import { describe, it, expect } from 'vitest';
import { parseHash, formatHash } from '../context/NavigationContext';
import { labExperimentsData } from '../data/lab';
import { studyCasesData } from '../data/studyCases';

describe('Deep Linking & Hash Routing Subsystem', () => {
  describe('parseHash', () => {
    it('debe resolver la sección raíz sobre-mi ante hash vacío o inválido', () => {
      expect(parseHash('').section).toBe('sobre-mi');
      expect(parseHash('#').section).toBe('sobre-mi');
      expect(parseHash('#/').section).toBe('sobre-mi');
      expect(parseHash('#/seccion-inexistente').section).toBe('sobre-mi');
    });

    it('debe parsear correctamente las secciones de primer nivel', () => {
      expect(parseHash('#/sobre-mi').section).toBe('sobre-mi');
      expect(parseHash('#/proyectos').section).toBe('proyectos');
      expect(parseHash('#/experimentos').section).toBe('experimentos');
      expect(parseHash('#/experiencia').section).toBe('experiencia');
      expect(parseHash('#/contacto').section).toBe('contacto');
    });

    it('debe parsear la sub-ruta del catálogo de proyectos', () => {
      const parsed = parseHash('#/proyectos/catalogo');
      expect(parsed.section).toBe('proyectos');
      expect(parsed.params.catalog).toBe(true);
      expect(parsed.params.studyCaseId).toBeUndefined();
    });

    it('debe parsear deep link hacia un caso de estudio desde la tríada', () => {
      const parsed = parseHash('#/proyectos/caso-estudio/ammi-online');
      expect(parsed.section).toBe('proyectos');
      expect(parsed.params.studyCaseId).toBe('ammi-online');
      expect(parsed.params.catalog).toBeUndefined();
    });

    it('debe parsear deep link hacia un caso de estudio anidado dentro del catálogo', () => {
      const parsed = parseHash('#/proyectos/catalogo/caso-estudio/istpet-siplici-limpieza');
      expect(parsed.section).toBe('proyectos');
      expect(parsed.params.catalog).toBe(true);
      expect(parsed.params.studyCaseId).toBe('istpet-siplici-limpieza');
    });

    it('debe parsear deep link hacia un experimento del laboratorio', () => {
      const parsed = parseHash('#/experimentos/polyphonic-synth-audio');
      expect(parsed.section).toBe('experimentos');
      expect(parsed.params.experimentId).toBe('polyphonic-synth-audio');
    });
  });

  describe('formatHash', () => {
    it('debe formatear hash de sección raíz', () => {
      expect(formatHash('proyectos')).toBe('#/proyectos');
      expect(formatHash('contacto')).toBe('#/contacto');
    });

    it('debe formatear hash con sub-ruta', () => {
      expect(formatHash('proyectos', 'catalogo')).toBe('#/proyectos/catalogo');
      expect(formatHash('experimentos', 'pingu-3d-voxel')).toBe('#/experimentos/pingu-3d-voxel');
    });
  });

  describe('Integridad referencial de los Deep Links', () => {
    it('todos los experimentos del Lab deben tener IDs válidos para deep linking', () => {
      expect(labExperimentsData.length).toBeGreaterThan(0);
      for (const exp of labExperimentsData) {
        expect(exp.id).toMatch(/^[a-z0-9-]+$/);
        const parsed = parseHash(`#/experimentos/${exp.id}`);
        expect(parsed.section).toBe('experimentos');
        expect(parsed.params.experimentId).toBe(exp.id);
      }
    });

    it('todos los casos de estudio deben tener IDs válidos para deep linking', () => {
      const casesEs = Object.keys(studyCasesData.es);
      expect(casesEs.length).toBeGreaterThan(0);
      for (const caseId of casesEs) {
        expect(caseId).toMatch(/^[a-z0-9-]+$/);
        const parsed = parseHash(`#/proyectos/caso-estudio/${caseId}`);
        expect(parsed.section).toBe('proyectos');
        expect(parsed.params.studyCaseId).toBe(caseId);
      }
    });

    it('el caso de estudio de VITA y proyectos dinámicos no deben exceder el ancho del contenedor en diagramAscii', async () => {
      const { catalogProjectsData } = await import('../data/projects');
      const { getStudyCaseForProject } = await import('../data/studyCases');
      
      const vita = catalogProjectsData.find(p => p.id === 'vita-talleres');
      expect(vita).toBeDefined();
      if (vita) {
        const studyCase = getStudyCaseForProject(vita, 'es');
        expect(studyCase.architectureDecision.diagramAscii).toBeDefined();
        const lines = (studyCase.architectureDecision.diagramAscii ?? '').split('\n').filter(Boolean);
        for (const line of lines) {
          expect(line.length).toBeLessThanOrEqual(69);
        }
      }
    });
  });
});
