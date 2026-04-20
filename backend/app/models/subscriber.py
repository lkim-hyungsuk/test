from datetime import datetime
import secrets
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database import Base


class Subscriber(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(254), nullable=False, unique=True, index=True)
    confirmed = Column(Boolean, default=False, nullable=False)
    token = Column(String(64), default=lambda: secrets.token_urlsafe(32), nullable=False)
    subscribed_at = Column(DateTime, default=datetime.utcnow)
    unsubscribed_at = Column(DateTime)
