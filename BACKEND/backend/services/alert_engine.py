from backend.data.store import patients, alerts, shift_logs
from datetime import datetime

last_alerted_status = {}

def generate_alerts():
    for p_id, patient in patients.items():
        if patient.status == "Stable":
            last_alerted_status[p_id] = "Stable"
            continue
            
        severity = ""
        recipient = ""
        
        if patient.risk_score >= 71:
            severity = "Critical"
            recipient = "Nurse + Doctor + ICU Team"
        elif patient.risk_score >= 51:
            severity = "High"
            recipient = "Nurse + Duty Doctor"
        else:
            severity = "Moderate"
            recipient = "Assigned Nurse"
            
        if last_alerted_status.get(p_id) != severity:
            alert = {
                "timestamp": datetime.now().isoformat(),
                "patient_id": p_id,
                "patient_name": patient.name,
                "severity": severity,
                "recipient": recipient,
                "message": f"Patient {patient.name} ({p_id}) is in {severity} condition. Risk Score: {patient.risk_score}"
            }
            alerts.insert(0, alert)
            last_alerted_status[p_id] = severity
            
            # Log the event for shift handover report
            event_map = {
                "Critical": "Critical alert generated – ICU team notified",
                "High": "High-priority alert generated – doctor notified",
                "Moderate": "Moderate alert generated – nurse notified",
            }
            shift_logs.insert(0, {
                "timestamp": alert["timestamp"],
                "patient_id": p_id,
                "patient_name": patient.name,
                "bed_number": patient.bed_number,
                "event": event_map.get(severity, "Alert generated"),
                "severity": severity,
                "risk_score": patient.risk_score,
                "countdown": patient.countdown,
                "outcome": f"Escalated to {recipient}",
            })
            if len(shift_logs) > 200:
                shift_logs.pop()
            
            if len(alerts) > 100:
                alerts.pop()
