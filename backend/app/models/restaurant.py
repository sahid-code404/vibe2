"""Restaurant model."""
from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(Text, nullable=True)
    lat = Column(Numeric(10, 7), nullable=True)
    lng = Column(Numeric(10, 7), nullable=True)
    rating = Column(Numeric(3, 2), default=0.00)
    price_level = Column(Integer, nullable=True)
    image_url = Column(Text, nullable=True)
    phone = Column(String(30), nullable=True)
    website = Column(String(500), nullable=True)
    place_id = Column(String(255), nullable=True, index=True)
    cuisine = Column(String(100), nullable=True)
    opening_hours = Column(JSON, nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
