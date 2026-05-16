"""Hotel model."""
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(Text, nullable=True)
    lat = Column(Numeric(10, 7), nullable=True)
    lng = Column(Numeric(10, 7), nullable=True)
    rating = Column(Numeric(3, 2), default=0.00)
    price_per_night = Column(Numeric(10, 2), nullable=True)
    image_url = Column(Text, nullable=True)
    phone = Column(String(30), nullable=True)
    website = Column(String(500), nullable=True)
    place_id = Column(String(255), nullable=True)
    amenities = Column(JSON, nullable=True)
    star_rating = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
