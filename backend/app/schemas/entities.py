"""Pydantic schemas for foods, restaurants, hotels, attractions."""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ---- Food Schemas ----
class FoodResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    cuisine: Optional[str] = None
    category_id: Optional[int] = None
    region_id: Optional[int] = None
    rating_avg: Optional[float] = 0.0
    rating_count: Optional[int] = 0
    price_range: Optional[str] = None
    is_vegetarian: Optional[bool] = False
    is_featured: Optional[bool] = False
    tags: Optional[list] = None
    category_name: Optional[str] = None
    region_name: Optional[str] = None

    class Config:
        from_attributes = True


class FoodCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    cuisine: Optional[str] = None
    category_id: Optional[int] = None
    region_id: Optional[int] = None
    price_range: Optional[str] = None
    is_vegetarian: Optional[bool] = False
    tags: Optional[list] = None


# ---- Place Schemas (shared for restaurants, hotels, attractions) ----
class PlaceResponse(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    rating: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    distance: Optional[float] = None  # km
    price_level: Optional[int] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    source: Optional[str] = None  # opentripmap, geoapify, local


class HotelResponse(PlaceResponse):
    price_per_night: Optional[float] = None
    star_rating: Optional[int] = None
    amenities: Optional[list] = None


class AttractionResponse(PlaceResponse):
    entry_fee: Optional[float] = None
    opening_hours: Optional[dict] = None


# ---- Review Schemas ----
class ReviewResponse(BaseModel):
    id: int
    user_id: int
    entity_type: str
    entity_id: int
    content: Optional[str] = None
    rating: float
    image_url: Optional[str] = None
    is_approved: bool = True
    helpful_count: int = 0
    created_at: Optional[datetime] = None
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None

    class Config:
        from_attributes = True


class ReviewCreateRequest(BaseModel):
    entity_type: str
    entity_id: int
    content: Optional[str] = None
    rating: float
    image_url: Optional[str] = None


# ---- Itinerary Schemas ----
class ItineraryResponse(BaseModel):
    id: int
    user_id: int
    title: str
    destination: Optional[str] = None
    days: int = 1
    budget: Optional[float] = None
    content: dict
    ai_generated: bool = False
    is_public: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ItineraryCreateRequest(BaseModel):
    title: str
    destination: Optional[str] = None
    days: int = 1
    budget: Optional[float] = None
    content: dict
    ai_generated: bool = False
    is_public: bool = False


# ---- Favorite Schemas ----
class FavoriteResponse(BaseModel):
    id: int
    entity_type: str
    entity_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FavoriteRequest(BaseModel):
    entity_type: str
    entity_id: int


# ---- AI Schemas ----
class AIChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None


class AIChatResponse(BaseModel):
    reply: str
    itinerary: Optional[dict] = None
    suggestions: Optional[list] = None


# ---- Category/Region ----
class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    icon: Optional[str] = None

    class Config:
        from_attributes = True


class RegionResponse(BaseModel):
    id: int
    name: str
    slug: str
    country: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


# ---- Pagination ----
class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    pages: int
