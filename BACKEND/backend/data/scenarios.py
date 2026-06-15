from backend.models.patient import Patient, Vitals

def get_initial_patients() -> list[Patient]:
    return [
        Patient(
            id="P001",
            name="John Doe",
            age=45,
            gender="Male",
            bed_number="Bed 1",
            category="General ICU",
            monitoring_profile=["heart_rate", "spo2", "blood_pressure", "temperature"],
            vitals=Vitals(heart_rate=76, spo2=98, temperature=98.6, blood_pressure="120/80", respiratory_rate=16),
            trends={"heart_rate": [], "spo2": [], "temperature": [], "respiratory_rate": []}
        ),
        Patient(
            id="P002",
            name="Jane Smith",
            age=62,
            gender="Female",
            bed_number="Bed 2",
            category="Respiratory",
            monitoring_profile=["spo2", "temperature", "respiratory_rate"],
            vitals=Vitals(heart_rate=92, spo2=97, temperature=99.0, blood_pressure="125/82", respiratory_rate=18),
            trends={"heart_rate": [], "spo2": [], "temperature": [], "respiratory_rate": []}
        ),
        Patient(
            id="P003",
            name="Robert Johnson",
            age=55,
            gender="Male",
            bed_number="Bed 3",
            category="Infection",
            monitoring_profile=["heart_rate", "spo2", "temperature", "blood_pressure"],
            vitals=Vitals(heart_rate=85, spo2=98, temperature=99.5, blood_pressure="120/80", respiratory_rate=16),
            trends={"heart_rate": [], "spo2": [], "temperature": [], "respiratory_rate": []}
        ),
        Patient(
            id="P004",
            name="Emily Davis",
            age=38,
            gender="Female",
            bed_number="Bed 4",
            category="Post-Surgery",
            monitoring_profile=["heart_rate", "temperature", "blood_pressure"],
            vitals=Vitals(heart_rate=120, spo2=88, temperature=100.5, blood_pressure="110/70", respiratory_rate=22),
            trends={"heart_rate": [], "spo2": [], "temperature": [], "respiratory_rate": []}
        ),
        Patient(
            id="P005",
            name="Michael Brown",
            age=71,
            gender="Male",
            bed_number="Bed 5",
            category="Cardiac",
            monitoring_profile=["heart_rate", "blood_pressure", "spo2"],
            vitals=Vitals(heart_rate=80, spo2=96, temperature=98.6, blood_pressure="130/85", respiratory_rate=18),
            trends={"heart_rate": [], "spo2": [], "temperature": [], "respiratory_rate": []}
        )
    ]

# Define trajectories for the scenario engine
TRAJECTORIES = {
    "P001": { # Stable
        "heart_rate": [76, 77, 78, 77],
        "spo2": [98, 98, 97, 98],
        "temperature": [98.6, 98.6, 98.7, 98.6]
    },
    "P002": { # Respiratory Deterioration
        "heart_rate": [92, 104, 118, 132, 145],
        "spo2": [97, 95, 93, 89, 84],
        "temperature": [99.0, 100.0, 101.0, 102.0],
        "respiratory_rate": [18, 22, 26, 30, 35]
    },
    "P003": { # Fever Progression
        "temperature": [99.5, 100.2, 101.5, 102.5, 103.0],
        "heart_rate": [85, 95, 110, 125, 135]
    },
    "P004": { # Recovering
        "heart_rate": [120, 110, 102, 94, 88],
        "spo2": [88, 91, 95, 98, 99],
        "temperature": [100.5, 99.8, 99.1, 98.6, 98.6]
    },
    "P005": { # Cardiac Deterioration
        "heart_rate": [80, 65, 55, 45, 40],
        "spo2": [96, 95, 92, 90, 88],
        "blood_pressure": ["130/85", "110/70", "90/60", "80/50", "70/40"]
    }
}
