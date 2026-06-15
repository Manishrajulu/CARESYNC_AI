export type ShiftType = "morning" | "evening" | "night";

export interface ShiftInfo {
  nurseName: string;
  shift: ShiftType;
  shiftLabel: string;
  shiftTime: string;
  loginTime: string;
}

export const SHIFTS: { id: ShiftType; label: string; time: string; emoji: string }[] = [
  { id: "morning", label: "Morning Shift", time: "06:00 – 14:00", emoji: "🌅" },
  { id: "evening", label: "Evening Shift", time: "14:00 – 22:00", emoji: "🌆" },
  { id: "night",   label: "Night Shift",   time: "22:00 – 06:00", emoji: "🌙" },
];

const KEY = "caresync_shift";

export function getShiftInfo(): ShiftInfo | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ShiftInfo) : null;
  } catch {
    return null;
  }
}

export function saveShiftInfo(info: ShiftInfo): void {
  localStorage.setItem(KEY, JSON.stringify(info));
}

export function clearShiftInfo(): void {
  localStorage.removeItem(KEY);
}

export function shiftDuration(loginTime: string): string {
  const diff = Date.now() - new Date(loginTime).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
