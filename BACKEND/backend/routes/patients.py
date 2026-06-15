from fastapi import APIRouter, HTTPException
from backend.data.store import patients
from backend.models.requests import MonitoringProfileUpdate

router = APIRouter()

@router.get("/patients")
def get_all_patients():
    return list(patients.values())

@router.get("/patients/{id}")
def get_patient(id: str):
    if id not in patients:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient = patients[id]
    return {
        "patient": patient,
        "vitals": patient.vitals,
        "trends": patient.trends,
        "explanations": patient.explanations,
        "countdown": patient.countdown,
        "summary": patient.summary
    }

@router.post("/patients")
def create_patient(patient_data: dict):
    from backend.models.patient import Patient
    try:
        new_patient = Patient(**patient_data)
        patients[new_patient.id] = new_patient
        return new_patient
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/patients/{id}/monitoring-profile")
def update_monitoring_profile(id: str, update: MonitoringProfileUpdate):
    if id not in patients:
        raise HTTPException(status_code=404, detail="Patient not found")
    patients[id].monitoring_profile = update.profile
    return {"message": "Monitoring profile updated successfully", "profile": patients[id].monitoring_profile}
