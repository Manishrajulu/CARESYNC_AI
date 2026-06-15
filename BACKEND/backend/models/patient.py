from typing import List, Optional, Dict, Union
from pydantic import BaseModel

class Vitals(BaseModel):
    heart_rate: Optional[int] = None
    spo2: Optional[int] = None
    temperature: Optional[float] = None
    blood_pressure: Optional[str] = None
    respiratory_rate: Optional[int] = None

class Patient(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    bed_number: str
    category: str
    monitoring_profile: List[str]
    vitals: Vitals
    trends: Dict[str, List[Union[int, float, str]]] = {}
    risk_score: int = 0
    status: str = "Stable"
    countdown: Optional[str] = None
    priority: float = 0.0
    explanations: List[str] = []
    summary: str = ""
