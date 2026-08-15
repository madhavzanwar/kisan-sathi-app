from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Optional farmer profile data
    farm_size = Column(Float, nullable=True)
    soil_type = Column(String, nullable=True)

    scans = relationship("ScanHistory", back_populates="owner")
    fertilizers = relationship("FertilizerHistory", back_populates="owner")


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String)
    confidence = Column(Float)
    severity = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="scans")


class FertilizerHistory(Base):
    __tablename__ = "fertilizer_history"

    id = Column(Integer, primary_key=True, index=True)
    crop_type = Column(String)
    recommended_fertilizer = Column(String)
    urea_kg = Column(Float)
    dap_kg = Column(Float)
    mop_kg = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="fertilizers")
