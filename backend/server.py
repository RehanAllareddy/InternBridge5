from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from seed_data import get_seed_internships
from scraper import ScraperService

from apscheduler.schedulers.asyncio import AsyncIOScheduler


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
TAVILY_API_KEY = os.environ.get('TAVILY_API_KEY', '')

scraper = ScraperService(db, TAVILY_API_KEY, EMERGENT_LLM_KEY)
scheduler = AsyncIOScheduler()

# Create the main app without a prefix
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# =================== MODELS ===================
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class Internship(BaseModel):
    id: str
    field: str
    title: str
    location: str
    deadline: str
    grade: str
    url: str
    source: Optional[str] = 'seed'
    created_at: Optional[datetime] = None


class ScrapeRunSummary(BaseModel):
    id: str
    started_at: datetime
    finished_at: Optional[datetime] = None
    status: str
    queries_searched: Optional[int] = 0
    candidates_found: Optional[int] = 0
    new_added: Optional[int] = 0
    duration_seconds: Optional[float] = 0


# =================== HELPERS ===================
def _doc_to_internship(doc) -> dict:
    return {
        'id': str(doc.get('_id')),
        'field': doc.get('field', ''),
        'title': doc.get('title', ''),
        'location': doc.get('location', ''),
        'deadline': doc.get('deadline', ''),
        'grade': doc.get('grade', ''),
        'url': doc.get('url', ''),
        'source': doc.get('source', 'seed'),
        'created_at': doc.get('created_at'),
    }


async def seed_database_if_empty():
    seeds = get_seed_internships()
    inserted = 0
    for s in seeds:
        existing = await db.internships.find_one({'title': s['title']})
        if not existing:
            s['created_at'] = datetime.now(timezone.utc)
            await db.internships.insert_one(s)
            inserted += 1
    count = await db.internships.count_documents({})
    if inserted:
        logger.info(f"Inserted {inserted} new seed internships. Collection now has {count} documents.")
    else:
        logger.info(f"Internships collection already up to date with {count} documents.")


# =================== ROUTES ===================
@api_router.get("/")
async def root():
    return {"message": "InternBridge API", "status": "ok"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.dict())
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**s) for s in status_checks]


@api_router.get("/internships")
async def get_internships():
    docs = await db.internships.find().sort('created_at', -1).to_list(5000)
    return [_doc_to_internship(d) for d in docs]


@api_router.get("/internships/stats")
async def get_internships_stats():
    total = await db.internships.count_documents({})
    fields = await db.internships.distinct('field')
    locations = await db.internships.distinct('location')
    last_run = await db.scrape_runs.find_one(
        {'status': 'completed'}, sort=[('finished_at', -1)]
    )
    return {
        'total': total,
        'fields': len(fields),
        'locations': len(locations),
        'last_scrape': last_run.get('finished_at').isoformat() if last_run and last_run.get('finished_at') else None,
        'last_scrape_added': last_run.get('new_added', 0) if last_run else 0,
    }


@api_router.post("/admin/scrape")
async def trigger_scrape(background_tasks: BackgroundTasks):
    """Trigger a scrape run in the background. Returns immediately."""
    if not TAVILY_API_KEY or not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="Scraper not configured (missing API keys)")

    # Check if a scrape is already running
    running = await db.scrape_runs.find_one({'status': 'running'})
    if running:
        return {'message': 'Scrape already in progress', 'started_at': running.get('started_at').isoformat() if running.get('started_at') else None}

    async def _do_scrape():
        try:
            await scraper.run_once()
        except Exception as e:
            logger.error(f"Scrape run failed: {e}")
            await db.scrape_runs.update_many(
                {'status': 'running'},
                {'$set': {'status': 'failed', 'finished_at': datetime.now(timezone.utc), 'error': str(e)}},
            )

    background_tasks.add_task(_do_scrape)
    return {'message': 'Scrape started in background', 'started_at': datetime.now(timezone.utc).isoformat()}


@api_router.get("/admin/scrape/status")
async def scrape_status():
    runs_cursor = db.scrape_runs.find().sort('started_at', -1).limit(10)
    runs = []
    async for r in runs_cursor:
        runs.append({
            'id': str(r.get('_id')),
            'started_at': r.get('started_at').isoformat() if r.get('started_at') else None,
            'finished_at': r.get('finished_at').isoformat() if r.get('finished_at') else None,
            'status': r.get('status', 'unknown'),
            'queries_searched': r.get('queries_searched', 0),
            'candidates_found': r.get('candidates_found', 0),
            'new_added': r.get('new_added', 0),
            'duration_seconds': r.get('duration_seconds', 0),
            'error': r.get('error'),
        })
    return {'runs': runs}


@api_router.get("/internships/recent")
async def recent_internships(limit: int = 12):
    docs = await db.internships.find({'source': 'scraper'}).sort('created_at', -1).to_list(limit)
    return [_doc_to_internship(d) for d in docs]


# =================== APP LIFECYCLE ===================
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await seed_database_if_empty()
    # Schedule scraping every 6 hours
    if TAVILY_API_KEY and EMERGENT_LLM_KEY:
        scheduler.add_job(
            scraper.run_once,
            trigger='interval',
            hours=6,
            id='scrape_internships',
            replace_existing=True,
            max_instances=1,
            coalesce=True,
        )
        scheduler.start()
        logger.info("Scheduler started — scrape will run every 6 hours.")
    else:
        logger.warning("Scraper API keys missing — scheduler not started.")


@app.on_event("shutdown")
async def shutdown_db_client():
    try:
        scheduler.shutdown(wait=False)
    except Exception:
        pass
    client.close()
