import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Activity, Layers, Cpu, Globe, Lock, ArrowUpRight, Maximize2 } from 'lucide-react';

interface ProjectVisualProps {
  type: 'dataviz' | 'design-system' | 'audio-engine' | 'image';
  title: string;
  imageSrc?: string;
  liveUrl?: string;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({ type, title, imageSrc, liveUrl }) => {
  const [tick, setTick] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 100);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Manejar tecla ESC para cerrar modal
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Vista de Imagen de Proyecto Real (AMMI Online, Bioregistro, Desaparecidos EC)
  if (type === 'image' || imageSrc) {
    const displayImage = imageSrc || '/images/AmmiOnline.webp';
    const isBioregistro = displayImage.toLowerCase().includes('bioregistro') || title.toLowerCase().includes('bioregistro');
    const isDesaparecidos = displayImage.toLowerCase().includes('desaparecidos') || title.toLowerCase().includes('desaparecidos');

    // Metadatos adaptativos por proyecto
    const systemCategory = isBioregistro
      ? '// CLIENTE MÓVIL // FLUTTER + DART'
      : isDesaparecidos
      ? '// PLATAFORMA CÍVICA // FASTAPI + REDIS'
      : '// PLATAFORMA INSTITUCIONAL // ANGULAR 20 SSR + POSTGRESQL';

    const addressDisplay = isBioregistro
      ? 'app.bioregistro.device // LOCAL AUTH + GPS'
      : isDesaparecidos
      ? 'alertas.desaparecidos.ec // GEO ENGINE'
      : liveUrl
      ? liveUrl.replace('https://', '').replace('/#/', '')
      : 'ammionline.ammi.edu.ec';

    const telemetryLeft = isBioregistro
      ? 'DESPLIEGUE PRODUCCIÓN: FLUTTER + FIREBASE + HAVERSINE'
      : isDesaparecidos
      ? 'MOTOR GEOESPACIAL: REDIS PUB/SUB + HAVERSINE'
      : 'DESPLIEGUE EN VIVO: ANGULAR 20 SSR + .NET 8 + POSTGRESQL';

    const telemetryRight = isBioregistro
      ? 'ANTI-FRAUDE: BIOMETRÍA + DEVICE LOCK'
      : isDesaparecidos
      ? 'PROPAGACIÓN: < 3S // CELERY WORKERS'
      : 'REPORTES AUTOMÁTICOS: < 2 MIN // CQRS';

    return (
      <>
        <div className="w-full bg-bg-subtle border border-border flex flex-col font-mono group overflow-hidden shadow-sm hover:border-border-strong transition-all duration-300">
          {/* Top Browser / Window Frame */}
          <div className="flex justify-between items-center text-[10px] sm:text-xs text-fg-muted border-b border-border px-3 py-1.5 bg-bg/90 backdrop-blur-sm z-10 select-none">
            {/* Window Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-border bg-bg-subtle group-hover:bg-red-500/80 transition-colors" />
                <span className="w-2.5 h-2.5 rounded-full border border-border bg-bg-subtle group-hover:bg-amber-500/80 transition-colors" />
                <span className="w-2.5 h-2.5 rounded-full border border-border bg-bg-subtle group-hover:bg-emerald-500/80 transition-colors" />
              </div>
              <span className="hidden sm:inline-block text-fg-subtle pl-2 font-mono text-[10px]">
                {systemCategory}
              </span>
            </div>

            {/* Address Bar */}
            <div className="flex items-center space-x-2 px-2.5 py-0.5 bg-bg border border-border text-[10px] sm:text-[11px] text-fg rounded-sm truncate max-w-[200px] sm:max-w-[340px]">
              <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate font-mono tracking-tight">
                {addressDisplay}
              </span>
            </div>

            {/* Actions / Status */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="p-1 border border-border hover:border-fg bg-bg text-fg hover:text-fg-muted transition-all"
                title="Ampliar captura"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center space-x-1 px-2 py-0.5 border border-border hover:border-fg bg-bg text-[10px] text-fg font-semibold hover:bg-fg hover:text-bg transition-all"
                  title="Visitar plataforma oficial"
                >
                  <Globe className="w-3 h-3" />
                  <span>[ VER LIVE ]</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          {/* Screenshot Container */}
          <div
            className="relative w-full h-52 sm:h-64 md:h-72 lg:h-80 bg-bg-subtle/80 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={displayImage}
              alt={title}
              className="w-full h-full object-cover sm:object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.01]"
              loading="lazy"
            />
          </div>

          {/* Bottom telemetry footer */}
          <div className="flex justify-between items-center text-[10px] text-fg-subtle border-t border-border px-3 py-1.5 bg-bg select-none">
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">{telemetryLeft}</span>
            </span>
            <span className="hidden sm:inline-block">{telemetryRight}</span>
          </div>
        </div>

        {/* Modal / Lightbox de pantalla completa montado en document.body mediante createPortal */}
        {isModalOpen && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md p-4 sm:p-8 flex flex-col justify-between animate-fadeIn cursor-zoom-out select-none"
            onClick={() => setIsModalOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            {/* Header del Lightbox */}
            <div className="flex items-center justify-between font-mono text-xs text-neutral-300 border-b border-neutral-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="text-white font-bold tracking-wider uppercase">{title}</span>
                <span className="hidden sm:inline text-neutral-500">{systemCategory}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 border border-neutral-700 bg-neutral-900 text-white hover:border-white transition-colors cursor-pointer text-xs font-mono"
              >
                [ CERRAR ✕ ]
              </button>
            </div>

            {/* Imagen Centrada */}
            <div className="my-auto flex items-center justify-center max-h-[82vh] w-full p-2">
              <img
                src={displayImage}
                alt={title}
                className="max-h-[80vh] max-w-full object-contain rounded border border-neutral-800 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Footer del Lightbox */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px] text-neutral-400 border-t border-neutral-800 pt-3">
              <span>{title}</span>
              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white underline hover:text-neutral-300 inline-flex items-center space-x-1"
                >
                  <span>{liveUrl}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-neutral-400">{telemetryLeft}</span>
              )}
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  if (type === 'dataviz') {
    return (
      <div className="w-full h-52 sm:h-64 md:h-72 lg:h-80 bg-bg-subtle border border-border flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-mono group">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Top telemetry bar */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-fg-muted border-b border-border pb-3 z-10">
          <div className="flex items-center space-x-3">
            <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="tracking-wider uppercase">RENDER_THREAD // WORKER_01 ACTIVE</span>
          </div>
          <div className="flex space-x-4">
            <span>FPS: <strong className="text-fg font-normal">59.94</strong></span>
            <span>MEM: <strong className="text-fg font-normal">14.2 MB</strong></span>
          </div>
        </div>

        {/* Dynamic visual canvas representation */}
        <div className="my-auto z-10 flex flex-col items-center justify-center space-y-4">
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 sm:gap-2 w-full max-w-lg">
            {Array.from({ length: 24 }).map((_, i) => {
              const heightMultiplier = Math.sin((tick + i * 4) * 0.2) * 0.5 + 0.5;
              const isAccent = (i + tick) % 7 === 0;
              return (
                <div key={i} className="flex flex-col items-center space-y-1">
                  <div
                    className={`w-full transition-all duration-300 ${
                      isAccent ? 'bg-fg' : 'bg-fg-subtle opacity-40'
                    }`}
                    style={{
                      height: `${Math.max(12, Math.floor(heightMultiplier * 54))}px`,
                    }}
                  />
                  <span className="text-[8px] text-fg-subtle">0{i + 1}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-fg-muted tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>SUB-PIXEL SAMPLING ENGINE // MATRIX 24×12</span>
          </div>
        </div>

        {/* Bottom coordinate readout */}
        <div className="flex justify-between items-center text-[10px] text-fg-subtle border-t border-border pt-3 z-10">
          <span>X: 1920.00 Y: 1080.00 Z: 0.00</span>
          <span>PIPELINE: PROJECTION_PASS_OK</span>
        </div>
      </div>
    );
  }

  if (type === 'design-system') {
    return (
      <div className="w-full h-52 sm:h-64 md:h-72 lg:h-80 bg-bg-subtle border border-border flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-mono group">
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-fg-muted border-b border-border pb-3">
          <div className="flex items-center space-x-3">
            <Layers className="w-3.5 h-3.5 text-fg-muted" />
            <span className="tracking-wider uppercase">TOKEN GRAFT // ATOMIC DEFINITION</span>
          </div>
          <span>SPEC_VERSION: 3.4.0</span>
        </div>

        {/* Token Specimens Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto z-10">
          <div className="p-3 border border-border bg-bg flex flex-col justify-between space-y-2">
            <span className="text-[10px] text-fg-muted uppercase">COLOR_SCALE</span>
            <div className="grid grid-cols-4 gap-1 h-8">
              <div className="bg-fg opacity-100" />
              <div className="bg-fg opacity-70" />
              <div className="bg-fg opacity-40" />
              <div className="bg-fg opacity-15" />
            </div>
            <span className="text-[9px] text-fg-subtle">LUM_RATIO: 1.000 → 0.045</span>
          </div>

          <div className="p-3 border border-border bg-bg flex flex-col justify-between space-y-2">
            <span className="text-[10px] text-fg-muted uppercase">TYPE_CADENCE</span>
            <div className="space-y-1 font-sans">
              <div className="text-sm font-semibold tracking-tight text-fg leading-none">Aa Titular 700</div>
              <div className="text-xs text-fg-muted leading-none">Bb Párrafo 400</div>
              <div className="text-[10px] text-fg-subtle font-mono leading-none">Cc Código 500</div>
            </div>
            <span className="text-[9px] text-fg-subtle">SCALE: 1.250 MAJOR THIRD</span>
          </div>

          <div className="p-3 border border-border bg-bg flex flex-col justify-between space-y-2">
            <span className="text-[10px] text-fg-muted uppercase">SPATIAL_RHYTHM</span>
            <div className="flex items-end space-x-1.5 h-8">
              <div className="w-2 h-2 bg-fg opacity-80" />
              <div className="w-3 h-4 bg-fg opacity-80" />
              <div className="w-4 h-6 bg-fg opacity-80" />
              <div className="w-6 h-8 bg-fg opacity-80" />
            </div>
            <span className="text-[9px] text-fg-subtle">BASE_UNIT: 4px | 8px | 16px</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-fg-subtle border-t border-border pt-3">
          <span>CONTRAST: 14.8:1 (AAA VERIFIED)</span>
          <span>TOKENS COMPILED: 184</span>
        </div>
      </div>
    );
  }

  // Audio Engine / Telemetry Stream
  return (
    <div className="w-full h-52 sm:h-64 md:h-72 lg:h-80 bg-bg-subtle border border-border flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-mono group">
      <div className="flex justify-between items-center text-[10px] sm:text-xs text-fg-muted border-b border-border pb-3">
        <div className="flex items-center space-x-3">
          <Cpu className="w-3.5 h-3.5 text-fg-muted" />
          <span className="tracking-wider uppercase">TELEMETRY_STREAM // WS_PORT: 8080</span>
        </div>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">STREAMING 10.2k EV/S</span>
      </div>

      {/* Realtime Wave Stream Visual */}
      <div className="my-auto z-10 space-y-4">
        <div className="flex items-center space-x-1 sm:space-x-1.5 h-20 w-full overflow-hidden justify-between">
          {Array.from({ length: 36 }).map((_, i) => {
            const rawVal = Math.sin((tick * 2 + i * 8) * 0.15) * Math.cos((tick + i) * 0.1);
            const height = Math.floor(Math.abs(rawVal) * 50) + 8;
            return (
              <div
                key={i}
                className="w-1.5 bg-fg transition-all duration-200"
                style={{
                  height: `${height}px`,
                  opacity: i === 35 ? 1 : (i / 35) * 0.7 + 0.3,
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-fg-muted">
          <span>BUFFER_DRIFT: 0.02ms</span>
          <span>CIRCULAR_QUEUE: 1024 / 1024 SLOTS</span>
          <span>HEAP: OPTIMAL</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-fg-subtle border-t border-border pt-3">
        <span>RXJS PIPELINE: BATCH_WINDOW_16ms</span>
        <span>DROPPED_FRAMES: 0</span>
      </div>
    </div>
  );
};
