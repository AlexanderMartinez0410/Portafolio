import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ProjectFilterCategory, Project, CatalogProject } from '../types';
import { ProjectVisual } from './ProjectVisual';
import { SectionFooterNav } from './SectionFooterNav';
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers, CheckCircle2, BookOpen, Lock, Hammer, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { translations, getLocalizedProjects, getLocalizedCatalog } from '../i18n/translations';
import { FadeUp } from './FadeUp';
import { AnimatedCounter } from './AnimatedCounter';
import { SpotlightCard } from './SpotlightCard';
import { StudyCaseModal } from './StudyCaseModal';
import { getStudyCaseForProject } from '../data/studyCases';

export const Projects: React.FC = () => {
  const { language } = useLanguage();
  const { currentRoute, navigateTo } = useNavigation();
  const t = translations[language];
  const localizedProjects = getLocalizedProjects(language);
  const localizedCatalog = getLocalizedCatalog(language);

  // El catálogo y el caso de estudio activo se derivan directamente de la URL (Single Source of Truth, 0 cascading renders)
  const showCatalogView = Boolean(currentRoute.section === 'proyectos' && currentRoute.params.catalog);

  const activeStudyCaseProject =
    currentRoute.section === 'proyectos' && currentRoute.params.studyCaseId
      ? [...localizedProjects, ...localizedCatalog].find((p) => p.id === currentRoute.params.studyCaseId) || null
      : null;

  const [selectedCategory, setSelectedCategory] = useState<ProjectFilterCategory>('all');
  const [expandedImage, setExpandedImage] = useState<{ src: string; title: string } | null>(null);
  const scrollPosRef = useRef<number>(0);

  const activeStudyCase = activeStudyCaseProject ? getStudyCaseForProject(activeStudyCaseProject, language) : null;

  // Manejar tecla ESC para cerrar el lightbox de imagen expandida
  useEffect(() => {
    if (!expandedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedImage]);

  const handleOpenStudyCase = (project: Project | CatalogProject) => {
    if (showCatalogView) {
      navigateTo(`/proyectos/catalogo/caso-estudio/${project.id}`);
    } else {
      navigateTo(`/proyectos/caso-estudio/${project.id}`);
    }
  };

  const handleCloseStudyCase = () => {
    if (showCatalogView) {
      navigateTo('/proyectos/catalogo');
    } else {
      navigateTo('/proyectos');
    }
  };

  const handleOpenCatalog = () => {
    const container = document.querySelector('div.overflow-y-auto');
    if (container) {
      scrollPosRef.current = container.scrollTop;
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
    navigateTo('/proyectos/catalogo');
  };

  const handleBackToTriad = () => {
    navigateTo('/proyectos');
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

  return (
    <>
      <AnimatePresence mode="wait">
      {showCatalogView ? (
        <motion.div
          key="catalog-view"
          initial={{ opacity: 0, y: 14, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.995 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col justify-between space-y-12 w-full"
        >
          <div className="space-y-8 w-full">
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
            <FadeUp keyTrigger={language} yOffset={6} className="max-w-4xl space-y-2">
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

            {/* Grid de Tarjetas del Catálogo con Linterna / Spotlight ocupando todo el ancho */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2 w-full">
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

                    {item.imageSrc && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setExpandedImage({ src: item.imageSrc!, title: item.title });
                        }}
                        className="overflow-hidden border border-border bg-bg-subtle aspect-video group/img relative rounded-sm my-1 cursor-pointer select-none"
                        title={language === 'es' ? 'Haz clic para ampliar la captura' : 'Click to expand image'}
                      >
                        <img
                          src={item.imageSrc}
                          alt={item.title}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 text-white font-mono text-[11px] font-semibold backdrop-blur-[1px] pointer-events-none">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>[ {language === 'es' ? 'AMPLIAR CAPTURA' : 'EXPAND IMAGE'} ]</span>
                        </div>
                      </div>
                    )}

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

                  {/* Bottom: Rol, Stack Tecnológico, Metodologías, Año y Botón Caso de Estudio */}
                  <div className="pt-3 border-t border-border space-y-3">
                    {item.role && (
                      <div className="text-[10px] font-mono font-semibold text-purple-600 dark:text-purple-400">
                        // {item.role}
                      </div>
                    )}

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

                    {item.methodologies && item.methodologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {item.methodologies.map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="px-1.5 py-0.5 border border-purple-500/20 bg-purple-500/5 text-[9px] font-mono text-purple-600 dark:text-purple-300 font-medium tracking-tight"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenStudyCase(item);
                          }}
                          className="py-1 px-2.5 border border-border hover:border-purple-500 bg-bg text-[10px] font-mono font-semibold text-fg hover:text-purple-600 dark:hover:text-purple-400 flex items-center space-x-1.5 transition-all shadow-sm"
                        >
                          <BookOpen className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          <span>[ {language === 'es' ? 'CASO DE ESTUDIO' : 'CASE STUDY'} ]</span>
                        </button>

                        {item.githubUrl && (
                          <a
                            href={item.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="py-1 px-2.5 border border-border hover:border-fg bg-bg text-[10px] font-mono font-semibold text-fg hover:text-purple-600 dark:hover:text-purple-400 flex items-center space-x-1.5 transition-all shadow-sm"
                          >
                            <svg className="w-3 h-3 text-fg fill-current shrink-0" viewBox="0 0 24 24">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            <span>[ REPO ]</span>
                          </a>
                        )}
                      </div>

                      {item.year && (
                        <span className="font-mono text-[10px] text-fg-subtle shrink-0">
                          {item.year}
                        </span>
                      )}
                    </div>
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
        </motion.div>
      ) : (
        <motion.div
          key="triad-view"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col justify-between space-y-16 w-full"
        >
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
        <FadeUp keyTrigger={language} delay={0.06} yOffset={12} className="space-y-14">
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
              className="space-y-4 group"
            >
              {/* Barra superior del proyecto */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5 font-mono text-xs">
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
                <ProjectVisual
                  type={project.visualType}
                  title={project.title}
                  imageSrc={project.imageSrc}
                  liveUrl={project.liveUrl}
                />
              </div>

              {/* Ficha técnica estructurada y compacta */}
              <div className="space-y-3.5 pt-3 border-t border-border font-mono text-xs">
                {/* 1. Header de Rol, Año y Formato */}
                <div className="px-3 py-2 border-l-2 border-purple-500 bg-bg-surface/80 border border-border border-l-purple-500 flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 uppercase tracking-widest block font-bold">
                      // {t.projects.roleLabel}
                    </span>
                    <div className="text-xs sm:text-sm font-bold text-fg tracking-tight">
                      {project.role}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-fg-muted font-semibold shrink-0">
                    <span className="text-fg">{project.year}</span>
                    <span className="text-fg-subtle">|</span>
                    <span className="text-[10px] text-fg-subtle">{project.format}</span>
                  </div>
                </div>

                {/* 2. Grid de Tecnologías y Metodologías */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Stack Tecnológico */}
                  <div className="p-3 border border-border bg-bg-subtle/50 space-y-1.5">
                    <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-bold">
                      // {t.projects.techUsed}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 border border-border bg-bg text-[10px] text-fg font-medium uppercase shadow-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metodologías & Arquitectura */}
                  {project.methodologies && project.methodologies.length > 0 && (
                    <div className="p-3 border border-border bg-bg-subtle/50 space-y-1.5">
                      <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-bold">
                        // {t.projects.methodologiesLabel}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {project.methodologies.map((meth, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 border border-purple-500/30 bg-purple-500/10 text-[10px] text-purple-600 dark:text-purple-300 font-medium"
                          >
                            {meth}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Reto y Arquitectura (Challenge & Architecture) */}
                <div className="space-y-2 p-3.5 border border-border bg-bg-surface/50 font-sans">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-widest block font-bold">
                      // {t.projects.challenge}
                    </span>
                    <p className="text-xs sm:text-[13px] text-fg leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-border/60">
                    <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 uppercase tracking-widest block font-semibold">
                      // {language === 'es' ? 'SOLUCIÓN TÉCNICA & IMPACTO' : 'TECHNICAL SOLUTION & IMPACT'}
                    </span>
                    <p className="text-xs text-fg-muted leading-relaxed">
                      {project.summary}
                    </p>
                  </div>
                </div>

                {/* 4. Métricas de Impacto (Directamente debajo de Reto & Solución) */}
                {project.metrics && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 border border-border bg-bg-subtle/60">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="space-y-0.5 px-2.5 py-1.5 bg-bg/80 border border-border/50">
                        <span className="text-[9px] text-fg-subtle uppercase tracking-wider block font-semibold truncate">{m.label}</span>
                        <span className="text-xs font-bold text-fg block truncate">
                          <AnimatedCounter value={m.value} />
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. Botones de Acción */}
                <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => handleOpenStudyCase(project)}
                    className="px-3.5 py-1.5 border border-purple-500/50 hover:border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-semibold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer hover:bg-purple-500/20"
                    title={language === 'es' ? 'Ver Caso de Estudio estructurado estilo Obsidian' : 'View Case Study structured Obsidian-style'}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>[ {language === 'es' ? 'CASO DE ESTUDIO // OBSIDIAN' : 'CASE STUDY // OBSIDIAN'} ]</span>
                  </button>

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 border border-border hover:border-fg bg-bg text-fg font-semibold flex items-center space-x-1.5 transition-all hover:bg-fg hover:text-bg shadow-sm"
                    >
                      <span>{t.projects.viewProject.replace(' ]', '')}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>]</span>
                    </a>
                  ) : project.id === 'bioregistro' ? (
                    <span
                      className="px-2.5 py-1.5 border border-border bg-bg-subtle text-[10px] font-mono text-fg-muted flex items-center space-x-1.5"
                      title="Software privado institucional sujeto a cláusula de confidencialidad"
                    >
                      <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>[ {language === 'es' ? 'SOFTWARE PRIVADO // NDA' : 'PROPRIETARY // NDA'} ]</span>
                    </span>
                  ) : (
                    <span
                      className="px-2.5 py-1.5 border border-border bg-bg-subtle text-[10px] font-mono text-fg-muted flex items-center space-x-1.5"
                      title="Plataforma en fase de desarrollo activo y prototipo funcional"
                    >
                      <Hammer className="w-3 h-3 text-blue-500" />
                      <span>[ {language === 'es' ? 'EN DESARROLLO ACTIVO' : 'IN ACTIVE DEV'} ]</span>
                    </span>
                  )}
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
        </motion.div>
      )}
      </AnimatePresence>

      {/* Modal / Visor de Caso de Estudio estilo Obsidian */}
      <StudyCaseModal
        studyCase={activeStudyCase}
        onClose={handleCloseStudyCase}
      />

      {/* Modal Lightbox de Imagen Expandida */}
      {expandedImage && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md p-4 sm:p-8 flex flex-col justify-between animate-fadeIn cursor-zoom-out select-none"
          onClick={() => setExpandedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Header del Lightbox */}
          <div className="flex items-center justify-between font-mono text-xs text-neutral-300 border-b border-neutral-800 pb-3">
            <div className="flex items-center space-x-3">
              <span className="text-white font-bold tracking-wider uppercase">{expandedImage.title}</span>
              <span className="hidden sm:inline text-neutral-500">// VISTA PREVIA EXPANDIDA</span>
            </div>
            <button
              onClick={() => setExpandedImage(null)}
              className="px-3 py-1 border border-neutral-700 bg-neutral-900 text-white hover:border-white transition-colors cursor-pointer text-xs font-mono flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>[ {language === 'es' ? 'CERRAR ✕' : 'CLOSE ✕'} ]</span>
            </button>
          </div>

          {/* Imagen a Pantalla Completa */}
          <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden">
            <img
              src={expandedImage.src}
              alt={expandedImage.title}
              className="max-w-full max-h-[82vh] object-contain rounded shadow-2xl transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Footer Telemetría */}
          <div className="flex justify-between items-center font-mono text-[10px] text-neutral-500 border-t border-neutral-800 pt-3">
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{language === 'es' ? 'CAPTURA EN ALTA RESOLUCIÓN' : 'HIGH RESOLUTION CAPTURE'}</span>
            </span>
            <span>{language === 'es' ? 'PRESIONA ESC O HAZ CLIC FUERA PARA CERRAR' : 'PRESS ESC OR CLICK OUTSIDE TO CLOSE'}</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

