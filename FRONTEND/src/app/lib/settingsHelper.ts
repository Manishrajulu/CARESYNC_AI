export function isAlertAllowed(alert: { severity: string; message: string }) {
  const criticalEnabled = localStorage.getItem("criticalAlertsEnabled") !== "false";
  const highEnabled = localStorage.getItem("highPriorityAlertsEnabled") !== "false";
  const moderateEnabled = localStorage.getItem("moderateAlertsEnabled") !== "false";

  if (alert.severity === "Critical" && !criticalEnabled) return false;
  if (alert.severity === "High" && !highEnabled) return false;
  if (alert.severity === "Moderate" && !moderateEnabled) return false;

  const thresholdStr = localStorage.getItem("riskThreshold");
  if (thresholdStr) {
    const threshold = parseInt(thresholdStr);
    const match = alert.message.match(/Risk Score:\s*(\d+)/i);
    if (match) {
      const risk = parseInt(match[1]);
      if (risk < threshold) return false;
    }
  }

  return true;
}

export function isVoiceAlertAllowed(message: string, patientsList: any[] = []) {
  const voiceAnnouncementsEnabled = localStorage.getItem("voiceAnnouncementsEnabled") !== "false";
  if (!voiceAnnouncementsEnabled) return false;

  // Only allow voice alerts if their persisted state is NEW
  try {
    const raw = localStorage.getItem("caresync_persisted_alerts");
    if (raw) {
      const parsed = JSON.parse(raw);
      const matchedAlert = parsed.find((a: any) => {
        const idMatch = a.patient_id && message.includes(a.patient_id);
        const nameMatch = a.patient_name && message.includes(a.patient_name);
        return idMatch || nameMatch;
      });
      if (matchedAlert && matchedAlert.status !== "NEW") {
        return false;
      }
    }
  } catch (e) {
    console.error("Failed to check voice alert lifecycle", e);
  }

  let severity = "Moderate";
  let searchId = "";
  let searchBed = "";

  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("code red") || lowerMsg.includes("critical")) {
    severity = "Critical";
  } else if (lowerMsg.includes("attention nurse") || lowerMsg.includes("immediate assistance")) {
    severity = "High";
  }

  const idMatch = message.match(/Patient\s+([A-Za-z0-9_]+)/i);
  if (idMatch) {
    searchId = idMatch[1];
  }
  const parenMatch = message.match(/\(([A-Za-z0-9_]+)\)/);
  if (parenMatch) {
    searchId = parenMatch[1];
  }

  const bedMatch = message.match(/Bed\s+(\d+)/i);
  if (bedMatch) {
    searchBed = `Bed ${bedMatch[1]}`;
  }

  const patient = patientsList.find((p: any) => p.id === searchId || p.bed_number === searchBed);
  const riskScore = patient ? patient.risk_score : 0;

  const criticalEnabled = localStorage.getItem("criticalAlertsEnabled") !== "false";
  const highEnabled = localStorage.getItem("highPriorityAlertsEnabled") !== "false";
  const moderateEnabled = localStorage.getItem("moderateAlertsEnabled") !== "false";

  if (severity === "Critical" && !criticalEnabled) return false;
  if (severity === "High" && !highEnabled) return false;
  if (severity === "Moderate" && !moderateEnabled) return false;

  const thresholdStr = localStorage.getItem("riskThreshold");
  if (thresholdStr) {
    const threshold = parseInt(thresholdStr);
    if (riskScore < threshold) return false;
  }

  return true;
}
