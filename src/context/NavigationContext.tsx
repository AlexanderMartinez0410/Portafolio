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
  { id: 'experiencia', index: '02', label: 'EXPERIENCIA' },
  { id: 'experimentos', index: '03', label: 'EXPERIMENTOS' },
  { id: 'contacto', index: '04', label: 'CONTACTO' },
];

export interface ParsedRoute {
  section: SectionId;
  subPath: string | null;
  params: {
    catalog?: boolean;
    studyCaseId?: string;
    experimentId?: string;
    [key: string]: string | boolean | undefined;
  };
  rawHash: string;
}

export function parseHash(rawHash: string): ParsedRoute {
  // Limpiar '#' y slash inicial
  const clean = rawHash.replace(/^#\/?/, '').trim();
  if (!clean) {
    return {
      section: 'sobre-mi',
      subPath: null,
      params: {},
      rawHash,
    };
  }

  const segments = clean.split('/').filter(Boolean);
  const candidateSection = segments[0] as SectionId;
  const validSection = NAV_ITEMS.some((item) => item.id === candidateSection)
    ? candidateSection
    : 'sobre-mi';

  const subSegments = segments.slice(1);
  const subPath = subSegments.length > 0 ? subSegments.join('/') : null;
  const params: ParsedRoute['params'] = {};

  if (validSection === 'proyectos') {
    if (subSegments[0] === 'catalogo') {
      params.catalog = true;
      if (subSegments[1] === 'caso-estudio' && subSegments[2]) {
        params.studyCaseId = subSegments[2];
      }
    } else if (subSegments[0] === 'caso-estudio' && subSegments[1]) {
      params.studyCaseId = subSegments[1];
    }
  } else if (validSection === 'experimentos') {
    if (subSegments[0]) {
      params.experimentId = subSegments[0];
    }
  }

  return {
    section: validSection,
    subPath,
    params,
    rawHash,
  };
}

export function formatHash(section: SectionId, subPath?: string | null): string {
  if (subPath) {
    const cleanSub = subPath.replace(/^\//, '');
    return `#/${section}/${cleanSub}`;
  }
  return `#/${section}`;
}

interface NavigationContextType {
  activeSection: SectionId;
  currentRoute: ParsedRoute;
  setActiveSection: (section: SectionId) => void;
  navigateTo: (routeOrSection: string) => void;
  goToNextSection: () => void;
  goToPrevSection: () => void;
  currentNavIndex: number;
  direction: number;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [direction, setDirection] = useState<number>(1);

  const [currentRoute, setCurrentRoute] = useState<ParsedRoute>(() => {
    if (typeof window !== 'undefined') {
      return parseHash(window.location.hash);
    }
    return {
      section: 'sobre-mi',
      subPath: null,
      params: {},
      rawHash: '',
    };
  });

  const activeSection = currentRoute.section;

  const navigateTo = (routeOrSection: string) => {
    if (typeof window === 'undefined') return;

    let targetHash = routeOrSection;
    if (!targetHash.startsWith('#')) {
      targetHash = targetHash.startsWith('/') ? `#${targetHash}` : `#/${targetHash}`;
    }

    const parsed = parseHash(targetHash);
    const newIndex = NAV_ITEMS.findIndex((item) => item.id === parsed.section);
    const oldIndex = NAV_ITEMS.findIndex((item) => item.id === activeSection);
    if (newIndex !== -1 && oldIndex !== -1 && newIndex !== oldIndex) {
      setDirection(newIndex > oldIndex ? 1 : -1);
    }

    window.location.hash = targetHash;
    setCurrentRoute(parsed);
  };

  const setActiveSection = (section: SectionId) => {
    navigateTo(section);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      const newIndex = NAV_ITEMS.findIndex((item) => item.id === parsed.section);
      const oldIndex = NAV_ITEMS.findIndex((item) => item.id === currentRoute.section);
      if (newIndex !== -1 && oldIndex !== -1 && newIndex !== oldIndex) {
        setDirection(newIndex > oldIndex ? 1 : -1);
      }
      setCurrentRoute(parsed);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentRoute.section]);

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
        currentRoute,
        setActiveSection,
        navigateTo,
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
