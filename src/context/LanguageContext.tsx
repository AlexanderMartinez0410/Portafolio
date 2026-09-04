import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isSpanish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'portfolio_language';

export const getBrowserDefaultLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const browserLang = (
      navigator.language ||
      (navigator.languages && navigator.languages[0]) ||
      ''
    ).toLowerCase();

    if (browserLang.startsWith('es')) {
      return 'es';
    }
    return 'en';
  }
  return 'es';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (stored === 'es' || stored === 'en') {
        return stored;
      }
      return getBrowserDefaultLanguage();
    }
    return 'es';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isSpanish: language === 'es'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
