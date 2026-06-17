"""AI-powered scraper: uses Tavily search + Emergent LLM to discover and extract new internships."""
import os
import json
import logging
import asyncio
from datetime import datetime, timezone
from typing import List, Dict, Any

from tavily import TavilyClient
from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)

# Search queries to discover new internships
SEARCH_QUERIES = [
    "best high school internship programs 2026 STEM apply",
    "new high school summer research programs 2026",
    "college student internships 2026 tech finance application deadlines",
    "paid internships for high school students 2026 list",
    "computer science internships high school students 2026",
    "biology medicine research internships high school 2026",
    "business finance internships college students 2026",
    "engineering internships high school summer 2026 deadlines",
    "AI machine learning internships students 2026",
    "arts design internships high school students 2026",
]

VALID_FIELDS = {
    'STEM','Law','Design','Business','AI','Medicine','Arts','Engineering','CS','Science','Research',
    'Tech','Finance','Healthcare','Policy','Journalism','Environment','Education','Community Service',
    'Leadership/Business'
}

EXTRACTION_SYSTEM = """You are a strict data extraction assistant. Given web search results about student internships, extract internship opportunities as JSON.

Return ONLY valid JSON in this exact shape (no markdown, no commentary):
{"internships": [{"field": "STEM", "title": "Program Name", "location": "U.S./Virtual/State", "deadline": "Jan/Feb/Mar/.../Rolling", "grade": "HS/College/11-12/HS seniors", "url": "https://..."}, ...]}

Rules:
- field MUST be one of: STEM, Law, Design, Business, AI, Medicine, Arts, Engineering, CS, Science, Research, Tech, Finance, Healthcare, Policy, Journalism, Environment, Education, Community Service, Leadership/Business
- title MUST start with the hosting university, lab, company, or organization name, followed by the program name. Examples:
  * GOOD: "Stanford Pre-Collegiate Studies", "MIT Beaver Works Summer Institute", "Goldman Sachs Insight Series", "Texas Tech Research Apprenticeship", "Bank of America Student Leaders"
  * BAD: "Summer High School Internship", "Research Program for HS Students", "Internship Programs", "Current Opportunities"
- If the search result mentions a university or organization (Harvard, NIH, NASA, JPL, Texas A&M, etc.), the title MUST include that name first.
- If you cannot determine which specific organization runs the program, SKIP it entirely. Do not include generic-titled programs.
- Each title must be unique and identifiable — no two titles should be confusable.
- location: short, e.g., "MA", "CA", "Virtual", "U.S.", "DC", "NY"
- deadline: month abbreviation (Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec) OR "Rolling"
- grade: "HS", "College", "HS+College", "11-12", "HS seniors" etc.
- url: official program/application URL
- Only include programs that are CLEARLY internship/research/fellowship opportunities for HS or college students
- Skip news articles, generic listings, blog posts, or anything that is not a real specific program
- If you cannot find at least 1 valid opportunity, return {"internships": []}
- Limit to maximum 8 opportunities per call
"""


