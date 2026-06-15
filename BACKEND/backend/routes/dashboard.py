from fastapi import APIRouter
from backend.data.store import dashboard_stats, patients, alerts

router = APIRouter()

@router.get("/dashboard")
def get_dashboard():
    priority_queue = sorted(list(patients.values()), key=lambda x: x.priority, reverse=True)
    return {
        "stats": dashboard_stats,
        "patients": list(patients.values()),
        "priorityQueue": priority_queue,
        "alerts": alerts[:20]
    }
