from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.models.tutorial import Tutorial
from app.models.newsletter import Newsletter, NewsletterStatus
from app.models.subscriber import Subscriber
from app.email_service import send_confirmation_email
from app.config import settings

router = APIRouter(tags=["public"])


# ── Tutorials ─────────────────────────────────────────────────────────────────

class TutorialSummary(BaseModel):
    id: int
    title: str
    slug: str
    reading_time_minutes: int
    tags: List[str]

    class Config:
        from_attributes = True


class TutorialDetail(TutorialSummary):
    content: str


@router.get("/tutorials", response_model=List[TutorialSummary])
def list_tutorials(db: Session = Depends(get_db)):
    return db.query(Tutorial).filter(Tutorial.published == True).order_by(Tutorial.created_at.desc()).all()


@router.get("/tutorials/{slug}", response_model=TutorialDetail)
def get_tutorial(slug: str, db: Session = Depends(get_db)):
    t = db.query(Tutorial).filter(Tutorial.slug == slug, Tutorial.published == True).first()
    if not t:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    return t


# ── Newsletter archive ────────────────────────────────────────────────────────

class NewsletterSummary(BaseModel):
    id: int
    title: str
    subject_line: str
    sent_at: Optional[str]

    class Config:
        from_attributes = True


class NewsletterDetail(NewsletterSummary):
    html_content: Optional[str]


@router.get("/archive", response_model=List[NewsletterSummary])
def list_archive(db: Session = Depends(get_db)):
    return (
        db.query(Newsletter)
        .filter(Newsletter.status == NewsletterStatus.sent)
        .order_by(Newsletter.sent_at.desc())
        .all()
    )


@router.get("/archive/{newsletter_id}", response_model=NewsletterDetail)
def get_issue(newsletter_id: int, db: Session = Depends(get_db)):
    nl = db.get(Newsletter, newsletter_id)
    if not nl or nl.status != NewsletterStatus.sent:
        raise HTTPException(status_code=404, detail="Issue not found")
    return nl


# ── Subscribe / unsubscribe ───────────────────────────────────────────────────

class SubscribeRequest(BaseModel):
    email: EmailStr


@router.post("/subscribe", status_code=201)
def subscribe(body: SubscribeRequest, db: Session = Depends(get_db)):
    existing = db.query(Subscriber).filter(Subscriber.email == body.email).first()
    if existing:
        if existing.unsubscribed_at:
            existing.unsubscribed_at = None
            db.commit()
            return {"message": "Welcome back! Check your email to confirm."}
        if existing.confirmed:
            return {"message": "You're already subscribed."}
        # Resend confirmation
        send_confirmation_email(existing.email, existing.token)
        return {"message": "Confirmation email resent."}
    subscriber = Subscriber(email=body.email)
    db.add(subscriber)
    db.commit()
    db.refresh(subscriber)
    send_confirmation_email(subscriber.email, subscriber.token)
    return {"message": "Check your inbox to confirm your subscription."}


@router.get("/confirm/{token}")
def confirm_subscription(token: str, db: Session = Depends(get_db)):
    subscriber = db.query(Subscriber).filter(Subscriber.token == token).first()
    if not subscriber:
        raise HTTPException(status_code=404, detail="Invalid token")
    subscriber.confirmed = True
    db.commit()
    return RedirectResponse(url=f"{settings.frontend_url}/?confirmed=1")


@router.get("/unsubscribe/{token}")
def unsubscribe(token: str, db: Session = Depends(get_db)):
    from datetime import datetime
    subscriber = db.query(Subscriber).filter(Subscriber.token == token).first()
    if not subscriber:
        raise HTTPException(status_code=404, detail="Invalid token")
    subscriber.unsubscribed_at = datetime.utcnow()
    db.commit()
    return RedirectResponse(url=f"{settings.frontend_url}/?unsubscribed=1")
