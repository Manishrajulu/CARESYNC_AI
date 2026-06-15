from typing import Dict, List, Any
from backend.models.patient import Patient

patients: Dict[str, Patient] = {}
alerts: List[dict] = []
voice_alerts: List[dict] = []
shift_logs: List[dict] = []  # Chronological event log for shift handover report
dashboard_stats: dict = {
    "total_patients": 0,
    "stable_count": 0,
    "moderate_count": 0,
    "critical_count": 0,
    "average_risk_score": 0.0
}

engine_state: dict = {
    "running": True,
    "cycle_count": 0,
    "last_updated": None
}
