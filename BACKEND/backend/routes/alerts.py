from fastapi import APIRouter
from backend.data.store import alerts, voice_alerts

router = APIRouter()

@router.get("/alerts")
def get_alerts():
    return alerts

@router.get("/voice-alert")
def get_voice_alert():
    if len(voice_alerts) > 0:
        return voice_alerts[0]
    return {"message": None}
