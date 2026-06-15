from backend.data.store import patients, engine_state
from backend.data.scenarios import TRAJECTORIES

def update_scenarios():
    """
    Updates patient vitals along their predefined trajectories.
    """
    cycle = engine_state.get("cycle_count", 0)
    
    for p_id, patient in patients.items():
        if p_id in TRAJECTORIES:
            traj = TRAJECTORIES[p_id]
            for vital_name, values in traj.items():
                if len(values) > 0:
                    idx = cycle % len(values)
                    # Update patient vitals
                    setattr(patient.vitals, vital_name, values[idx])

def update_trends():
    """
    Appends current vitals to the patient's trends.
    """
    for p_id, patient in patients.items():
        vitals_dict = patient.vitals.model_dump()
        for key, val in vitals_dict.items():
            if val is not None:
                if key not in patient.trends:
                    patient.trends[key] = []
                patient.trends[key].append(val)
                # Keep last 50 data points to prevent memory explosion
                if len(patient.trends[key]) > 50:
                    patient.trends[key] = patient.trends[key][-50:]
