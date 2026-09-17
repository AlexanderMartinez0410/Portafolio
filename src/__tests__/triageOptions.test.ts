import { describe, it, expect } from 'vitest';
import { 
  getObjectiveOptions, 
  generateHumanMessage 
} from '../components/triage/triageOptions';

describe('Bot de Triaje y Generador de Mensajes', () => {
  it('debe retornar opciones localizadas en español e inglés', () => {
    const esOptions = getObjectiveOptions(true);
    const enOptions = getObjectiveOptions(false);

    expect(esOptions.length).toBe(4);
    expect(enOptions.length).toBe(4);
    expect(esOptions[0].label).toContain('Crear un Proyecto');
    expect(enOptions[0].label).toContain('Build a Project');
  });

  it('debe generar un mensaje coherente para solicitudes Freelance en español', () => {
    const msg = generateHumanMessage({
      isEs: true,
      intent: 'freelance',
      freelanceType: 'Página o Plataforma Web',
      freelanceStage: 'Tengo solo la idea en mente',
      name: 'Carlos Mendoza',
      contactHandle: 'carlos@empresa.com',
      notes: 'Queremos lanzar un marketplace en 2 meses'
    });

    expect(msg).toContain('Hola Alexander');
    expect(msg).toContain('Página o Plataforma Web');
    expect(msg).toContain('tengo solo la idea en mente');
    expect(msg).toContain('Carlos Mendoza');
    expect(msg).toContain('carlos@empresa.com');
    expect(msg).toContain('marketplace en 2 meses');
  });

  it('debe generar un mensaje coherente para propuestas Full-time en inglés', () => {
    const msg = generateHumanMessage({
      isEs: false,
      intent: 'fulltime',
      jobRole: 'Full Stack Engineer (.NET 8 + Angular)',
      jobModality: 'International Remote (B2B / Contractor)',
      name: 'Sarah Connor',
      contactHandle: 'sarah.recruiter@techcorp.io',
      notes: 'Competitive salary in USD, immediate start'
    });

    expect(msg).toContain('Hi Alexander');
    expect(msg).toContain('Full Stack Engineer');
    expect(msg).toContain('International Remote');
    expect(msg).toContain('Sarah Connor');
    expect(msg).toContain('sarah.recruiter@techcorp.io');
  });
});
