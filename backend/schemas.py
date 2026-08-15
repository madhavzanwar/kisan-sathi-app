from pydantic import BaseModel
from typing import Optional
import datetime

class UserCreate(BaseModel):
    email: str
    password: str
    farm_size: Optional[float] = None
    soil_type: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    farm_size: Optional[float] = None
    soil_type: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
