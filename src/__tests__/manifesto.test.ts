import { describe, it, expect } from 'vitest';
import { authorProfile } from '../data/manifesto';
import { projectsData } from '../data/projects';
import { studyCasesData } from '../data/studyCases';

describe('Integridad de Datos del Portafolio', () => {
  it('debe tener datos completos del manifiesto profesional', () => {
    expect(authorProfile.name).toContain('ALEXANDER RAFAEL MARTÍNEZ MORILLO');
    expect(authorProfile.discipline).toBeDefined();
    expect(authorProfile.email).toBe('alkut202@gmail.com');
    expect(authorProfile.github).toContain('github.com');
    expect(authorProfile.linkedin).toContain('linkedin.com');
  });

  it('debe contener los 3 proyectos centrales de la tríada', () => {
    expect(projectsData.length).toBeGreaterThanOrEqual(3);
    const triadIds = ['ammi-online', 'bioregistro', 'desaparecidos-ec'];
    triadIds.forEach(id => {
      const proj = projectsData.find(p => p.id === id);
      expect(proj).toBeDefined();
      expect(proj?.title).toBeDefined();
      expect(proj?.technologies.length).toBeGreaterThan(0);
    });
  });

  it('los casos de estudio de Obsidian deben tener frontmatter estructurado y secciones requeridas', () => {
    const esCases = Object.values(studyCasesData.es);
    expect(esCases.length).toBeGreaterThanOrEqual(3);
    esCases.forEach(sc => {
      expect(sc.id).toBeDefined();
      expect(sc.frontmatter.type).toBeDefined();
      expect(sc.frontmatter.technologies.length).toBeGreaterThan(0);
      expect(sc.architectureDecision.adrSummary).toBeDefined();
    });
  });
});
