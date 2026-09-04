// =============================================================================
// EXPERIMENTO #03 — Sintetizador Polifónico & Osciloscopio Web Audio API
// Arquitectura:
//   1. AudioContext nativo sin librerías externas para mínimo overhead.
//   2. Polifonía dinámica (Multi-voice engine) con asignación y liberación de voces.
//   3. Modulador de envolvente analógica ADSR (Attack, Decay, Sustain, Release).
//   4. Selector de osciladores (sine, triangle, sawtooth, square) y filtro paso bajo (cutoff/resonance).
//   5. Reproductor y Analizador de Pistas de Audio (MP3/WAV upload o loop procedural synthwave).
//   6. Detección espectral de graves (Bass Kick Detection) y visualizador CRT a 60 FPS.
//   7. Control por teclado físico de computadora (A, W, S, E, D, F...) y teclado táctil/ratón.
// =============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ExperimentComponentProps } from '../components/ExperimentDetail';
import { 
  Volume2, 
  VolumeX, 
  Activity, 
  Sliders, 
  Radio, 
  RotateCcw,
  Waves,
  Upload,
  Play,
  Pause,
  Square,
  Music,
  Disc,
  Zap
} from 'lucide-react';

// Tipos de forma de onda
type OscillatorWaveform = 'sine' | 'sawtooth' | 'square' | 'triangle';

// Escala diatónica y cromática (Octavas 4 y 5)
interface NoteDefinition {
  note: string;
  freq: number;
  key: string;
  isSharp?: boolean;
}

