export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bedNumber: string;
  category: string;
  status: "Stable" | "Moderate" | "Critical";
  riskScore: number;
  countdown: number | null; // minutes to critical, null if critical now
  priority: number;
  vitals: {
    heartRate: number;
    spO2: number;
    bloodPressure: string;
    temperature: number;
  };
  monitoringProfile: string[];
}

export interface Alert {
  id: string;
  timestamp: string;
  patientId: string;
  patientName: string;
  severity: "Moderate" | "High" | "Critical";
  message: string;
  recipient: string;
  status: "Active" | "Acknowledged" | "Resolved";
}

export interface VitalTrend {
  time: string;
  value: number;
}

export const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "Sarah Johnson",
    age: 67,
    gender: "Female",
    bedNumber: "ICU-01",
    category: "Cardiac",
    status: "Stable",
    riskScore: 35,
    countdown: 180,
    priority: 3,
    vitals: {
      heartRate: 78,
      spO2: 98,
      bloodPressure: "120/80",
      temperature: 37.2,
    },
    monitoringProfile: ["Heart Rate", "SpO₂", "Blood Pressure", "ECG"],
  },
  {
    id: "P002",
    name: "Michael Chen",
    age: 54,
    gender: "Male",
    bedNumber: "ICU-02",
    category: "Respiratory",
    status: "Critical",
    riskScore: 92,
    countdown: null,
    priority: 1,
    vitals: {
      heartRate: 115,
      spO2: 88,
      bloodPressure: "145/95",
      temperature: 38.9,
    },
    monitoringProfile: ["Heart Rate", "SpO₂", "Blood Pressure", "Temperature", "Respiratory Rate"],
  },
  {
    id: "P003",
    name: "Emily Martinez",
    age: 45,
    gender: "Female",
    bedNumber: "ICU-03",
    category: "Post-Surgery",
    status: "Stable",
    riskScore: 28,
    countdown: 240,
    priority: 4,
    vitals: {
      heartRate: 72,
      spO2: 97,
      bloodPressure: "118/76",
      temperature: 36.8,
    },
    monitoringProfile: ["Heart Rate", "SpO₂", "Blood Pressure", "Temperature"],
  },
  {
    id: "P004",
    name: "James Wilson",
    age: 72,
    gender: "Male",
    bedNumber: "ICU-04",
    category: "General ICU",
    status: "Moderate",
    riskScore: 68,
    countdown: 45,
    priority: 2,
    vitals: {
      heartRate: 95,
      spO2: 91,
      bloodPressure: "138/88",
      temperature: 37.8,
    },
    monitoringProfile: ["Heart Rate", "SpO₂", "Blood Pressure", "Temperature"],
  },
  {
    id: "P005",
    name: "Lisa Anderson",
    age: 58,
    gender: "Female",
    bedNumber: "ICU-05",
    category: "Infection",
    status: "Moderate",
    riskScore: 71,
    countdown: 35,
    priority: 2,
    vitals: {
      heartRate: 102,
      spO2: 93,
      bloodPressure: "132/85",
      temperature: 38.5,
    },
    monitoringProfile: ["Heart Rate", "SpO₂", "Blood Pressure", "Temperature", "WBC Count"],
  },
  {
    id: "P006",
    name: "Robert Taylor",
    age: 61,
    gender: "Male",
    bedNumber: "ICU-06",
    category: "Cardiac",
    status: "Stable",
    riskScore: 42,
    countdown: 150,
    priority: 3,
    vitals: {
      heartRate: 82,
      spO2: 96,
      bloodPressure: "125/82",
      temperature: 37.1,
    },
    monitoringProfile: ["Heart Rate", "SpO₂", "Blood Pressure", "ECG"],
  },
  {
    id: "P007",
    name: "Jennifer Lee",
    age: 39,
    gender: "Female",
    bedNumber: "ICU-07",
    category: "Post-Surgery",
    status: "Stable",
    riskScore: 25,
    countdown: 300,
    priority: 4,
    vitals: {
      heartRate: 68,
      spO2: 99,
      bloodPressure: "115/75",
      temperature: 36.9,
    },
    monitoringProfile: ["Heart Rate", "SpO₂", "Blood Pressure", "Temperature"],
  },
  {
    id: "P008",
    name: "David Brown",
    age: 76,
    gender: "Male",
    bedNumber: "ICU-08",
    category: "Respiratory",
    status: "Moderate",
    riskScore: 65,
    countdown: 52,
    priority: 2,
    vitals: {
      heartRate: 88,
      spO2: 92,
      bloodPressure: "130/84",
      temperature: 37.6,
    },
    monitoringProfile: ["Heart Rate", "SpO₂", "Blood Pressure", "Temperature", "Respiratory Rate"],
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "A001",
    timestamp: "2026-06-15T14:23:15",
    patientId: "P002",
    patientName: "Michael Chen",
    severity: "Critical",
    message: "Oxygen saturation dropped to 88%. Immediate intervention required.",
    recipient: "Dr. Sarah Williams",
    status: "Active",
  },
  {
    id: "A002",
    timestamp: "2026-06-15T14:18:42",
    patientId: "P004",
    patientName: "James Wilson",
    severity: "High",
    message: "Heart rate elevated to 95 bpm. Patient requires assessment.",
    recipient: "Nurse John Davis",
    status: "Acknowledged",
  },
  {
    id: "A003",
    timestamp: "2026-06-15T14:15:30",
    patientId: "P005",
    patientName: "Lisa Anderson",
    severity: "High",
    message: "Temperature elevated to 38.5°C. Fever management needed.",
    recipient: "Nurse Emily Parker",
    status: "Acknowledged",
  },
  {
    id: "A004",
    timestamp: "2026-06-15T14:10:15",
    patientId: "P008",
    patientName: "David Brown",
    severity: "Moderate",
    message: "SpO₂ showing declining trend. Monitor closely.",
    recipient: "Nurse John Davis",
    status: "Resolved",
  },
  {
    id: "A005",
    timestamp: "2026-06-15T14:05:00",
    patientId: "P004",
    patientName: "James Wilson",
    severity: "Moderate",
    message: "Blood pressure slightly elevated. Continue monitoring.",
    recipient: "Dr. Michael Roberts",
    status: "Resolved",
  },
];

