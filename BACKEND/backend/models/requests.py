from pydantic import BaseModel
from typing import List

class MonitoringProfileUpdate(BaseModel):
    profile: List[str]

class InterventionRequest(BaseModel):
    patientId: str
    intervention: str
