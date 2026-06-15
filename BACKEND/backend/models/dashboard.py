from pydantic import BaseModel
from typing import List, Any, Optional

class DashboardStats(BaseModel):
    total_patients: int = 0
    stable_count: int = 0
    moderate_count: int = 0
    critical_count: int = 0
    average_risk_score: float = 0.0

class DashboardResponse(BaseModel):
    stats: DashboardStats
    patients: List[Any]
    priorityQueue: List[Any]
    alerts: List[Any]