export const generateVitalTrends = (baseValue: number, variance: number, points: number = 24): VitalTrend[] => {
  const trends: VitalTrend[] = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 10 * 60000); // 10-minute intervals
    const randomVariance = (Math.random() - 0.5) * variance;
    trends.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.round((baseValue + randomVariance) * 10) / 10,
    });
  }
  
  return trends;
};

export const explanations = {
  P002: [
    "Oxygen saturation dropped below 90% threshold",
    "Heart rate increased rapidly from 85 to 115 bpm",
    "Persistent fever detected above 38.5°C",
    "Declining SpO₂ trend over past 2 hours",
  ],
  P004: [
    "Heart rate showing upward trend",
    "Blood pressure elevated above normal range",
    "Patient history indicates cardiac risk factors",
  ],
  P005: [
    "Elevated temperature indicating infection progression",
    "Heart rate compensating for systemic stress",
    "SpO₂ fluctuations detected",
  ],
  P008: [
    "Respiratory rate trending upward",
    "SpO₂ declining over past hour",
    "Patient category indicates respiratory compromise risk",
  ],
};

export const aiSummaries = {
  P002: "Patient P002 demonstrated declining oxygen saturation from 94% to 88% over the past 90 minutes, accompanied by tachycardia (HR 115 bpm) and persistent fever (38.9°C). The predictive model indicates immediate risk of respiratory failure. Immediate physician review and potential ventilatory support recommended.",
  P004: "Patient P004 shows early warning signs with elevated heart rate (95 bpm) and blood pressure (138/88). The AI model predicts potential cardiovascular instability within 45 minutes if current trends continue. Recommend close monitoring and consideration of rate control medications.",
  P005: "Patient P005 presents with signs of systemic infection with temperature 38.5°C and elevated heart rate (102 bpm). Current trajectory suggests potential sepsis development. Recommend blood cultures, antibiotic review, and fluid management assessment.",
  P008: "Patient P008 showing declining respiratory function with SpO₂ at 92% and increasing respiratory rate. Predictive analytics indicate potential need for supplemental oxygen within the next hour. Monitor closely for further deterioration.",
};

export const availableMonitoringParams = [
  "Heart Rate",
  "SpO₂",
  "Blood Pressure",
  "Temperature",
  "Respiratory Rate",
  "ECG",
  "Central Venous Pressure",
  "Urine Output",
  "Glucose Level",
  "WBC Count",
  "Lactate Level",
  "Arterial Blood Gas",
];

export const patientCategories = [
  "General ICU",
  "Cardiac",
  "Respiratory",
  "Post-Surgery",
  "Infection",
  "Neurological",
  "Trauma",
];
