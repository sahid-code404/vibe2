"""Review routes."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.review import Review
from app.models.profile import Profile
from app.models.user import User
from app.auth.dependencies import get_current_user, get_optional_user
from app.schemas.entities import ReviewResponse, ReviewCreateRequest

router = APIRouter()


@router.get("/", response_model=List[ReviewResponse])
def list_reviews(
    entity_type: Optional[str] = None,
    entity_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    q = db.query(Review).filter(Review.is_approved == True)
    if entity_type:
        q = q.filter(Review.entity_type == entity_type)
    if entity_id:
        q = q.filter(Review.entity_id == entity_id)

    reviews = q.order_by(Review.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    result = []
    for r in reviews:
        profile = db.query(Profile).filter(Profile.user_id == r.user_id).first()
        result.append(ReviewResponse(
            id=r.id, user_id=r.user_id, entity_type=r.entity_type,
            entity_id=r.entity_id, content=r.content,
            rating=float(r.rating), image_url=r.image_url,
            is_approved=r.is_approved, helpful_count=r.helpful_count,
            created_at=r.created_at,
            user_name=profile.display_name if profile else "Anonymous",
            user_avatar=profile.avatar_url if profile else None,
        ))
    return result


@router.post("/", response_model=ReviewResponse)
def create_review(
    req: ReviewCreateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    review = Review(
        user_id=user.id, entity_type=req.entity_type, entity_id=req.entity_id,
        content=req.content, rating=req.rating, image_url=req.image_url,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    return ReviewResponse(
        id=review.id, user_id=review.user_id, entity_type=review.entity_type,
        entity_id=review.entity_id, content=review.content,
        rating=float(review.rating), image_url=review.image_url,
        is_approved=review.is_approved, helpful_count=0,
        created_at=review.created_at,
        user_name=profile.display_name if profile else "Anonymous",
        user_avatar=profile.avatar_url if profile else None,
    )


@router.delete("/{review_id}")
def delete_review(review_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}
