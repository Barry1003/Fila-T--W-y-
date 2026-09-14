/**
 * Subtle luxury harmonic chime using Web Audio API
 */
let audioCtx: AudioContext | null = null;

export function playLuxuryChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    
    // Primary golden chime (F#6 / 1479.98 Hz & C#6 / 1108.73 Hz)
    const frequencies = [880, 1318.5, 1760];
    
    frequencies.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.03 / (idx + 1), now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  } catch {
    // Gracefully ignore audio autoplay policies
  }
}
