from fastapi import APIRouter
from backend.data.store import patients

router = APIRouter()

@router.get("/priority-queue")
def get_priority_queue():
    queue = sorted(list(patients.values()), key=lambda x: x.priority, reverse=True)
    return queue
