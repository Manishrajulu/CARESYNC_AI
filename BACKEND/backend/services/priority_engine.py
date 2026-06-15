from backend.data.store import patients

def rank_priorities():
    for p_id, patient in patients.items():
        priority_score = patient.risk_score * 0.7
        urgency_score = 0
        
        if patient.countdown == "Critical Now":
            urgency_score = 30
        elif patient.countdown:
            try:
                mins = int(patient.countdown.split()[0])
                if mins <= 15:
                    urgency_score = 20
                elif mins <= 30:
                    urgency_score = 10
            except ValueError:
                pass
                
        patient.priority = priority_score + urgency_score
