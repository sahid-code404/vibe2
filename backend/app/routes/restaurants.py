"""Restaurant routes — nearby restaurant discovery."""
from fastapi import APIRouter, Query
from typing import List
from app.services.places_service import search_nearby_places
from app.schemas.entities import PlaceResponse

router = APIRouter()


@router.get("/nearby", response_model=List[PlaceResponse])
async def nearby_restaurants(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: int = Query(5000, description="Search radius in meters"),
    limit: int = Query(20, ge=1, le=50),
):
    places = await search_nearby_places(lat, lng, "restaurants", radius, limit)
    return [PlaceResponse(**p) for p in places]
