from backend.data.store import patients, dashboard_stats

def refresh_dashboard_statistics():
    total = len(patients)
    stable = 0
    moderate = 0
    critical = 0
    total_risk = 0
    
    for p_id, patient in patients.items():
        if patient.status == "Stable":
            stable += 1
        elif patient.status == "Moderate":
            moderate += 1
        elif patient.status == "Critical":
            critical += 1
            
        total_risk += patient.risk_score
        
    dashboard_stats["total_patients"] = total
    dashboard_stats["stable_count"] = stable
    dashboard_stats["moderate_count"] = moderate
    dashboard_stats["critical_count"] = critical
    dashboard_stats["average_risk_score"] = round(total_risk / total if total > 0 else 0.0, 2)
