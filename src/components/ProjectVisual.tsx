import React, { useState, useEffect } from 'react';
import { Activity, Layers, Cpu } from 'lucide-react';

interface ProjectVisualProps {
  type: 'dataviz' | 'design-system' | 'audio-engine';
  title: string;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({ type }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 100);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  if (type === 'dataviz') {
    return (
      <div className="w-full h-64 sm:h-80 md:h-96 bg-bg-subtle border border-border flex flex-col justify-between p-6 relative overflow-hidden font-mono group">
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
      <div className="w-full h-64 sm:h-80 md:h-96 bg-bg-subtle border border-border flex flex-col justify-between p-6 relative overflow-hidden font-mono group">
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
    <div className="w-full h-64 sm:h-80 md:h-96 bg-bg-subtle border border-border flex flex-col justify-between p-6 relative overflow-hidden font-mono group">
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
