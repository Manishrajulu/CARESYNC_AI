from backend.data.store import patients

def calculate_risk():
    for p_id, patient in patients.items():
        score = 0
        profile = patient.monitoring_profile
        vitals = patient.vitals

        # SpO2 < 90: +50
        if "spo2" in profile and vitals.spo2 is not None:
            if vitals.spo2 < 90:
                score += 50

        # Heart Rate > 130: +30
        if "heart_rate" in profile and vitals.heart_rate is not None:
            if vitals.heart_rate > 130:
                score += 30

        # Temperature > 101: +20
        if "temperature" in profile and vitals.temperature is not None:
            if vitals.temperature > 101.0:
                score += 20

        # Abnormal Blood Pressure: +20
        if "blood_pressure" in profile and vitals.blood_pressure is not None:
            try:
                sys_str, dia_str = vitals.blood_pressure.split('/')
                sys_val = int(sys_str)
                dia_val = int(dia_str)
                if sys_val > 140 or sys_val < 90 or dia_val > 90 or dia_val < 60:
                    score += 20
            except ValueError:
                pass

        # Abnormal Respiratory Rate: +20
        if "respiratory_rate" in profile and vitals.respiratory_rate is not None:
            if vitals.respiratory_rate > 25 or vitals.respiratory_rate < 12:
                score += 20
        
        # Cap score at 100
        patient.risk_score = min(score, 100)

        # Update Status
        if patient.risk_score <= 30:
            patient.status = "Stable"
        elif patient.risk_score <= 70:
            patient.status = "Moderate"
        else:
            patient.status = "Critical"
