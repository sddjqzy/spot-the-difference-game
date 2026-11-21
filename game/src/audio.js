// audio.js — all sound is synthesized with the Web Audio API; no audio
// files are loaded, so the game plays fully offline.
let audioCtx = null;
let muted = false;

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type = 'sine', vol = 0.12) {
  const ac = ctx();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + startAt);
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

/** A bright two-note chime when a difference is found. */
export function playFound() { tone(660, 0, 0.14, 'sine', 0.14); tone(990, 0.09, 0.22, 'sine', 0.14); }

/** A soft low buzz for a wrong click. */
export function playWrong() { tone(160, 0, 0.18, 'triangle', 0.12); tone(120, 0.05, 0.2, 'triangle', 0.1); }

/** A sparkle arpeggio for a hint. */
export function playHint() { tone(880, 0, 0.1, 'sine', 0.1); tone(1174, 0.08, 0.1, 'sine', 0.1); tone(1568, 0.16, 0.16, 'sine', 0.1); }

/** A little fanfare when a level is cleared. */
export function playLevelClear() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.13));
}

/** A longer fanfare for finishing all six levels. */
export function playVictory() {
  [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.13, 0.26, 'triangle', 0.13));
}

/** A sad descending pair when time runs out. */
export function playTimeUp() { tone(392, 0, 0.25, 'sine', 0.12); tone(311, 0.22, 0.4, 'sine', 0.12); }

/** A single click tick for buttons. */
export function playClick() { tone(520, 0, 0.06, 'square', 0.05); }

export function toggleMute() { muted = !muted; return muted; }
export function isMuted() { return muted; }