class ScraperService:
    def __init__(self, db, tavily_api_key: str, llm_api_key: str):
        self.db = db
        self.tavily_api_key = tavily_api_key
        self.llm_api_key = llm_api_key
        self.tavily = TavilyClient(api_key=tavily_api_key) if tavily_api_key else None

    async def _search_one(self, query: str) -> List[Dict[str, Any]]:
        if not self.tavily:
            return []
        try:
            # Tavily is sync — run in thread
            loop = asyncio.get_event_loop()
            res = await loop.run_in_executor(
                None,
                lambda: self.tavily.search(query=query, search_depth="basic", max_results=8, include_answer=False),
            )
            return res.get('results', []) or []
        except Exception as e:
            logger.warning(f"Tavily search failed for '{query}': {e}")
            return []

    async def _extract_from_results(self, query: str, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not results:
            return []
        snippets = []
        for r in results[:8]:
            snippets.append({
                'title': r.get('title', ''),
                'url': r.get('url', ''),
                'content': (r.get('content') or '')[:600],
            })
        prompt = (
            f"Search query: {query}\n\n"
            f"Web search results (JSON):\n{json.dumps(snippets, ensure_ascii=False)}\n\n"
            "Extract real student internship/research/fellowship programs from these results. Output strict JSON."
        )
        try:
            chat = LlmChat(
                api_key=self.llm_api_key,
                session_id=f"scrape-{datetime.now(timezone.utc).timestamp()}",
                system_message=EXTRACTION_SYSTEM,
            ).with_model("openai", "gpt-5.4-mini")
            response = await chat.send_message(UserMessage(text=prompt))
            text = response.strip() if isinstance(response, str) else str(response)
            # strip code fences if present
            if text.startswith('```'):
                text = text.strip('`')
                if text.startswith('json'):
                    text = text[4:]
                text = text.strip()
            data = json.loads(text)
            items = data.get('internships', [])
            cleaned = []
            for it in items:
                if not isinstance(it, dict):
                    continue
                field = (it.get('field') or '').strip()
                if field not in VALID_FIELDS:
                    continue
                title = (it.get('title') or '').strip()
                url = (it.get('url') or '').strip()
                if not title or not url or not url.startswith('http'):
                    continue
                cleaned.append({
                    'field': field,
                    'title': title[:120],
                    'location': (it.get('location') or 'U.S.').strip()[:50],
                    'deadline': (it.get('deadline') or 'Rolling').strip()[:30],
                    'grade': (it.get('grade') or 'HS').strip()[:30],
                    'url': url[:500],
                    'source': 'scraper',
                })
            return cleaned
        except Exception as e:
            logger.warning(f"LLM extraction failed: {e}")
            return []

    async def _dedupe_and_store(self, candidates: List[Dict[str, Any]]) -> int:
        if not candidates:
            return 0
        # Build a set of existing titles + urls for dedupe
        existing_cursor = self.db.internships.find({}, {'title': 1, 'url': 1})
        existing = {(doc.get('title','').lower(), doc.get('url','').lower()) async for doc in existing_cursor}
        existing_titles = {t for t, _ in existing}
        existing_urls = {u for _, u in existing}

        new_docs = []
        for c in candidates:
            t = c['title'].lower()
            u = c['url'].lower()
            if t in existing_titles or u in existing_urls:
                continue
            existing_titles.add(t)
            existing_urls.add(u)
            c['created_at'] = datetime.now(timezone.utc)
            new_docs.append(c)

        if new_docs:
            await self.db.internships.insert_many(new_docs)
        return len(new_docs)

    async def run_once(self, max_queries: int = None) -> Dict[str, Any]:
        """Run a single scrape pass. Returns summary stats."""
        started = datetime.now(timezone.utc)
        await self.db.scrape_runs.insert_one({
            'started_at': started, 'status': 'running',
        })
        run_doc = await self.db.scrape_runs.find_one(sort=[('started_at', -1)])
        run_id = run_doc['_id']

        queries = SEARCH_QUERIES[: max_queries] if max_queries else SEARCH_QUERIES
        all_candidates: List[Dict[str, Any]] = []
        searched = 0
        for q in queries:
            results = await self._search_one(q)
            searched += 1
            extracted = await self._extract_from_results(q, results)
            all_candidates.extend(extracted)

        added = await self._dedupe_and_store(all_candidates)
        finished = datetime.now(timezone.utc)

        await self.db.scrape_runs.update_one(
            {'_id': run_id},
            {'$set': {
                'finished_at': finished,
                'status': 'completed',
                'queries_searched': searched,
                'candidates_found': len(all_candidates),
                'new_added': added,
                'duration_seconds': (finished - started).total_seconds(),
            }},
        )

        return {
            'started_at': started.isoformat(),
            'finished_at': finished.isoformat(),
            'queries_searched': searched,
            'candidates_found': len(all_candidates),
            'new_added': added,
        }
