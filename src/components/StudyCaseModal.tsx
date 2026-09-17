import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { StudyCase } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  Copy, 
  Check, 
  FileText, 
  Link2, 
  Terminal, 
  Lightbulb, 
  AlertCircle, 
  Info, 
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';

interface StudyCaseModalProps {
  studyCase: StudyCase | null;
  onClose: () => void;
}

export const StudyCaseModal: React.FC<StudyCaseModalProps> = ({ studyCase, onClose }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [copied, setCopied] = useState<boolean>(false);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Bloquear scroll de fondo al abrir modal
  useEffect(() => {
    if (studyCase) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [studyCase]);

  if (!studyCase) return null;

  // Generar representación en Markdown puro para copiar a Obsidian
  const generateMarkdownForClipboard = () => {
    return `---
type: ${studyCase.frontmatter.type}
role: ${studyCase.frontmatter.role}
status: ${studyCase.frontmatter.status}
created: ${studyCase.frontmatter.created}
tags: [${studyCase.frontmatter.tags.join(', ')}]
technologies: [${(studyCase.frontmatter.technologies || studyCase.frontmatter.stack).join(', ')}]
methodologies: [${(studyCase.frontmatter.methodologies || []).join(', ')}]
complexity: ${studyCase.frontmatter.complexity}
impact: ${studyCase.frontmatter.impact}
---

# ${studyCase.title}

## ${isEn ? '01. Operational Context & Core Challenge' : '01. Contexto Operativo & Reto Crítico'}
${studyCase.contextAndProblem}

## ${isEn ? '02. Architecture & Design Decisions' : '02. Arquitectura & Decisiones Técnicas'}
### ${studyCase.architectureDecision.adrSummary}
\`\`\`text
${studyCase.architectureDecision.diagramAscii ?? ''}
\`\`\`

${studyCase.architectureDecision.keyPoints.map((k) => `- ${k}`).join('\n')}

## ${isEn ? '03. Technical Solution & Core Code' : '03. Solución Técnica & Código Clave'}
${studyCase.technicalSolution.overview}

${studyCase.technicalSolution.snippets
  .map(
    (s) => `### \`${s.filename}\`
\`\`\`${s.language}
${s.code}
\`\`\``
  )
  .join('\n\n')}

## ${isEn ? '04. Technical Challenges & Engineering Fixes' : '04. Retos Técnicos Superados & Solución de Ingeniería'}
${studyCase.challengesAndFixes
  .map((c) => `- **${isEn ? 'Challenge' : 'Reto'}:** ${c.challenge}\n  - **${isEn ? 'Solution' : 'Solución'}:** ${c.solution}`)
  .join('\n\n')}

## ${isEn ? '05. Results, Metrics & Second Brain Connections' : '05. Resultados, Métricas & Conexiones de Segundo Cerebro'}
${studyCase.resultsAndSecondBrainLinks.conclusion}

### Backlinks:
${studyCase.resultsAndSecondBrainLinks.backlinks.map((b) => `- ${b}`).join('\n')}
`;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownForClipboard();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-sm overflow-hidden">
      {/* Backdrop clickeable */}
      <div 
        className="fixed inset-0 bg-transparent cursor-pointer" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }} 
        aria-label="Cerrar modal"
      />

      {/* Contenedor del Modal con Ventana Estilo Obsidian */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="study-case-modal-title"
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-bg border border-border shadow-2xl flex flex-col z-10 overflow-hidden font-sans"
      >
        {/* ========================================================================= */}
        {/* BARRA SUPERIOR DE OBSIDIAN (Pestaña de archivo + Acciones)                 */}
        {/* ========================================================================= */}
        <div className="px-4 py-2.5 bg-bg-subtle border-b border-border flex items-center justify-between font-mono text-xs text-fg-muted shrink-0 select-none">
          {/* Pestaña de Archivo */}
          <div className="flex items-center space-x-2 truncate">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-bg border border-border text-fg font-semibold text-[11px] truncate shadow-sm">
              <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span id="study-case-modal-title" className="truncate">{studyCase.vaultPath.split('/').pop()}</span>
            </div>
            <span className="text-[10px] text-fg-subtle hidden md:inline truncate">
              vault://{studyCase.vaultPath}
            </span>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 border border-border hover:border-fg bg-bg text-fg font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm group cursor-pointer"
              title={isEn ? 'Copy content formatted in Obsidian-compatible Markdown' : 'Copiar contenido en formato Markdown compatible con Obsidian'}
              aria-label={isEn ? 'Copy content in Markdown' : 'Copiar contenido en Markdown'}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">{isEn ? 'Copied' : 'Copiado'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-fg-muted group-hover:text-fg transition-colors" />
                  <span className="hidden sm:inline">{isEn ? 'Copy MD' : 'Copiar MD'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 border border-border hover:border-fg bg-bg text-fg-muted hover:text-fg transition-all cursor-pointer"
              title={isEn ? 'Close window (Esc)' : 'Cerrar ventana (Esc)'}
              aria-label={isEn ? 'Close case study (Escape)' : 'Cerrar caso de estudio (Escape)'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CUERPO PRINCIPAL DE LA NOTA DE SEGUNDO CEREBRO (Scroll Interno)           */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-8 text-fg select-text">
            
            {/* 1. FRONTMATTER YAML (Metadatos Visuales de Obsidian) */}
            <div className="border border-border bg-bg-subtle p-4 sm:p-5 font-mono text-xs space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-[10px] text-fg-subtle border-b border-border pb-2">
                <span className="font-bold tracking-widest text-fg flex items-center space-x-1">
                  <span>---</span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">[ OBSIDIAN FRONTMATTER ]</span>
                  <span>---</span>
                </span>
                <span>YAML METADATA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <div>
                  <span className="text-fg-subtle">role: </span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{studyCase.frontmatter.role}</span>
                </div>
                <div>
                  <span className="text-fg-subtle">status: </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{studyCase.frontmatter.status}</span>
                </div>
                <div>
                  <span className="text-fg-subtle">type: </span>
                  <span className="text-fg font-medium">{studyCase.frontmatter.type}</span>
                </div>
                <div>
                  <span className="text-fg-subtle">created: </span>
                  <span className="text-fg font-mono">{studyCase.frontmatter.created}</span>
                </div>
              </div>

              {/* Tags de Obsidian */}
              <div className="pt-2 border-t border-border/70 flex flex-wrap items-center gap-1.5">
                <span className="text-fg-subtle text-[10px]">tags:</span>
                {studyCase.frontmatter.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-bg border border-border text-[10px] text-purple-600 dark:text-purple-400 font-mono font-medium rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stack Tecnológico */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-fg-subtle text-[10px]">technologies:</span>
                {(studyCase.frontmatter.technologies || studyCase.frontmatter.stack).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-bg border border-border text-[10px] text-fg font-mono font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Metodologías & Arquitectura */}
              {studyCase.frontmatter.methodologies && studyCase.frontmatter.methodologies.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-fg-subtle text-[10px]">methodologies:</span>
                  {studyCase.frontmatter.methodologies.map((meth, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-600 dark:text-purple-300 font-mono font-medium"
                    >
                      {meth}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Título Principal */}
            <div className="space-y-2 border-b border-border pb-5">
              <span className="font-mono text-xs text-fg-subtle uppercase tracking-widest block font-semibold">
                // ARCHITECTURE & ENGINEERING RECORD
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg leading-tight">
                {studyCase.title}
              </h1>
            </div>

            {/* CALLOUTS PERSONALIZADOS (Estilo Obsidian Callouts) */}
            {studyCase.callouts && studyCase.callouts.length > 0 && (
              <div className="space-y-4">
                {studyCase.callouts.map((callout, idx) => {
                  const isImportant = callout.type === 'important';
                  const isTip = callout.type === 'tip';
                  const isWarning = callout.type === 'warning';

                  return (
                    <div
                      key={idx}
                      className={`p-4 border-l-4 border bg-bg-subtle space-y-1 text-xs font-sans ${
                        isImportant
                          ? 'border-l-purple-500 border-border'
                          : isTip
                          ? 'border-l-emerald-500 border-border'
                          : isWarning
                          ? 'border-l-amber-500 border-border'
                          : 'border-l-blue-500 border-border'
                      }`}
                    >
                      <div className="font-mono text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5 text-fg">
                        {isImportant && <Flame className="w-3.5 h-3.5 text-purple-500" />}
                        {isTip && <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />}
                        {isWarning && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                        {!isImportant && !isTip && !isWarning && <Info className="w-3.5 h-3.5 text-blue-500" />}
                        <span>{callout.title ?? `[!${callout.type.toUpperCase()}]`}</span>
                      </div>
                      <p className="text-fg-muted leading-relaxed font-sans pt-0.5">
                        {callout.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ========================================================================= */}
            {/* SECCIÓN 01: CONTEXTO & PROBLEMA                                           */}
            {/* ========================================================================= */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-fg flex items-center space-x-2 border-b border-border pb-2">
                <span className="font-mono text-sm text-fg-subtle">01.</span>
                <span>{isEn ? 'Operational Context & Core Challenge' : 'Contexto Operativo & Reto Crítico'}</span>
              </h2>
              <p className="text-sm sm:text-base text-fg-muted leading-relaxed font-sans">
                {studyCase.contextAndProblem}
              </p>
            </section>

            {/* ========================================================================= */}
            {/* SECCIÓN 02: ARQUITECTURA & ADR                                            */}
            {/* ========================================================================= */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-fg flex items-center space-x-2 border-b border-border pb-2">
                <span className="font-mono text-sm text-fg-subtle">02.</span>
                <span>{studyCase.architectureDecision.adrSummary}</span>
              </h2>

              {/* Diagrama ASCII Arquitectónico */}
              {studyCase.architectureDecision.diagramAscii && (
                <div className="p-4 bg-bg-surface border border-border overflow-x-auto">
                  <pre className="font-mono text-[11px] text-fg leading-tight">
                    <code>{studyCase.architectureDecision.diagramAscii.trim()}</code>
                  </pre>
                </div>
              )}

              {/* Puntos clave */}
              <div className="space-y-2 pt-1">
                <span className="font-mono text-xs font-bold text-fg uppercase tracking-wider block">
                  {isEn ? 'Design Decisions & Applied Principles:' : 'Decisiones de Diseño & Principios Aplicados:'}
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-fg-muted list-disc list-inside font-sans">
                  {studyCase.architectureDecision.keyPoints.map((pt, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* SECCIÓN 03: SOLUCIÓN TÉCNICA & CÓDIGO                                     */}
            {/* ========================================================================= */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-fg flex items-center space-x-2 border-b border-border pb-2">
                <span className="font-mono text-sm text-fg-subtle">03.</span>
                <span>{isEn ? 'Technical Implementation & Core Source Code' : 'Implementación Técnica & Código Fuente Clave'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-fg-muted leading-relaxed font-sans">
                {studyCase.technicalSolution.overview}
              </p>

              {/* Bloques de Código de la Nota */}
              {studyCase.technicalSolution.snippets.map((snippet, sIdx) => (
                <div key={sIdx} className="border border-border bg-bg overflow-hidden shadow-sm">
                  <div className="px-3.5 py-2 bg-bg-subtle border-b border-border flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-fg flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5 text-fg-muted" />
                      <span>{snippet.filename}</span>
                    </span>
                    <span className="text-[10px] text-fg-subtle uppercase">{snippet.language}</span>
                  </div>
                  <pre className="p-4 font-mono text-[11px] leading-relaxed text-fg overflow-x-auto bg-bg select-text">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ))}
            </section>

            {/* ========================================================================= */}
            {/* SECCIÓN 04: RETOS & SOLUCIONES                                            */}
            {/* ========================================================================= */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-fg flex items-center space-x-2 border-b border-border pb-2">
                <span className="font-mono text-sm text-fg-subtle">04.</span>
                <span>{isEn ? 'Technical Challenges Overcome & Solutions' : 'Retos Técnicos Superados & Solución de Ingeniería'}</span>
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {studyCase.challengesAndFixes.map((cf, idx) => (
                  <div key={idx} className="p-4 border border-border bg-bg-subtle space-y-2">
                    <div className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                      <span>{isEn ? `CHALLENGE #${idx + 1}:` : `DESAFÍO #${idx + 1}:`}</span>
                      <span className="text-fg font-sans font-medium">{cf.challenge}</span>
                    </div>
                    <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-start space-x-1.5 pt-1 border-t border-border/60">
                      <span className="shrink-0 font-bold">{isEn ? 'SOLUTION:' : 'SOLUCIÓN:'}</span>
                      <span className="text-fg-muted font-sans font-normal leading-relaxed">{cf.solution}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================================= */}
            {/* SECCIÓN 05: RESULTADOS & BACKLINKS DE SEGUNDO CEREBRO                      */}
            {/* ========================================================================= */}
            <section className="space-y-5 pt-2">
              <h2 className="text-lg font-bold text-fg flex items-center space-x-2 border-b border-border pb-2">
                <span className="font-mono text-sm text-fg-subtle">05.</span>
                <span>{isEn ? 'Results, Metrics & Second Brain Links' : 'Resultados, Métricas & Conexiones del Segundo Cerebro'}</span>
              </h2>

              {/* Grid de Métricas */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {studyCase.resultsAndSecondBrainLinks.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="p-3 border border-border bg-bg-surface space-y-1">
                    <span className="text-[10px] font-mono text-fg-subtle uppercase tracking-wider block font-semibold">
                      {m.label}
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-fg block">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-fg-muted leading-relaxed font-sans">
                {studyCase.resultsAndSecondBrainLinks.conclusion}
              </p>

              {/* Backlinks de Obsidian tipo [[Concepto]] */}
              <div className="p-4 border border-border bg-bg-subtle space-y-2 font-mono text-xs">
                <span className="text-[10px] font-bold text-fg-subtle uppercase tracking-wider flex items-center space-x-1.5">
                  <Link2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{isEn ? 'SECOND BRAIN BACKLINKS & GRAPH CONNECTIONS:' : 'BACKLINKS & CONEXIONES DEL SEGUNDO CEREBRO:'}</span>
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {studyCase.resultsAndSecondBrainLinks.backlinks.map((link, lIdx) => (
                    <span
                      key={lIdx}
                      className="px-2.5 py-1 bg-bg border border-border text-purple-600 dark:text-purple-400 text-xs font-mono font-semibold flex items-center space-x-1 cursor-default hover:border-purple-500 transition-colors"
                    >
                      <span>{link}</span>
                    </span>
                  ))}
                </div>
              </div>
            </section>

          </div>

          {/* ========================================================================= */}
          {/* PIE DEL MODAL CON BOTÓN DE CIERRE                                         */}
          {/* ========================================================================= */}
          <div className="px-5 py-3 bg-bg-subtle border-t border-border flex items-center justify-between font-mono text-xs shrink-0">
            <span className="text-[10px] text-fg-subtle hidden sm:inline">
              {isEn ? 'Press [ESC] to exit or click outside' : 'Presione [ESC] para salir o haga clic fuera'}
            </span>

            <div className="flex items-center space-x-3 ml-auto">
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="px-3.5 py-1.5 border border-border hover:border-fg bg-bg text-fg font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isEn ? 'Copied to clipboard' : 'Copiado al portapapeles') : (isEn ? 'Copy Markdown Note' : 'Copiar Nota en Markdown')}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="px-4 py-1.5 border border-border bg-fg text-bg hover:opacity-90 font-bold transition-opacity cursor-pointer"
              >
                {isEn ? 'Close' : 'Cerrar'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

