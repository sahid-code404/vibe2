"""Tourist attraction routes."""
from fastapi import APIRouter, Query
from typing import List
from app.services.places_service import search_nearby_places, get_place_details
from app.schemas.entities import PlaceResponse

router = APIRouter()


@router.get("/nearby", response_model=List[PlaceResponse])
async def nearby_attractions(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: int = Query(10000, description="Search radius in meters"),
    limit: int = Query(20, ge=1, le=50),
):
    places = await search_nearby_places(lat, lng, "attractions", radius, limit)
    return [PlaceResponse(**p) for p in places]


@router.get("/{place_id}")
async def attraction_details(place_id: str):
    details = await get_place_details(place_id)
    if not details:
        return {"id": place_id, "name": "Place", "source": "unavailable"}
    return details
