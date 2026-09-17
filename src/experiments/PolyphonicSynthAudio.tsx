// =============================================================================
// EXPERIMENTO #03 — Sintetizador Polifónico & Osciloscopio Web Audio API
// Arquitectura:
//   1. AudioContext nativo sin librerías externas para mínimo overhead.
//   2. Polifonía dinámica (Multi-voice engine) con asignación y liberación de voces.
//   3. Modulador de envolvente analógica ADSR (Attack, Decay, Sustain, Release) en tiempo real.
//   4. Selector de osciladores (sine, triangle, sawtooth, square) y filtro paso bajo (cutoff/resonance).
//   5. Secuenciador Web Audio en vivo (Demo Synthwave 124 BPM) que reacciona en tiempo real a los controles.
//   6. Iluminación exacta de teclas del piano sincronizada con el tempo musical.
//   7. Analizador FFT / Osciloscopio a 60 FPS con detección de energía de graves (Bass Kick).
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
  Sparkles
} from 'lucide-react';

import { 
  type OscillatorWaveform,
  type NoteDefinition,
  type ActiveVoice,
  NOTES,
  DEMO_MELODY,
  makeDistortionCurve,
  formatAudioSeconds
} from './synth/synthData';
import { triggerDrumSound } from './synth/drumSynth';

