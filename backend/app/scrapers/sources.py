SOURCES = [
    {"name": "Anthropic Blog", "url": "https://www.anthropic.com/rss.xml", "tags": ["AI tools", "research"]},
    {"name": "OpenAI Blog", "url": "https://openai.com/blog/rss.xml", "tags": ["AI tools", "research"]},
    {"name": "Google DeepMind", "url": "https://deepmind.google/blog/rss.xml", "tags": ["AI tools", "healthcare"]},
    {"name": "arXiv cs.AI", "url": "https://rss.arxiv.org/rss/cs.AI", "tags": ["research", "study design"]},
    {"name": "arXiv q-bio", "url": "https://rss.arxiv.org/rss/q-bio", "tags": ["clinical research", "data analysis"]},
    {"name": "NEJM AI", "url": "https://ai.nejm.org/rss/current", "tags": ["clinical research", "evidence"]},
    {"name": "Nature Medicine", "url": "https://www.nature.com/nm.rss", "tags": ["clinical research", "AI tools"]},
]

# Keywords that indicate clinical research relevance — used to filter arXiv/general sources
CLINICAL_KEYWORDS = [
    "clinical", "medical", "patient", "hospital", "diagnosis", "treatment",
    "literature review", "systematic review", "evidence", "cohort", "trial",
    "research workflow", "data analysis", "study design", "healthcare",
    "physician", "doctor", "nurse", "radiology", "pathology",
]
