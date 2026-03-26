// Gen-Z Web Audio sound effects — no files needed

function ctx() {
  return new (window.AudioContext || window.webkitAudioContext)();
}

// Mark done — satisfying sparkle pop
export function playDone() {
  try {
    const ac = ctx();
    const t = ac.currentTime;
    [0, 0.06, 0.12].forEach((delay, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + i * 200, t + delay);
      osc.frequency.exponentialRampToValueAtTime(1200 + i * 300, t + delay + 0.08);
      gain.gain.setValueAtTime(0.18, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.18);
      osc.start(t + delay);
      osc.stop(t + delay + 0.2);
    });
  } catch (_) {}
}

// Miss day — brainrot "L" buzzer
export function playMiss() {
  try {
    const ac = ctx();
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.35);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    osc.start(t);
    osc.stop(t + 0.4);
  } catch (_) {}
}

// Streak milestone — hype airhorn
export function playMilestone() {
  try {
    const ac = ctx();
    const t = ac.currentTime;
    const freqs = [220, 277, 330, 440];
    freqs.forEach((f, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, t + i * 0.07);
      gain.gain.setValueAtTime(0.12, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.25);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.28);
    });
  } catch (_) {}
}

// Full habit completed — slay celebration
export function playSlay() {
  try {
    const ac = ctx();
    const t = ac.currentTime;
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((f, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, t + i * 0.09);
      gain.gain.setValueAtTime(0.15, t + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.2);
      osc.start(t + i * 0.09);
      osc.stop(t + i * 0.09 + 0.22);
    });
  } catch (_) {}
}
