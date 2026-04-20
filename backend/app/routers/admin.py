from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.article import Article, ArticleStatus
from app.models.tutorial import Tutorial
from app.models.newsletter import Newsletter, NewsletterStatus
from app.models.subscriber import Subscriber
from app.routers.deps import require_admin
from app.email_service import build_newsletter_html, send_newsletter

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Articles ──────────────────────────────────────────────────────────────────

class ArticleAnnotate(BaseModel):
    clinical_relevance_note: str
    tags: Optional[List[str]] = None


class ArticleOut(BaseModel):
    id: int
    source_name: str
    title: str
    full_url: str
    original_summary: Optional[str]
    clinical_relevance_note: Optional[str]
    tags: List[str]
    status: str

    class Config:
        from_attributes = True


@router.get("/articles", response_model=List[ArticleOut])
def list_articles(
    status: Optional[str] = "pending",
    db: Session = Depends(get_db),
    _: str = Depends(require_admin),
):
    q = db.query(Article)
    if status:
        q = q.filter(Article.status == status)
    return q.order_by(Article.scraped_at.desc()).limit(100).all()


@router.patch("/articles/{article_id}/approve")
def approve_article(
    article_id: int,
    body: ArticleAnnotate,
    db: Session = Depends(get_db),
    _: str = Depends(require_admin),
):
    if not body.clinical_relevance_note.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="clinical_relevance_note is required before approving",
        )
    article = db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    article.clinical_relevance_note = body.clinical_relevance_note.strip()
    if body.tags is not None:
        article.tags = body.tags
    article.status = ArticleStatus.approved
    db.commit()
    return {"ok": True}


@router.patch("/articles/{article_id}/reject")
def reject_article(
    article_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(require_admin),
):
    article = db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    article.status = ArticleStatus.rejected
    db.commit()
    return {"ok": True}


# ── Tutorials ─────────────────────────────────────────────────────────────────

class TutorialIn(BaseModel):
    title: str
    slug: str
    content: str
    reading_time_minutes: int = 5
    tags: List[str] = []
    published: bool = False


class TutorialOut(TutorialIn):
    id: int

    class Config:
        from_attributes = True


@router.get("/tutorials", response_model=List[TutorialOut])
def list_tutorials(db: Session = Depends(get_db), _: str = Depends(require_admin)):
    return db.query(Tutorial).order_by(Tutorial.created_at.desc()).all()


@router.post("/tutorials", response_model=TutorialOut, status_code=201)
def create_tutorial(body: TutorialIn, db: Session = Depends(get_db), _: str = Depends(require_admin)):
    tutorial = Tutorial(**body.model_dump())
    db.add(tutorial)
    db.commit()
    db.refresh(tutorial)
    return tutorial


@router.put("/tutorials/{tutorial_id}", response_model=TutorialOut)
def update_tutorial(
    tutorial_id: int,
    body: TutorialIn,
    db: Session = Depends(get_db),
    _: str = Depends(require_admin),
):
    tutorial = db.get(Tutorial, tutorial_id)
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    for k, v in body.model_dump().items():
        setattr(tutorial, k, v)
    db.commit()
    db.refresh(tutorial)
    return tutorial


@router.delete("/tutorials/{tutorial_id}", status_code=204)
def delete_tutorial(tutorial_id: int, db: Session = Depends(get_db), _: str = Depends(require_admin)):
    tutorial = db.get(Tutorial, tutorial_id)
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    db.delete(tutorial)
    db.commit()


# ── Newsletters ───────────────────────────────────────────────────────────────

class NewsletterIn(BaseModel):
    title: str
    subject_line: str
    featured_tutorial_id: int
    article_ids: List[int]


class NewsletterOut(BaseModel):
    id: int
    title: str
    subject_line: str
    status: str
    featured_tutorial_id: Optional[int]
    article_ids: List[int]
    html_content: Optional[str]
    sent_at: Optional[str]

    class Config:
        from_attributes = True


@router.get("/newsletters", response_model=List[NewsletterOut])
def list_newsletters(db: Session = Depends(get_db), _: str = Depends(require_admin)):
    return db.query(Newsletter).order_by(Newsletter.created_at.desc()).all()


@router.post("/newsletters", response_model=NewsletterOut, status_code=201)
def create_newsletter(body: NewsletterIn, db: Session = Depends(get_db), _: str = Depends(require_admin)):
    tutorial = db.get(Tutorial, body.featured_tutorial_id)
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    articles = [db.get(Article, aid) for aid in body.article_ids]
    if any(a is None for a in articles):
        raise HTTPException(status_code=404, detail="One or more articles not found")
    html = build_newsletter_html(tutorial, articles)
    nl = Newsletter(
        title=body.title,
        subject_line=body.subject_line,
        featured_tutorial_id=body.featured_tutorial_id,
        article_ids=body.article_ids,
        html_content=html,
    )
    db.add(nl)
    db.commit()
    db.refresh(nl)
    return nl


@router.post("/newsletters/{newsletter_id}/send")
def send_newsletter_now(
    newsletter_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(require_admin),
):
    from datetime import datetime
    nl = db.get(Newsletter, newsletter_id)
    if not nl:
        raise HTTPException(status_code=404, detail="Newsletter not found")
    if nl.status == NewsletterStatus.sent:
        raise HTTPException(status_code=400, detail="Already sent")
    confirmed_emails = [s.email for s in db.query(Subscriber).filter(Subscriber.confirmed == True, Subscriber.unsubscribed_at == None).all()]
    if not confirmed_emails:
        raise HTTPException(status_code=400, detail="No confirmed subscribers")
    send_newsletter(nl.subject_line, nl.html_content, confirmed_emails)
    nl.status = NewsletterStatus.sent
    nl.sent_at = datetime.utcnow()
    db.commit()
    return {"ok": True, "sent_to": len(confirmed_emails)}


# ── Subscribers ───────────────────────────────────────────────────────────────

class SubscriberOut(BaseModel):
    id: int
    email: str
    confirmed: bool
    subscribed_at: Optional[str]
    unsubscribed_at: Optional[str]

    class Config:
        from_attributes = True


@router.get("/subscribers", response_model=List[SubscriberOut])
def list_subscribers(db: Session = Depends(get_db), _: str = Depends(require_admin)):
    return db.query(Subscriber).order_by(Subscriber.subscribed_at.desc()).all()


# ── Manual scrape trigger ─────────────────────────────────────────────────────

@router.post("/scrape")
def trigger_scrape(db: Session = Depends(get_db), _: str = Depends(require_admin)):
    from app.scrapers.rss import scrape_all
    count = scrape_all(db)
    return {"added": count}
