Build a modern, premium healthcare web application called "CareSync AI".

PROJECT OVERVIEW:
CareSync AI is an AI-powered ICU Clinical Decision Support System designed to transform healthcare from reactive care to proactive care.

Unlike traditional systems that only display patient vitals and trigger alerts after emergencies occur, CareSync AI:
• Continuously monitors patients
• Predicts deterioration before it happens
• Explains why patients are at risk
• Prioritizes patients dynamically
• Escalates alerts intelligently
• Provides voice-assisted notifications

The application should look like a REAL ICU MONITORING PLATFORM USED BY HOSPITALS and NOT like a chatbot or generic AI dashboard.

==================================================
DESIGN REQUIREMENTS
==================================================

Design Style:
- Premium enterprise healthcare UI
- Inspired by Epic Systems, Philips IntelliVue, Cerner
- Professional hospital command center
- Apple-level polish
- Clean and minimal

DO NOT BUILD:
❌ ChatGPT-style interfaces
❌ Cyberpunk AI dashboards
❌ Neon futuristic themes
❌ Generic admin templates

Visual Theme:

Primary Blue:    #2563EB
Critical Red:   #DC2626
Warning Amber:  #F59E0B
Success Green:  #16A34A
Background:     #F8FAFC
Card:           #FFFFFF
Text:            #0F172A

UI Characteristics:
- Rounded corners (16px)
- Soft shadows
- Spacious layouts
- Rich status indicators
- Smooth transitions
- Responsive design
- Medical professionalism

Tech Stack:
- React
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- React Query
- Recharts
- Lucide Icons
- Framer Motion

==================================================
APPLICATION LAYOUT
==================================================

Desktop-first layout:

Sidebar
+
Top Header
+
Main Content Area
+
Right Insights Panel

Sidebar Navigation:

🏥 Dashboard
➕ Patient Admission
📋 Patients
🚨 Alerts
📈 Analytics
⚙ Settings

Header should display:
- CareSync AI
- Tagline: "From Reactive Care to Proactive Care"
- Current Time
- Total Patients
- Critical Count

==================================================
PAGE 1: ICU DASHBOARD
==================================================

Top KPI Cards:
- Total Patients
- Stable Patients
- Moderate Risk Patients
- Critical Patients
- Average Risk Score

Main Patient Table Columns:
- Bed Number
- Patient Name
- Patient Type
- Status
- Risk Score
- Countdown
- Priority
- Actions

Status Colors:
Stable → Green
Moderate → Amber
Critical → Red

Priority Queue Panel:
Display:
🥇 Priority 1
🥈 Priority 2
🥉 Priority 3

Live Alert Feed:
Display:
- Timestamp
- Patient
- Severity
- Message

==================================================
PAGE 2: PATIENT ADMISSION
==================================================

Patient Form Fields:
- Patient ID
- Patient Name
- Age
- Gender
- Bed Number
- Patient Category

Patient Categories:
- General ICU
- Cardiac
- Respiratory
- Post-Surgery
- Infection

==================================================
ADAPTIVE MONITORING PROFILE (USP)
==================================================

Default Monitoring Parameters:
☑ Heart Rate
☑ SpO₂
☑ Blood Pressure
☑ Temperature

Allow doctors/nurses to:
➕ Add monitoring parameters
➖ Remove monitoring parameters
⚙ Customize monitoring profiles

Display selected parameters as chips/tags.

Example:
Cardiac:
✓ HR
✓ BP
✓ SpO₂
✗ Temperature

==================================================
PAGE 3: PATIENT DETAIL PAGE
==================================================

Patient Overview Card:
Display:
- Patient Information
- Bed Number
- Category
- Status
- Risk Score
- Priority

Current Vitals Cards:
❤️ Heart Rate
🫁 SpO₂
🩸 Blood Pressure
🌡 Temperature

Trend Charts:
- HR Trend
- SpO₂ Trend
- Temperature Trend
- BP Trend

Use Recharts.

==================================================
EXPLAINABLE AI SECTION (USP)
==================================================

Title:
"Why was this patient flagged?"

Display reasons such as:

✓ Oxygen saturation dropped below threshold
✓ Heart rate increased rapidly
✓ Persistent fever detected

==================================================
PREDICTIVE DETERIORATION COUNTDOWN (BIGGEST USP)
==================================================

Display prominently:

Estimated Time to Critical

⏳ 18 Minutes

OR

🚨 Critical Now

This should be one of the largest and most visually important components.

==================================================
AI CLINICAL SUMMARY
==================================================

Card Example:

Patient Summary

"Patient P002 demonstrated declining oxygen saturation and increasing heart rate.

Immediate physician review recommended."

==================================================
PAGE 4: ALERTS
==================================================

Alert Table Columns:
- Time
- Patient
- Severity
- Recipient
- Status

Severity Levels:
- Moderate
- High
- Critical

==================================================
VOICE ALERT ASSISTANT (USP)
==================================================

Display active voice announcements.

Example:

🔊 Attention Nurse Sarah.
Patient P002 requires immediate assistance.

Critical Example:

🔊 CODE RED.
ICU Team to Bed 5 immediately.

Use browser SpeechSynthesis API.

Expose utility:

announce(message)

Examples:
announce("Attention Nurse Sarah. Patient P002 requires immediate assistance.")
announce("Code Red. ICU Team to Bed 5 immediately.")

==================================================
PAGE 5: WHAT-IF INTERVENTION SIMULATOR (USP)
==================================================

Display Current State:
- Risk Score
- Countdown
- Priority

Intervention Buttons:
🫁 Apply Oxygen Support
💉 Administer Medication
🩸 Fluid Support
👁 Increase Monitoring

Results Panel:

Before:
Risk: 85
Critical in 18 mins

After:
Risk: 55
Critical in 45 mins

Display improvements visually.

==================================================
ALERT MODALS
==================================================

Moderate:
"Patient requires observation."

High:
"Patient requires immediate attention."

Critical:
"CODE RED. ICU Team to Bed 5 immediately."

==================================================
BACKEND API REQUIREMENTS
==================================================

GET /dashboard

Returns:
{
  stats,
  patients,
  priorityQueue,
  alerts
}

GET /patients

Returns all patients.

GET /patients/:id

Returns:
{
  vitals,
  trends,
  explanations,
  countdown,
  summary
}

POST /patients

Create patient.

PATCH /patients/:id/monitoring-profile

Update adaptive monitoring parameters.

GET /priority-queue

Returns ranked patients.

GET /alerts

Returns alert feed.

POST /simulate-intervention

Input:
{
  patientId,
  intervention
}

Returns:
{
  before,
  after
}

GET /voice-alert

Returns current voice announcement.

==================================================
DEVELOPMENT PRIORITY
==================================================

1. Dashboard
2. Patient Admission
3. Patient Detail Page
4. Explainable AI
5. Countdown UI
6. Priority Queue
7. Alerts
8. Voice Alerts
9. What-If Simulator
10. Final Polish

==================================================
FINAL GOAL
==================================================

The final product should feel like a premium ICU command center that predicts deterioration, explains risk, prioritizes care, and empowers healthcare professionals through proactive decision support.

The judges should immediately think:

"This doesn't look like a 6-hour hackathon project. It looks like an actual hospital product."