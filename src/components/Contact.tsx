import React, { useState } from 'react';
import { authorProfile } from '../data/manifesto';
import { SectionFooterNav } from './SectionFooterNav';
import { Colophon } from './Colophon';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { TypewriterText } from './TypewriterText';
import { FadeUp } from './FadeUp';
import { ContactTriageBot } from './ContactTriageBot';
import { getObfuscatedContact } from '../utils/security';

export const Contact: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    const { email } = getObfuscatedContact();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const handleOpenMailto = () => {
    const { email } = getObfuscatedContact();
    const subject = encodeURIComponent(language === 'es' ? 'Oportunidad / Consulta // Portafolio Alexander Martínez' : 'Opportunity / Inquiry // Alexander Martínez Portfolio');
    window.location.href = `mailto:${email}?subject=${subject}`;
  };

  return (
    <div className="flex-1 flex flex-col justify-between space-y-12">
      {/* Contenido Principal */}
      <div className="space-y-12">
        {/* Encabezado */}
        <FadeUp keyTrigger={language} yOffset={6} className="flex items-center justify-between border-b border-border pb-4 font-mono text-xs text-fg-muted">
          <div className="flex items-center space-x-2">
            <span className="text-fg font-semibold">04 /</span>
            <span className="tracking-wider uppercase font-medium">{t.contact.sectionTag}</span>
          </div>
          <span className="tracking-wider text-[11px] text-fg-subtle uppercase font-medium">
            {t.contact.tag}
          </span>
        </FadeUp>

        {/* Titular */}
        <div className="space-y-4 max-w-3xl">
          <TypewriterText
            as="h2"
            text={t.contact.headline}
            className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-fg leading-tight block"
            typingSpeed={14}
            erasingSpeed={8}
          />
          <FadeUp keyTrigger={language} delay={0.06} yOffset={8}>
            <p className="text-base text-fg-muted leading-relaxed font-sans">
              {t.contact.subheadline}
            </p>
          </FadeUp>
        </div>

        {/* Asistente Guiado de Triage & Despacho */}
        <FadeUp keyTrigger={language} delay={0.1} yOffset={10}>
          <ContactTriageBot />
        </FadeUp>

        {/* Tarjeta de Correo Directo (Ofuscada contra Web-Scraping) */}
        <FadeUp keyTrigger={language} delay={0.12} yOffset={10} className="p-6 md:p-8 bg-bg-subtle border border-border space-y-4">
          <div className="flex items-center justify-between font-mono text-[10px] text-fg-subtle uppercase tracking-widest font-semibold border-b border-border/60 pb-2">
            <span>{t.contact.directEmail}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[9px] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>// {language === 'es' ? 'PROTEGIDO CONTRA BOTS' : 'SCRAPER PROTECTED'}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-base sm:text-xl font-semibold font-mono tracking-tight text-fg flex items-center space-x-2">
                <span>alexander.martinez</span>
                <span className="text-fg-subtle font-normal">[at]</span>
                <span>dev</span>
              </div>
              <p className="text-xs text-fg-muted font-sans">
                {language === 'es'
                  ? 'Dirección protegida contra crawlers de spam. Ábrela directamente o cópiala al portapapeles.'
                  : 'Address protected against automated spam harvesters. Open directly or copy to clipboard.'}
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={handleOpenMailto}
                className="min-h-[44px] px-4 py-2.5 bg-fg text-bg hover:opacity-90 text-xs font-mono font-semibold flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
                title="Abrir en tu cliente de correo"
              >
                <span>[ {language === 'es' ? 'ABRIR CORREO' : 'OPEN EMAIL'} ]</span>
              </button>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="min-h-[44px] px-4 py-2.5 border border-border hover:border-fg bg-bg text-xs font-mono text-fg flex items-center space-x-2 transition-all font-semibold shadow-sm cursor-pointer"
                aria-label={t.contact.copyEmail}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 tracking-wider">{t.contact.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-fg-muted group-hover:text-fg transition-colors" />
                    <span className="tracking-wider">{t.contact.copyEmail}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </FadeUp>

        {/* Tarjeta de Estado & Disponibilidad */}
        <FadeUp keyTrigger={language} delay={0.14} yOffset={10} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 border border-border bg-bg-surface space-y-1.5 font-mono text-xs">
            <span className="text-[10px] text-fg-subtle uppercase tracking-wider block font-semibold">
              // {language === 'es' ? 'DISPONIBILIDAD DE CONTRATACIÓN' : 'CONTRACT AVAILABILITY'}
            </span>
            <div className="flex items-center space-x-2 text-fg font-semibold pt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
              </span>
              <span>{authorProfile.status}</span>
            </div>
          </div>

          <div className="p-5 border border-border bg-bg-surface space-y-1.5 font-mono text-xs">
            <span className="text-[10px] text-fg-subtle uppercase tracking-wider block font-semibold">
              // {language === 'es' ? 'UBICACIÓN & ZONA HORARIA' : 'LOCATION & TIMEZONE'}
            </span>
            <div className="text-fg font-semibold pt-1 truncate">
              <span>{authorProfile.location}</span>
            </div>
          </div>
        </FadeUp>

        {/* Enlaces de perfiles */}
        <FadeUp keyTrigger={language} delay={0.16} yOffset={10} className="space-y-3 pt-2 font-mono text-xs">
          <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
            {t.contact.profilesTitle}
          </span>
          <div className="flex flex-wrap gap-3 sm:gap-6 pt-2">
            <a
              href={authorProfile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3.5 py-2 border border-border bg-bg hover:border-fg inline-flex items-center space-x-1.5 text-fg font-semibold hover:text-fg-muted transition-all group shadow-sm"
            >
              <span>[ GITHUB</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>]</span>
            </a>

            <a
              href={authorProfile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3.5 py-2 border border-border bg-bg hover:border-fg inline-flex items-center space-x-1.5 text-fg font-semibold hover:text-fg-muted transition-all group shadow-sm"
            >
              <span>[ LINKEDIN</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>]</span>
            </a>

            <a
              href={authorProfile.dossierUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3.5 py-2 border border-border bg-bg hover:border-fg inline-flex items-center space-x-1.5 text-fg font-semibold hover:text-fg-muted transition-all group shadow-sm"
            >
              <span>{t.contact.cvDownload.replace(' ]', '')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>]</span>
            </a>
          </div>
        </FadeUp>
      </div>

      {/* Pie fijado al suelo */}
      <div className="mt-auto pt-10 space-y-4">
        <SectionFooterNav />
        <Colophon />
      </div>
    </div>
  );
};
