"""Itinerary routes."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.itinerary import Itinerary
from app.models.user import User
from app.auth.dependencies import get_current_user
from app.schemas.entities import ItineraryResponse, ItineraryCreateRequest

router = APIRouter()


@router.get("/", response_model=List[ItineraryResponse])
def list_itineraries(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Itinerary).filter(Itinerary.user_id == user.id).order_by(Itinerary.created_at.desc()).all()


@router.get("/public", response_model=List[ItineraryResponse])
def public_itineraries(
    page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return db.query(Itinerary).filter(Itinerary.is_public == True).order_by(Itinerary.created_at.desc()).offset((page - 1) * limit).limit(limit).all()


@router.post("/", response_model=ItineraryResponse)
def create_itinerary(req: ItineraryCreateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    itin = Itinerary(user_id=user.id, **req.model_dump())
    db.add(itin)
    db.commit()
    db.refresh(itin)
    return itin


@router.get("/{itin_id}", response_model=ItineraryResponse)
def get_itinerary(itin_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    itin = db.query(Itinerary).filter(Itinerary.id == itin_id).first()
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    if itin.user_id != user.id and not itin.is_public:
        raise HTTPException(status_code=403, detail="Not authorized")
    return itin


@router.delete("/{itin_id}")
def delete_itinerary(itin_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    itin = db.query(Itinerary).filter(Itinerary.id == itin_id, Itinerary.user_id == user.id).first()
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    db.delete(itin)
    db.commit()
    return {"message": "Itinerary deleted"}
