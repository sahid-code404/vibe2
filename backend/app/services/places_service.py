"""Places service — integration with OpenTripMap and Geoapify."""
import httpx
from typing import Optional, List
from app.config import settings


async def search_nearby_places(
    lat: float,
    lng: float,
    category: str = "foods",
    radius: int = 5000,
    limit: int = 20,
) -> List[dict]:
    """Search nearby places using OpenTripMap API."""
    places = []

    # Map category to OpenTripMap kinds
    kind_map = {
        "foods": "foods",
        "restaurants": "foods",
        "hotels": "accomodations",
        "attractions": "interesting_places",
        "cultural": "cultural",
        "architecture": "architecture",
        "natural": "natural",
    }
    kinds = kind_map.get(category, "interesting_places")

    # Try OpenTripMap first
    if settings.OPENTRIPMAP_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(
                    f"https://api.opentripmap.com/0.1/en/places/radius",
                    params={
                        "radius": radius,
                        "lon": lng,
                        "lat": lat,
                        "kinds": kinds,
                        "limit": limit,
                        "apikey": settings.OPENTRIPMAP_API_KEY,
                    },
                )
                if resp.status_code == 200:
                    data = resp.json()
                    if isinstance(data, list):
                        for item in data:
                            place = {
                                "id": item.get("xid", ""),
                                "name": item.get("name", "Unknown"),
                                "lat": item.get("point", {}).get("lat"),
                                "lng": item.get("point", {}).get("lon"),
                                "rating": item.get("rate", 0),
                                "category": kinds,
                                "source": "opentripmap",
                                "distance": item.get("dist"),
                            }
                            if place["name"] and place["name"] != "Unknown":
                                places.append(place)
        except Exception as e:
            print(f"OpenTripMap error: {e}")

    # Fallback to Geoapify
    if not places and settings.GEOAPIFY_API_KEY:
        try:
            geoapify_cat_map = {
                "foods": "catering.restaurant",
                "restaurants": "catering.restaurant",
                "hotels": "accommodation.hotel",
                "attractions": "tourism.sights",
            }
            geo_cat = geoapify_cat_map.get(category, "tourism.sights")

            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(
                    "https://api.geoapify.com/v2/places",
                    params={
                        "categories": geo_cat,
                        "filter": f"circle:{lng},{lat},{radius}",
                        "limit": limit,
                        "apiKey": settings.GEOAPIFY_API_KEY,
                    },
                )
                if resp.status_code == 200:
                    data = resp.json()
                    for feature in data.get("features", []):
                        props = feature.get("properties", {})
                        places.append({
                            "id": props.get("place_id", ""),
                            "name": props.get("name", "Unknown"),
                            "address": props.get("formatted", ""),
                            "lat": props.get("lat"),
                            "lng": props.get("lon"),
                            "rating": props.get("rating"),
                            "category": category,
                            "source": "geoapify",
                            "distance": props.get("distance"),
                        })
        except Exception as e:
            print(f"Geoapify error: {e}")

    # If no API keys, return demo data
    if not places:
        places = _get_demo_places(lat, lng, category, limit)

    return places


async def get_place_details(xid: str) -> Optional[dict]:
    """Get detailed info about a place from OpenTripMap."""
    if not settings.OPENTRIPMAP_API_KEY:
        return None

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"https://api.opentripmap.com/0.1/en/places/xid/{xid}",
                params={"apikey": settings.OPENTRIPMAP_API_KEY},
            )
            if resp.status_code == 200:
                data = resp.json()
                return {
                    "id": data.get("xid"),
                    "name": data.get("name"),
                    "description": data.get("wikipedia_extracts", {}).get("text", ""),
                    "address": data.get("address", {}),
                    "lat": data.get("point", {}).get("lat"),
                    "lng": data.get("point", {}).get("lon"),
                    "image_url": data.get("preview", {}).get("source"),
                    "rating": data.get("rate"),
                    "kinds": data.get("kinds"),
                    "url": data.get("url"),
                    "source": "opentripmap",
                }
    except Exception as e:
        print(f"Place details error: {e}")

    return None


def _get_demo_places(lat: float, lng: float, category: str, limit: int) -> List[dict]:
    """Return demo places when no API keys are configured."""
    import random
    demo = {
        "foods": [
            {"name": "Spice Garden Restaurant", "rating": 4.5, "category": "restaurant"},
            {"name": "Royal Bengal Kitchen", "rating": 4.7, "category": "restaurant"},
            {"name": "The Curry House", "rating": 4.3, "category": "restaurant"},
            {"name": "Street Bites Corner", "rating": 4.6, "category": "street_food"},
            {"name": "Tandoori Nights", "rating": 4.4, "category": "restaurant"},
            {"name": "Chai & Chaat Hub", "rating": 4.2, "category": "cafe"},
            {"name": "Biryani Palace", "rating": 4.8, "category": "restaurant"},
            {"name": "Dosa Factory", "rating": 4.1, "category": "restaurant"},
        ],
        "restaurants": [
            {"name": "Spice Garden Restaurant", "rating": 4.5, "category": "restaurant"},
            {"name": "Royal Bengal Kitchen", "rating": 4.7, "category": "restaurant"},
            {"name": "The Curry House", "rating": 4.3, "category": "restaurant"},
            {"name": "Tandoori Nights", "rating": 4.4, "category": "restaurant"},
            {"name": "Biryani Palace", "rating": 4.8, "category": "restaurant"},
            {"name": "Mughlai Darbar", "rating": 4.6, "category": "restaurant"},
        ],
        "hotels": [
            {"name": "Grand Heritage Hotel", "rating": 4.5, "category": "hotel", "price_per_night": 3500},
            {"name": "City View Inn", "rating": 4.0, "category": "hotel", "price_per_night": 1800},
            {"name": "Royal Palace Resort", "rating": 4.8, "category": "hotel", "price_per_night": 7500},
            {"name": "Budget Stay Express", "rating": 3.8, "category": "hotel", "price_per_night": 900},
            {"name": "Comfort Suites", "rating": 4.3, "category": "hotel", "price_per_night": 2500},
            {"name": "Heritage Haveli", "rating": 4.6, "category": "hotel", "price_per_night": 5000},
        ],
        "attractions": [
            {"name": "Historic Fort", "rating": 4.7, "category": "architecture"},
            {"name": "Ancient Temple", "rating": 4.8, "category": "cultural"},
            {"name": "City Museum", "rating": 4.3, "category": "cultural"},
            {"name": "Botanical Gardens", "rating": 4.5, "category": "natural"},
            {"name": "Memorial Park", "rating": 4.2, "category": "cultural"},
            {"name": "Art Gallery", "rating": 4.4, "category": "cultural"},
            {"name": "Sunset Point", "rating": 4.6, "category": "natural"},
        ],
    }

    items = demo.get(category, demo["attractions"])[:limit]
    places = []
    for i, item in enumerate(items):
        offset_lat = random.uniform(-0.02, 0.02)
        offset_lng = random.uniform(-0.02, 0.02)
        places.append({
            "id": f"demo_{category}_{i}",
            "name": item["name"],
            "lat": lat + offset_lat,
            "lng": lng + offset_lng,
            "rating": item["rating"],
            "category": item.get("category", category),
            "source": "demo",
            "distance": round(random.uniform(0.5, 5.0), 1),
            "price_per_night": item.get("price_per_night"),
            "image_url": f"https://images.unsplash.com/photo-{'1555396273' if category == 'foods' else '1566073771'}?w=400",
        })
    return places
