// Tactile Haptic Sound Engine powered by native Web Audio API
// High-craft micro-interactions: mechanical camera shutter & precision electronic switches

let ctx: AudioContext | null = null;
let isMuted = true; // Default muted for unobtrusive UX, user opt-in toggleable in header

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      ctx = new AudioCtx();
    }
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

export function initAudio() {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('sound_enabled');
  if (saved !== null) {
    isMuted = saved !== 'true';
  }
  syncAudioUI();
}

export function isAudioMuted(): boolean {
  return isMuted;
}

export function toggleAudio(): boolean {
  isMuted = !isMuted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('sound_enabled', isMuted ? 'false' : 'true');
    if (!isMuted) {
      getContext();
      playClick(1.2);
    }
    syncAudioUI();
  }
  return !isMuted;
}

function syncAudioUI() {
  if (typeof document === 'undefined') return;
  const label = document.getElementById('sound-status-label');
  const icon = document.getElementById('sound-waves-icon');
  if (label) {
    label.textContent = isMuted ? 'OFF' : 'ON';
  }
  if (icon) {
    icon.classList.toggle('opacity-40', isMuted);
    icon.classList.toggle('opacity-100', !isMuted);
  }
}

/** Precision mechanical click (shutter / solid-state latch) */
export function playClick(pitch = 1.0) {
  if (isMuted) return;
  const c = getContext();
  if (!c) return;

  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(140 * pitch, now);
  osc.frequency.exponentialRampToValueAtTime(30, now + 0.03);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  osc.connect(gain);
  gain.connect(c.destination);

  osc.start(now);
  osc.stop(now + 0.035);
}

/** High-frequency tactile tick on button/card hover */
export function playHover() {
  if (isMuted) return;
  const c = getContext();
  if (!c) return;

  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.012);

  gain.gain.setValueAtTime(0.015, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

  osc.connect(gain);
  gain.connect(c.destination);

  osc.start(now);
  osc.stop(now + 0.015);
}
