# Research AI Weekly

A bi-weekly newsletter platform teaching medical students and residents how to use AI tools in their research workflow — in plain English, no technical background required.

**Core philosophy:** Tutorials are the hero content. News articles are secondary and always include a plain-English note explaining what the news means for a medical student's or resident's research workflow.

---

## What it includes

- **Public web app** — tutorials library, newsletter archive, subscribe page
- **Admin dashboard** — article review queue, tutorial editor, newsletter composer, subscriber list
- **Automated RSS scraper** — pulls from Anthropic, OpenAI, DeepMind, arXiv, NEJM AI, Nature Medicine
- **Email delivery** — bi-weekly newsletters via Resend

---

## Quick start (local)

### Prerequisites
- Docker + Docker Compose
- A [Resend](https://resend.com) account (free tier: 3,000 emails/month)

### 1. Configure environment
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/medai
RESEND_API_KEY=re_your_key_here
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=your_password
JWT_SECRET=a-long-random-string
FRONTEND_URL=http://localhost:3000
```

### 2. Start everything
```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### 3. Trigger your first scrape
```bash
curl -X POST http://localhost:8000/admin/scrape \
  -H "Authorization: Bearer <your_jwt_token>"
```
Or just wait — the scraper runs automatically every day at 06:00 UTC.

---

## Workflow

### Writing tutorials (the most important part)
1. Go to `/admin/tutorials`
2. Write a step-by-step guide in Markdown — plain English, no jargon
3. Tag it (Literature Review / Study Design / Data Analysis / Clinical Research)
4. Mark as Published when ready

### Curating articles
1. Go to `/admin/queue` — pending articles from the RSS scraper appear here
2. For each article, write a `clinical_relevance_note`:
   > "What this means for your research: ..."
   This replaces the raw article summary in the newsletter. It must be written before you can approve.
3. Approve or reject.

### Composing an issue
1. Go to `/admin/compose`
2. Select a **featured tutorial** (required — every issue leads with a guide)
3. Select 3–5 approved articles
4. Save as draft, preview, then send

---

## Deploy (Railway)

1. Create a PostgreSQL database on Railway
2. Deploy the `backend/` directory as a Python service
3. Deploy the `frontend/` directory as a static site
4. Set environment variables from `.env.example`

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11 + FastAPI |
| Database | PostgreSQL + SQLAlchemy |
| Frontend | React 18 + Tailwind CSS |
| Email | Resend API |
| Scraping | feedparser |
| Scheduling | APScheduler |
