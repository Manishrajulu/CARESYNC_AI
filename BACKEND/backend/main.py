import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.data.store import patients
from backend.data.scenarios import get_initial_patients
from backend.services.orchestrator import run_orchestration_cycle
from backend.config import Config

from backend.routes import dashboard, patients as patient_routes, queue, alerts, simulation, health, shift_report

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Preload patients
    initial = get_initial_patients()
    for p in initial:
        patients[p.id] = p
        
    # Start background task
    task = asyncio.create_task(engine_loop())
    yield
    # Shutdown
    task.cancel()

async def engine_loop():
    while True:
        run_orchestration_cycle()
        await asyncio.sleep(Config.CYCLE_INTERVAL_SECONDS)

app = FastAPI(title="CareSync AI Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(patient_routes.router)
app.include_router(queue.router)
app.include_router(alerts.router)
app.include_router(simulation.router)
app.include_router(health.router)
app.include_router(shift_report.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=Config.HOST, port=Config.PORT, reload=True)
