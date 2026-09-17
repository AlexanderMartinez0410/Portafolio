import React, { useState } from 'react';
import { skillsData } from '../data/manifesto';
import { SectionFooterNav } from './SectionFooterNav';
import { Code2, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { TypewriterText } from './TypewriterText';
import { FadeUp } from './FadeUp';
import { ScrollReveal } from './ScrollReveal';

// ─── Discrete 7-Level Segment Meter (International SFIA Standard) ─────────────
const SkillBar: React.FC<{
  name: string;
  sfiaLevel: number;
  sfiaLabel: string;
  barColor: string;
  delay: number;
}> = ({ name, sfiaLevel, sfiaLabel, barColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -6 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
    className="space-y-1 p-2 border border-border/80 bg-bg-subtle/50 hover:bg-bg-subtle hover:border-border-strong transition-colors"
  >
    <div className="flex items-center justify-between font-mono text-[11px]">
      <span className="text-fg font-medium">{name}</span>
      <span className="text-[10px] font-semibold tracking-wider text-fg-subtle border border-border px-1.5 py-0.5 bg-bg uppercase">
        {sfiaLabel}
      </span>
    </div>
    <div className="grid grid-cols-7 gap-1 pt-0.5">
      {[1, 2, 3, 4, 5, 6, 7].map((lvl) => {
        const isActive = lvl <= sfiaLevel;
        return (
          <div
            key={lvl}
            className={`h-1.5 rounded-xs transition-all duration-300 ${
              isActive
                ? `${barColor} opacity-90 shadow-xs`
                : 'bg-border/40'
            }`}
          />
        );
      })}
    </div>
  </motion.div>
);

// ─── Skills section ───────────────────────────────────────────────────────────
const SkillsSection: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeGroup, setActiveGroup] = useState<string>('all');

  const selectedCategory = skillsData.find((g) => g.category === activeGroup);
  const insight = selectedCategory ? t.hero.skillsCategoryInsights[selectedCategory.category] : null;

  return (
    <div id="dominio-tecnico" className="scroll-mt-4">
      <ScrollReveal yOffset={20} className="space-y-5 pt-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center space-x-2 font-mono text-xs text-fg font-semibold">
            <BarChart2 className="w-4 h-4 text-fg-muted" />
            <span className="tracking-wider uppercase">{t.hero.skillsHeader}</span>
          </div>
          <span className="font-mono text-[10px] text-fg-subtle tracking-wider uppercase font-medium">
            {t.hero.skillsTag}
          </span>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
          {['all', ...skillsData.map((g) => g.category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveGroup(cat)}
              className={`px-3 py-1.5 border tracking-wider uppercase transition-all cursor-pointer ${
                activeGroup === cat
                  ? 'border-border-strong bg-fg text-bg font-bold shadow-xs'
                  : 'border-border text-fg-muted hover:text-fg hover:border-border-strong bg-bg-subtle'
              }`}
            >
              {cat === 'all' ? t.hero.skillsAllTab : cat}
            </button>
          ))}
        </div>

        {/* Tier Legend (SFIA 7-Level Framework) */}
        <div className="flex flex-wrap items-center gap-1.5 p-2 border border-border bg-bg-subtle/40 font-mono text-[10px] text-fg-muted">
          <span className="text-fg font-semibold uppercase tracking-wider pr-1">
            [ MARCO SFIA (1-7) ]:
          </span>
          <span className="px-1.5 py-0.5 border border-border-strong bg-fg text-bg font-semibold">
            {t.hero.tierLegend.l5}
          </span>
          <span className="px-1.5 py-0.5 border border-border bg-bg text-fg-muted">
            {t.hero.tierLegend.l4}
          </span>
          <span className="px-1.5 py-0.5 border border-border bg-bg text-fg-muted">
            {t.hero.tierLegend.l3}
          </span>
          <span className="px-1.5 py-0.5 border border-border bg-bg text-fg-muted">
            {t.hero.tierLegend.l2}
          </span>
          <span className="text-fg-subtle px-1 text-[9px]">
            (L6-L7 Dirección)
          </span>
        </div>

        {/* Main Content Area con altura fija/estable para evitar cualquier desplazamiento exterior */}
        <div className="min-h-[530px] md:min-h-[510px] flex flex-col justify-start">
          <AnimatePresence mode="wait">
            {activeGroup === 'all' ? (
              /* Vista 'TODOS': 2 columnas equilibradas para evitar saltos bruscos de altura */
              <motion.div
                key="all-view"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch min-h-[490px] md:min-h-[470px]"
              >
                {/* Columna Izquierda: Tarjetas compactas de las 5 áreas */}
                <div className="flex flex-col justify-center h-full space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {skillsData.map((group, idx) => (
                      <div
                        key={group.category}
                        onClick={() => setActiveGroup(group.category)}
                        className={`p-3 border border-border bg-bg-subtle/30 hover:bg-bg-subtle hover:border-border-strong cursor-pointer transition-all space-y-1.5 group flex flex-col justify-between ${
                          idx === skillsData.length - 1 && skillsData.length % 2 !== 0 ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-border/80 pb-1">
                          <span className={`font-mono text-[11px] font-bold uppercase tracking-wider ${group.color}`}>
                            {group.category}
                          </span>
                          <span className="font-mono text-[9px] text-fg-subtle group-hover:text-fg transition-colors">
                            VER +
                          </span>
                        </div>
                        <div className="space-y-1">
                          {group.skills.slice(0, 3).map((skill) => (
                            <div key={skill.name} className="flex items-center justify-between font-mono text-[10px]">
                              <span className="text-fg truncate max-w-[140px]">{skill.name}</span>
                              <span className="text-fg-subtle text-[9px] font-semibold">{skill.sfiaLabel.split('·')[1]?.trim() || 'L' + skill.sfiaLevel}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-1 border-t border-border/60 text-[9px] font-mono text-fg-subtle text-right">
                          {group.skills.length} tecnologías · SFIA L{Math.max(...group.skills.map(s => s.sfiaLevel))} máx
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Columna Derecha: Panorama Global de Producción */}
                <div className="p-5 md:p-6 border border-border-strong bg-bg-subtle flex flex-col justify-center space-y-4 h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-2 font-mono text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        <span className="text-fg font-bold tracking-wider uppercase">
                          {t.hero.skillsGlobalOverview.title}
                        </span>
                      </div>
                      <span className="text-fg-subtle text-[10px] tracking-wider uppercase">
                        [ {t.hero.skillsGlobalOverview.tag} ]
                      </span>
                    </div>

                    <p className="font-sans text-xs text-fg leading-relaxed">
                      {t.hero.skillsGlobalOverview.profileSummary}
                    </p>

                    <div className="p-2.5 border border-border bg-bg font-mono text-[10px] text-fg-muted space-y-1">
                      <span className="text-fg font-bold block">// ALCANCE SFIA VERIFICABLE:</span>
                      <p className="leading-relaxed">{t.hero.skillsGlobalOverview.sfiaScope}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px] pt-1">
                      {t.hero.skillsGlobalOverview.productionHighlights.map((hl, i) => (
                        <div
                          key={i}
                          className="px-2 py-1 border border-border bg-bg text-fg font-medium tracking-wide flex items-center gap-1.5"
                        >
                          <span className="text-emerald-500 font-bold"></span>
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="font-mono text-[10px] text-fg-subtle border-t border-border pt-2.5">
                     {t.hero.skillsGlobalOverview.calloutHint}
                  </p>
                </div>
              </motion.div>
            ) : selectedCategory && insight ? (
              /* Vista filtrada: Habilidades a la izquierda + Informe profundo a la derecha */
              <motion.div
                key={selectedCategory.category}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch min-h-[490px] md:min-h-[470px]"
              >
                {/* Columna Izquierda: Barras de dominio con 7 segmentos SFIA */}
                <div className="space-y-3 p-5 border border-border bg-bg-subtle/30 flex flex-col justify-center h-full">
                  <div>
                    <div className="flex items-center justify-between border-b border-border pb-2 mb-2.5">
                      <span className={`font-mono text-xs font-bold uppercase tracking-widest ${selectedCategory.color}`}>
                        {selectedCategory.category}
                      </span>
                      <span className="font-mono text-[10px] text-fg-subtle">
                        [ {selectedCategory.skills.length} TECNOLOGÍAS ]
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedCategory.skills.map((skill, idx) => (
                        <SkillBar
                          key={skill.name}
                          name={skill.name}
                          sfiaLevel={skill.sfiaLevel}
                          sfiaLabel={skill.sfiaLabel}
                          barColor={selectedCategory.barColor}
                          delay={0.03 + idx * 0.02}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/80 font-mono text-[10px] text-fg-subtle flex justify-between">
                    <span>Nivel máx: SFIA L{Math.max(...selectedCategory.skills.map(s => s.sfiaLevel))}</span>
                    <span>7 niveles de escala</span>
                  </div>
                </div>

                {/* Columna Derecha: Informe de Experiencia en Producción & Enfoque */}
                <div className="p-5 md:p-6 border border-border-strong bg-bg-subtle space-y-3.5 flex flex-col justify-center h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-2 font-mono text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <span className="text-fg font-bold tracking-wider uppercase">
                          {insight.title}
                        </span>
                      </div>
                      <span className="text-fg-subtle text-[10px] tracking-wider uppercase">
                        [ {insight.tag} ]
                      </span>
                    </div>

                    {/* Stack y capacidades */}
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold text-fg uppercase tracking-wider block">
                        // QUÉ MANEJO EN ESTA ÁREA:
                      </span>
                      <p className="font-sans text-xs text-fg leading-relaxed">
                        {insight.capabilities}
                      </p>
                    </div>

                    {/* Dónde y cómo se ha aplicado */}
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold text-fg uppercase tracking-wider block">
                        // CASOS REALES EN PRODUCCIÓN:
                      </span>
                      <p className="font-sans text-xs text-fg-muted leading-relaxed">
                        {insight.productionCases}
                      </p>
                    </div>

                    {/* Criterio y por qué */}
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold text-fg uppercase tracking-wider block">
                        // POR QUÉ ESTE CRITERIO TÉCNICO:
                      </span>
                      <p className="font-sans text-xs text-fg-muted leading-relaxed">
                        {insight.engineeringRationale}
                      </p>
                    </div>
                  </div>

                  {/* Highlights pills */}
                  <div className="pt-2 border-t border-border flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {insight.keyHighlights.map((hl, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 border border-border bg-bg text-fg font-medium tracking-wide"
                      >
                        + {hl}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Disclaimer */}
        <p className="font-mono text-[10px] text-fg-subtle border-l-2 border-border pl-3 leading-relaxed">
          {t.hero.skillsDisclaimer}
        </p>
      </ScrollReveal>
    </div>
  );
};

// ─── Main Hero component ──────────────────────────────────────────────────────
export const Hero: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [showSkills, setShowSkills] = useState(false);

  const todayEdition = new Intl.DateTimeFormat(t.hero.dateLocale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date()).replace(/\./g, '').toUpperCase();

  const handleToggleSkills = (forcedState?: boolean) => {
    const nextState = typeof forcedState === 'boolean' ? forcedState : !showSkills;
    setShowSkills(nextState);

    if (nextState) {
      // Auto-scroll suave anclado al botón superior para mantener el botón visible
      setTimeout(() => {
        const target = document.getElementById('skills-toggle-anchor');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    } else {
      setTimeout(() => {
        const target = document.getElementById('skills-toggle-anchor');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between space-y-14">
      {/* Contenido Principal */}
      <div className="space-y-14">
        {/* Encabezado Estilo Diario / Gaceta */}
        <FadeUp
          keyTrigger={language}
          yOffset={6}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border pb-4 font-mono text-xs text-fg-muted"
        >
          <div className="flex items-center space-x-2">
            <span className="text-fg font-semibold">00 /</span>
            <span className="tracking-wider uppercase font-medium">{t.hero.sectionTag}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-[11px] font-medium tracking-wider uppercase">
            <span className="text-fg-subtle">
              [ {t.hero.role} ]
            </span>
            <span className="text-border-strong hidden sm:inline">|</span>
            <span className="text-fg-muted">
              [ {t.hero.editionPrefix} {todayEdition} ]
            </span>
          </div>
        </FadeUp>

        {/* Titular Principal */}
        <div className="space-y-6 min-h-[5.5rem] sm:min-h-[6.5rem] md:min-h-[7.5rem] flex items-center">
          <TypewriterText
            as="h1"
            text={t.hero.headline}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-medium tracking-tight text-fg leading-[1.2] block"
            typingSpeed={12}
            erasingSpeed={7}
          />
        </div>

        {/* Introducción */}
        <FadeUp
          keyTrigger={language}
          delay={0.06}
          yOffset={10}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base text-fg-muted leading-relaxed font-sans">
            <p>{t.hero.intro1}</p>
            <p>{t.hero.intro2}</p>
          </div>

          {/* Ancla y botón principal DOMINIO TÉCNICO */}
          <div id="skills-toggle-anchor" className="pt-2 scroll-mt-6">
            <button
              onClick={() => handleToggleSkills()}
              aria-expanded={showSkills}
              className="group inline-flex items-center gap-2.5 px-5 py-3 border border-border-strong bg-fg text-bg hover:bg-bg hover:text-fg hover:border-border-strong font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-xs active:translate-y-0.5"
            >
              <BarChart2 className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>
                {showSkills ? t.hero.toggleSkillsClose : t.hero.toggleSkillsOpen}
              </span>
            </button>
          </div>
        </FadeUp>

        {/* DOMINIO TÉCNICO & ARSENAL SFIA (Colapsable / Expandible) */}
        <AnimatePresence>
          {showSkills && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <SkillsSection />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pilares / Cómo Trabajo */}
        <div id="enfoque-ingenieria" className="scroll-mt-8">
          <ScrollReveal yOffset={24} className="bg-bg-subtle border border-border p-6 md:p-8 space-y-6">
          <FadeUp keyTrigger={language} className="space-y-6">
            <div className="flex items-center justify-between font-mono text-xs text-fg-muted border-b border-border pb-3">
              <div className="flex items-center space-x-2.5">
                <Code2 className="w-4 h-4 text-fg-muted" />
                <span className="tracking-wider uppercase text-fg font-semibold">
                  {t.hero.pillarsHeader}
                </span>
              </div>
              <span className="text-[10px] text-fg-subtle tracking-wider uppercase font-medium">
                {t.hero.pillarsTag}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono">
              {t.hero.pillars.map((pillar, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.42,
                    delay: 0.08 + idx * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="space-y-1.5 p-2 -m-2 rounded transition-colors hover:bg-bg/40"
                >
                  <div className="flex items-baseline space-x-2 text-xs text-fg font-semibold">
                    <span className="text-fg-subtle text-[10px]">0{idx + 1}.</span>
                    <span className="tracking-wider uppercase">{pillar.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-fg-muted font-sans pl-5">
                    {pillar.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </FadeUp>
        </ScrollReveal>
        </div>
      </div>

      {/* Navegación fijada al suelo */}
      <div className="mt-auto pt-10">
        <SectionFooterNav />
      </div>
    </div>
  );
};



