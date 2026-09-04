import React from 'react';
import { useNavigation, NAV_ITEMS } from '../context/NavigationContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const SectionFooterNav: React.FC = () => {
  const { currentNavIndex, setActiveSection } = useNavigation();
  const { language } = useLanguage();
  const t = translations[language];

  const prevItem = currentNavIndex > 0 ? NAV_ITEMS[currentNavIndex - 1] : null;
  const nextItem = currentNavIndex < NAV_ITEMS.length - 1 ? NAV_ITEMS[currentNavIndex + 1] : null;

  return (
    <div className="pt-12 pb-6 border-t border-border flex items-center justify-between font-mono text-xs">
      <div>
        {prevItem ? (
          <button
            onClick={() => setActiveSection(prevItem.id)}
            className="inline-flex items-center space-x-2 text-fg-muted hover:text-fg transition-colors group py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>[ {t.footerNav.prev}: {prevItem.index} / {t.nav[prevItem.id]} ]</span>
          </button>
        ) : (
          <span className="text-fg-subtle/50 text-[10px]">{t.footerNav.start}</span>
        )}
      </div>

      <div>
        {nextItem ? (
          <button
            onClick={() => setActiveSection(nextItem.id)}
            className="inline-flex items-center space-x-2 text-fg font-semibold hover:text-fg-muted transition-colors group py-2"
          >
            <span>[ {t.footerNav.next}: {nextItem.index} / {t.nav[nextItem.id]} ]</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <span className="text-fg-subtle/50 text-[10px]">{t.footerNav.end}</span>
        )}
      </div>
    </div>
  );
};
