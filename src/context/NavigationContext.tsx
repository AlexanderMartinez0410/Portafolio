import React, { createContext, useContext, useState, useEffect } from 'react';

export type SectionId = 'sobre-mi' | 'proyectos' | 'experimentos' | 'experiencia' | 'contacto';

export interface NavItem {
  id: SectionId;
  index: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'sobre-mi', index: '00', label: 'SOBRE MÍ' },
  { id: 'proyectos', index: '01', label: 'PROYECTOS' },
  { id: 'experimentos', index: '02', label: 'EXPERIMENTOS' },
  { id: 'experiencia', index: '03', label: 'EXPERIENCIA' },
  { id: 'contacto', index: '04', label: 'CONTACTO' },
];

interface NavigationContextType {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  goToNextSection: () => void;
  goToPrevSection: () => void;
  currentNavIndex: number;
  direction: number;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [direction, setDirection] = useState<number>(1);
  const [activeSection, setActiveSectionState] = useState<SectionId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as SectionId;
      const valid = NAV_ITEMS.some((item) => item.id === hash);
      if (valid) return hash;
    }
    return 'sobre-mi';
  });

  const setActiveSection = (section: SectionId) => {
    const newIndex = NAV_ITEMS.findIndex((item) => item.id === section);
    const oldIndex = NAV_ITEMS.findIndex((item) => item.id === activeSection);
    if (newIndex !== -1 && oldIndex !== -1 && newIndex !== oldIndex) {
      setDirection(newIndex > oldIndex ? 1 : -1);
    }
    setActiveSectionState(section);
    if (typeof window !== 'undefined') {
      window.location.hash = section;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as SectionId;
      const valid = NAV_ITEMS.some((item) => item.id === hash);
      if (valid && hash !== activeSection) {
        const newIndex = NAV_ITEMS.findIndex((item) => item.id === hash);
        const oldIndex = NAV_ITEMS.findIndex((item) => item.id === activeSection);
        if (newIndex !== -1 && oldIndex !== -1) {
          setDirection(newIndex > oldIndex ? 1 : -1);
        }
        setActiveSectionState(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeSection]);

  const currentNavIndex = NAV_ITEMS.findIndex((item) => item.id === activeSection);

  const goToNextSection = () => {
    if (currentNavIndex < NAV_ITEMS.length - 1) {
      setActiveSection(NAV_ITEMS[currentNavIndex + 1].id);
    }
  };

  const goToPrevSection = () => {
    if (currentNavIndex > 0) {
      setActiveSection(NAV_ITEMS[currentNavIndex - 1].id);
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        activeSection,
        setActiveSection,
        goToNextSection,
        goToPrevSection,
        currentNavIndex,
        direction
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
