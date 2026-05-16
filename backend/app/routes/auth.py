"""Authentication routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.auth.password import hash_password, verify_password
from app.auth.jwt import create_access_token, create_refresh_token, decode_token, create_reset_token
from app.auth.dependencies import get_current_user
from app.schemas.auth import (
    RegisterRequest, LoginRequest, TokenResponse, RefreshRequest,
    ForgotPasswordRequest, ResetPasswordRequest, UserResponse, MessageResponse,
)

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=req.email,
        password_hash=hash_password(req.password),
        is_verified=True,
        is_active=True,
    )
    db.add(user)
    db.flush()

    profile = Profile(
        user_id=user.id,
        display_name=req.display_name or req.email.split("@")[0],
    )
    db.add(profile)

    access = create_access_token({"sub": str(user.id), "role": user.role})
    refresh = create_refresh_token({"sub": str(user.id)})
    user.refresh_token = refresh
    db.commit()
    db.refresh(user)
    db.refresh(profile)

    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        user=UserResponse(
            id=user.id, email=user.email, role=user.role,
            is_verified=user.is_verified,
            display_name=profile.display_name,
            avatar_url=profile.avatar_url,
            created_at=user.created_at,
        ),
    )


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")

    access = create_access_token({"sub": str(user.id), "role": user.role})
    refresh = create_refresh_token({"sub": str(user.id)})
    user.refresh_token = refresh
    db.commit()

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()

    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        user=UserResponse(
            id=user.id, email=user.email, role=user.role,
            is_verified=user.is_verified,
            display_name=profile.display_name if profile else None,
            avatar_url=profile.avatar_url if profile else None,
            created_at=user.created_at,
        ),
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(req: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(req.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    access = create_access_token({"sub": str(user.id), "role": user.role})
    new_refresh = create_refresh_token({"sub": str(user.id)})
    user.refresh_token = new_refresh
    db.commit()

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()

    return TokenResponse(
        access_token=access,
        refresh_token=new_refresh,
        user=UserResponse(
            id=user.id, email=user.email, role=user.role,
            is_verified=user.is_verified,
            display_name=profile.display_name if profile else None,
            avatar_url=profile.avatar_url if profile else None,
            created_at=user.created_at,
        ),
    )


@router.post("/logout", response_model=MessageResponse)
def logout(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.refresh_token = None
    db.commit()
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    return UserResponse(
        id=user.id, email=user.email, role=user.role,
        is_verified=user.is_verified,
        display_name=profile.display_name if profile else None,
        avatar_url=profile.avatar_url if profile else None,
        created_at=user.created_at,
    )


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        token = create_reset_token()
        user.reset_token = token
        user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(hours=1)
        db.commit()
        print(f"[PASSWORD RESET] Token for {req.email}: {token}")
    return MessageResponse(message="If an account exists, a reset link has been sent")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == req.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    if user.reset_token_expiry and user.reset_token_expiry.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Reset token expired")

    user.password_hash = hash_password(req.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()
    return MessageResponse(message="Password reset successfully")
