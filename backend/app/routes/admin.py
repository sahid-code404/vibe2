"""Admin routes."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.models.review import Review
from app.models.food import Food
from app.models.report import Report
from app.models.itinerary import Itinerary
from app.models.admin_log import AdminLog
from app.auth.dependencies import require_admin
from app.schemas.auth import UserResponse

router = APIRouter()


@router.get("/stats")
def admin_stats(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return {
        "total_users": db.query(User).count(),
        "total_foods": db.query(Food).count(),
        "total_reviews": db.query(Review).count(),
        "total_itineraries": db.query(Itinerary).count(),
        "pending_reports": db.query(Report).filter(Report.status == "pending").count(),
        "pending_reviews": db.query(Review).filter(Review.is_approved == False).count(),
    }


@router.get("/users")
def admin_list_users(
    page: int = Query(1, ge=1), limit: int = Query(20),
    search: Optional[str] = None,
    admin: User = Depends(require_admin), db: Session = Depends(get_db),
):
    q = db.query(User)
    if search:
        q = q.filter(User.email.ilike(f"%{search}%"))
    total = q.count()
    users = q.order_by(User.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    result = []
    for u in users:
        profile = db.query(Profile).filter(Profile.user_id == u.id).first()
        result.append({
            "id": u.id, "email": u.email, "role": u.role,
            "is_active": u.is_active, "is_verified": u.is_verified,
            "display_name": profile.display_name if profile else None,
            "created_at": str(u.created_at) if u.created_at else None,
        })
    return {"items": result, "total": total, "page": page}


@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int, role: str = Query(...),
    admin: User = Depends(require_admin), db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    user.role = role
    log = AdminLog(admin_id=admin.id, action=f"Changed role to {role}", entity_type="user", entity_id=user_id)
    db.add(log)
    db.commit()
    return {"message": f"User role updated to {role}"}


@router.put("/users/{user_id}/toggle-active")
def toggle_user_active(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'activated' if user.is_active else 'deactivated'}"}


@router.get("/reviews/pending")
def pending_reviews(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.is_approved == False).order_by(Review.created_at.desc()).all()
    return [{"id": r.id, "user_id": r.user_id, "entity_type": r.entity_type, "content": r.content, "rating": float(r.rating), "created_at": str(r.created_at)} for r in reviews]


@router.put("/reviews/{review_id}/approve")
def approve_review(review_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.is_approved = True
    db.commit()
    return {"message": "Review approved"}


@router.get("/reports")
def list_reports(
    status: Optional[str] = None,
    admin: User = Depends(require_admin), db: Session = Depends(get_db),
):
    q = db.query(Report)
    if status:
        q = q.filter(Report.status == status)
    reports = q.order_by(Report.created_at.desc()).all()
    return [{"id": r.id, "reporter_id": r.reporter_id, "entity_type": r.entity_type, "entity_id": r.entity_id, "reason": r.reason, "status": r.status, "created_at": str(r.created_at)} for r in reports]


@router.put("/reports/{report_id}")
def update_report(
    report_id: int, status: str = Query(...), notes: Optional[str] = None,
    admin: User = Depends(require_admin), db: Session = Depends(get_db),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = status
    report.admin_notes = notes
    report.resolved_by = admin.id
    db.commit()
    return {"message": "Report updated"}


@router.get("/logs")
def admin_logs(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    logs = db.query(AdminLog).order_by(AdminLog.created_at.desc()).limit(100).all()
    return [{"id": l.id, "admin_id": l.admin_id, "action": l.action, "entity_type": l.entity_type, "created_at": str(l.created_at)} for l in logs]
