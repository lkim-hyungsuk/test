from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.dialects.postgresql import ARRAY
from app.database import Base


class Tutorial(Base):
    __tablename__ = "tutorials"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    slug = Column(String(500), nullable=False, unique=True, index=True)
    content = Column(Text, nullable=False)  # Markdown
    reading_time_minutes = Column(Integer, default=5)
    tags = Column(ARRAY(String), default=[])
    published = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
