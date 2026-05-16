"""Food routes."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.food import Food
from app.models.category import Category
from app.models.region import Region
from app.schemas.entities import FoodResponse, FoodCreateRequest, CategoryResponse, RegionResponse
from app.auth.dependencies import require_admin

router = APIRouter()


@router.get("/", response_model=List[FoodResponse])
def list_foods(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    cuisine: Optional[str] = None,
    region_id: Optional[int] = None,
    category_id: Optional[int] = None,
    vegetarian: Optional[bool] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Food)
    if cuisine:
        q = q.filter(Food.cuisine.ilike(f"%{cuisine}%"))
    if region_id:
        q = q.filter(Food.region_id == region_id)
    if category_id:
        q = q.filter(Food.category_id == category_id)
    if vegetarian is not None:
        q = q.filter(Food.is_vegetarian == vegetarian)
    if featured is not None:
        q = q.filter(Food.is_featured == featured)
    if search:
        q = q.filter(Food.name.ilike(f"%{search}%"))

    total = q.count()
    foods = q.order_by(Food.rating_avg.desc()).offset((page - 1) * limit).limit(limit).all()

    result = []
    for f in foods:
        cat = db.query(Category).filter(Category.id == f.category_id).first()
        reg = db.query(Region).filter(Region.id == f.region_id).first()
        result.append(FoodResponse(
            id=f.id, name=f.name, description=f.description, image_url=f.image_url,
            cuisine=f.cuisine, category_id=f.category_id, region_id=f.region_id,
            rating_avg=float(f.rating_avg) if f.rating_avg else 0,
            rating_count=f.rating_count, price_range=f.price_range,
            is_vegetarian=f.is_vegetarian, is_featured=f.is_featured,
            tags=f.tags, category_name=cat.name if cat else None,
            region_name=reg.name if reg else None,
        ))
    return result


@router.get("/featured", response_model=List[FoodResponse])
def featured_foods(db: Session = Depends(get_db)):
    foods = db.query(Food).filter(Food.is_featured == True).order_by(Food.rating_avg.desc()).limit(12).all()
    result = []
    for f in foods:
        reg = db.query(Region).filter(Region.id == f.region_id).first()
        result.append(FoodResponse(
            id=f.id, name=f.name, description=f.description, image_url=f.image_url,
            cuisine=f.cuisine, category_id=f.category_id, region_id=f.region_id,
            rating_avg=float(f.rating_avg) if f.rating_avg else 0,
            rating_count=f.rating_count, price_range=f.price_range,
            is_vegetarian=f.is_vegetarian, is_featured=f.is_featured,
            tags=f.tags, region_name=reg.name if reg else None,
        ))
    return result


@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@router.get("/regions", response_model=List[RegionResponse])
def list_regions(db: Session = Depends(get_db)):
    return db.query(Region).all()


@router.get("/{food_id}", response_model=FoodResponse)
def get_food(food_id: int, db: Session = Depends(get_db)):
    f = db.query(Food).filter(Food.id == food_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Food not found")
    cat = db.query(Category).filter(Category.id == f.category_id).first()
    reg = db.query(Region).filter(Region.id == f.region_id).first()
    return FoodResponse(
        id=f.id, name=f.name, description=f.description, image_url=f.image_url,
        cuisine=f.cuisine, category_id=f.category_id, region_id=f.region_id,
        rating_avg=float(f.rating_avg) if f.rating_avg else 0,
        rating_count=f.rating_count, price_range=f.price_range,
        is_vegetarian=f.is_vegetarian, is_featured=f.is_featured,
        tags=f.tags, category_name=cat.name if cat else None,
        region_name=reg.name if reg else None,
    )


@router.post("/", response_model=FoodResponse)
def create_food(req: FoodCreateRequest, admin=Depends(require_admin), db: Session = Depends(get_db)):
    food = Food(**req.model_dump())
    db.add(food)
    db.commit()
    db.refresh(food)
    return FoodResponse(
        id=food.id, name=food.name, description=food.description, image_url=food.image_url,
        cuisine=food.cuisine, category_id=food.category_id, region_id=food.region_id,
        rating_avg=0, rating_count=0, price_range=food.price_range,
        is_vegetarian=food.is_vegetarian, is_featured=False, tags=food.tags,
    )
