"""Culinary Compass — FastAPI Application Entry Point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import init_db
from app.routes import auth, users, foods, restaurants, hotels, attractions
from app.routes import reviews, itineraries, favorites, ai, admin, upload


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: create tables
    init_db()
    # Seed initial data
    from app.services.seed_service import seed_initial_data
    seed_initial_data()
    yield
    # Shutdown
    pass


app = FastAPI(
    title="Culinary Compass API",
    description="AI-powered travel and food discovery platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(foods.router, prefix="/foods", tags=["Foods"])
app.include_router(restaurants.router, prefix="/restaurants", tags=["Restaurants"])
app.include_router(hotels.router, prefix="/hotels", tags=["Hotels"])
app.include_router(attractions.router, prefix="/attractions", tags=["Attractions"])
app.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
app.include_router(itineraries.router, prefix="/itineraries", tags=["Itineraries"])
app.include_router(favorites.router, prefix="/favorites", tags=["Favorites"])
app.include_router(ai.router, prefix="/ai", tags=["AI Assistant"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])


@app.get("/")
def root():
    return {
        "name": "Culinary Compass API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
