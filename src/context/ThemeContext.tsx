import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { ThemeMode } from '../types';
import { playSparkSound, playRepairSound } from '../utils/soundEffects';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  frenzyCount: number;
  isLampBroken: boolean;
  repairLamp: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'museum_portfolio_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to 'light' (Sala Travertino) as required
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    }
    return 'light';
  });

  // Easter Egg: Contador de clics continuos y estado de foco fundido
  const [frenzyCount, setFrenzyCount] = useState<number>(0);
  const [isLampBroken, setIsLampBroken] = useState<boolean>(false);
  const frenzyRef = useRef<number>(0);
  const lastToggleTimeRef = useRef<number>(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const repairLamp = useCallback(() => {
    playRepairSound();
    setIsLampBroken(false);
    frenzyRef.current = 0;
    setFrenzyCount(0);
  }, []);

  const toggleTheme = useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastToggleTimeRef.current;
    lastToggleTimeRef.current = now;

    // Si ya está rota la lámpara, simplemente alternar tema o no hacer sobrecarga
    if (isLampBroken) {
      setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
      return;
    }

    // Cancelar temporizador de enfriamiento previo
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (elapsed < 2400) {
      frenzyRef.current += 1;
    } else {
      frenzyRef.current = 1;
    }

    const nextFrenzy = frenzyRef.current;
    setFrenzyCount(nextFrenzy);

    // Evento raro: Debe acumular al menos 8 clics rápidos consecutivos
    // y la probabilidad por clic es baja (12%), haciéndolo un hallazgo inesperado
    let triggerChance = 0;
    if (nextFrenzy >= 22) {
      triggerChance = 1.0; // Garantizado solo tras insistencia extrema
    } else if (nextFrenzy >= 15) {
      triggerChance = 0.35;
    } else if (nextFrenzy >= 8) {
      triggerChance = 0.12; // Muy raro (12% de chance)
    }

    if (triggerChance > 0 && Math.random() < triggerChance) {
      setIsLampBroken(true);
      playSparkSound();
    } else {
      // Programar enfriamiento gradual si no sigue cliqueando
      resetTimerRef.current = setTimeout(() => {
        frenzyRef.current = 0;
        setFrenzyCount(0);
      }, 4000);
    }

    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [isLampBroken]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === 'dark',
        frenzyCount,
        isLampBroken,
        repairLamp,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
