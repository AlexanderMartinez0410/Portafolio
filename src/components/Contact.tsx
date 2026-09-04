import React, { useState } from 'react';
import { authorProfile } from '../data/manifesto';
import { SectionFooterNav } from './SectionFooterNav';
import { Colophon } from './Colophon';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { TypewriterText } from './TypewriterText';
import { FadeUp } from './FadeUp';

export const Contact: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(authorProfile.email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
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

        {/* Tarjeta de Correo Directo */}
        <FadeUp keyTrigger={language} delay={0.12} yOffset={10} className="p-6 md:p-8 bg-bg-subtle border border-border space-y-4">
          <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
            {t.contact.directEmail}
          </span>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <a
              href={`mailto:${authorProfile.email}`}
              className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-fg hover:text-fg-muted transition-colors break-all"
            >
              {authorProfile.email}
            </a>

            <button
              onClick={handleCopyEmail}
              className="self-start sm:self-auto px-4 py-2.5 border border-border hover:border-fg bg-bg text-xs font-mono text-fg flex items-center space-x-2 transition-all group font-semibold"
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
        </FadeUp>

        {/* Enlaces de perfiles */}
        <FadeUp keyTrigger={language} delay={0.16} yOffset={10} className="space-y-3 pt-4 font-mono text-xs">
          <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
            {t.contact.profilesTitle}
          </span>
          <div className="flex flex-wrap gap-4 sm:gap-8 pt-2">
            <a
              href={authorProfile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-fg font-semibold hover:text-fg-muted transition-colors group"
            >
              <span>[ GITHUB</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>]</span>
            </a>

            <a
              href={authorProfile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-fg font-semibold hover:text-fg-muted transition-colors group"
            >
              <span>[ LINKEDIN</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>]</span>
            </a>

            <a
              href={authorProfile.dossierUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-fg font-semibold hover:text-fg-muted transition-colors group"
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
