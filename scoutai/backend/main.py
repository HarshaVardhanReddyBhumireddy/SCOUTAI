from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from backend.jd_parser import parse_jd
import uvicorn
from candidate_db import CANDIDATES
from matcher import match_candidates
from outreach import simulate_outreach
from scorer import build_shortlist

app = FastAPI(title="ScoutAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class JDRequest(BaseModel):
    jd_text: str


class OutreachRequest(BaseModel):
    candidate_id: int
    jd_text: str
    match_score: float


class ShortlistRequest(BaseModel):
    candidates: list
    match_weight: Optional[float] = 0.6
    interest_weight: Optional[float] = 0.4


@app.get("/")
def root():
    return {"status": "ok", "service": "ScoutAI API"}


@app.post("/api/parse-jd")
def parse_jd_endpoint(req: JDRequest):
    try:
        parsed = parse_jd(req.jd_text)

        # ✅ ALWAYS RETURN VALID JSON
        return {
            "success": True,
            "data": parsed or {}   # 🔥 prevent None
        }

    except Exception as e:
        print("ERROR:", str(e))   # 🔥 log error
        return {
            "success": False,
            "data": {},
            "error": str(e)
        }

@app.post("/api/match-candidates")
def match_candidates_endpoint(req: JDRequest):
    try:
        parsed = parse_jd(req.jd_text)
        matches = match_candidates(parsed, CANDIDATES)
        return {"success": True, "data": matches, "total": len(matches)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/simulate-outreach")
async def simulate_outreach_endpoint(req: OutreachRequest):
    try:
        cand = next((c for c in CANDIDATES if c["id"] == req.candidate_id), None)
        if not cand:
            raise HTTPException(status_code=404, detail="Candidate not found")
        result = await simulate_outreach(cand, req.jd_text, req.match_score)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/build-shortlist")
def build_shortlist_endpoint(req: ShortlistRequest):
    try:
        shortlist = build_shortlist(
            req.candidates, req.match_weight, req.interest_weight
        )
        return {"success": True, "data": shortlist}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/candidates")
def get_all_candidates():
    return {"success": True, "data": CANDIDATES, "total": len(CANDIDATES)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
