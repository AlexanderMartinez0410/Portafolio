import React, { useState, useRef, useEffect } from 'react';
import { labExperimentsData } from '../data/lab';
import type { LabExperiment } from '../types';
import { ExperimentDetail } from './ExperimentDetail';
import { SectionFooterNav } from './SectionFooterNav';
import { FlaskConical, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { FadeUp } from './FadeUp';
import { SpotlightCard } from './SpotlightCard';

export const Lab: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedExperiment, setSelectedExperiment] = useState<LabExperiment | null>(null);
  const scrollPosRef = useRef<number>(0);
  const lastExperimentIdRef = useRef<string | null>(null);

  // Al abrir un experimento, guardar la posición de scroll del contenedor
  const handleOpenExperiment = (exp: LabExperiment) => {
    const container = document.querySelector('div.overflow-y-auto');
    if (container) {
      scrollPosRef.current = container.scrollTop;
    }
    lastExperimentIdRef.current = exp.id;
    setSelectedExperiment(exp);
  };

  // Al volver del detalle, restaurar la posición exacta de scroll donde estaba el usuario
  const handleBackToLab = () => {
    setSelectedExperiment(null);
  };

  useEffect(() => {
    if (!selectedExperiment && lastExperimentIdRef.current) {
      const container = document.querySelector('div.overflow-y-auto');
      if (container) {
        // Restaurar posición guardada instantáneamente
        container.scrollTop = scrollPosRef.current;
        // O si hay elemento con id, hacer scroll hacia él
        const cardElement = document.getElementById(`lab-card-${lastExperimentIdRef.current}`);
        if (cardElement) {
          cardElement.scrollIntoView({ block: 'nearest' });
        }
      }
    }
  }, [selectedExperiment]);

  // Si hay un experimento seleccionado, mostramos la vista de detalle / playground
  if (selectedExperiment) {
    return (
      <ExperimentDetail
        experiment={selectedExperiment}
        onBack={handleBackToLab}
        onSelectExperiment={(exp) => {
          lastExperimentIdRef.current = exp.id;
          setSelectedExperiment(exp);
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between space-y-12">
      {/* Contenido Principal */}
      <div className="space-y-12">
        {/* Encabezado */}
        <FadeUp keyTrigger={language} yOffset={6} className="flex items-center justify-between border-b border-border pb-4 font-mono text-xs text-fg-muted">
          <div className="flex items-center space-x-2">
            <span className="text-fg font-semibold">02 /</span>
            <span className="tracking-wider uppercase font-medium">{t.lab.sectionTag}</span>
          </div>
          <span className="tracking-wider text-[11px] text-fg-subtle uppercase flex items-center space-x-1.5 font-medium">
            <FlaskConical className="w-3.5 h-3.5 text-fg-muted" />
            <span>[ PLAYGROUND // {labExperimentsData.length} {language === 'es' ? 'EXPERIMENTOS' : 'EXPERIMENTS'} ]</span>
          </span>
        </FadeUp>

        {/* Texto introductorio */}
        <FadeUp keyTrigger={language} delay={0.06} yOffset={8} className="max-w-3xl">
          <p className="text-base text-fg-muted leading-relaxed font-sans">
            {t.lab.headline}
          </p>
        </FadeUp>

        {/* Grid de Experimentos con Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {labExperimentsData.map((item) => (
            <SpotlightCard
              key={item.number}
              id={`lab-card-${item.id}`}
              onClick={() => handleOpenExperiment(item)}
              className="p-6 md:p-7 border border-border bg-bg-subtle flex flex-col justify-between space-y-6 hover:border-fg transition-all group cursor-pointer"
            >
              {/* Top: Número, Categoría y Título */}
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs border-b border-border pb-3">
                  <span className="font-bold text-fg text-sm">{item.number}</span>
                  <span className="text-[10px] text-fg-subtle uppercase tracking-wider font-semibold">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-base font-semibold text-fg tracking-tight leading-snug group-hover:text-fg transition-colors">
                  {item.title}
                </h4>

                {/* Descripción */}
                <p className="text-sm text-fg-muted leading-relaxed font-sans pt-1">
                  {item.description}
                </p>

                {/* Enfoque Técnico */}
                {item.approach && (
                  <div className="pt-2">
                    <div className="p-3 border border-border/70 bg-bg text-[11px] font-mono text-fg-muted space-y-1">
                      <span className="text-[10px] text-fg font-bold uppercase tracking-wider block">
                        ENFOQUE ARQUITECTÓNICO:
                      </span>
                      <p className="leading-relaxed font-sans text-xs text-fg-subtle">
                        {item.approach}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom: Tags de tecnología y Botón de Acción Sólido */}
              <div className="pt-4 border-t border-border space-y-4">
                {item.tech && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 border border-border/80 bg-bg text-[10px] font-mono text-fg font-medium tracking-wide"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider flex items-center space-x-1">
                    <span>●</span>
                    <span>{item.status}</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenExperiment(item);
                    }}
                    className="whitespace-nowrap px-3.5 py-1.5 border border-border group-hover:border-fg bg-bg text-xs font-mono text-fg font-semibold flex items-center space-x-1.5 transition-all shadow-sm group-hover:bg-fg group-hover:text-bg"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>[ {language === 'es' ? 'PROBAR DEMO' : 'RUN DEMO'} ]</span>
                  </button>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* Navegación fijada al suelo */}
      <div className="mt-auto pt-10">
        <SectionFooterNav />
      </div>
    </div>
  );
};
