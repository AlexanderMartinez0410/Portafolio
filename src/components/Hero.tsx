import React from 'react';
import { techStackData } from '../data/manifesto';
import { SectionFooterNav } from './SectionFooterNav';
import { Code2, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { TypewriterText } from './TypewriterText';
import { FadeUp } from './FadeUp';
import { ScrollReveal } from './ScrollReveal';

export const Hero: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const todayEdition = new Intl.DateTimeFormat(t.hero.dateLocale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date()).replace(/\./g, '').toUpperCase();

  const stackCategoryTitles: Record<string, string> = {
    'FRONTEND & CREATIVE ENGINEERING': t.hero.stackCategories.frontend,
    'BACKEND & INTEGRACIÓN FUNCIONAL': t.hero.stackCategories.backend,
    'DATOS, INFRA & HARDWARE': t.hero.stackCategories.data,
    'IA APLICADA & METODOLOGÍA': t.hero.stackCategories.ai,
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

        {/* Titular Principal con Efecto Borrado y Reescritura al Cambiar de Idioma */}
        <div className="space-y-6 min-h-[5.5rem] sm:min-h-[6.5rem] md:min-h-[7.5rem] flex items-center">
          <TypewriterText
            as="h1"
            text={t.hero.headline}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-medium tracking-tight text-fg leading-[1.2] block"
            typingSpeed={12}
            erasingSpeed={7}
          />
        </div>

        {/* Introducción con FadeUp suave al cambiar de idioma */}
        <FadeUp
          keyTrigger={language}
          delay={0.06}
          yOffset={10}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base text-fg-muted leading-relaxed font-sans"
        >
          <p>{t.hero.intro1}</p>
          <p>{t.hero.intro2}</p>
        </FadeUp>

        {/* STACK TECNOLÓGICO */}
        <ScrollReveal yOffset={20} className="space-y-6 pt-4">
          <FadeUp keyTrigger={language} className="space-y-6">
            <div className="flex items-center space-x-2 font-mono text-xs text-fg font-semibold border-b border-border pb-3">
              <Wrench className="w-4 h-4 text-fg-muted" />
              <span className="tracking-wider uppercase">{t.hero.stackHeader}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {techStackData.map((category, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.05 + idx * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="p-4 border border-border bg-bg-subtle space-y-3 flex flex-col justify-between hover:border-border-strong transition-colors"
                >
                  <span className="font-mono text-xs font-semibold text-fg tracking-wider uppercase block border-b border-border pb-2">
                    {stackCategoryTitles[category.title] || category.title}
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {category.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 border border-border bg-bg text-[11px] font-mono text-fg font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeUp>
        </ScrollReveal>

        {/* Pilares / Cómo Trabajo: Al bajar con el scroll sube como un dato suave y escalonado */}
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

      {/* Navegación fijada al suelo */}
      <div className="mt-auto pt-10">
        <SectionFooterNav />
      </div>
    </div>
  );
};
