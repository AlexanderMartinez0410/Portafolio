import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export const BrokenLampEasterEgg: React.FC = () => {
  const { isLampBroken, repairLamp } = useTheme();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [flickerState, setFlickerState] = useState<'sparking' | 'dead' | 'restored'>('sparking');

  const [prevBroken, setPrevBroken] = useState(isLampBroken);
  if (isLampBroken !== prevBroken) {
    setPrevBroken(isLampBroken);
    if (!isLampBroken) {
      setFlickerState('sparking');
      setIsFixing(false);
    }
  }

  const handleFix = useCallback(() => {
    if (isFixing) return;
    setIsFixing(true);
    setFlickerState('restored');
    setTimeout(() => {
      repairLamp();
      setIsFixing(false);
    }, 900);
  }, [isFixing, repairLamp]);

  useEffect(() => {
    if (!isLampBroken) return;

    // 1. Fase de chisporroteo / parpadeo inicial por 1.4 segundos
    const timer = setTimeout(() => {
      // 2. Blackout total: Filamento se quiebra y todo queda a oscuras
      setFlickerState('dead');
    }, 1400);

    // 3. Auto-reparación tras 14 segundos si el usuario no interactúa
    const autoRestoreTimer = setTimeout(() => {
      handleFix();
    }, 14000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoRestoreTimer);
    };
  }, [isLampBroken, handleFix]);

  return (
    <AnimatePresence>
      {isLampBroken && (
        <div 
          role="alertdialog"
          aria-modal="true"
          aria-label={isEn ? 'Power outage alert' : 'Aviso de corte de energía'}
          className="fixed inset-0 z-50 pointer-events-auto flex flex-col items-center justify-start overflow-hidden select-none"
        >
          {/* 
            CAPA DE BLACKOUT TOTAL:
            Cubre toda la pantalla sumergiendo el portafolio entero en oscuridad absoluta.
          */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity:
                flickerState === 'sparking'
                  ? [0, 0.98, 0.25, 0.98, 0.4, 0.99]
                  : flickerState === 'dead'
                  ? 0.98
                  : [1, 0], // Flash de salida al restaurar
            }}
            transition={{
              duration: flickerState === 'sparking' ? 1.4 : flickerState === 'restored' ? 0.45 : 0.3,
              times: flickerState === 'sparking' ? [0, 0.25, 0.45, 0.65, 0.85, 1] : undefined,
            }}
            className="absolute inset-0 bg-[#060608] backdrop-blur-md"
          />

          {/* Flash estroboscópico de encendido (cuando regresa la luz) */}
          {flickerState === 'restored' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute inset-0 bg-amber-100/90 pointer-events-none z-10"
            />
          )}

          {/* Conjunto Lámpara Colgante con Física Pendular */}
          <motion.div
            initial={{ y: -400, rotate: 0 }}
            animate={{
              y: isFixing ? -440 : 0,
              rotate: isFixing ? 0 : [0, 7, -6, 4, -2.5, 1, 0],
            }}
            exit={{ y: -440, opacity: 0 }}
            transition={{
              y: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              rotate: { duration: 3.5, ease: 'easeInOut' },
            }}
            style={{ transformOrigin: 'top center' }}
            className="flex flex-col items-center cursor-pointer group relative z-20"
            onClick={handleFix}
            title={isEn ? 'Click on the bulb to repair the light' : 'Haz clic en la bombilla para reparar el foco'}
          >
            {/* Cable negro que cae del techo */}
            <div className="w-[3px] h-32 md:h-44 bg-gradient-to-b from-neutral-950 via-neutral-800 to-neutral-700 shadow-md" />

            {/* Portalámparas / Casquillo vintage de latón oscuro */}
            <div className="w-8 h-7 bg-[#2d2118] rounded-t-sm border border-[#4a3b2c] shadow-inner flex flex-col items-center justify-between py-0.5">
              <div className="w-9 h-1 bg-[#4a3724] rounded-full" />
              <div className="w-7 h-0.5 bg-[#1a120b]" />
              <div className="w-7 h-0.5 bg-[#1a120b]" />
            </div>

            {/* Bombilla Edison SVG interactiva */}
            <div className="relative flex items-center justify-center -mt-0.5">
              {/* Resplandor sutil: fuerte al chisporrotear / restaurar, débil rescoldo moribundo al estar rota */}
              <motion.div
                animate={{
                  opacity:
                    flickerState === 'sparking'
                      ? [1, 0.05, 0.9, 0.1, 0.8, 0]
                      : flickerState === 'restored'
                      ? 1
                      : [0.35, 0.1, 0.2, 0.05],
                  scale: flickerState === 'restored' ? 1.6 : flickerState === 'sparking' ? 1.2 : 0.85,
                }}
                transition={{
                  duration: flickerState === 'sparking' ? 1.4 : flickerState === 'restored' ? 0.4 : 3,
                  repeat: flickerState === 'dead' ? Infinity : 0,
                  repeatType: 'reverse',
                }}
                className={`absolute w-52 h-52 rounded-full blur-2xl pointer-events-none ${
                  flickerState === 'dead' ? 'bg-amber-900/20' : 'bg-amber-300/50'
                }`}
              />

              <svg
                width="76"
                height="106"
                viewBox="0 0 72 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-200 group-hover:scale-105 filter drop-shadow-2xl"
              >
                {/* Bulbo de cristal */}
                <path
                  d="M20 10 H52 L54 30 C59 38 64 48 64 60 C64 78 51.5 92 36 92 C20.5 92 8 78 8 60 C8 48 13 38 18 30 Z"
                  fill={
                    flickerState === 'restored'
                      ? 'rgba(254, 240, 138, 0.9)'
                      : flickerState === 'sparking'
                      ? 'rgba(253, 224, 71, 0.45)'
                      : 'rgba(28, 28, 35, 0.65)'
                  }
                  stroke={
                    flickerState === 'restored'
                      ? '#FACC15'
                      : flickerState === 'sparking'
                      ? '#EAB308'
                      : 'rgba(90, 90, 110, 0.5)'
                  }
                  strokeWidth="2.2"
                />

                {/* Reflejos de cristal */}
                <path
                  d="M16 48 C15 54 16 64 21 72"
                  stroke={flickerState === 'dead' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.55)'}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                {/* 1. Filamento en cortocircuito / chisporroteo */}
                {flickerState === 'sparking' && (
                  <motion.g
                    animate={{ opacity: [1, 0.1, 0.95, 0.15, 1, 0] }}
                    transition={{ duration: 1.4 }}
                  >
                    <path
                      d="M28 35 L28 55 L32 50 L36 55 L40 50 L44 55 L44 35"
                      stroke="#FDE047"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="36" cy="52" r="3" fill="#FFFFFF" />
                  </motion.g>
                )}

                {/* 2. Filamento roto en dos partes con tizne quemado */}
                {flickerState === 'dead' && (
                  <g>
                    <path
                      d="M28 35 L28 49 L31 45"
                      stroke="#404040"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M44 35 L44 54 L37 59"
                      stroke="#404040"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    {/* Rescoldo tenue al rojo vivo que se enfría en el extremo */}
                    <circle cx="31" cy="45" r="1.5" fill="#f97316" opacity="0.8" />
                    <circle cx="37" cy="59" r="1.5" fill="#ef4444" opacity="0.7" />
                    {/* Grieta y humo interno */}
                    <path
                      d="M33 53 L35 57 L32 62"
                      stroke="rgba(15, 15, 20, 0.8)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* 3. Filamento restaurado y resplandeciente */}
                {flickerState === 'restored' && (
                  <g>
                    <path
                      d="M28 35 L28 55 L32 50 L36 55 L40 50 L44 55 L44 35"
                      stroke="#FEF08A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="36" cy="52" r="4.5" fill="#FFFFFF" />
                  </g>
                )}
              </svg>

              {/* Chispas durante el chisporroteo inicial */}
              {flickerState === 'sparking' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {[...Array(7)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1.3, 0],
                        x: (i % 2 === 0 ? 1 : -1) * (18 + i * 10),
                        y: 12 + i * 14,
                        opacity: [1, 0.85, 0],
                      }}
                      transition={{
                        duration: 0.5 + i * 0.1,
                        repeat: 2,
                        delay: i * 0.07,
                      }}
                      className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-200"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Placa de Emergencia en la Oscuridad */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-6 bg-neutral-900/95 border border-amber-500/30 shadow-[0_0_40px_rgba(0,0,0,0.9)] rounded-xl p-5 max-w-sm text-center flex flex-col items-center gap-3 mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                {isEn ? 'TOTAL POWER OUTAGE' : 'CORTE TOTAL DE ENERGÍA'}
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {isEn
                  ? 'You blew the fuses by playing with the switch. The entire room has gone dark.'
                  : 'Has fundido los fusibles por insistir con el interruptor. La sala completa se ha quedado a oscuras.'}
              </p>

              <button
                type="button"
                onClick={handleFix}
                disabled={isFixing}
                className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all active:scale-95 cursor-pointer"
              >
                {isFixing
                  ? isEn
                    ? 'Restoring power...'
                    : 'Restableciendo corriente...'
                  : isEn
                  ? 'Screw in new bulb & restore light'
                  : 'Enroscar bombilla y reactivar luz'}
              </button>

              <span className="text-[10px] text-neutral-400 font-mono tracking-tight">
                {isEn
                  ? '(Or click directly on the lightbulb to turn it on)'
                  : '(O haz clic directamente sobre la bombilla para encenderla)'}
              </span>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
