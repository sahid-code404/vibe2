"""Favorites routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.favorite import Favorite
from app.models.user import User
from app.auth.dependencies import get_current_user
from app.schemas.entities import FavoriteResponse, FavoriteRequest

router = APIRouter()


@router.get("/", response_model=List[FavoriteResponse])
def list_favorites(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Favorite).filter(Favorite.user_id == user.id).order_by(Favorite.created_at.desc()).all()


@router.post("/", response_model=FavoriteResponse)
def add_favorite(req: FavoriteRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Favorite).filter(
        Favorite.user_id == user.id, Favorite.entity_type == req.entity_type, Favorite.entity_id == req.entity_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already favorited")
    fav = Favorite(user_id=user.id, entity_type=req.entity_type, entity_id=req.entity_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav


@router.delete("/{entity_type}/{entity_id}")
def remove_favorite(entity_type: str, entity_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fav = db.query(Favorite).filter(
        Favorite.user_id == user.id, Favorite.entity_type == entity_type, Favorite.entity_id == entity_id
    ).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites"}


@router.get("/check/{entity_type}/{entity_id}")
def check_favorite(entity_type: str, entity_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fav = db.query(Favorite).filter(
        Favorite.user_id == user.id, Favorite.entity_type == entity_type, Favorite.entity_id == entity_id
    ).first()
    return {"is_favorited": fav is not None}