const NOTES: NoteDefinition[] = [
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

// Estructura interna de una voz activa
interface ActiveVoice {
  osc: OscillatorNode;
  gain: GainNode;
  filter: BiquadFilterNode;
}

// Conversor auxiliar de AudioBuffer a WAV para loop de demostración
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const length = buffer.length * blockAlign;
  const bufferLength = 44 + length;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export const PolyphonicSynthAudio: React.FC<ExperimentComponentProps> = ({
  onTelemetryUpdate
}) => {
  // Configuración de audio
  const [waveform, setWaveform] = useState<OscillatorWaveform>('sawtooth');
  const [masterVolume, setMasterVolume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [octaveShift, setOctaveShift] = useState<number>(0);

  // Parámetros ADSR (en segundos / ratio)
  const [attack, setAttack] = useState<number>(0.02);
  const [decay, setDecay] = useState<number>(0.2);
  const [sustain, setSustain] = useState<number>(0.6);
  const [release, setRelease] = useState<number>(0.35);

  // Filtro Paso Bajo (Low-pass)
  const [cutoffFreq, setCutoffFreq] = useState<number>(2500);
  const [resonance, setResonance] = useState<number>(4);

  // Tipo de visualizador
  const [visMode, setVisMode] = useState<'wave' | 'fft'>('wave');
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  // Estado del Reproductor de Música / Pistas
  const [trackName, setTrackName] = useState<string | null>(null);
  const [isTrackPlaying, setIsTrackPlaying] = useState<boolean>(false);
  const [trackDuration, setTrackDuration] = useState<number>(0);
  const [trackCurrentTime, setTrackCurrentTime] = useState<number>(0);
  const [bassEnergy, setBassEnergy] = useState<number>(0); // 0.0 - 1.0 para telemetría

  // Modo Auto-Sync DSP (Adaptación de la pista: Iluminación de teclado & auto-knobs)
  const [autoSyncTrack, setAutoSyncTrack] = useState<boolean>(true);
  const [detectedPitchNote, setDetectedPitchNote] = useState<string | null>(null);
  const [detectedPitchFreq, setDetectedPitchFreq] = useState<number>(0);

  // Referencias de audio nativas
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const masterFilterRef = useRef<BiquadFilterNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const activeVoicesRef = useRef<Map<string, ActiveVoice>>(new Map());

  // Referencias de reproducción de archivos
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const trackSourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 1. Inicializar AudioContext bajo demanda
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;

      const masterFilter = ctx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(cutoffFreq, ctx.currentTime);
      masterFilter.Q.setValueAtTime(resonance, ctx.currentTime);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);

      // Cadena de Audio: Fuentes -> masterFilter -> masterGain -> analyser -> destination
      masterFilter.connect(masterGain);
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      masterGainRef.current = masterGain;
      masterFilterRef.current = masterFilter;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, [masterVolume, cutoffFreq, resonance]);

  // Actualizar filtro global cuando cambien los controles
  useEffect(() => {
    if (masterFilterRef.current && audioCtxRef.current) {
      masterFilterRef.current.frequency.setTargetAtTime(cutoffFreq, audioCtxRef.current.currentTime, 0.02);
      masterFilterRef.current.Q.setTargetAtTime(resonance, audioCtxRef.current.currentTime, 0.02);
    }
  }, [cutoffFreq, resonance]);

  // Actualizar volumen maestro
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetVol = isMuted ? 0 : masterVolume;
      masterGainRef.current.gain.setTargetAtTime(targetVol, audioCtxRef.current.currentTime, 0.02);
    }
  }, [masterVolume, isMuted]);

  // 2. Encender nota (Note On)
  const playNote = useCallback((noteDef: NoteDefinition) => {
    const ctx = getAudioContext();
    if (!ctx || !masterGainRef.current) return;

    if (activeVoicesRef.current.has(noteDef.note)) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const voiceGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const multiplier = Math.pow(2, octaveShift);
    osc.type = waveform;
    osc.frequency.setValueAtTime(noteDef.freq * multiplier, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoffFreq, now);
    filter.Q.setValueAtTime(resonance, now);

    voiceGain.gain.setValueAtTime(0.0001, now);
    voiceGain.gain.linearRampToValueAtTime(1.0, now + Math.max(0.005, attack));
    voiceGain.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, sustain), 
      now + attack + Math.max(0.01, decay)
    );

    osc.connect(filter);
    filter.connect(voiceGain);
    if (masterFilterRef.current) {
      voiceGain.connect(masterFilterRef.current);
    } else if (masterGainRef.current) {
      voiceGain.connect(masterGainRef.current);
    }

    osc.start(now);
    activeVoicesRef.current.set(noteDef.note, { osc, gain: voiceGain, filter });
    const currentActiveCount = activeVoicesRef.current.size;
    setActiveNotes(prev => new Set(prev).add(noteDef.note));

    onTelemetryUpdate?.({
      renderTime: 0.12,
      eventName: `NoteOn: ${noteDef.note} (${(noteDef.freq * multiplier).toFixed(1)}Hz)`,
      customMetrics: [
        { label: 'Voces', value: `${currentActiveCount} activas`, color: 'text-emerald-400' },
        { label: 'Cutoff', value: `${cutoffFreq}Hz`, color: 'text-amber-400' },
        { label: 'Onda', value: waveform.toUpperCase(), color: 'text-blue-400' }
      ]
    });
  }, [getAudioContext, octaveShift, waveform, cutoffFreq, resonance, attack, decay, sustain, onTelemetryUpdate]);

  // 3. Apagar nota (Note Off con etapa de Release)
  const stopNote = useCallback((noteDef: NoteDefinition) => {
    const voice = activeVoicesRef.current.get(noteDef.note);
    if (!voice || !audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.01, release));

    voice.osc.stop(now + release + 0.05);

    setTimeout(() => {
      voice.osc.disconnect();
      voice.filter.disconnect();
      voice.gain.disconnect();
    }, (release + 0.1) * 1000);

    activeVoicesRef.current.delete(noteDef.note);
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(noteDef.note);
      return next;
    });

    const remainingCount = activeVoicesRef.current.size;

    onTelemetryUpdate?.({
      renderTime: 0.11,
      eventName: `NoteOff: ${noteDef.note}`,
      customMetrics: [
        { label: 'Voces', value: `${remainingCount} activas`, color: remainingCount > 0 ? 'text-emerald-400' : 'text-fg-muted' },
        { label: 'Cutoff', value: `${cutoffFreq}Hz`, color: 'text-amber-400' },
        { label: 'Onda', value: waveform.toUpperCase(), color: 'text-blue-400' }
      ]
    });
  }, [release, cutoffFreq, waveform, onTelemetryUpdate]);

  // ── 3.1. Gestión de Pistas de Audio (Carga de Canciones MP3/WAV y Demo) ──
  const setupAudioElementSource = useCallback((audio: HTMLAudioElement) => {
    const ctx = getAudioContext();
    if (!trackSourceNodeRef.current && ctx) {
      const source = ctx.createMediaElementSource(audio);
      if (masterFilterRef.current) {
        source.connect(masterFilterRef.current);
      } else if (masterGainRef.current) {
        source.connect(masterGainRef.current);
      }
      trackSourceNodeRef.current = source;
    }
  }, [getAudioContext]);

  // Cargar archivo del usuario
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const url = URL.createObjectURL(file);
    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audioElementRef.current = audio;
    }

    const audio = audioElementRef.current;
    audio.src = url;
    audio.load();
    setupAudioElementSource(audio);

    audio.onloadedmetadata = () => {
      setTrackDuration(audio.duration);
      setTrackName(file.name.replace(/\.[^/.]+$/, ''));
      audio.play();
      setIsTrackPlaying(true);
    };

    audio.ontimeupdate = () => {
      setTrackCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      setIsTrackPlaying(false);
    };

    onTelemetryUpdate?.({
      renderTime: 0.18,
      eventName: `TrackLoaded: ${file.name}`
    });
  };

  // Cargar Demo Musical Sintetizado (Audio procedimental estilo Cyberpunk)
  const loadProceduralDemoTrack = () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const sampleRate = ctx.sampleRate;
    const durationSec = 12;
    const buffer = ctx.createBuffer(2, sampleRate * durationSec, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    const bpm = 124;
    const beatSec = 60 / bpm;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const beatProgress = (t % beatSec) / beatSec;

      // Kick/Bombo (140Hz -> 45Hz)
      let kick = 0;
      if (beatProgress < 0.25) {
        const kickEnv = Math.exp(-beatProgress * 22);
        const kickFreq = 140 * Math.exp(-beatProgress * 30) + 45;
        kick = Math.sin(2 * Math.PI * kickFreq * t) * kickEnv * 0.9;
      }

      // Línea de bajo arpegiada (16th notes en Re menor)
      const bassStep = Math.floor((t / (beatSec / 4)) % 8);
      const bassNotes = [73.42, 87.31, 110.0, 98.0, 73.42, 110.0, 87.31, 65.41];
      const bassFreq = bassNotes[bassStep];
      const bassEnv = Math.exp(-((t % (beatSec / 4)) / (beatSec / 4)) * 7);
      const bass = (Math.sin(2 * Math.PI * bassFreq * t) + 0.3 * Math.sin(2 * Math.PI * bassFreq * 2 * t)) * bassEnv * 0.45;

      // Hi-hat en contratiempo
      let hihat = 0;
      const hatProgress = (t % (beatSec / 2)) / (beatSec / 2);
      if (hatProgress < 0.12) {
        hihat = (Math.random() * 2 - 1) * Math.exp(-hatProgress * 35) * 0.2;
      }

      left[i] = (kick * 0.8 + bass * 0.8 + hihat * 0.5);
      right[i] = (kick * 0.8 + bass * 0.7 + hihat * 0.6);
    }

    const wavBlob = audioBufferToWav(buffer);
    const url = URL.createObjectURL(wavBlob);

    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audioElementRef.current = audio;
    }

    const audio = audioElementRef.current;
    audio.src = url;
    audio.loop = true;
    audio.load();
    setupAudioElementSource(audio);

    audio.onloadedmetadata = () => {
      setTrackDuration(audio.duration);
      setTrackName('Cyberpunk Synthwave Loop [Demo 124 BPM]');
      audio.play();
      setIsTrackPlaying(true);
    };

    audio.ontimeupdate = () => {
      setTrackCurrentTime(audio.currentTime);
    };

    onTelemetryUpdate?.({
      renderTime: 0.25,
      eventName: 'Demo Synthwave Loop cargado (124 BPM)'
    });
  };

  const toggleTrackPlay = () => {
    if (!audioElementRef.current) return;
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    if (isTrackPlaying) {
      audioElementRef.current.pause();
      setIsTrackPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsTrackPlaying(true);
    }
  };

  const stopTrack = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      setIsTrackPlaying(false);
      setTrackCurrentTime(0);
    }
  };

  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 4. Mapeo de Teclado Físico de PC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      const match = NOTES.find(n => n.key === key);
      if (match) {
        e.preventDefault();
        playNote(match);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const match = NOTES.find(n => n.key === key);
      if (match) {
        e.preventDefault();
        stopNote(match);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playNote, stopNote]);

  // 5. Renderizado en Tiempo Real del Osciloscopio (HTML5 Canvas a 60 FPS)
  useEffect(() => {
    let active = true;

    const drawVisualizer = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;

      if (canvas && analyser) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          ctx.fillStyle = '#09090b';
          ctx.fillRect(0, 0, width, height);

          // Líneas de grilla tipo osciloscopio analógico
          ctx.strokeStyle = '#27272a';
          ctx.lineWidth = 1;
          for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          for (let y = 0; y < height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          // Análisis de graves (20Hz - 150Hz en los primeros bins)
          const freqData = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(freqData);
          let bassSum = 0;
          let weightedFreqSum = 0;
          let totalEnergy = 0;

          for (let i = 0; i < freqData.length; i++) {
            const val = freqData[i];
            totalEnergy += val;
            weightedFreqSum += val * i * (analyser.context.sampleRate / analyser.fftSize);
            if (i < 6) bassSum += val;
          }

          const currentBass = Math.min(1.0, (bassSum / 6) / 255);
          setBassEnergy(currentBass);

          // Si hay golpe de bajo marcado, dibujamos destello perimetral
          if (currentBass > 0.45) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${currentBass * 0.4})`;
            ctx.lineWidth = 4;
            ctx.strokeRect(0, 0, width, height);
          }

          // ── ALGORITMO DE AUTOCORRELACIÓN PARA PITCH DETECTION (NOTA DE LA CANCIÓN) ──
          if (isTrackPlaying && autoSyncTrack) {
            const timeData = new Float32Array(analyser.fftSize);
            analyser.getFloatTimeDomainData(timeData);

            // Calcular Root Mean Square (RMS) para evitar detectar silencio
            let rms = 0;
            for (let i = 0; i < timeData.length; i++) {
              rms += timeData[i] * timeData[i];
            }
            rms = Math.sqrt(rms / timeData.length);

            if (rms > 0.02) {
              // Algoritmo de correlación cruzada en el dominio del tiempo
              const sampleRate = analyser.context.sampleRate;
              const minPeriod = Math.floor(sampleRate / 800); // Max 800 Hz
              const maxPeriod = Math.floor(sampleRate / 80);  // Min 80 Hz
              let bestCorrelation = 0;
              let bestPeriod = -1;

              for (let period = minPeriod; period <= maxPeriod; period++) {
                let correlation = 0;
                for (let i = 0; i < timeData.length - period; i++) {
                  correlation += timeData[i] * timeData[i + period];
                }
                correlation = correlation / (timeData.length - period);

                if (correlation > bestCorrelation) {
                  bestCorrelation = correlation;
                  bestPeriod = period;
                }
              }

              if (bestPeriod > 0 && bestCorrelation > 0.01) {
                const fundamentalFreq = sampleRate / bestPeriod;
                setDetectedPitchFreq(Math.round(fundamentalFreq));

                // Mapear frecuencia fundamental a la nota más cercana de nuestro piano
                let closestNote = NOTES[0];
                let minDiff = Infinity;
                NOTES.forEach(n => {
                  const diff = Math.abs(n.freq - fundamentalFreq);
                  if (diff < minDiff) {
                    minDiff = diff;
                    closestNote = n;
                  }
                });

                if (minDiff < 45) {
                  setDetectedPitchNote(closestNote.note);
                } else {
                  setDetectedPitchNote(null);
                }
              }
            } else {
              setDetectedPitchNote(null);
            }

            // Auto-Ajuste del Centroide Espectral (Mueve el filtro cutoff automáticamente)
            if (totalEnergy > 500) {
              const spectralCentroid = weightedFreqSum / totalEnergy;
              const targetCutoff = Math.min(7500, Math.max(600, Math.round(spectralCentroid * 1.5)));
              setCutoffFreq(prev => Math.round(prev * 0.85 + targetCutoff * 0.15));
            }
          } else if (!isTrackPlaying) {
            if (detectedPitchNote) setDetectedPitchNote(null);
          }

          if (visMode === 'wave') {
            const bufferLength = analyser.fftSize;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#10b981';
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#10b981';
            ctx.beginPath();

            const sliceWidth = width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
              const v = dataArray[i] / 128.0;
              const y = (v * height) / 2;

              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);

              x += sliceWidth;
            }

            ctx.lineTo(width, height / 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
          } else {
            const bufferLength = analyser.frequencyBinCount;
            const barCount = 48;
            const barWidth = width / barCount - 2;
            const step = Math.floor(bufferLength / barCount);

            for (let i = 0; i < barCount; i++) {
              const val = freqData[i * step] / 255;
              const barHeight = val * (height - 10);
              const x = i * (barWidth + 2);
              const y = height - barHeight;

              ctx.fillStyle = i < 6 ? '#34d399' : '#10b981';
              ctx.fillRect(x, y, barWidth, barHeight);
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    };

    drawVisualizer();

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [visMode]);

  // Limpieza general al desmontar
  useEffect(() => {
    return () => {
      activeVoicesRef.current.forEach(voice => {
        try {
          voice.osc.stop();
          voice.osc.disconnect();
        } catch {
          // Ignorar
        }
      });
      activeVoicesRef.current.clear();
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const resetPreset = () => {
    setWaveform('sawtooth');
    setMasterVolume(0.3);
    setOctaveShift(0);
    setCutoffFreq(2500);
    setResonance(4);
    setAttack(0.02);
    setDecay(0.2);
    setSustain(0.6);
    setRelease(0.35);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 font-mono text-fg select-none">
      {/* Barra superior de telemetría y controles rápidos */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 text-xs">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="font-bold tracking-wider uppercase">
            DSP ENGINE // POLYPHONIC AUDIO & TRACK ANALYZER
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setVisMode(visMode === 'wave' ? 'fft' : 'wave')}
            className="px-2.5 py-1 border border-border bg-bg-subtle hover:border-fg text-fg flex items-center space-x-1.5 transition-all text-[11px]"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>MODO: {visMode.toUpperCase()}</span>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 border transition-all ${
              isMuted ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-border bg-bg-subtle text-fg'
            }`}
            title={isMuted ? 'Desmutear' : 'Mutear'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={resetPreset}
            className="px-2 py-1 border border-border bg-bg-subtle hover:border-fg text-fg flex items-center space-x-1 text-[11px]"
            title="Restaurar parámetros por defecto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* MODULO REPRODUCTOR DE CANCIONES Y AUDIO STREAM */}
      <div className="p-3 border border-border bg-bg-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="p-2 border border-border bg-bg text-emerald-500 shrink-0">
            <Disc className={`w-4 h-4 ${isTrackPlaying ? 'animate-spin' : ''}`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-fg-subtle uppercase font-bold">PISTA DE AUDIO:</span>
              <span className="font-bold text-fg truncate text-[11px]">
                {trackName || 'Ninguna pista cargada (Reproduce o sube un archivo)'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[10px] text-fg-muted mt-0.5">
              <span>{formatSeconds(trackCurrentTime)} / {formatSeconds(trackDuration)}</span>
              <span>•</span>
              <span className="text-emerald-500">BASS: {(bassEnergy * 100).toFixed(0)}%</span>
              {autoSyncTrack && detectedPitchNote && (
                <>
                  <span>•</span>
                  <span className="text-amber-400 font-bold flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>PITCH: {detectedPitchNote} ({detectedPitchFreq}Hz)</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Acciones de la pista */}
        <div className="flex items-center space-x-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mp3,audio/wav,audio/ogg"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Toggle de Auto-Sync / Adaptación de datos */}
          <button
            onClick={() => setAutoSyncTrack(!autoSyncTrack)}
            className={`px-2.5 py-1.5 border flex items-center space-x-1.5 transition-all text-[11px] ${
              autoSyncTrack
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold'
                : 'border-border bg-bg text-fg-muted hover:text-fg'
            }`}
            title="Activa la adaptación automática del teclado y filtros al compás de la música"
          >
            <Zap className="w-3 h-3" />
            <span>AUTO-SYNC: {autoSyncTrack ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 border border-border bg-bg hover:border-fg text-fg flex items-center space-x-1.5 transition-all text-[11px]"
            title="Subir archivo de audio MP3 o WAV"
          >
            <Upload className="w-3 h-3" />
            <span>[ SUBIR AUDIO ]</span>
          </button>

          <button
            onClick={loadProceduralDemoTrack}
            className="px-2.5 py-1.5 border border-border bg-bg hover:border-fg text-fg flex items-center space-x-1.5 transition-all text-[11px]"
            title="Cargar demo synthwave de 124 BPM"
          >
            <Music className="w-3 h-3" />
            <span>[ DEMO SYNTHWAVE ]</span>
          </button>

          {trackName && (
            <>
              <button
                onClick={toggleTrackPlay}
                className="p-1.5 border border-border bg-bg hover:border-fg text-fg transition-all"
                title={isTrackPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isTrackPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button
                onClick={stopTrack}
                className="p-1.5 border border-border bg-bg hover:border-fg text-fg transition-all"
                title="Detener pista"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pantalla del Osciloscopio FFT Canvas */}
      <div className="relative border border-border bg-zinc-950 overflow-hidden h-36 sm:h-44 flex flex-col justify-between p-2 shadow-inner">
        <canvas
          ref={canvasRef}
          width={800}
          height={180}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-2 left-2 pointer-events-none flex items-center space-x-3 text-[10px] text-zinc-400">
          <span>SAMPLING: 44.1 kHz</span>
          <span>VOICES: {activeNotes.size}</span>
          <span>FILTER: {cutoffFreq}Hz</span>
        </div>

        <div className="absolute bottom-2 right-2 pointer-events-none text-[10px] text-zinc-500">
          REAL-TIME FFT 2048 • PASS-BAND ANALYZER
        </div>
      </div>

      {/* Matriz de Parámetros: Osciladores, Filtros y Envolvente ADSR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Columna 1: Formas de onda y Octava */}
        <div className="p-3 border border-border bg-bg-subtle space-y-3">
          <span className="font-bold text-[11px] text-fg uppercase flex items-center space-x-1.5 border-b border-border pb-1.5">
            <Waves className="w-3.5 h-3.5 text-emerald-500" />
            <span>OSCILADOR & VOICING</span>
          </span>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {(['sine', 'triangle', 'sawtooth', 'square'] as OscillatorWaveform[]).map(wave => (
              <button
                key={wave}
                onClick={() => setWaveform(wave)}
                className={`py-1.5 px-2 text-[10px] uppercase border transition-all ${
                  waveform === wave
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold'
                    : 'border-border bg-bg text-fg-muted hover:text-fg'
                }`}
              >
                {wave}
              </button>
            ))}
          </div>

          <div className="space-y-1 pt-1 text-[11px]">
            <div className="flex justify-between text-fg-subtle">
              <span>Octava:</span>
              <span className="text-fg font-bold">{octaveShift > 0 ? `+${octaveShift}` : octaveShift}</span>
            </div>
            <div className="flex space-x-1">
              {[-1, 0, 1].map(shift => (
                <button
                  key={shift}
                  onClick={() => setOctaveShift(shift)}
                  className={`flex-1 py-1 text-[10px] border transition-all ${
                    octaveShift === shift ? 'border-fg bg-fg text-bg font-bold' : 'border-border bg-bg text-fg'
                  }`}
                >
                  {shift > 0 ? `+${shift}` : shift} OCT
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna 2: Filtro Paso Bajo */}
        <div className="p-3 border border-border bg-bg-subtle space-y-3">
          <span className="font-bold text-[11px] text-fg uppercase flex items-center space-x-1.5 border-b border-border pb-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-500" />
            <span>FILTRO PASO BAJO (BIQUAD)</span>
          </span>

          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-fg-subtle">
                <span>Cutoff Frequency:</span>
                <span className="text-fg font-bold">{cutoffFreq} Hz</span>
              </div>
              <input
                type="range"
                min="200"
                max="8000"
                step="50"
                value={cutoffFreq}
                onChange={e => setCutoffFreq(Number(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-fg-subtle">
                <span>Resonance (Q):</span>
                <span className="text-fg font-bold">{resonance}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.5"
                value={resonance}
                onChange={e => setResonance(Number(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Columna 3: Envolvente ADSR */}
        <div className="p-3 border border-border bg-bg-subtle space-y-2">
          <span className="font-bold text-[11px] text-fg uppercase flex items-center space-x-1.5 border-b border-border pb-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>ENVOLVENTE ANALÓGICA (ADSR)</span>
          </span>

          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            <div className="space-y-1">
              <span className="text-[9px] text-fg-subtle block">ATTACK</span>
              <input
                type="range"
                min="0.005"
                max="0.5"
                step="0.01"
                value={attack}
                onChange={e => setAttack(Number(e.target.value))}
                className="w-full h-1 bg-border accent-emerald-500"
              />
              <span className="text-[9px] text-fg block">{Math.round(attack * 1000)}ms</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-fg-subtle block">DECAY</span>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={decay}
                onChange={e => setDecay(Number(e.target.value))}
                className="w-full h-1 bg-border accent-emerald-500"
              />
              <span className="text-[9px] text-fg block">{Math.round(decay * 1000)}ms</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-fg-subtle block">SUSTAIN</span>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={sustain}
                onChange={e => setSustain(Number(e.target.value))}
                className="w-full h-1 bg-border accent-emerald-500"
              />
              <span className="text-[9px] text-fg block">{Math.round(sustain * 100)}%</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-fg-subtle block">RELEASE</span>
              <input
                type="range"
                min="0.05"
                max="1.5"
                step="0.05"
                value={release}
                onChange={e => setRelease(Number(e.target.value))}
                className="w-full h-1 bg-border accent-emerald-500"
              />
              <span className="text-[9px] text-fg block">{Math.round(release * 1000)}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Teclado de Piano Interactivo */}
      <div className="p-3 border border-border bg-bg-subtle space-y-2">
        <div className="flex items-center justify-between text-[11px] text-fg-subtle">
          <span>TECLADO VIRTUAL // SOPORTE POLIFÓNICO MULTI-VOZ</span>
          <span className="hidden sm:inline text-[10px]">PULSA LAS TECLAS DEL TECLADO [A-L] O HAZ CLIC</span>
        </div>

        <div className="relative flex justify-center h-32 sm:h-36 pt-1 pb-2 overflow-x-auto select-none">
          <div className="relative flex">
            {NOTES.map((n) => {
              const isManuallyActive = activeNotes.has(n.note);
              const isDetectedFromTrack = autoSyncTrack && isTrackPlaying && detectedPitchNote === n.note;

              if (n.isSharp) {
                return (
                  <button
                    key={n.note}
                    onMouseDown={() => playNote(n)}
                    onMouseUp={() => stopNote(n)}
                    onMouseLeave={() => stopNote(n)}
                    onTouchStart={(e) => { e.preventDefault(); playNote(n); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopNote(n); }}
                    className={`absolute z-10 w-7 sm:w-8 h-20 sm:h-22 -ml-3.5 sm:-ml-4 border border-zinc-800 rounded-b transition-all flex flex-col justify-end items-center pb-2 ${
                      isDetectedFromTrack
                        ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)] scale-105'
                        : isManuallyActive
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                    }`}
                    style={{
                      left: `${
                        NOTES.filter((item, idx) => idx < NOTES.indexOf(n) && !item.isSharp).length * 40
                      }px`
                    }}
                  >
                    <span className="text-[8px] font-bold uppercase">{n.note}</span>
                    <span className="text-[8px] opacity-60 uppercase font-mono">[{n.key}]</span>
                  </button>
                );
              }

              return (
                <button
                  key={n.note}
                  onMouseDown={() => playNote(n)}
                  onMouseUp={() => stopNote(n)}
                  onMouseLeave={() => stopNote(n)}
                  onTouchStart={(e) => { e.preventDefault(); playNote(n); }}
                  onTouchEnd={(e) => { e.preventDefault(); stopNote(n); }}
                  className={`w-9 sm:w-10 h-32 sm:h-34 border border-border rounded-b transition-all flex flex-col justify-end items-center pb-2 relative z-0 ${
                    isDetectedFromTrack
                      ? 'bg-amber-400 text-zinc-950 border-amber-500 font-bold shadow-[0_0_16px_rgba(251,191,36,0.7)] scale-[1.02]'
                      : isManuallyActive
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-600 font-bold'
                      : 'bg-bg text-fg-muted hover:bg-bg-subtle'
                  }`}
                >
                  <span className="text-[10px] font-bold">{n.note}</span>
                  <span className="text-[9px] text-fg-subtle uppercase">[{n.key}]</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
