// ─── Voice Announcement Queue ───────────────────────────────────────────────
// FIFO queue so messages never interrupt each other.
// Deduplication is handled by the caller (RootLayout / Alerts) via lastSpokenRef.

const speechQueue: string[] = [];
let isSpeaking = false;

function playNext() {
  if (isSpeaking || speechQueue.length === 0) return;

  const message = speechQueue.shift()!;
  isSpeaking = true;

  if (!('speechSynthesis' in window)) {
    isSpeaking = false;
    playNext();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Pick an English voice if available
  const loadVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    loadVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = loadVoice;
  }

  utterance.onend = () => {
    isSpeaking = false;
    playNext();
  };

  utterance.onerror = () => {
    isSpeaking = false;
    playNext();
  };

  window.speechSynthesis.speak(utterance);
}

// ─── Vibration helper ────────────────────────────────────────────────────────
function vibrateForSeverity(severity: 'Moderate' | 'High' | 'Critical') {
  if (!('vibrate' in navigator)) return;
  try {
    if (severity === 'Critical') {
      navigator.vibrate([500, 200, 500]);
    } else if (severity === 'High') {
      navigator.vibrate(300);
    }
    // Moderate → voice only, no vibration
  } catch {
    // Silently ignore on unsupported devices
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Queue a plain text message for announcement.
 * Does NOT deduplicate — callers must manage lastSpokenRef themselves.
 */
export const announce = (message: string) => {
  if (!message) return;
  
  // Trigger vibration if the message refers to Critical or High condition
  if (message.toLowerCase().includes("critical") || message.toLowerCase().includes("code red")) {
    vibrateForSeverity("Critical");
  } else if (message.toLowerCase().includes("high") || message.toLowerCase().includes("immediate assistance")) {
    vibrateForSeverity("High");
  }

  speechQueue.push(message);
  playNext();
};

/**
 * Queue a structured clinical alert announcement with appropriate vibration.
 */
export const announceAlert = (
  patientName: string,
  severity: 'Moderate' | 'High' | 'Critical',
  nurseName?: string
) => {
  let message = '';

  if (severity === 'Critical') {
    message = `CODE RED. ICU Team to ${patientName}'s bedside immediately.`;
  } else if (severity === 'High') {
    message = nurseName
      ? `Attention ${nurseName}. Patient ${patientName} requires immediate assistance.`
      : `Attention nursing staff. Patient ${patientName} requires immediate assistance.`;
  } else {
    message = `Patient ${patientName} requires observation.`;
  }

  vibrateForSeverity(severity);
  speechQueue.push(message);
  playNext();
};
