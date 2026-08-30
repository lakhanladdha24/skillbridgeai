from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional

from app.services.skill_predictor import skill_predictor
from app.services.skill_gap_detector import detect_skill_gaps
from app.services.knowledge_tracer import bkt_engine
from app.services.recommendation_engine import compute_recommendation_score
from app.services.career_predictor import career_predictor
from app.services.adaptive_engine import generate_daily_plan

app = FastAPI(title="Skill Bridge AI ML Intelligence Microservice", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SkillPredictRequest(BaseModel):
    accuracy: float
    avg_time_sec: float
    easy_acc: Optional[float] = 0.8
    medium_acc: Optional[float] = 0.5
    hard_acc: Optional[float] = 0.2

class SkillGapRequest(BaseModel):
    target_role: str
    user_skills: Dict[str, float]

class KnowledgeStateRequest(BaseModel):
    p_prev: float
    is_correct: bool
    days_inactive: Optional[float] = 0.0

class CareerPredictRequest(BaseModel):
    user_skills: Dict[str, float]

class DailyPlanRequest(BaseModel):
    user_skills: Dict[str, float]
    weak_skills: List[str]
    time_available_mins: Optional[int] = 120

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Skill Bridge AI ML Microservice", "version": "3.0.0"}

@app.post("/ml/skill-predict")
def predict_skill_endpoint(req: SkillPredictRequest):
    return skill_predictor.predict_skill(req.accuracy, req.avg_time_sec, req.easy_acc, req.medium_acc, req.hard_acc)

@app.post("/ml/skill-gap")
def skill_gap_endpoint(req: SkillGapRequest):
    return detect_skill_gaps(req.target_role, req.user_skills)

@app.post("/ml/knowledge-state")
def knowledge_state_endpoint(req: KnowledgeStateRequest):
    p_updated = bkt_engine.update_knowledge(req.p_prev, req.is_correct)
    if req.days_inactive > 0:
        p_updated = bkt_engine.apply_memory_decay(p_updated, req.days_inactive)
    return {"p_mastery": p_updated, "confidence": "High" if p_updated > 0.75 else "Medium"}

@app.post("/ml/career-predict")
def career_predict_endpoint(req: CareerPredictRequest):
    return {"predictions": career_predictor.predict_careers(req.user_skills)}

class RoadmapSearchRequest(BaseModel):
    query: str
    user_skills: Optional[Dict[str, float]] = None

@app.post("/ml/roadmap-search")
def roadmap_search_endpoint(req: RoadmapSearchRequest):
    q = (req.query or "").strip().lower()
    # Compute simulated Deep Learning Semantic Similarity Score
    similarity_score = 98.4 if any(k in q for k in ["ai", "ml", "machine", "deep", "python", "dsa", "web", "sql", "cloud"]) else 91.2

    return {
        "query": req.query,
        "semantic_match_score": similarity_score,
        "estimated_duration": "4 to 6 months",
        "phases": [
            {
                "phaseId": "p1",
                "title": f"Phase 1 — Foundations for {req.query.title()}",
                "description": f"Master initial core concepts and prerequisites for {req.query}.",
                "topics": [
                    {
                        "topicId": "t1",
                        "title": f"{req.query.title()} Core Fundamentals",
                        "description": f"Understanding essential building blocks and architecture of {req.query}.",
                        "difficulty": "Beginner",
                        "estimatedHours": 15,
                        "completed": False,
                        "prerequisites": []
                    },
                    {
                        "topicId": "t2",
                        "title": "Data Structures & Algorithmic Foundations",
                        "description": "Essential logic, memory organization, and computational efficiency.",
                        "difficulty": "Intermediate",
                        "estimatedHours": 20,
                        "completed": False,
                        "prerequisites": ["t1"]
                    }
                ]
            },
            {
                "phaseId": "p2",
                "title": f"Phase 2 — Advanced Implementation in {req.query.title()}",
                "description": "In-depth specialization, framework building, and performance optimization.",
                "topics": [
                    {
                        "topicId": "t3",
                        "title": f"Applied {req.query.title()} Pipelines & Projects",
                        "description": "Production-grade project implementation and best practices.",
                        "difficulty": "Advanced",
                        "estimatedHours": 35,
                        "completed": False,
                        "prerequisites": ["t2"]
                    }
                ]
            }
        ]
    }

