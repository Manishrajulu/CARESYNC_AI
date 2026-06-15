from fastapi import APIRouter
from backend.data.store import shift_logs, patients
from datetime import datetime

router = APIRouter()

def _get_current_shift() -> str:
    hour = datetime.now().hour
    if 6 <= hour < 14:
        return "Morning (06:00 – 14:00)"
    elif 14 <= hour < 22:
        return "Evening (14:00 – 22:00)"
    else:
        return "Night (22:00 – 06:00)"

@router.get("/shift-report")
def get_shift_report():
    patient_summary = []
    for p in patients.values():
        patient_summary.append({
            "patient_id": p.id,
            "patient_name": p.name,
            "bed_number": p.bed_number,
            "category": p.category,
            "current_status": p.status,
            "risk_score": p.risk_score,
            "countdown": p.countdown,
            "priority": p.priority,
        })
    # Sort by risk_score descending so highest-risk patients appear first
    patient_summary.sort(key=lambda x: x["risk_score"], reverse=True)

    return {
        "shift": _get_current_shift(),
        "generated_at": datetime.now().isoformat(),
        "total_events": len(shift_logs),
        "patient_summary": patient_summary,
        "events": shift_logs[:50],  # Last 50 events, already sorted newest-first
    }
