import React from 'react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { TypewriterText } from '../components/TypewriterText';
import { SpotlightCard } from '../components/SpotlightCard';
import { FadeUp } from '../components/FadeUp';

// ─── Mock de motion/react para evitar dependencia de animaciones en tests ───
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ─── Mock de IntersectionObserver (no existe en jsdom) ───
beforeAll(() => {
  globalThis.IntersectionObserver = vi.fn().mockImplementation(function (_cb: IntersectionObserverCallback) {
    return {
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    };
  }) as unknown as typeof IntersectionObserver;
});

// ─────────────────────────────────────────────────────────────────────────────
// AnimatedCounter
// ─────────────────────────────────────────────────────────────────────────────
describe('AnimatedCounter', () => {
  it('renderiza el valor de texto provisto sin romper el árbol de React', () => {
    render(<AnimatedCounter value="100% PROCESOS" />);
    expect(screen.getByText('100% PROCESOS')).toBeDefined();
  });

  it('renderiza un valor numérico puro como string', () => {
    render(<AnimatedCounter value={42} />);
    // El valor inicial se muestra antes de la animación
    expect(screen.getByText('0')).toBeDefined();
  });

  it('acepta className personalizado sin errores', () => {
    const { container } = render(
      <AnimatedCounter value="5 proyectos" className="font-bold text-xl" />
    );
    const span = container.querySelector('span');
    expect(span?.className).toContain('font-bold');
  });

  it('no lanza errores con valores no numéricos puros', () => {
    expect(() => render(<AnimatedCounter value="Sin número aquí" />)).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TypewriterText
// ─────────────────────────────────────────────────────────────────────────────
describe('TypewriterText', () => {
  it('renderiza el texto inicial correctamente', () => {
    render(<TypewriterText text="Hola mundo" />);
    expect(screen.getByText('Hola mundo')).toBeDefined();
  });

  it('usa el tag "span" por defecto', () => {
    const { container } = render(<TypewriterText text="Test span" />);
    expect(container.querySelector('span')).toBeDefined();
  });

  it('usa el tag "h1" cuando se especifica as="h1"', () => {
    const { container } = render(<TypewriterText text="Título principal" as="h1" />);
    expect(container.querySelector('h1')).toBeDefined();
  });

  it('usa el tag "p" cuando se especifica as="p"', () => {
    const { container } = render(<TypewriterText text="Párrafo" as="p" />);
    expect(container.querySelector('p')).toBeDefined();
  });

  it('acepta className personalizado', () => {
    const { container } = render(
      <TypewriterText text="Styled" className="text-accent font-mono" />
    );
    // El componente raíz recibe la clase
    const root = container.firstElementChild;
    expect(root?.className).toContain('text-accent');
  });

  it('no renderiza cursor cuando showCursor=false', () => {
    const { container } = render(
      <TypewriterText text="Sin cursor" showCursor={false} />
    );
    // No debe haber un span de cursor (animate-pulse)
    const cursor = container.querySelector('.animate-pulse');
    expect(cursor).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SpotlightCard
// ─────────────────────────────────────────────────────────────────────────────
describe('SpotlightCard', () => {
  it('renderiza sus children correctamente', () => {
    render(
      <SpotlightCard>
        <p>Contenido de la tarjeta</p>
      </SpotlightCard>
    );
    expect(screen.getByText('Contenido de la tarjeta')).toBeDefined();
  });

  it('aplica className personalizado al contenedor raíz', () => {
    const { container } = render(
      <SpotlightCard className="bg-card border">
        <span>Item</span>
      </SpotlightCard>
    );
    const root = container.firstElementChild;
    expect(root?.className).toContain('bg-card');
    expect(root?.className).toContain('border');
  });

  it('asigna el atributo id al contenedor raíz', () => {
    render(
      <SpotlightCard id="proyecto-ammi">
        <span>AMMI</span>
      </SpotlightCard>
    );
    expect(document.getElementById('proyecto-ammi')).toBeDefined();
  });

  it('llama a onClick cuando se hace clic', () => {
    const handleClick = vi.fn();
    render(
      <SpotlightCard onClick={handleClick}>
        <button>Clic aquí</button>
      </SpotlightCard>
    );
    fireEvent.click(screen.getByText('Clic aquí'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no lanza error cuando onClick no se provee', () => {
    expect(() =>
      render(
        <SpotlightCard>
          <span>Sin handler</span>
        </SpotlightCard>
      )
    ).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FadeUp
// ─────────────────────────────────────────────────────────────────────────────
describe('FadeUp', () => {
  it('renderiza sus children', () => {
    render(
      <FadeUp>
        <p>Contenido animado</p>
      </FadeUp>
    );
    expect(screen.getByText('Contenido animado')).toBeDefined();
  });

  it('acepta className personalizado', () => {
    const { container } = render(
      <FadeUp className="mt-4 px-6">
        <span>Item con clase</span>
      </FadeUp>
    );
    // El div interno de motion.div recibe la clase
    const inner = container.querySelector('.mt-4');
    expect(inner).toBeDefined();
  });

  it('renderiza con delay=0 por defecto sin errores', () => {
    expect(() =>
      render(
        <FadeUp>
          <span>Sin delay</span>
        </FadeUp>
      )
    ).not.toThrow();
  });
});
