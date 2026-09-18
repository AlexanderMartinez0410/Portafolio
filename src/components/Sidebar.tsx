import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, NAV_ITEMS, type SectionId } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { authorProfile } from '../data/manifesto';
import dinoPenguImg from '../assets/Trazo Vectorial.png';
import { Sun, Moon, Menu, X, Languages, Download } from 'lucide-react';
import { motion } from 'motion/react';

export const Sidebar: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const { activeSection, setActiveSection } = useNavigation();
  const { language, setLanguage, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const t = translations[language];

  const handleNavClick = (id: SectionId) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* CABECERA MÓVIL (< 1024px) - Limpia, sin bordes toscos ni solapamientos   */}
      {/* ========================================================================= */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-bg/95 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 py-3 flex items-center justify-between transition-colors">
        {/* Lado Izquierdo: Mascota y Nombre */}
        <button
          onClick={() => handleNavClick('sobre-mi')}
          className="flex items-center space-x-2.5 text-left group focus:outline-none"
        >
          <img
            src={dinoPenguImg}
            alt="DinoPengu Mascota"
            className="w-9 h-9 object-contain mix-blend-multiply dark:mix-blend-screen dark:invert shrink-0"
          />
          <div className="flex flex-col min-w-0 pr-1">
            <span className="text-xs sm:text-sm font-bold tracking-tight uppercase text-fg truncate">
              <span className="sm:hidden">{authorProfile.shortName || 'ALEXANDER MARTÍNEZ'}</span>
              <span className="hidden sm:inline">{authorProfile.name}</span>
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-fg-subtle tracking-wider uppercase font-medium truncate">
              {authorProfile.tagline}
            </span>
          </div>
        </button>

        {/* Lado Derecho: Toggle de Idioma, Toggle de Tema y Hamburguesa */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 font-mono shrink-0">
          {/* Botón de Idioma Móvil */}
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 text-xs border border-border hover:border-border-strong text-fg hover:bg-bg-subtle transition-all focus:outline-none flex items-center space-x-1"
            aria-label="Cambiar idioma"
            title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <Languages className="w-3.5 h-3.5 text-fg-muted" />
            <span className="text-[10px] font-bold tracking-wider">{language === 'es' ? 'EN' : 'ES'}</span>
          </button>

          {/* Botón de Tema Minimalista */}
          <button
            onClick={toggleTheme}
            className="p-2 text-fg-muted hover:text-fg hover:bg-bg-subtle transition-colors focus:outline-none"
            aria-label="Cambiar tema"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Botón Hamburguesa Limpio */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-fg hover:bg-bg-subtle transition-colors focus:outline-none"
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MENÚ MÓVIL FULLSCREEN OVERLAY (Cero solapamiento, tipografía limpia)       */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-bg px-6 py-5 flex flex-col justify-between overflow-y-auto animate-fadeIn select-none">
          {/* Barra Superior del Menú Abierto */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center space-x-2.5">
              <img
                src={dinoPenguImg}
                alt="DinoPengu Mascota"
                className="w-8 h-8 object-contain mix-blend-multiply dark:mix-blend-screen dark:invert shrink-0"
              />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
                {t.sidebar.mobileNavTitle}
              </span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-fg-muted hover:text-fg hover:bg-bg-subtle transition-colors focus:outline-none"
              aria-label={t.sidebar.closeMenu}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Navegación Limpia y Fluida */}
          <nav className="py-8 space-y-3">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left flex items-center justify-between py-3 px-3 transition-colors font-mono text-sm ${
                    isActive
                      ? 'text-fg font-bold bg-bg-subtle'
                      : 'text-fg-muted hover:text-fg hover:bg-bg-subtle/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-fg-subtle text-xs font-semibold">{item.index} /</span>
                    <span className="tracking-wider uppercase text-sm">{t.nav[item.id]}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-fg" />}
                </button>
              );
            })}
          </nav>

          {/* Pie del Menú Móvil */}
          <div className="pt-6 border-t border-border space-y-4">
            <div className="flex items-center space-x-2.5 text-xs font-mono text-fg-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
              </span>
              <span className="font-medium uppercase tracking-wider">{t.sidebar.status}</span>
            </div>

            {/* Selector de Idioma Móvil */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                onClick={() => setLanguage('es')}
                className={`py-2 px-3 border text-center transition-all ${
                  language === 'es'
                    ? 'border-border-strong bg-bg-subtle text-fg font-bold'
                    : 'border-border text-fg-muted hover:text-fg'
                }`}
              >
                [ ESPAÑOL ]
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 border text-center transition-all ${
                  language === 'en'
                    ? 'border-border-strong bg-bg-subtle text-fg font-bold'
                    : 'border-border text-fg-muted hover:text-fg'
                }`}
              >
                [ ENGLISH ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR FIJO DESKTOP (>= 1024px)                                          */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-[22%] xl:w-[24%] min-w-[280px] max-w-[360px] flex-col justify-between p-8 xl:p-10 border-r border-border bg-bg z-30 select-none transition-colors">
        {/* Superior: Mascota Centrada + Nombre y Rol */}
        <div className="space-y-4 flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-full">
            <img
              src={dinoPenguImg}
              alt="DinoPengu Mascota"
              className="w-28 h-28 xl:w-32 xl:h-32 object-contain mx-auto mix-blend-multiply dark:mix-blend-screen dark:invert hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="space-y-1 w-full">
            <button
              onClick={() => handleNavClick('sobre-mi')}
              className="text-center block w-full text-base xl:text-lg font-bold tracking-tight text-fg hover:opacity-80 transition-opacity uppercase"
            >
              {authorProfile.name}
            </button>
            <p className="font-mono text-[11px] leading-relaxed text-fg-muted tracking-wider uppercase font-medium">
              {authorProfile.discipline}
            </p>
          </div>
        </div>

        {/* Medio: Navegación por salas/secciones */}
        <div className="my-auto space-y-3">
          <span className="block font-mono text-[10px] text-fg-subtle uppercase tracking-widest mb-6 font-semibold">
            {t.sidebar.roomNavigation}
          </span>
          <nav className="space-y-1.5 font-mono text-xs relative">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative w-full text-left group flex items-center justify-between py-2.5 px-3 transition-colors duration-150 ${
                    isActive
                      ? 'text-fg font-bold'
                      : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      className="absolute inset-0 border border-border-strong bg-bg-subtle shadow-sm z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center space-x-3">
                    <span
                      className={`transition-opacity ${
                        isActive ? 'text-fg font-bold opacity-100' : 'text-fg-subtle opacity-70 group-hover:opacity-100'
                      }`}
                    >
                      {item.index} /
                    </span>
                    <span className="tracking-wider uppercase">
                      {t.nav[item.id]}
                    </span>
                  </div>
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative z-10 text-[10px] text-fg font-bold tracking-wider"
                    >
                      ●
                    </motion.span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Inferior: Disponibilidad, Modo y Selector de Idioma */}
        <div className="space-y-4 pt-6 border-t border-border">
          {/* Estado de disponibilidad */}
          <div className="flex items-center space-x-2.5 font-mono text-[11px] text-fg-muted">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
            </span>
            <span className="tracking-wider uppercase text-[10px] sm:text-[11px] font-medium">{t.sidebar.status}</span>
          </div>

          {/* Descargar / Ver CV Harvard */}
          <a
            href={language === 'en' ? '/cv_alexander_martinez_en.html' : '/cv_alexander_martinez_es.html'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between py-2 px-3 border border-border hover:border-border-strong bg-bg-subtle text-xs font-mono text-fg transition-all group font-medium"
          >
            <div className="flex items-center space-x-2">
              <Download className="w-3.5 h-3.5 text-fg-muted group-hover:text-fg transition-colors" />
              <span className="tracking-wider text-[11px]">{language === 'en' ? 'HARVARD RESUME' : 'CURRÍCULUM HARVARD'}</span>
            </div>
            <span className="text-[10px] text-fg-subtle group-hover:text-fg transition-colors">[ PDF / ↗ ]</span>
          </a>
          <div className="space-y-1.5">
            <span className="block font-mono text-[10px] text-fg-subtle uppercase tracking-widest font-semibold">
              {t.sidebar.theme}
            </span>
            <button
              onClick={toggleTheme}
              className="w-full text-left py-2 px-3 border border-border hover:border-border-strong bg-bg-subtle text-xs font-mono text-fg flex items-center justify-between transition-all group font-medium"
              title="Cambiar entre modo claro y modo oscuro"
            >
              <div className="flex items-center space-x-2">
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-fg-muted" />}
                <span className="tracking-wider text-[11px]">
                  {isDark ? t.sidebar.themeDark : t.sidebar.themeLight}
                </span>
              </div>
              <span className="text-[10px] text-fg-subtle group-hover:text-fg transition-colors">
                [ ⟳ ]
              </span>
            </button>
          </div>

          {/* Selector de Idioma Minimalista Editorial */}
          <div className="space-y-1.5">
            <span className="block font-mono text-[10px] text-fg-subtle uppercase tracking-widest font-semibold">
              {t.sidebar.language}
            </span>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              <button
                onClick={() => setLanguage('es')}
                className={`py-1.5 px-2 border text-center transition-all ${
                  language === 'es'
                    ? 'border-border-strong bg-bg-subtle text-fg font-bold shadow-sm'
                    : 'border-border text-fg-muted hover:text-fg hover:border-border-strong'
                }`}
              >
                [ ES ]
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`py-1.5 px-2 border text-center transition-all ${
                  language === 'en'
                    ? 'border-border-strong bg-bg-subtle text-fg font-bold shadow-sm'
                    : 'border-border text-fg-muted hover:text-fg hover:border-border-strong'
                }`}
              >
                [ EN ]
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
