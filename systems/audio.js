// ============================================================
// AUDIO SYSTEM — procedural sounds (no files needed)
// ============================================================

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Play a tone with an envelope
function playTone(freq, duration, type = 'sine', volume = 0.15, delay = 0) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  const startTime = ctx.currentTime + delay;
  const endTime = startTime + duration;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, endTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(endTime + 0.05);
}

// Play a glide (frequency sweeps from one pitch to another)
function playGlide(startFreq, endFreq, duration, type = 'sine', volume = 0.15, delay = 0) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;

  const startTime = ctx.currentTime + delay;
  const endTime = startTime + duration;

  osc.frequency.setValueAtTime(startFreq, startTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, endTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, endTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(endTime + 0.05);
}

// ============================================================
// PUBLIC SOUNDS
// ============================================================

export function playCoinSound() {
  // Two-tone "ding": bright and satisfying
  playTone(880, 0.08, 'sine', 0.15, 0);
  playTone(1320, 0.18, 'sine', 0.12, 0.06);
  // Slight sparkle
  playTone(1760, 0.12, 'triangle', 0.06, 0.12);
}

export function playGameOverSound() {
  // Descending three-note sigh
  playTone(523, 0.2, 'sine', 0.18, 0);    // C5
  playTone(392, 0.2, 'sine', 0.18, 0.18); // G4
  playTone(261, 0.5, 'sine', 0.20, 0.36); // C4
}

export function playNewBestSound() {
  // Ascending arpeggio — celebratory
  const notes = [523, 659, 784, 1046]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    playTone(freq, 0.18, 'triangle', 0.15, i * 0.1);
  });
  // Final chord
  playTone(523, 0.6, 'sine', 0.08, 0.45);
  playTone(659, 0.6, 'sine', 0.08, 0.45);
  playTone(784, 0.6, 'sine', 0.08, 0.45);
}

export function playStartSound() {
  // Quick rising "whoosh" when game starts
  playGlide(300, 900, 0.25, 'triangle', 0.15);
}

export function playTickSound() {
  // Subtle tick for the last 10 seconds
  playTone(1400, 0.04, 'square', 0.05);
}

// ============================================================
// UNLOCK AUDIO CONTEXT (browser autoplay policy)
// Call this on the first user click
// ============================================================
export function unlockAudio() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}