from backend.data.store import patients

def predict_countdown():
    for p_id, patient in patients.items():
        if patient.status == "Critical":
            patient.countdown = "Critical Now"
            continue
            
        if patient.status == "Stable":
            patient.countdown = None
            continue
            
        spo2_trend = patient.trends.get("spo2", [])
        hr_trend = patient.trends.get("heart_rate", [])
        
        minutes = 45 # Default fallback
        if len(spo2_trend) >= 3:
            drop = spo2_trend[-3] - spo2_trend[-1]
            if drop > 0:
                target = 89
                diff = spo2_trend[-1] - target
                if diff > 0:
                    steps = diff / (drop / 2.0)
                    minutes = min(minutes, int(steps * 5))

        if len(hr_trend) >= 3:
            rise = hr_trend[-1] - hr_trend[-3]
            if rise > 0:
                target = 131
                diff = target - hr_trend[-1]
                if diff > 0:
                    steps = diff / (rise / 2.0)
                    minutes = min(minutes, int(steps * 5))

        patient.countdown = f"{max(1, minutes)} minutes"
