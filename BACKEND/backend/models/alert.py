from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Alert(BaseModel):
    timestamp: str
    patient_id: str
    patient_name: str
    severity: str
    recipient: str
    message: str

class VoiceAlert(BaseModel):
    timestamp: str
    message: str
