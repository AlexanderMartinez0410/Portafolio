// Web Audio API sintetizado para efectos de sonido sin archivos externos
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Sonido de chispa y cortocircuito al romper el foco
 */
export function playSparkSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Zumbido de corriente alterna errático (60Hz / 120Hz con distorsión)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
    osc.frequency.setValueAtTime(50, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);

    oscGain.gain.setValueAtTime(0.08, now);
    oscGain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    oscGain.gain.setValueAtTime(0.02, now + 0.12);
    oscGain.gain.setValueAtTime(0.15, now + 0.2);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);

    // 2. Chispas tipo crackle (ruido blanco en ráfagas cortas)
    const bufferSize = Math.floor(ctx.sampleRate * 0.35);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (Math.random() > 0.4 ? 1 : 0);
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, now);
    noiseGain.gain.setValueAtTime(0.12, now + 0.1);
    noiseGain.gain.setValueAtTime(0.02, now + 0.18);
    noiseGain.gain.setValueAtTime(0.14, now + 0.24);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    // Filtro pasaaltos para darle timbre crujiente y metálico
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, now);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now);
  } catch {
    // Si la política de audio del navegador lo bloquea, continúa en silencio
  }
}

/**
 * Sonido de foco nuevo enroscado y encendido satisfactorio
 */
export function playRepairSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Tono campana / cristalino suave
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16); // G5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch {
    // Silencioso si no se permite
  }
}
