"""User routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.auth.dependencies import get_current_user
from app.schemas.auth import UserResponse, ProfileResponse, ProfileUpdateRequest

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    return UserResponse(
        id=user.id, email=user.email, role=user.role, is_verified=user.is_verified,
        display_name=profile.display_name if profile else None,
        avatar_url=profile.avatar_url if profile else None,
        created_at=user.created_at,
    )


@router.get("/profile", response_model=ProfileResponse)
def get_full_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/profile", response_model=ProfileResponse)
def update_profile(req: ProfileUpdateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id)
        db.add(profile)

    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile


@router.get("/{user_id}", response_model=UserResponse)
def get_user_public(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    return UserResponse(
        id=user.id, email=user.email, role=user.role, is_verified=user.is_verified,
        display_name=profile.display_name if profile else None,
        avatar_url=profile.avatar_url if profile else None,
        created_at=user.created_at,
    )
