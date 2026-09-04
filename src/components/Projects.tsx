import React, { useState, useRef, useEffect } from 'react';
import type { ProjectFilterCategory } from '../types';
import { ProjectVisual } from './ProjectVisual';
import { SectionFooterNav } from './SectionFooterNav';
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { translations, getLocalizedProjects, getLocalizedCatalog } from '../i18n/translations';
import { FadeUp } from './FadeUp';
import { AnimatedCounter } from './AnimatedCounter';
import { SpotlightCard } from './SpotlightCard';

export const Projects: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const localizedProjects = getLocalizedProjects(language);
  const localizedCatalog = getLocalizedCatalog(language);

  const [showCatalogView, setShowCatalogView] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ProjectFilterCategory>('all');
  const scrollPosRef = useRef<number>(0);

  const handleOpenCatalog = () => {
    const container = document.querySelector('div.overflow-y-auto');
    if (container) {
      scrollPosRef.current = container.scrollTop;
      container.scrollTo({ top: 0, behavior: 'instant' });
    }
    setShowCatalogView(true);
  };

  const handleBackToTriad = () => {
    setShowCatalogView(false);
  };

  useEffect(() => {
    if (!showCatalogView && scrollPosRef.current > 0) {
      const container = document.querySelector('div.overflow-y-auto');
      if (container) {
        container.scrollTop = scrollPosRef.current;
      }
    }
  }, [showCatalogView]);

  const categories: { id: ProjectFilterCategory; label: string }[] = [
    { id: 'all', label: t.projects.categories.all },
    { id: 'frontend', label: t.projects.categories.frontend },
    { id: 'backend', label: t.projects.categories.backend },
    { id: 'fullstack', label: t.projects.categories.fullstack },
    { id: 'mobile', label: t.projects.categories.mobile },
    { id: 'ai', label: t.projects.categories.ai }
  ];

  const filteredCatalog = selectedCategory === 'all'
    ? localizedCatalog
    : localizedCatalog.filter((p) => p.category === selectedCategory);

  // =========================================================================
  // VISTA DEDICADA DEL CATÁLOGO COMPLETO (IDÉNTICO A EXPERIMENT DETAIL EN LAB)
  // =========================================================================
  if (showCatalogView) {
    return (
      <div className="flex-1 flex flex-col justify-between space-y-12 animate-fadeIn">
        <div className="space-y-8">
          {/* Encabezado Dedicado del Catálogo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border font-mono text-xs text-fg-muted">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToTriad}
                className="px-3 py-1.5 border border-border bg-bg-subtle hover:border-fg hover:text-fg text-fg font-mono text-xs font-semibold flex items-center space-x-2 transition-all group shadow-sm"
                title="Volver a los proyectos destacados"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>{t.projects.backToProjects}</span>
              </button>
              <span className="text-fg font-bold">01.CAT /</span>
              <span className="tracking-wider uppercase font-semibold text-fg">
                {t.projects.catalogTitle}
              </span>
            </div>

            <span className="tracking-wider text-[11px] text-fg-subtle uppercase font-medium">
              [ +<AnimatedCounter value={localizedCatalog.length} /> {language === 'es' ? 'PROYECTOS' : 'PROJECTS'} ]
            </span>
          </div>

          {/* Texto descriptivo del Catálogo */}
          <FadeUp keyTrigger={language} yOffset={6} className="max-w-3xl space-y-2">
            <p className="text-base text-fg-muted leading-relaxed font-sans">
              {t.projects.catalogSubtitle}
            </p>
          </FadeUp>

          {/* Barra de Filtros por Categoría */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
              // {t.projects.filterLabel}
            </span>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count = cat.id === 'all'
                  ? localizedCatalog.length
                  : localizedCatalog.filter((p) => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 border text-xs tracking-wider uppercase font-semibold transition-all ${
                      isActive
                        ? 'border-fg bg-fg text-bg shadow-sm'
                        : 'border-border bg-bg text-fg-muted hover:text-fg hover:border-border-strong'
                    }`}
                  >
                    {cat.label} [{count}]
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de Tarjetas del Catálogo con Linterna / Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {filteredCatalog.map((item) => (
              <SpotlightCard
                key={item.id}
                className="p-6 border border-border bg-bg-subtle flex flex-col justify-between space-y-5 hover:border-fg transition-all group"
              >
                {/* Top: Código, Categoría y Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs border-b border-border pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-fg">{item.code} /</span>
                      <span className="text-[10px] text-fg-subtle uppercase tracking-wider font-semibold">
                        {item.categoryLabel}
                      </span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 border border-border bg-bg text-[9px] font-mono text-fg font-medium tracking-wide uppercase">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-semibold text-fg tracking-tight leading-snug">
                    {item.title}
                  </h4>

                  {/* Reto / Problema */}
                  <p className="text-xs text-fg-muted leading-relaxed font-sans">
                    {item.challenge}
                  </p>

                  {/* Aporte Técnico Destacado */}
                  <div className="p-3 border border-border/70 bg-bg text-xs font-sans text-fg space-y-1">
                    <span className="text-[9px] font-mono font-bold text-fg-subtle uppercase tracking-wider block flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>SOLUCIÓN & APORTE TÉCNICO:</span>
                    </span>
                    <p className="leading-relaxed text-xs text-fg-muted">
                      {item.impact}
                    </p>
                  </div>
                </div>

                {/* Bottom: Stack Tecnológico y Año */}
                <div className="pt-3 border-t border-border space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.stack.map((t, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 border border-border/80 bg-bg text-[10px] font-mono text-fg font-medium tracking-wide"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {item.year && (
                    <div className="font-mono text-[10px] text-fg-subtle text-right">
                      <span>AÑO: {item.year}</span>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Botón inferior para volver a la Tríada */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleBackToTriad}
              className="px-5 py-2.5 border border-border hover:border-fg bg-bg text-xs font-mono text-fg font-semibold flex items-center space-x-2 transition-all group shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>{t.projects.backToProjects}</span>
            </button>
          </div>
        </div>

        {/* Navegación al pie */}
        <div className="mt-auto pt-10">
          <SectionFooterNav />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between space-y-16">
      {/* Contenido Principal */}
      <div className="space-y-16">
        {/* Encabezado de Sección */}
        <FadeUp
          keyTrigger={language}
          yOffset={6}
          className="flex items-center justify-between border-b border-border pb-4 font-mono text-xs text-fg-muted"
        >
          <div className="flex items-center space-x-2">
            <span className="text-fg font-semibold">01 /</span>
            <span className="tracking-wider uppercase font-medium">{t.projects.sectionTag}</span>
          </div>
          <span className="tracking-wider text-[11px] text-fg-subtle uppercase font-medium">
            {t.projects.triadCount(localizedProjects.length)}
          </span>
        </FadeUp>

        {/* Lista de Proyectos Principales (La Tríada) */}
        <FadeUp keyTrigger={language} delay={0.06} yOffset={12} className="space-y-20">
          {localizedProjects.map((project, pIdx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45,
                delay: pIdx === 0 ? 0.05 : 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-6 group"
            >
              {/* Barra superior del proyecto */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3 font-mono text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="text-fg font-bold">{project.index} /</span>
                  <h3 className="text-fg font-semibold tracking-wider uppercase text-xs sm:text-sm">
                    {project.title}
                  </h3>
                </div>
                <span className="text-[11px] text-fg-muted tracking-wider uppercase font-medium">
                  {project.meta}
                </span>
              </div>

              {/* Esquema Visual / Preview */}
              <div className="transition-all duration-300 group-hover:border-border-strong">
                <ProjectVisual type={project.visualType} title={project.title} />
              </div>

              {/* Ficha técnica a dos columnas */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-border">
                {/* Columna izquierda: Tecnologías y Métricas (5 cols) */}
                <div className="md:col-span-5 space-y-4 font-mono text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                      {t.projects.yearType}
                    </span>
                    <div className="flex items-center space-x-3 text-fg font-medium">
                      <span>{project.year}</span>
                      <span className="text-fg-subtle">|</span>
                      <span className="text-fg-muted">{project.format}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                      {t.projects.techUsed}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 border border-border bg-bg-subtle text-[11px] text-fg font-medium tracking-wide uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.metrics && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/70">
                      {project.metrics.map((m, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="text-[9px] text-fg-subtle uppercase tracking-wider block font-semibold">{m.label}</span>
                          <span className="text-[11px] font-bold text-fg block">
                            <AnimatedCounter value={m.value} />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Columna derecha: Reto, Solución y Enlaces (7 cols) */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                      {t.projects.challenge}
                    </span>
                    <p className="text-sm text-fg-muted leading-relaxed font-sans">
                      {project.challenge}
                    </p>
                    <p className="text-xs text-fg-subtle leading-relaxed font-sans">
                      {project.summary}
                    </p>
                  </div>

                  {/* Enlaces de Acción */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-border font-mono text-xs">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-nowrap inline-flex items-center space-x-1.5 text-fg font-semibold hover:text-fg-muted transition-colors group/link"
                    >
                      <span>{t.projects.viewProject.replace(' ]', '')}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      <span>]</span>
                    </a>

                    {project.sourceUrl && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap inline-flex items-center space-x-1.5 text-fg-muted hover:text-fg font-medium transition-colors group/link"
                      >
                        <span>{t.projects.viewCode.replace(' ]', '')}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        <span>]</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </FadeUp>

        {/* ========================================================================= */}
        {/* ACCESO A PANTALLA COMPLETA: CATÁLOGO COMPLETO DE PROYECTOS (+16)           */}
        {/* ========================================================================= */}
        <FadeUp keyTrigger={language} delay={0.1} className="pt-8 border-t border-border">
          <div
            onClick={handleOpenCatalog}
            className="p-6 md:p-8 border border-border bg-bg-subtle hover:border-fg flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all cursor-pointer group shadow-sm"
          >
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 font-mono text-xs text-fg font-semibold">
                <Layers className="w-4 h-4 text-fg-muted group-hover:text-fg transition-colors" />
                <span className="tracking-wider uppercase">{t.projects.catalogTitle}</span>
                <span className="px-2 py-0.5 border border-border bg-bg text-[10px] text-fg-muted font-normal">
                  +<AnimatedCounter value={localizedCatalog.length} /> PROYECTOS
                </span>
              </div>
              <p className="text-xs text-fg-muted font-sans max-w-xl leading-relaxed">
                {t.projects.catalogSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenCatalog();
              }}
              className="self-start sm:self-auto px-5 py-3 border border-border group-hover:border-fg bg-bg text-xs font-mono text-fg font-semibold flex items-center space-x-2 transition-all shadow-sm group-hover:bg-fg group-hover:text-bg"
            >
              <span>{t.projects.openCatalog}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </FadeUp>
      </div>

      {/* Navegación fijada al suelo */}
      <div className="mt-auto pt-10">
        <SectionFooterNav />
      </div>
    </div>
  );
};

