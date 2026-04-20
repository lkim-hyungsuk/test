import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

logger = logging.getLogger(__name__)
_scheduler = BackgroundScheduler()


def _scrape_job():
    from app.database import SessionLocal
    from app.scrapers.rss import scrape_all
    db = SessionLocal()
    try:
        count = scrape_all(db)
        logger.info("Scheduled scrape added %d articles", count)
    finally:
        db.close()


def start_scheduler():
    # Scrape daily at 06:00 UTC
    _scheduler.add_job(_scrape_job, CronTrigger(hour=6, minute=0), id="daily_scrape", replace_existing=True)
    _scheduler.start()
    logger.info("Scheduler started")


def stop_scheduler():
    _scheduler.shutdown(wait=False)
