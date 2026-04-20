from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SAEnum
from sqlalchemy.dialects.postgresql import ARRAY
import enum
from app.database import Base


class ArticleStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String(200), nullable=False)
    source_url = Column(String(500), nullable=False)
    title = Column(String(500), nullable=False)
    original_summary = Column(Text)
    full_url = Column(String(500), nullable=False, unique=True)
    # Admin writes this before approving — plain-English "what this means for your research"
    clinical_relevance_note = Column(Text)
    tags = Column(ARRAY(String), default=[])
    status = Column(SAEnum(ArticleStatus), default=ArticleStatus.pending, nullable=False)
    scraped_at = Column(DateTime, default=datetime.utcnow)
    published_at = Column(DateTime)