export const PolyphonicSynthAudio: React.FC<ExperimentComponentProps> = ({
  onTelemetryUpdate
}) => {
  // Configuración de audio del sintetizador
  const [waveform, setWaveform] = useState<OscillatorWaveform>('sawtooth');
  const [masterVolume, setMasterVolume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [octaveShift, setOctaveShift] = useState<number>(0);

  // Parámetros ADSR (en segundos / ratio)
  const [attack, setAttack] = useState<number>(0.02);
  const [decay, setDecay] = useState<number>(0.15);
  const [sustain, setSustain] = useState<number>(0.5);
  const [release, setRelease] = useState<number>(0.25);

  // Filtro Paso Bajo (Low-pass)
  const [cutoffFreq, setCutoffFreq] = useState<number>(2800);
  const [resonance, setResonance] = useState<number>(4);

  // Tipo de visualizador
  const [visMode, setVisMode] = useState<'wave' | 'fft'>('wave');
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [sequencerNotes, setSequencerNotes] = useState<Set<string>>(new Set());

  // Estado del Reproductor de Música / Pistas
  const [trackName, setTrackName] = useState<string | null>(null);
  const [isTrackPlaying, setIsTrackPlaying] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [trackDuration, setTrackDuration] = useState<number>(0);
  const [trackCurrentTime, setTrackCurrentTime] = useState<number>(0);
  const [bassEnergy, setBassEnergy] = useState<number>(0);

  // Referencias mutables para lectura en tiempo real sin reiniciar timers
  const synthParamsRef = useRef({
    waveform,
    octaveShift,
    attack,
    decay,
    sustain,
    release,
    cutoffFreq,
    resonance,
    masterVolume,
    isMuted
  });

  // Mantener actualizado synthParamsRef
  useEffect(() => {
    synthParamsRef.current = {
      waveform,
      octaveShift,
      attack,
      decay,
      sustain,
      release,
      cutoffFreq,
      resonance,
      masterVolume,
      isMuted
    };
  }, [waveform, octaveShift, attack, decay, sustain, release, cutoffFreq, resonance, masterVolume, isMuted]);

  // Referencias de audio nativas
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const masterFilterRef = useRef<BiquadFilterNode | null>(null);
  const distortionNodeRef = useRef<WaveShaperNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const activeVoicesRef = useRef<Map<string, ActiveVoice>>(new Map());

  // Referencias del secuenciador en vivo
  const sequencerIntervalRef = useRef<number | null>(null);
  const sequencerStepRef = useRef<number>(0);

  // Referencias de reproducción de archivos subidos
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

      const distortion = ctx.createWaveShaper();
      distortion.curve = makeDistortionCurve(waveform);
      distortion.oversample = '4x';

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);

      // Cadena de Audio: Fuentes -> distortion -> masterFilter -> masterGain -> analyser -> destination
      distortion.connect(masterFilter);
      masterFilter.connect(masterGain);
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      distortionNodeRef.current = distortion;
      analyserRef.current = analyser;
      masterGainRef.current = masterGain;
      masterFilterRef.current = masterFilter;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, [cutoffFreq, resonance, masterVolume, waveform]);

  // Actualizar curva de distorsión analógica en tiempo real para sintetizador y canciones subidas
  useEffect(() => {
    if (distortionNodeRef.current) {
      distortionNodeRef.current.curve = makeDistortionCurve(waveform);
    }
  }, [waveform]);

  // Actualizar tono y velocidad de reproducción (Pitch Shift / Slowed / Nightcore) en canciones subidas
  useEffect(() => {
    if (audioElementRef.current) {
      const rate = octaveShift === -1 ? 0.75 : octaveShift === 1 ? 1.25 : 1.0;
      audioElementRef.current.playbackRate = rate;
      // Permite que el cambio de velocidad afecte el pitch/tono de la canción como cinta analógica
      (audioElementRef.current as unknown as { preservesPitch: boolean }).preservesPitch = false;
    }
  }, [octaveShift]);

  // Actualizar filtro global cuando cambien los controles (inmediato, sin glitch)
  useEffect(() => {
    if (masterFilterRef.current && audioCtxRef.current) {
      masterFilterRef.current.frequency.setTargetAtTime(cutoffFreq, audioCtxRef.current.currentTime, 0.015);
      masterFilterRef.current.Q.setTargetAtTime(resonance, audioCtxRef.current.currentTime, 0.015);
    }
  }, [cutoffFreq, resonance]);

  // Actualizar volumen maestro
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetVol = isMuted ? 0 : masterVolume;
      masterGainRef.current.gain.setTargetAtTime(targetVol, audioCtxRef.current.currentTime, 0.015);
    }
  }, [masterVolume, isMuted]);

  // 2. Encender nota manual (Note On)
  const playNote = useCallback((noteDef: NoteDefinition) => {
    const ctx = getAudioContext();
    if (!ctx || !masterGainRef.current) return;

    if (activeVoicesRef.current.has(noteDef.note)) return;

    const params = synthParamsRef.current;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const voiceGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const multiplier = Math.pow(2, params.octaveShift);
    osc.type = params.waveform;
    osc.frequency.setValueAtTime(noteDef.freq * multiplier, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(params.cutoffFreq, now);
    filter.Q.setValueAtTime(params.resonance, now);

    voiceGain.gain.setValueAtTime(0.0001, now);
    voiceGain.gain.linearRampToValueAtTime(1.0, now + Math.max(0.005, params.attack));
    voiceGain.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, params.sustain), 
      now + params.attack + Math.max(0.01, params.decay)
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
      renderTime: 0.05,
      eventName: `NoteOn: ${noteDef.note} (${(noteDef.freq * multiplier).toFixed(1)}Hz)`,
      customMetrics: [
        { label: 'Voces', value: `${currentActiveCount} activas`, color: 'text-emerald-400' },
        { label: 'Cutoff', value: `${params.cutoffFreq}Hz`, color: 'text-amber-400' },
        { label: 'Onda', value: params.waveform.toUpperCase(), color: 'text-blue-400' }
      ]
    });
  }, [getAudioContext, onTelemetryUpdate]);

  // 3. Apagar nota manual (Note Off con etapa de Release)
  const stopNote = useCallback((noteDef: NoteDefinition) => {
    const voice = activeVoicesRef.current.get(noteDef.note);
    if (!voice || !audioCtxRef.current) return;

    const params = synthParamsRef.current;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.01, params.release));

    voice.osc.stop(now + params.release + 0.05);

    setTimeout(() => {
      try {
        voice.osc.disconnect();
        voice.filter?.disconnect();
        voice.gain.disconnect();
      } catch {
        // Ignorar
      }
    }, (params.release + 0.1) * 1000);

    activeVoicesRef.current.delete(noteDef.note);
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(noteDef.note);
      return next;
    });

    const remainingCount = activeVoicesRef.current.size;

    onTelemetryUpdate?.({
      renderTime: 0.04,
      eventName: `NoteOff: ${noteDef.note}`,
      customMetrics: [
        { label: 'Voces', value: `${remainingCount} activas`, color: remainingCount > 0 ? 'text-emerald-400' : 'text-fg-muted' },
        { label: 'Cutoff', value: `${params.cutoffFreq}Hz`, color: 'text-amber-400' },
        { label: 'Onda', value: params.waveform.toUpperCase(), color: 'text-blue-400' }
      ]
    });
  }, [onTelemetryUpdate]);

  // ── 4. SINTETIZADOR DE PERCUSIÓN & SECUENCIADOR EN VIVO (124 BPM) ──
  const triggerDrum = useCallback((type: 'kick' | 'bass' | 'hihat', time: number, ctx: AudioContext) => {
    triggerDrumSound(type, time, ctx, masterGainRef.current);
  }, []);

  // Reproducir una nota sintetizada programada en el secuenciador
  const playSequencedNote = useCallback((noteName: string, stepDurationMs: number) => {
    const ctx = getAudioContext();
    if (!ctx || !masterFilterRef.current) return;

    const noteDef = NOTES.find(n => n.note === noteName);
    if (!noteDef) return;

    const params = synthParamsRef.current;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const voiceGain = ctx.createGain();

    const multiplier = Math.pow(2, params.octaveShift);
    osc.type = params.waveform; // Reactiva a cambios de forma de onda
    osc.frequency.setValueAtTime(noteDef.freq * multiplier, now);

    // Envolvente ADSR reactiva
    const noteLenSec = (stepDurationMs / 1000) * 0.85;
    const noteAttack = Math.min(noteLenSec * 0.3, Math.max(0.005, params.attack));
    const noteDecay = Math.min(noteLenSec * 0.4, Math.max(0.01, params.decay));
    const noteRelease = Math.max(0.02, params.release);

    voiceGain.gain.setValueAtTime(0.0001, now);
    voiceGain.gain.linearRampToValueAtTime(0.85, now + noteAttack);
    voiceGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, params.sustain * 0.85), now + noteAttack + noteDecay);
    voiceGain.gain.setValueAtTime(Math.max(0.0001, params.sustain * 0.85), now + noteLenSec);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + noteLenSec + noteRelease);

    osc.connect(voiceGain);
    voiceGain.connect(masterFilterRef.current);

    osc.start(now);
    osc.stop(now + noteLenSec + noteRelease + 0.05);

    // Iluminar la tecla exacta en el piano al instante
    setSequencerNotes(new Set([noteName]));
    setTimeout(() => {
      setSequencerNotes(prev => {
        const next = new Set(prev);
        next.delete(noteName);
        return next;
      });
    }, stepDurationMs * 0.85);

    setTimeout(() => {
      try {
        osc.disconnect();
        voiceGain.disconnect();
      } catch {
        // Ignorar
      }
    }, (noteLenSec + noteRelease + 0.1) * 1000);
  }, [getAudioContext]);

  // Iniciar / Detener Secuenciador Demo en Vivo
  const startDemoSequencer = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    // Detener cualquier audio previo
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    if (sequencerIntervalRef.current) {
      window.clearInterval(sequencerIntervalRef.current);
      sequencerIntervalRef.current = null;
    }

    setIsDemoMode(true);
    setIsTrackPlaying(true);
    setTrackName('Cyberpunk Synthwave Engine [124 BPM Sequencer]');
    setTrackDuration(16 * (60 / 124 / 4) * 4); // Loop continuo
    sequencerStepRef.current = 0;

    const bpm = 124;
    const stepIntervalMs = (60 / bpm / 4) * 1000; // Semicorcheas a 124 BPM (~121ms)

    const stepRunner = () => {
      const step = sequencerStepRef.current;
      const now = ctx.currentTime;

      // 1. Batería en el compás
      if (step % 4 === 0) {
        triggerDrum('kick', now, ctx);
      }
      if (step % 2 === 1) {
        triggerDrum('hihat', now, ctx);
      }
      if (step % 4 === 2) {
        triggerDrum('bass', now, ctx);
      }

      // 2. Melodía sintetizada
      const melodyStep = DEMO_MELODY[step % DEMO_MELODY.length];
      if (melodyStep) {
        playSequencedNote(melodyStep.note, stepIntervalMs * melodyStep.duration);
      }

      sequencerStepRef.current = (step + 1) % DEMO_MELODY.length;
      setTrackCurrentTime(prev => (prev + (stepIntervalMs / 1000)) % 16);
    };

    // Ejecutar primer paso inmediatamente
    stepRunner();
    sequencerIntervalRef.current = window.setInterval(stepRunner, stepIntervalMs);

    onTelemetryUpdate?.({
      renderTime: 0.15,
      eventName: 'Secuenciador Demo Iniciado (124 BPM)'
    });
  }, [getAudioContext, triggerDrum, playSequencedNote, onTelemetryUpdate]);

  const stopSequencer = useCallback(() => {
    if (sequencerIntervalRef.current) {
      window.clearInterval(sequencerIntervalRef.current);
      sequencerIntervalRef.current = null;
    }
    setSequencerNotes(new Set());
    setIsTrackPlaying(false);
    setIsDemoMode(false);
    setTrackCurrentTime(0);
  }, []);

  // ── 5. Gestión de Archivos de Audio Subidos por el Usuario (MP3/WAV) ──
  const setupAudioElementSource = useCallback((audio: HTMLAudioElement) => {
    const ctx = getAudioContext();
    if (!trackSourceNodeRef.current && ctx) {
      const source = ctx.createMediaElementSource(audio);
      if (distortionNodeRef.current) {
        source.connect(distortionNodeRef.current);
      } else if (masterFilterRef.current) {
        source.connect(masterFilterRef.current);
      } else if (masterGainRef.current) {
        source.connect(masterGainRef.current);
      }
      trackSourceNodeRef.current = source;
    }
  }, [getAudioContext]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detener secuenciador si estaba activo
    if (sequencerIntervalRef.current) {
      stopSequencer();
    }

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
      setIsDemoMode(false);
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

  const toggleTrackPlay = () => {
    if (isDemoMode) {
      if (isTrackPlaying) {
        if (sequencerIntervalRef.current) {
          window.clearInterval(sequencerIntervalRef.current);
          sequencerIntervalRef.current = null;
        }
        setIsTrackPlaying(false);
        setSequencerNotes(new Set());
      } else {
        startDemoSequencer();
      }
      return;
    }

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
    if (isDemoMode) {
      stopSequencer();
      return;
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      setIsTrackPlaying(false);
      setTrackCurrentTime(0);
    }
  };

  const formatSeconds = formatAudioSeconds;

  // 6. Mapeo de Teclado Físico de PC
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

  // 7. Renderizado en Tiempo Real del Osciloscopio (HTML5 Canvas a 60 FPS)
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

          for (let i = 0; i < 6; i++) {
            bassSum += freqData[i];
          }

          const currentBass = Math.min(1.0, (bassSum / 6) / 255);
          setBassEnergy(currentBass);

          // Destello perimetral en golpe de bajo
          if (currentBass > 0.45) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${currentBass * 0.4})`;
            ctx.lineWidth = 4;
            ctx.strokeRect(0, 0, width, height);
          }

          // Detección armónica de notas para música subida (MP3/WAV)
          if (!isDemoMode && isTrackPlaying) {
            const sampleRate = analyser.context.sampleRate;
            const binSize = sampleRate / analyser.fftSize;
            let maxEnergy = 0;
            let dominantNote: string | null = null;

            for (const n of NOTES) {
              const bin = Math.round(n.freq / binSize);
              if (bin < freqData.length) {
                const energy = (freqData[bin] + (freqData[bin - 1] || 0) + (freqData[bin + 1] || 0)) / 3;
                if (energy > 130 && energy > maxEnergy) {
                  maxEnergy = energy;
                  dominantNote = n.note;
                }
              }
            }

            if (dominantNote) {
              setSequencerNotes(new Set([dominantNote]));
            }
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

      if (typeof document !== 'undefined' && document.hidden) {
        // Pausar solicitud de frames si la pestaña no es visible
        return;
      }

      animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && active) {
        animationFrameRef.current = requestAnimationFrame(drawVisualizer);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    drawVisualizer();

    return () => {
      active = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [visMode, isDemoMode, isTrackPlaying]);

  // Limpieza general al desmontar
  useEffect(() => {
    const activeVoices = activeVoicesRef.current;
    const audioElement = audioElementRef.current;
    const audioCtx = audioCtxRef.current;
    return () => {
      if (sequencerIntervalRef.current) {
        window.clearInterval(sequencerIntervalRef.current);
      }
      activeVoices.forEach(voice => {
        try {
          voice.osc.stop();
          voice.osc.disconnect();
        } catch {
          // Ignorar
        }
      });
      activeVoices.clear();
      if (audioElement) {
        audioElement.pause();
      }
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close();
      }
    };
  }, []);

  const resetPreset = () => {
    setWaveform('sawtooth');
    setMasterVolume(0.3);
    setOctaveShift(0);
    setCutoffFreq(2800);
    setResonance(4);
    setAttack(0.02);
    setDecay(0.15);
    setSustain(0.5);
    setRelease(0.25);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 font-mono text-fg select-none">
      {/* Barra superior de telemetría y controles rápidos */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 text-xs">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[11px] sm:text-xs">
            DSP ENGINE // SYNTH & SEQUENCER
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setVisMode(visMode === 'wave' ? 'fft' : 'wave')}
            className="px-2.5 py-1 border border-border bg-bg-subtle hover:border-fg text-fg flex items-center space-x-1.5 transition-all text-[11px] cursor-pointer"
            aria-label={`Cambiar modo de visualización: actualmente ${visMode.toUpperCase()}`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>MODO: {visMode.toUpperCase()}</span>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 border transition-all cursor-pointer ${
              isMuted ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-border bg-bg-subtle text-fg'
            }`}
            title={isMuted ? 'Desmutear' : 'Mutear'}
            aria-label={isMuted ? 'Activar sonido del sintetizador' : 'Silenciar sonido del sintetizador'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={resetPreset}
            className="px-2 py-1 border border-border bg-bg-subtle hover:border-fg text-fg flex items-center space-x-1 text-[11px] cursor-pointer"
            title="Restaurar parámetros por defecto"
            aria-label="Restaurar parámetros por defecto del sintetizador"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* MODULO REPRODUCTOR DE CANCIONES Y SECUENCIADOR SYNTHWAVE */}
      <div className="p-3 border border-border bg-bg-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="p-2 border border-border bg-bg text-emerald-500 shrink-0">
            <Disc className={`w-4 h-4 ${isTrackPlaying ? 'animate-spin' : ''}`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-fg-subtle uppercase font-bold">PISTA:</span>
              <span className="font-bold text-fg truncate text-[11px]">
                {trackName || 'Ninguna pista activa (Presiona Demo o sube un archivo)'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[10px] text-fg-muted mt-0.5">
              <span>{formatSeconds(trackCurrentTime)} {trackDuration > 0 ? `/ ${formatSeconds(trackDuration)}` : ''}</span>
              <span>•</span>
              <span className="text-emerald-500">BASS: {(bassEnergy * 100).toFixed(0)}%</span>
              {isDemoMode && isTrackPlaying && (
                <>
                  <span>•</span>
                  <span className="text-amber-400 font-bold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>SYNTH DIRECTO (124 BPM)</span>
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
            aria-label="Subir archivo de audio"
          />

          <button
            onClick={startDemoSequencer}
            className={`px-2.5 py-1.5 border flex items-center space-x-1.5 transition-all text-[11px] cursor-pointer ${
              isDemoMode && isTrackPlaying
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold'
                : 'border-border bg-bg hover:border-fg text-fg'
            }`}
            title="Reproducir demo con el sintetizador en tiempo real a 124 BPM"
            aria-label="Reproducir demo con el sintetizador en tiempo real a 124 BPM"
          >
            <Music className="w-3 h-3" />
            <span>[ DEMO SYNTHWAVE ]</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 border border-border bg-bg hover:border-fg text-fg flex items-center space-x-1.5 transition-all text-[11px] cursor-pointer"
            title="Subir archivo de audio MP3 o WAV"
            aria-label="Subir pista de audio local MP3 o WAV"
          >
            <Upload className="w-3 h-3" />
            <span>[ SUBIR AUDIO ]</span>
          </button>

          {trackName && (
            <>
              <button
                onClick={toggleTrackPlay}
                className="p-1.5 border border-border bg-bg hover:border-fg text-fg transition-all cursor-pointer"
                title={isTrackPlaying ? 'Pausar' : 'Reproducir'}
                aria-label={isTrackPlaying ? 'Pausar reproducción de audio' : 'Iniciar reproducción de audio'}
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
          <span>VOICES: {activeNotes.size + sequencerNotes.size}</span>
          <span>FILTER: {cutoffFreq}Hz</span>
          <span>ONDA: {waveform.toUpperCase()}</span>
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
                className="w-full h-1 bg-border accent-emerald-500 cursor-pointer"
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
                className="w-full h-1 bg-border accent-emerald-500 cursor-pointer"
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
                className="w-full h-1 bg-border accent-emerald-500 cursor-pointer"
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
                className="w-full h-1 bg-border accent-emerald-500 cursor-pointer"
              />
              <span className="text-[9px] text-fg block">{Math.round(release * 1000)}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Teclado de Piano Interactivo */}
      <div className="p-3 border border-border bg-bg-subtle space-y-2">
        <div className="flex items-center justify-between text-[11px] text-fg-subtle">
          <span>TECLADO VIRTUAL // ILUMINACIÓN SINCRONIZADA</span>
          <span className="hidden sm:inline text-[10px]">TOCA CON EL TECLADO [A-L] O HAZ CLIC MIENTRAS SUENA LA CANCIÓN</span>
        </div>

        <div className="relative flex justify-center h-32 sm:h-36 pt-1 pb-2 overflow-x-auto select-none">
          <div className="relative flex">
            {NOTES.map((n) => {
              const isManuallyActive = activeNotes.has(n.note);
              const isSequencerActive = sequencerNotes.has(n.note);

              if (n.isSharp) {
                return (
                  <button
                    key={n.note}
                    onMouseDown={() => playNote(n)}
                    onMouseUp={() => stopNote(n)}
                    onMouseLeave={() => stopNote(n)}
                    onTouchStart={(e) => { e.preventDefault(); playNote(n); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopNote(n); }}
                    className={`absolute z-10 w-7 sm:w-8 h-20 sm:h-22 -ml-3.5 sm:-ml-4 border rounded-b transition-all flex flex-col justify-end items-center pb-2 ${
                      isSequencerActive
                        ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.9)] scale-105'
                        : isManuallyActive
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] scale-105'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
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
                  className={`w-9 sm:w-10 h-32 sm:h-34 border rounded-b transition-all flex flex-col justify-end items-center pb-2 relative z-0 ${
                    isSequencerActive
                      ? 'bg-amber-400 text-zinc-950 border-amber-500 font-bold shadow-[0_0_16px_rgba(251,191,36,0.8)] scale-[1.03]'
                      : isManuallyActive
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-600 font-bold shadow-[0_0_14px_rgba(16,185,129,0.8)] scale-[1.02]'
                      : 'bg-bg text-fg-muted border-border hover:bg-bg-subtle'
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
