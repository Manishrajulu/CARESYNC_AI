from backend.data.store import patients

def generate_explanations():
    for p_id, patient in patients.items():
        explanations = []
        profile = patient.monitoring_profile
        vitals = patient.vitals

        if "spo2" in profile and vitals.spo2 is not None and vitals.spo2 < 90:
            explanations.append("Oxygen saturation dropped below threshold")
        
        if "heart_rate" in profile and vitals.heart_rate is not None and vitals.heart_rate > 130:
            explanations.append("Heart rate increased rapidly")
            
        if "temperature" in profile and vitals.temperature is not None and vitals.temperature > 101.0:
            explanations.append("Persistent fever detected")
            
        if "blood_pressure" in profile and vitals.blood_pressure is not None:
            try:
                sys_str, dia_str = vitals.blood_pressure.split('/')
                sys_val = int(sys_str)
                dia_val = int(dia_str)
                if sys_val > 140 or sys_val < 90 or dia_val > 90 or dia_val < 60:
                    explanations.append("Abnormal blood pressure detected")
            except ValueError:
                pass
                
        if "respiratory_rate" in profile and vitals.respiratory_rate is not None and (vitals.respiratory_rate > 25 or vitals.respiratory_rate < 12):
            explanations.append("Abnormal respiratory rate detected")

        patient.explanations = explanations
