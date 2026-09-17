import React, { useState, useRef, useEffect } from 'react';
import { labExperimentsData } from '../data/lab';
import type { LabExperiment } from '../types';
import { ExperimentDetail } from './ExperimentDetail';
import { SectionFooterNav } from './SectionFooterNav';
import { FlaskConical, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { translations } from '../i18n/translations';
import { FadeUp } from './FadeUp';
import { SpotlightCard } from './SpotlightCard';

export const Lab: React.FC = () => {
  const { language } = useLanguage();
  const { currentRoute, navigateTo } = useNavigation();
  const t = translations[language];

  // El experimento activo se deriva directamente de la URL (Single Source of Truth, 0 cascading renders)
  const selectedExperiment =
    currentRoute.section === 'experimentos' && currentRoute.params.experimentId
      ? labExperimentsData.find((item) => item.id === currentRoute.params.experimentId) || null
      : null;

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const scrollPosRef = useRef<number>(0);
  const lastExperimentIdRef = useRef<string | null>(null);

  const filterCategories = [
    { id: 'all', label: t.lab.filters.all },
    { id: 'ui-ux', label: t.lab.filters['ui-ux'] },
    { id: '3d-webgl', label: t.lab.filters['3d-webgl'] },
    { id: 'ai-llm', label: t.lab.filters['ai-llm'] },
    { id: 'audio-dsp', label: t.lab.filters['audio-dsp'] },
    { id: 'cli-systems', label: t.lab.filters['cli-systems'] },
  ];

  const filteredExperiments = selectedFilter === 'all'
    ? labExperimentsData
    : labExperimentsData.filter((item) => item.tagCategory === selectedFilter);

  // Manejar cambio de filtro con auto-scroll suave al primer elemento o grid
  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);

    setTimeout(() => {
      const match = selectedFilter === 'all'
        ? labExperimentsData[0]
        : labExperimentsData.find((item) => item.tagCategory === filterId);

      if (match) {
        const cardElement = document.getElementById(`lab-card-${match.id}`);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }, 50);
  };

  // Al abrir un experimento, guardar la posición de scroll del contenedor y actualizar la URL
  const handleOpenExperiment = (exp: LabExperiment) => {
    const container = document.querySelector('div.overflow-y-auto');
    if (container) {
      scrollPosRef.current = container.scrollTop;
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
    lastExperimentIdRef.current = exp.id;
    navigateTo(`/experimentos/${exp.id}`);
  };

  // Al volver del detalle, restaurar la posición exacta de scroll y sincronizar la URL
  const handleBackToLab = () => {
    navigateTo('/experimentos');
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

  return (
    <AnimatePresence mode="wait">
      {selectedExperiment ? (
        <motion.div
          key={`exp-detail-${selectedExperiment.id}`}
          initial={{ opacity: 0, y: 14, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.995 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex-1 flex flex-col justify-between"
        >
          <ExperimentDetail
            experiment={selectedExperiment}
            onBack={handleBackToLab}
            onSelectExperiment={(exp) => {
              lastExperimentIdRef.current = exp.id;
              navigateTo(`/experimentos/${exp.id}`);
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="lab-list"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col justify-between space-y-12 w-full"
        >
          {/* Contenido Principal */}
          <div className="space-y-12 w-full">
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

            {/* Texto introductorio y Barra de Filtros */}
            <div className="space-y-6">
              <FadeUp keyTrigger={language} delay={0.06} yOffset={8} className="max-w-4xl">
                <p className="text-base text-fg-muted leading-relaxed font-sans">
                  {t.lab.headline}
                </p>
              </FadeUp>

              {/* Filtro por Categorías con desplazamiento suave */}
              <FadeUp keyTrigger={language} delay={0.1} yOffset={6} className="pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 font-mono text-xs border-y border-border py-3 bg-bg-subtle/30 px-3">
                  <span className="text-[10px] text-fg-subtle uppercase tracking-widest font-semibold shrink-0">
                    {t.lab.filterLabel}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {filterCategories.map((cat) => {
                      const isActive = selectedFilter === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleFilterSelect(cat.id)}
                          className={`px-3 py-1 text-[11px] tracking-wider uppercase transition-all border font-medium ${
                            isActive
                              ? 'border-border-strong bg-fg text-bg font-bold shadow-sm'
                              : 'border-border text-fg-muted hover:text-fg hover:border-border-strong bg-bg'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Grid de Experimentos con Spotlight ocupando todo el ancho */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 pt-2 w-full">
              {filteredExperiments.map((item) => (
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
