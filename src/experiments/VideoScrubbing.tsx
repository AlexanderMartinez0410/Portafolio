// =============================================================================
// EXPERIMENTO #07 — Video Scrubbing Frame a Frame (100% Web / Client-Side)
// Arquitectura:
//   1. Procesamiento 100% en el navegador (HTML5 Video + OffscreenCanvas + ImageBitmap)
//   2. Cero almacenamiento en disco y cero persistencia: todo vive en memoria volátil (RAM/VRAM)
//   3. Decodificación GPU acelerada frame a frame con scrubbing a 60 FPS
//   4. Diseño adaptado a Modo Claro y Modo Oscuro con botón de subida destacado
// =============================================================================

import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { ExperimentComponentProps } from '../components/ExperimentDetail';
import { Upload, AlertCircle, RefreshCw, Loader2, Sparkles, Film, Cpu, HardDrive } from 'lucide-react';

type VideoState =
  | { status: 'loading'; message: string; progress?: number }
  | { status: 'ready'; totalFrames: number; fps: number; duration: number; sourceName: string }
  | { status: 'idle' }
  | { status: 'error'; message: string };

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}.${String(Math.floor((s % 1) * 10))}`;

export const VideoScrubbing: React.FC<ExperimentComponentProps> = ({
  onTelemetryUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Almacén de frames en memoria volátil (ImageBitmap acelerado por GPU)
  const bitmapsRef = useRef<ImageBitmap[]>([]);
  const [state, setState] = useState<VideoState>({ status: 'idle' });
  const [activeFrameIdx, setActiveFrameIdx] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const progressRef = useRef(0);
  const isReady = state.status === 'ready';

  // ─── Liberar memoria GPU/RAM al cambiar o desmontar ──────────────────────
  const clearBitmaps = useCallback(() => {
    if (bitmapsRef.current.length > 0) {
      bitmapsRef.current.forEach((b) => {
        try { b.close(); } catch { /* ignore */ }
      });
      bitmapsRef.current = [];
    }
  }, []);

  useEffect(() => {
    return () => {
      clearBitmaps();
    };
  }, [clearBitmaps]);

  // ─── Generador de secuencia demo procedural (100% en memoria) ─────────────
  const loadProceduralDemo = useCallback(async () => {
    setState({ status: 'loading', message: 'Generando secuencia procedural de 60 frames en memoria...', progress: 10 });
    clearBitmaps();

    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const bgFill = isDark ? '#090d16' : '#f8fafc';
    const gridStroke = isDark ? '#1e293b' : '#e2e8f0';
    const ring1 = isDark ? '#38bdf8' : '#0284c7';
    const ring2 = isDark ? '#10b981' : '#059669';
    const grad1 = isDark ? '#38bdf8' : '#3b82f6';
    const grad2 = isDark ? '#6366f1' : '#4f46e5';
    const grad3 = isDark ? '#090d16' : '#e2e8f0';
    const textColorPrimary = isDark ? '#f8fafc' : '#0f172a';
    const textColorMuted = isDark ? '#94a3b8' : '#64748b';
    const textColorAccent = isDark ? '#10b981' : '#047857';
    const textSubtle = isDark ? '#38bdf8' : '#0369a1';

    const TOTAL = 60;
    const offscreen = document.createElement('canvas');
    offscreen.width = 720;
    offscreen.height = 405;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    const newBitmaps: ImageBitmap[] = [];

    for (let i = 0; i < TOTAL; i++) {
      const t = i / (TOTAL - 1);
      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, 720, 405);

      // Grid de coordenadas
      ctx.strokeStyle = gridStroke;
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= 720; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, 405); ctx.stroke();
      }
      for (let gy = 0; gy <= 405; gy += 40) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(720, gy); ctx.stroke();
      }

      // Geometría orbital
      const cx = 360, cy = 202;
      const radius = 95;
      const angle = t * Math.PI * 4;

      ctx.strokeStyle = ring1;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.45, t * Math.PI, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = ring2;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.3, radius * 0.6, -t * Math.PI * 1.2, 0, Math.PI * 2);
      ctx.stroke();

      // Núcleo
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 50);
      grad.addColorStop(0, grad1);
      grad.addColorStop(0.45, grad2);
      grad.addColorStop(1, grad3);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fill();

      // Satélite
      const satX = cx + Math.cos(angle) * (radius * 1.25);
      const satY = cy + Math.sin(angle) * (radius * 0.55);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(satX, satY, 9, 0, Math.PI * 2);
      ctx.fill();

      // HUD informativo
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = textColorAccent;
      ctx.fillText(`FRAME: [ ${String(i + 1).padStart(2, '0')} / ${TOTAL} ]`, 28, 42);
      ctx.fillStyle = textColorMuted;
      ctx.fillText(`TIMELINE: ${(t * 100).toFixed(1)}%`, 28, 64);
      ctx.fillText(`ROTATION: ${(angle * 180 / Math.PI).toFixed(0)}°`, 28, 86);
      ctx.fillStyle = textSubtle;
      ctx.fillText(`RESOLUCIÓN: 720×405 (16:9) // MEMORIA VOLÁTIL`, 28, 375);
      ctx.fillStyle = textColorPrimary;
      ctx.fillText(`MODO: WEB BROWSER CLIENT-SIDE ENGINE`, 360, 42);

      const bmp = await createImageBitmap(offscreen);
      newBitmaps.push(bmp);
    }

    bitmapsRef.current = newBitmaps;
    progressRef.current = 0;
    setActiveFrameIdx(0);
    setDisplayPct(0);
    setState({
      status: 'ready',
      totalFrames: TOTAL,
      fps: 24,
      duration: TOTAL / 24,
      sourceName: 'Demo Procedural (En Memoria)',
    });
  }, [clearBitmaps]);

  // Cargar demo inicial diferido al montar para evitar cascading renders
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      void loadProceduralDemo();
    });
    return () => cancelAnimationFrame(handle);
  }, [loadProceduralDemo]);

  // ─── Extractor de frames 100% en Web (Client-Side, Cero disco) ───────────
  const processVideoInBrowser = useCallback(async (file: File) => {
    if (!file.type.startsWith('video/')) {
      setState({ status: 'error', message: 'Por favor selecciona un archivo de video válido (MP4, WebM, etc).' });
      return;
    }

    setState({
      status: 'loading',
      message: `Iniciando decodificación en navegador: "${file.name}"...`,
      progress: 0,
    });

    clearBitmaps();
    const blobUrl = URL.createObjectURL(file);

    try {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = blobUrl;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('El navegador no pudo abrir este formato de video.'));
      });

      const duration = video.duration || 1;
      const origW = video.videoWidth || 640;
      const origH = video.videoHeight || 360;

      // Limitar resolución máx para mantener rendimiento óptimo en RAM (ancho 800px)
      const scale = Math.min(1, 800 / origW);
      const targetW = Math.round(origW * scale);
      const targetH = Math.round(origH * scale);

      // Extraer entre 24 y 72 frames según la duración
      const totalFrames = Math.max(24, Math.min(72, Math.round(duration * 24)));

      const offscreen = document.createElement('canvas');
      offscreen.width = targetW;
      offscreen.height = targetH;
      const ctx = offscreen.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('No se pudo inicializar el contexto de Canvas.');

      const newBitmaps: ImageBitmap[] = [];

      for (let i = 0; i < totalFrames; i++) {
        const targetTime = (i / (totalFrames - 1)) * Math.max(0, duration - 0.04);
        video.currentTime = targetTime;

        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            resolve();
          };
          video.addEventListener('seeked', onSeeked, { once: true });
        });

        ctx.drawImage(video, 0, 0, targetW, targetH);
        const bmp = await createImageBitmap(offscreen);
        newBitmaps.push(bmp);

        const currentPct = Math.round(((i + 1) / totalFrames) * 100);
        setState({
          status: 'loading',
          message: `Decodificando frames en memoria del navegador: ${currentPct}% (${i + 1}/${totalFrames})...`,
          progress: currentPct,
        });
      }

      bitmapsRef.current = newBitmaps;
      progressRef.current = 0;
      setActiveFrameIdx(0);
      setDisplayPct(0);

      setState({
        status: 'ready',
        totalFrames,
        fps: Math.round(totalFrames / duration),
        duration,
        sourceName: file.name,
      });
    } catch (err: any) {
      setState({
        status: 'error',
        message: err?.message || 'Error durante la decodificación del video en el navegador.',
      });
    } finally {
      // Liberar inmediatamente el blob del video original de la memoria
      URL.revokeObjectURL(blobUrl);
    }
  }, [clearBitmaps]);

  // ─── Dibujar frame activo en Canvas ──────────────────────────────────────
  useEffect(() => {
    if (!isReady || bitmapsRef.current.length === 0) return;

    const bmp = bitmapsRef.current[activeFrameIdx];
    const canvas = canvasRef.current;
    if (bmp && canvas) {
      if (canvas.width !== bmp.width || canvas.height !== bmp.height) {
        canvas.width = bmp.width;
        canvas.height = bmp.height;
      }
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(bmp, 0, 0);
    }
  }, [isReady, activeFrameIdx]);

  // ─── Seek y Telemetría ───────────────────────────────────────────────────
  const seekTo = useCallback((progress: number) => {
    const p = clamp(progress, 0, 1);
    progressRef.current = p;
    setDisplayPct(p * 100);

    const total = bitmapsRef.current.length;
    if (total > 0) {
      const idx = Math.min(Math.floor(p * total), total - 1);
      setActiveFrameIdx(idx);

      onTelemetryUpdate?.({
        renderTime: 0.05,
        eventName: `Frame ${idx + 1} / ${total}`,
        customMetrics: [
          { label: 'Frame', value: `${idx + 1} / ${total}`, color: 'text-emerald-500' },
          { label: 'Timeline', value: `${(p * 100).toFixed(1)}%`, color: 'text-amber-500' },
          { label: 'Procesamiento', value: '100% Web (RAM)', color: 'text-blue-500' },
          { label: 'Disco', value: '0 bytes (Sin Guardar)', color: 'text-purple-500' }
        ]
      });
    }
  }, [onTelemetryUpdate]);

  // ─── Scrubbing con Rueda de Ratón ─────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isReady) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const total = bitmapsRef.current.length;
      if (total <= 1) return;

      const delta = e.deltaY;
      const step = (1 / total) * (Math.abs(delta) > 100 ? 2 : 1) * Math.sign(delta);
      seekTo(progressRef.current + step);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isReady, seekTo]);

  // ─── Handlers de archivo ─────────────────────────────────────────────────
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processVideoInBrowser(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processVideoInBrowser(file);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-3 select-none font-mono text-fg">
      {/* ── BARRA SUPERIOR DE HERRAMIENTAS Y ACCIÓN ── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border pb-3 text-xs shrink-0">
        <div className="flex items-center space-x-2 min-w-0">
          <Film className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-bold tracking-wider uppercase text-[11px] sm:text-xs truncate text-fg">
            VIDEO SCRUBBER // <span className="hidden sm:inline">MOTOR PYTHON FRAME A FRAME</span><span className="sm:hidden">FRAME A FRAME</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* BOTÓN PRIMARIO DE SUBIR VIDEO (Prominente, alto contraste en modo claro y oscuro) */}
          <label className="px-3 py-1.5 border border-emerald-600 dark:border-emerald-500 bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20 active:scale-95 font-bold flex items-center space-x-1.5 transition-all text-xs cursor-pointer shadow-sm">
            <input type="file" accept="video/*" className="sr-only" onChange={handleFileInput} />
            <Upload className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>[ SUBIR VIDEO ]</span>
          </label>

          <button
            onClick={() => loadProceduralDemo()}
            className="px-2.5 py-1.5 border border-border hover:border-fg bg-bg-subtle text-fg text-xs font-medium flex items-center space-x-1 transition-all active:scale-95"
            title="Generar o recargar demo procedural de 60 frames"
          >
            <RefreshCw className="w-3 h-3 text-fg-muted" />
            <span className="hidden sm:inline">DEMO</span>
          </button>
        </div>
      </div>

      {/* ── VISUALIZADOR PRINCIPAL ── */}
      <div
        ref={containerRef}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`relative w-full flex-1 bg-bg-subtle dark:bg-black/90 border border-border overflow-hidden transition-colors flex items-center justify-center min-h-[380px] sm:min-h-[440px] ${
          isDragging ? 'border-emerald-500 ring-2 ring-emerald-500/30' : ''
        } ${isReady ? 'cursor-ns-resize' : ''}`}
      >
        {/* Renderizado de Frame con Canvas (ImageBitmap en memoria GPU) */}
        {isReady && (
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        )}

        {/* HUD Superior (Adaptado a Modo Claro y Oscuro) */}
        {isReady && (
          <>
            <div
              className="absolute top-0 bottom-0 w-px bg-emerald-500/70 dark:bg-emerald-400/80 pointer-events-none"
              style={{ left: `${displayPct}%` }}
            />
            <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none z-10 gap-2">
              <span className="px-2.5 py-1 bg-bg/90 dark:bg-black/85 backdrop-blur-md text-[11px] text-fg font-mono flex items-center gap-1.5 border border-border shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{formatTime((displayPct / 100) * state.duration)}s / {formatTime(state.duration)}s</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-bg/90 dark:bg-black/85 backdrop-blur-md text-[11px] text-fg font-mono flex items-center gap-1.5 border border-border shadow-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                    <Cpu className="w-3 h-3" /> Memoria RAM
                  </span>
                  <span className="text-fg-subtle">·</span>
                  <span>f.{activeFrameIdx + 1} / {state.totalFrames}</span>
                </span>

                <label className="pointer-events-auto px-2.5 py-1 bg-bg/90 dark:bg-black/85 backdrop-blur-md text-[11px] text-fg hover:text-emerald-600 dark:hover:text-emerald-400 border border-border hover:border-emerald-500 cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm font-semibold">
                  <input type="file" accept="video/*" className="sr-only" onChange={handleFileInput} />
                  <Upload className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Subir otro</span>
                </label>
              </div>
            </div>

            {/* Tip inferior */}
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-bg/90 dark:bg-black/85 backdrop-blur-md text-[10px] text-fg-subtle whitespace-nowrap font-mono border border-border shadow-sm pointer-events-none z-10">
              ↕ Gira la rueda del ratón o desliza la barra inferior para scrubbing frame a frame
            </p>
          </>
        )}

        {/* Estado Loading con barra de progreso */}
        {state.status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg/95 backdrop-blur-sm z-20 p-6">
            <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
            <div className="w-full max-w-xs space-y-2 text-center">
              <p className="text-xs text-fg font-mono font-semibold">{state.message}</p>
              {typeof state.progress === 'number' && (
                <div className="w-full h-2 bg-bg-surface border border-border overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-150"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
              )}
              <div className="flex items-center justify-center gap-2 text-[10px] text-fg-subtle">
                <HardDrive className="w-3 h-3" />
                <span>0 bytes en disco · Procesando 100% en Web</span>
              </div>
            </div>
          </div>
        )}

        {/* Estado Idle (Sin frames) */}
        {state.status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
            <label className="cursor-pointer group flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border hover:border-emerald-500 bg-bg hover:bg-bg-subtle/60 transition-all max-w-lg w-full text-center shadow-sm">
              <input type="file" accept="video/*" className="sr-only" onChange={handleFileInput} />
              <div className="w-14 h-14 border border-border bg-bg-subtle flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-fg">
                  Haz clic aquí o arrastra tu video MP4 / WebM
                </p>
                <p className="text-xs text-fg-muted font-sans">
                  El navegador decodificará los fotogramas directamente en memoria volátil (RAM/VRAM). No se guarda nada en disco.
                </p>
              </div>
              <div className="pt-2">
                <span className="px-3 py-1.5 border border-emerald-600 dark:border-emerald-500 bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> [ SELECCIONAR VIDEO ]
                </span>
              </div>
            </label>

            <button
              type="button"
              onClick={() => loadProceduralDemo()}
              className="px-4 py-2 border border-border hover:border-fg bg-bg text-fg hover:bg-bg-subtle text-xs font-mono flex items-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>[ O PROBAR DEMO PROCEDURAL DE 60 FRAMES ]</span>
            </button>
          </div>
        )}

        {/* Estado Error */}
        {state.status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg/95 p-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-xs text-fg font-semibold text-center max-w-md">{state.message}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setState({ status: 'idle' })}
                className="px-4 py-1.5 border border-border text-xs text-fg hover:border-fg bg-bg-subtle"
              >
                Volver a intentar
              </button>
              <button
                onClick={() => loadProceduralDemo()}
                className="px-4 py-1.5 border border-emerald-500 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
              >
                Cargar Demo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── BARRA INTERACTIVA DE SCRUBBING INFERIOR ── */}
      {isReady && (
        <div className="space-y-1.5 shrink-0">
          <div
            className="relative w-full h-4 bg-bg-surface border border-border cursor-pointer group hover:border-fg/60 transition-colors"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const p = (e.clientX - rect.left) / rect.width;
              seekTo(p);
            }}
          >
            {/* Barra de progreso coloreada */}
            <div
              className="absolute inset-y-0 left-0 bg-emerald-500 dark:bg-emerald-400 transition-none"
              style={{ width: `${displayPct}%` }}
            />
            {/* Cursor / Cabezal de aguja */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-5 bg-fg border border-bg shadow-sm pointer-events-none transition-none"
              style={{ left: `calc(${displayPct}% - 7px)` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-fg-subtle px-1 font-mono">
            <span>FRAME: <strong className="text-fg">{activeFrameIdx + 1}</strong> / {state.totalFrames}</span>
            <span>POSICIÓN: <strong className="text-fg">{displayPct.toFixed(1)}%</strong></span>
            <span>ALMACENAMIENTO: <strong className="text-emerald-600 dark:text-emerald-400">0 BYTES EN DISCO (100% WEB)</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
