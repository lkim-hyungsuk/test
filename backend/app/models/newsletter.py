from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SAEnum, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
import enum
from app.database import Base


class NewsletterStatus(str, enum.Enum):
    draft = "draft"
    scheduled = "scheduled"
    sent = "sent"


class Newsletter(Base):
    __tablename__ = "newsletters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    subject_line = Column(String(500), nullable=False)
    html_content = Column(Text)
    text_content = Column(Text)
    status = Column(SAEnum(NewsletterStatus), default=NewsletterStatus.draft, nullable=False)
    scheduled_at = Column(DateTime)
    sent_at = Column(DateTime)
    featured_tutorial_id = Column(Integer, ForeignKey("tutorials.id"))
    article_ids = Column(ARRAY(Integer), default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
