import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { BrokenLampEasterEgg } from '../components/BrokenLampEasterEgg';

const TestEasterEggConsumer: React.FC = () => {
  const { frenzyCount, isLampBroken, toggleTheme, repairLamp } = useTheme();
  const { setLanguage } = useLanguage();

  return (
    <div>
      <div data-testid="frenzy-count">{frenzyCount}</div>
      <div data-testid="lamp-state">{isLampBroken ? 'broken' : 'intact'}</div>
      <button onClick={toggleTheme} data-testid="toggle-btn">Toggle</button>
      <button onClick={repairLamp} data-testid="repair-btn">Repair</button>
      <button onClick={() => setLanguage('en')} data-testid="lang-en-btn">EN</button>
      <button onClick={() => setLanguage('es')} data-testid="lang-es-btn">ES</button>
    </div>
  );
};

describe('Easter Egg de Sobrecarga Eléctrica y Lámpara Rota', () => {
  it('inicializa con frenzyCount en 0 y lámpara intacta', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <TestEasterEggConsumer />
          <BrokenLampEasterEgg />
        </ThemeProvider>
      </LanguageProvider>
    );

    expect(screen.getByTestId('frenzy-count').textContent).toBe('0');
    expect(screen.getByTestId('lamp-state').textContent).toBe('intact');
    expect(screen.queryByText(/CORTE TOTAL DE ENERGÍA/i)).toBeNull();
  });

  it('incrementa frenzyCount con clics consecutivos rápidos', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <TestEasterEggConsumer />
        </ThemeProvider>
      </LanguageProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');
    act(() => {
      toggleBtn.click();
    });
    expect(screen.getByTestId('frenzy-count').textContent).toBe('1');

    act(() => {
      toggleBtn.click();
    });
    expect(screen.getByTestId('frenzy-count').textContent).toBe('2');
  });

  it('activa la rotura de la lámpara y detecta el idioma español / inglés dinámicamente', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <TestEasterEggConsumer />
          <BrokenLampEasterEgg />
        </ThemeProvider>
      </LanguageProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');
    const langEnBtn = screen.getByTestId('lang-en-btn');

    // Cambiar a inglés antes de forzar el apagón
    act(() => {
      langEnBtn.click();
    });

    act(() => {
      for (let i = 0; i < 25; i++) {
        toggleBtn.click();
      }
    });

    expect(screen.getByTestId('lamp-state').textContent).toBe('broken');
    // En inglés debe decir TOTAL POWER OUTAGE
    expect(screen.getByText(/TOTAL POWER OUTAGE/i)).toBeDefined();
    expect(screen.getByText(/Screw in new bulb & restore light/i)).toBeDefined();
  });
});
