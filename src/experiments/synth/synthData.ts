export type OscillatorWaveform = 'sine' | 'sawtooth' | 'square' | 'triangle';

export interface NoteDefinition {
  note: string;
  freq: number;
  key: string;
  isSharp?: boolean;
}

export const NOTES: NoteDefinition[] = [
  { note: 'C4', freq: 261.63, key: 'a' },
  { note: 'C#4', freq: 277.18, key: 'w', isSharp: true },
  { note: 'D4', freq: 293.66, key: 's' },
  { note: 'D#4', freq: 311.13, key: 'e', isSharp: true },
  { note: 'E4', freq: 329.63, key: 'd' },
  { note: 'F4', freq: 349.23, key: 'f' },
  { note: 'F#4', freq: 369.99, key: 't', isSharp: true },
  { note: 'G4', freq: 392.00, key: 'g' },
  { note: 'G#4', freq: 415.30, key: 'y', isSharp: true },
  { note: 'A4', freq: 440.00, key: 'h' },
  { note: 'A#4', freq: 466.16, key: 'u', isSharp: true },
  { note: 'B4', freq: 493.88, key: 'j' },
  { note: 'C5', freq: 523.25, key: 'k' },
  { note: 'C#5', freq: 554.37, key: 'o', isSharp: true },
  { note: 'D5', freq: 587.33, key: 'l' },
  { note: 'D#5', freq: 622.25, key: 'p', isSharp: true },
  { note: 'E5', freq: 659.25, key: ';' },
];

export interface SequenceStep {
  note: string;
  duration: number; // en semicorcheas (1 = 16th, 2 = 8th)
}

export const DEMO_MELODY: (SequenceStep | null)[] = [
  { note: 'D4', duration: 1 },
  { note: 'F4', duration: 1 },
  { note: 'A4', duration: 1 },
  { note: 'D5', duration: 1 },
  { note: 'C5', duration: 1 },
  { note: 'A4', duration: 1 },
  { note: 'F4', duration: 1 },
  { note: 'E4', duration: 1 },
  { note: 'D4', duration: 1 },
  { note: 'F4', duration: 1 },
  { note: 'G4', duration: 1 },
  { note: 'A4', duration: 1 },
  { note: 'C5', duration: 1 },
  { note: 'D5', duration: 1 },
  { note: 'E5', duration: 1 },
  { note: 'D5', duration: 2 },
];

export interface ActiveVoice {
  osc: OscillatorNode;
  gain: GainNode;
  filter?: BiquadFilterNode;
  freq?: number;
}

export function makeDistortionCurve(wave: OscillatorWaveform, nSamples = 44100): Float32Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(nSamples * Float32Array.BYTES_PER_ELEMENT);
  const curve = new Float32Array(buffer);
  const deg = Math.PI / 180;
  for (let i = 0; i < nSamples; ++i) {
    const x = (i * 2) / nSamples - 1;
    if (wave === 'sine') {
      curve[i] = x;
    } else if (wave === 'triangle') {
      const k = 16;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    } else if (wave === 'sawtooth') {
      const k = 45;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    } else if (wave === 'square') {
      if (x > 0.08) curve[i] = 0.85;
      else if (x < -0.08) curve[i] = -0.85;
      else curve[i] = x * 8;
    }
  }
  return curve;
}

export function formatAudioSeconds(s: number): string {
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
