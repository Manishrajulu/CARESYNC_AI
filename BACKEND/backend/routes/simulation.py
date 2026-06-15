from fastapi import APIRouter, HTTPException
from backend.models.requests import InterventionRequest
from backend.services.intervention_engine import simulate_intervention

router = APIRouter()

@router.post("/simulate-intervention")
def simulate(req: InterventionRequest):
    result = simulate_intervention(req.patientId, req.intervention)
    if result is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return result
