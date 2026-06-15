from fastapi import APIRouter
from backend.data.store import engine_state

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "engine_running": engine_state["running"],
        "cycle_count": engine_state["cycle_count"],
        "last_updated": engine_state["last_updated"]
    }
