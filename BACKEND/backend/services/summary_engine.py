from backend.data.store import patients

def generate_clinical_summaries():
    for p_id, patient in patients.items():
        if patient.status == "Stable":
            patient.summary = f"Patient {patient.name} is currently stable with normal vitals."
            continue
            
        issues = []
        if "Oxygen saturation dropped below threshold" in patient.explanations:
            issues.append("declining oxygen saturation")
        if "Heart rate increased rapidly" in patient.explanations:
            issues.append("increasing heart rate")
        if "Persistent fever detected" in patient.explanations:
            issues.append("persistent fever")
            
        issue_str = " and ".join(issues) if issues else "abnormal vitals"
        
        action = "Observation required."
        if patient.risk_score >= 71:
            action = "Immediate physician review recommended."
        elif patient.risk_score >= 51:
            action = "Nurse review recommended."
            
        patient.summary = f"Patient {p_id} demonstrated {issue_str}. High deterioration risk detected. {action}"
