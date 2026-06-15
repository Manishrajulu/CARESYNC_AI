from backend.data.store import patients, shift_logs
from datetime import datetime

def simulate_intervention(patient_id: str, intervention: str):
    patient = patients.get(patient_id)
    if not patient:
        return None
        
    before_risk = patient.risk_score
    before_countdown = patient.countdown
    
    after_risk = before_risk
    after_countdown = before_countdown
    explanation = ""
    
    if intervention == "Oxygen Support":
        after_risk = max(0, before_risk - 30)
        if before_countdown == "Critical Now":
            after_countdown = "15 minutes"
        elif before_countdown:
            after_countdown = "45 minutes"
        explanation = "Oxygen support improves SpO2 and delays deterioration."
    elif intervention == "Medication":
        after_risk = max(0, before_risk - 20)
        if before_countdown == "Critical Now":
            after_countdown = "10 minutes"
        elif before_countdown:
            after_countdown = "60 minutes"
        explanation = "Medication stabilizes heart rate and reduces risk."
    elif intervention == "Fluid Support":
        after_risk = max(0, before_risk - 15)
        if before_countdown == "Critical Now":
            after_countdown = "5 minutes"
        elif before_countdown:
            after_countdown = "30 minutes"
        explanation = "Fluid support improves blood pressure and perfusion."
    elif intervention == "Increase Monitoring":
        explanation = "Increased monitoring provides more data but does not directly alter patient physiological state."
    else:
        explanation = "Unknown intervention applied."
        
    result = {
        "before": {
            "Risk": before_risk,
            "Countdown": before_countdown
        },
        "after": {
            "Risk": after_risk,
            "Countdown": after_countdown
        },
        "explanation": explanation
    }
    
    # Log intervention to shift report
    shift_logs.insert(0, {
        "timestamp": datetime.now().isoformat(),
        "patient_id": patient_id,
        "patient_name": patient.name,
        "bed_number": patient.bed_number,
        "event": f"What-If Simulation: {intervention} applied",
        "severity": "Info",
        "risk_score": after_risk,
        "countdown": after_countdown,
        "outcome": explanation,
    })
    if len(shift_logs) > 200:
        shift_logs.pop()
    
    return result
