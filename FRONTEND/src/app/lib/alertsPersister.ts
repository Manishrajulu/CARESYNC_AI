export interface PersistedAlert {
  timestamp: string;
  patient_id: string;
  patient_name: string;
  severity: "Moderate" | "High" | "Critical";
  recipient: string;
  message: string;
  status: "NEW" | "ACKNOWLEDGED" | "RESOLVED";
}

const STORAGE_KEY = "caresync_persisted_alerts";

export function getPersistedAlerts(): PersistedAlert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedAlert[]) : [];
  } catch {
    return [];
  }
}

export function savePersistedAlerts(alerts: PersistedAlert[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error("Failed to save alerts to localStorage", e);
  }
}

export function mergeBackendAlerts(backendAlerts: any[]): PersistedAlert[] {
  const persisted = getPersistedAlerts();
  let updated = false;

  // We want to merge backendAlerts into persisted.
  // Backend alerts are ordered newest-first in the backend response.
  // We process them in reverse order (oldest first) so that inserting at index 0 of persisted preserves chronological order.
  for (let i = backendAlerts.length - 1; i >= 0; i--) {
    const bAlert = backendAlerts[i];
    
    // Check if duplicate exists
    const exists = persisted.some(
      (p) => p.timestamp === bAlert.timestamp && p.patient_id === bAlert.patient_id
    );

    if (!exists) {
      const newAlert: PersistedAlert = {
        timestamp: bAlert.timestamp,
        patient_id: bAlert.patient_id,
        patient_name: bAlert.patient_name,
        severity: bAlert.severity,
        recipient: bAlert.recipient,
        message: bAlert.message,
        status: "NEW",
      };
      persisted.unshift(newAlert);
      updated = true;
    }
  }

  // Cap alerts list to prevent localStorage filling up (e.g. max 200 alerts)
  if (persisted.length > 200) {
    persisted.splice(200);
    updated = true;
  }

  if (updated) {
    savePersistedAlerts(persisted);
  }

  return persisted;
}

export function acknowledgeAlert(timestamp: string, patientId: string): PersistedAlert[] {
  const alerts = getPersistedAlerts();
  const index = alerts.findIndex((a) => a.timestamp === timestamp && a.patient_id === patientId);
  if (index !== -1) {
    alerts[index].status = "ACKNOWLEDGED";
    savePersistedAlerts(alerts);
  }
  return alerts;
}

export function resolveAlert(timestamp: string, patientId: string): PersistedAlert[] {
  const alerts = getPersistedAlerts();
  const index = alerts.findIndex((a) => a.timestamp === timestamp && a.patient_id === patientId);
  if (index !== -1) {
    alerts[index].status = "RESOLVED";
    savePersistedAlerts(alerts);
  }
  return alerts;
}

export function getActiveAlerts(): PersistedAlert[] {
  return getPersistedAlerts().filter((a) => a.status !== "RESOLVED");
}

export function getResolvedAlerts(): PersistedAlert[] {
  return getPersistedAlerts().filter((a) => a.status === "RESOLVED");
}
