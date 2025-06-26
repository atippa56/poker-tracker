from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional

class SessionBase(BaseModel):
    """Base session schema"""
    date: datetime
    location: str
    sb_size: float
    bb_size: float
    buy_in: float
    cash_out: float
    hours: float
    notes: Optional[str] = None

    @validator('sb_size', 'bb_size', 'buy_in', 'cash_out', 'hours')
    def validate_positive_numbers(cls, v):
        if v <= 0:
            raise ValueError('Value must be positive')
        return v

class SessionCreate(SessionBase):
    """Schema for creating a new session"""
    pass

class SessionUpdate(BaseModel):
    """Schema for updating a session"""
    date: Optional[datetime] = None
    location: Optional[str] = None
    sb_size: Optional[float] = None
    bb_size: Optional[float] = None
    buy_in: Optional[float] = None
    cash_out: Optional[float] = None
    hours: Optional[float] = None
    notes: Optional[str] = None

class SessionResponse(SessionBase):
    """Schema for session response"""
    id: int
    net_profit: float
    bb_per_hour: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # For Pydantic v2 compatibility 