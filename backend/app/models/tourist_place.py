"""Tourist Place model."""
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class TouristPlace(Base):
    __tablename__ = "tourist_places"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(Text, nullable=True)
    lat = Column(Numeric(10, 7), nullable=True)
    lng = Column(Numeric(10, 7), nullable=True)
    image_url = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    rating = Column(Numeric(3, 2), default=0.00)
    entry_fee = Column(Numeric(10, 2), nullable=True)
    opening_hours = Column(JSON, nullable=True)
    place_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
