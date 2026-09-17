import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Check, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { getObfuscatedContact } from '../utils/security';

export const QuickContactRail: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const contactItems = [
    {
      id: 'email',
      icon: Mail,
      label: t.quickContact.emailTooltip,
      sublabel: language === 'es' ? 'Abrir Correo Seguro' : 'Open Secure Email',
      colorHover: 'hover:text-amber-500 dark:hover:text-amber-400',
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: t.quickContact.whatsappTooltip,
      sublabel: language === 'es' ? 'Abrir WhatsApp Directo' : 'Open Direct WhatsApp',
      colorHover: 'hover:text-emerald-500 dark:hover:text-emerald-400',
    },
    {
      id: 'phone',
      icon: Phone,
      label: t.quickContact.phoneTooltip,
      sublabel: language === 'es' ? 'Llamar o Copiar' : 'Call or Copy',
      colorHover: 'hover:text-blue-500 dark:hover:text-blue-400',
    },
  ];

  const handleItemClick = (itemId: string) => {
    const { email, phone } = getObfuscatedContact();

    // 1. Teléfono: Copiar al portapapeles y lanzar marcador
    if (itemId === 'phone') {
      navigator.clipboard.writeText(phone);
      showToast(`${t.quickContact.phoneTooltip} (${t.quickContact.copied})`);
      try {
        window.location.assign(`tel:${phone}`);
      } catch {
        // Fallback silencioso
      }
      return;
    }

    // 2. Correo: Abrir en Gmail Web Compose dinámicamente y copiar al portapapeles
    if (itemId === 'email') {
      const emailSubject = encodeURIComponent(
        language === 'es' 
          ? 'Oportunidad / Consulta // Portafolio Alexander Martínez' 
          : 'Opportunity / Inquiry // Alexander Martínez Portfolio'
      );
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${emailSubject}`;
      navigator.clipboard.writeText(email);
      showToast(language === 'es' ? 'Abriendo correo...' : 'Opening email...');
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 3. WhatsApp: Abrir chat dinámicamente
    if (itemId === 'whatsapp') {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const encodedGreeting = encodeURIComponent(t.quickContact.whatsappGreeting);
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedGreeting}`;
      showToast(language === 'es' ? 'Abriendo WhatsApp...' : 'Opening WhatsApp...');
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {/* Toast Flotante de Confirmación */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex items-center space-x-2 px-4 py-2.5 bg-bg-surface border-2 border-border-strong text-fg font-mono text-xs shadow-2xl pointer-events-none"
          >
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="tracking-wider uppercase font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Riel Flotante Lateral Derecho (HUD) */}
      <aside
        aria-label={t.sidebar.directContact}
        className="fixed right-3 sm:right-5 md:right-6 bottom-5 md:bottom-7 z-40 flex flex-col items-center bg-bg/90 dark:bg-bg/95 backdrop-blur-md border border-border shadow-lg transition-all duration-200 select-none rounded-sm"
      >
        {/* Botón de Colapsar / Desplegar para nunca estorbar la pantalla */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full py-1.5 px-2 flex items-center justify-center gap-1 font-mono text-[9px] text-fg-subtle hover:text-fg hover:bg-bg-subtle transition-colors border-b border-border/50 focus:outline-none cursor-pointer"
          title={isCollapsed ? 'Mostrar canales de contacto' : 'Minimizar canales'}
          aria-label={isCollapsed ? 'Desplegar contacto directo' : 'Minimizar contacto directo'}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? (
            <div className="flex items-center space-x-1 py-0.5">
              <MessageSquare className="w-3.5 h-3.5 text-fg" />
              <ChevronUp className="w-3 h-3" />
            </div>
          ) : (
            <div className="flex items-center justify-between w-full space-x-2">
              <span className="font-bold tracking-widest uppercase text-[8px] text-fg-subtle">
                {t.quickContact.directLabel}
              </span>
              <ChevronDown className="w-3 h-3 text-fg-subtle hover:text-fg" />
            </div>
          )}
        </button>

        {/* Canales de Contacto (Botones Circulares Sin Href Estático) */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-1.5 flex flex-col items-center gap-2 overflow-hidden"
            >
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="relative group flex items-center">
                    {/* Botón Circular: Al hacer clic ABRE DIRECTAMENTE Y COPIA AL PORTAPAPELES SIN EXPONER URL EN HOVER */}
                    <button
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-bg hover:bg-bg-subtle hover:border-border-strong text-fg-muted ${item.colorHover} flex items-center justify-center transition-all duration-200 focus:outline-none shadow-sm hover:scale-105 active:scale-95 cursor-pointer`}
                      aria-label={item.label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>

                    {/* Micro-Tooltip a la izquierda */}
                    <div className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-3 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 flex items-center z-50">
                      <div className="px-2.5 py-1.5 bg-bg-surface/95 backdrop-blur-md border border-border-strong text-fg shadow-xl whitespace-nowrap font-mono">
                        <div className="flex items-center space-x-1.5 text-[10px] font-bold tracking-wider uppercase">
                          <span>[</span>
                          <span className="text-fg">{item.label}</span>
                          <span>]</span>
                        </div>
                        <div className="text-[9px] text-fg-muted tracking-tight font-normal truncate max-w-[200px]">
                          {item.id === 'phone' ? `${item.sublabel} (Clic para copiar)` : item.sublabel}
                        </div>
                      </div>
                      <div className="w-1.5 h-1.5 bg-bg-surface border-t border-r border-border-strong rotate-45 -ml-1" />
                    </div>
                  </div>
                );
              })}

              {/* Indicador de Disponibilidad */}
              <div className="w-full pt-1.5 mt-0.5 border-t border-border/50 flex items-center justify-center">
                <span className="relative flex h-1.5 w-1.5" title="En línea // Disponible">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600 dark:bg-emerald-400" />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </>
  );
};

