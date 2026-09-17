import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedCounter } from '../components/AnimatedCounter';

describe('Pruebas de Componentes React', () => {
  it('AnimatedCounter debe renderizar el valor provisto sin romper el árbol de React', () => {
    render(<AnimatedCounter value="100% PROCESOS" />);
    expect(screen.getByText('100% PROCESOS')).toBeDefined();
  });
});
