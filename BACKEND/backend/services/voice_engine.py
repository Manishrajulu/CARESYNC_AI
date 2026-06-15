from backend.data.store import patients, voice_alerts
from datetime import datetime

last_voice_alerted = {}

def generate_voice_announcements():
    for p_id, patient in patients.items():
        if patient.status == "Stable":
            last_voice_alerted[p_id] = "Stable"
            continue
            
        severity = ""
        if patient.risk_score >= 71:
            severity = "Critical"
        elif patient.risk_score >= 51:
            severity = "High"
        else:
            severity = "Moderate"
            
        if last_voice_alerted.get(p_id) != severity:
            message = ""
            if severity == "Moderate":
                message = f"Patient {p_id} requires observation."
            elif severity == "High":
                message = f"Attention Nurse. Patient {p_id} requires immediate assistance."
            else:
                bed_num = patient.bed_number.split(" ")[-1] if " " in patient.bed_number else patient.bed_number
                message = f"Code Red. ICU Team to Bed {bed_num} immediately."
                
            voice_alert = {
                "timestamp": datetime.now().isoformat(),
                "message": message
            }
            voice_alerts.insert(0, voice_alert)
            last_voice_alerted[p_id] = severity
            
            if len(voice_alerts) > 50:
                voice_alerts.pop()
