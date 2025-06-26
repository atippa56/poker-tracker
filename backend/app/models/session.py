from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from ..database.database import Base
from datetime import datetime

class Session(Base):
    """Session model for poker session tracking"""
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False, default=func.now())
    location = Column(String(255), nullable=False)
    sb_size = Column(Float, nullable=False)  # Small blind size in dollars
    bb_size = Column(Float, nullable=False)  # Big blind size in dollars
    buy_in = Column(Float, nullable=False)  # Amount bought in for
    cash_out = Column(Float, nullable=False)  # Amount cashed out
    hours = Column(Float, nullable=False)  # Session duration in hours
    notes = Column(Text, nullable=True)  # Optional notes
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    @property
    def net_profit(self) -> float:
        """Calculate net profit (cash_out - buy_in)"""
        return self.cash_out - self.buy_in
    
    @property 
    def bb_per_hour(self) -> float:
        """Calculate big blinds per hour: (net_profit / bb_size) / hours"""
        if self.hours == 0 or self.bb_size == 0:
            return 0.0
        return (self.net_profit / self.bb_size) / self.hours 