from datetime import datetime
from backend.data.store import engine_state

from backend.services.scenario_engine import update_scenarios, update_trends
from backend.services.risk_engine import calculate_risk
from backend.services.explanation_engine import generate_explanations
from backend.services.countdown_engine import predict_countdown
from backend.services.priority_engine import rank_priorities
from backend.services.alert_engine import generate_alerts
from backend.services.voice_engine import generate_voice_announcements
from backend.services.summary_engine import generate_clinical_summaries
from backend.services.dashboard_engine import refresh_dashboard_statistics

def run_orchestration_cycle():
    if not engine_state["running"]:
        return
        
    update_scenarios()
    update_trends()
    calculate_risk()
    generate_explanations()
    predict_countdown()
    rank_priorities()
    generate_alerts()
    generate_voice_announcements()
    generate_clinical_summaries()
    refresh_dashboard_statistics()
    
    engine_state["cycle_count"] += 1
    engine_state["last_updated"] = datetime.now().isoformat()
