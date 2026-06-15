# CareSync AI — ICU Clinical Decision Support System

CareSync AI is an AI-powered ICU Clinical Decision Support System designed to transform healthcare from reactive care to proactive care. Created as a 6-hour hackathon prototype, it continuously monitors patient vitals, predicts clinical deterioration, ranks patients dynamically in a priority queue, generates intelligent alerts with audio announcements & haptics, and supports simulated clinical interventions.

---

## Key Features (USPs)

*   **Pulsing Real-time Dashboard**: Live ICU patient metrics (Heart Rate, SpO₂, Blood Pressure, Temperature) polled and rendered every 5 seconds.
*   **Intelligent Priority Queue**: AI-ranked patient triage order dynamically updated to highlight the most critical patients first.
*   **Explainable AI (XAI)**: Clinical explanation cards for flags showing exactly why a patient is at risk.
*   **Estimated Time to Critical Event (Countdown)**: Pulsing visual timers indicating minutes remaining before a critical event, turning red as urgency increases.
*   **Voice Alerts & Haptic Feedback**: FIFO queued browser-based clinical announcements paired with custom vibration patterns (Critical/High) for emergency alerts.
*   **What-If Intervention Simulator**: Clinicians can select simulated interventions (Oxygen, Meds, Fluids) to instantly view predicted drops in risk scores and improved countdowns.
*   **Shift Handover & Nurse Login Flow**: Secure shift-based login (Morning/Evening/Night) with comprehensive clinical timeline log history for handover reports.
*   **Live Health Monitor**: Real-time status warnings at the header if the backend server becomes unreachable.

---

## Tech Stack

### Backend
*   **Core**: FastAPI (Python 3.10+)
*   **Server**: Uvicorn
*   **Services**: Modular scenario engines, risk engines, priority ranks, voice announcement compiling, and shift loggers.

### Frontend
*   **Framework**: React (v18) + TypeScript
*   **Bundler**: Vite
*   **State Management / Fetching**: TanStack React Query (v5) + Axios
*   **Styling**: Vanilla CSS, Lucide icons, Recharts

---

## Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)

### 1. Run the Backend
Navigate to the `BACKEND` directory:
```bash
cd BACKEND
```
Create a virtual environment (optional but recommended):
```bash
python -m venv .venv
.venv\Scripts\activate
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Start the FastAPI server:
```bash
python -m uvicorn backend.main:app --reload
```
The backend will run at `http://localhost:8000`.

### 2. Run the Frontend
Navigate to the `FRONTEND` directory:
```bash
cd FRONTEND
```
Install npm dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
The frontend will run at `http://localhost:5173`.

---

## Project Structure

```text
CARESYNC_AI/
├── BACKEND/
│   └── backend/
│       ├── data/         # Mock patients and scenario trajectories
│       ├── models/       # Pydantic schemas (Patient, Vitals)
│       ├── routes/       # API router endpoints
│       ├── services/     # Clinical engine calculations
│       ├── config.py     # Configuration parameters
│       └── main.py       # FastAPI application & startup lifecycle
└── FRONTEND/
    ├── src/
    │   └── app/
    │       ├── components/ # React pages & reusable UI blocks
    │       ├── lib/        # API configuration, voice tools, state persistence
    │       └── routes.tsx  # Router layout
    ├── package.json
    └── vite.config.ts
```
