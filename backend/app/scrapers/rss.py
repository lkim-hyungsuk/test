import logging
from datetime import datetime
import feedparser
from sqlalchemy.orm import Session
from app.models.article import Article, ArticleStatus
from app.scrapers.sources import SOURCES, CLINICAL_KEYWORDS

logger = logging.getLogger(__name__)


def _is_clinically_relevant(text: str) -> bool:
    lower = text.lower()
    return any(kw in lower for kw in CLINICAL_KEYWORDS)


def scrape_all(db: Session) -> int:
    added = 0
    for source in SOURCES:
        try:
            feed = feedparser.parse(source["url"])
            for entry in feed.entries:
                url = entry.get("link", "")
                if not url:
                    continue
                # Skip if already in DB
                if db.query(Article).filter(Article.full_url == url).first():
                    continue
                title = entry.get("title", "")
                summary = entry.get("summary", "")[:2000]
                combined = f"{title} {summary}"
                # For broad sources (arXiv cs.AI), filter to clinical topics
                if "arxiv" in source["url"] and "q-bio" not in source["url"]:
                    if not _is_clinically_relevant(combined):
                        continue
                published_at = None
                if hasattr(entry, "published_parsed") and entry.published_parsed:
                    try:
                        published_at = datetime(*entry.published_parsed[:6])
                    except Exception:
                        pass
                article = Article(
                    source_name=source["name"],
                    source_url=source["url"],
                    title=title[:500],
                    original_summary=summary,
                    full_url=url[:500],
                    tags=source["tags"],
                    status=ArticleStatus.pending,
                    published_at=published_at,
                )
                db.add(article)
                added += 1
        except Exception as e:
            logger.warning("Failed to scrape %s: %s", source["name"], e)
    db.commit()
    logger.info("Scraped %d new articles", added)
    return added
