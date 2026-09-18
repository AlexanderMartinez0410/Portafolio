import type { StudyCase, Project, CatalogProject } from '../../types';
import type { Language } from '../../types/i18n';
import { studyCasesData } from '../studyCases';

/**
 * Función auxiliar para formatear diagramas ASCII con ancho estrictamente acotado
 * garantizando que ninguna línea de texto se desborde del contenedor visual.
 */
function generateDynamicAsciiDiagram(title: string, technologies: string[], impact: string): string {
  const boxWidth = 69;
  const innerWidth = boxWidth - 4; // 65 caracteres de ancho útil

  const wrapText = (text: string, maxLen: number): string[] => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = '';

    for (const w of words) {
      if (!current) {
        current = w;
      } else if ((current + ' ' + w).length <= maxLen) {
        current += ' ' + w;
      } else {
        lines.push(current);
        current = w;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  const centerLine = (text: string): string => {
    const truncated = text.length > innerWidth ? text.slice(0, innerWidth - 3) + '...' : text;
    const pad = Math.max(0, innerWidth - truncated.length);
    const padLeft = Math.floor(pad / 2);
    const padRight = pad - padLeft;
    return `| ${' '.repeat(padLeft)}${truncated}${' '.repeat(padRight)} |`;
  };

  const padLine = (text: string): string => {
    const truncated = text.length > innerWidth ? text.slice(0, innerWidth - 3) + '...' : text;
    const padRight = Math.max(0, innerWidth - truncated.length);
    return `| ${truncated}${' '.repeat(padRight)} |`;
  };

  const border = '+' + '-'.repeat(boxWidth - 2) + '+';
  const midPipe = ' '.repeat(Math.floor(boxWidth / 2)) + '|';
  const midArrow = ' '.repeat(Math.floor(boxWidth / 2)) + 'v';

  const titleLines = wrapText(title.toUpperCase(), innerWidth);
  const techText = `[ PIPELINE ] ──> ${technologies.slice(0, 4).join(' + ')}`;
  const techLines = wrapText(techText, innerWidth);
  const impactLines = wrapText(impact, innerWidth);

  return [
    border,
    ...titleLines.map(centerLine),
    border,
    midPipe,
    midArrow,
    border,
    ...techLines.map(padLine),
    border,
    midPipe,
    midArrow,
    border,
    padLine('[ RESULTADO & IMPACTO OPERATIVO ]'),
    padLine(''),
    ...impactLines.map(padLine),
    border,
  ].join('\n');
}

/**
 * Función que genera un caso de estudio estructurado al instante para cualquier
 * proyecto del catálogo en base a sus metadatos técnicos y el idioma seleccionado.
 */
export function getStudyCaseForProject(project: Project | CatalogProject, lang: Language = 'es'): StudyCase {
  const dictionary = studyCasesData[lang] || studyCasesData.es;
  if (dictionary[project.id]) {
    return dictionary[project.id];
  }

  const isEn = lang === 'en';
  const technologies = 'technologies' in project ? project.technologies : project.stack;
  const methodologies = 'methodologies' in project && project.methodologies && project.methodologies.length > 0 
    ? project.methodologies 
    : (isEn ? ['Modular Architecture', 'Strict Typing', 'Clean Code Patterns'] : ['Arquitectura Modular', 'Tipado Estricto', 'Patrones de Código Limpio']);
  const role = 'role' in project && project.role ? project.role : (isEn ? 'Lead Software Engineer' : 'Ingeniero de Software Principal');
  const impact = 'impact' in project 
    ? project.impact 
    : (project.metrics?.[0]?.value ? `${project.metrics[0].label}: ${project.metrics[0].value}` : project.summary);
  const categoryLabel = 'categoryLabel' in project ? project.categoryLabel : project.format;

  return {
    id: project.id,
    title: project.title,
    vaultPath: `01_PROJECTS/${project.year?.split('—')[0]?.trim() ?? '2025'}_${project.id.replace(/-/g, '_')}.md`,
    frontmatter: {
      type: isEn ? 'Technical Study Case // Second Brain Note' : 'Caso de Estudio Técnico // Nota de Segundo Cerebro',
      role: role,
      status: '#completed // #verified',
      created: `${project.year?.split('—')[0]?.trim() ?? '2025'}-01-15`,
      tags: [
        `#${project.id}`,
        `#${categoryLabel ? categoryLabel.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'engineering'}`,
        isEn ? '#second-brain' : '#segundo-cerebro',
        isEn ? '#production' : '#produccion'
      ],
      technologies: technologies,
      methodologies: methodologies,
      stack: technologies,
      complexity: isEn ? 'Medium / High' : 'Media / Alta',
      impact: impact
    },
    contextAndProblem: project.challenge,
    architectureDecision: {
      adrSummary: isEn ? `ADR-00X: Technical Architecture & Specification for ${project.title}` : `ADR-00X: Arquitectura y Especificación Técnica para ${project.title}`,
      diagramAscii: generateDynamicAsciiDiagram(project.title, technologies, impact),
      keyPoints: isEn
        ? [
            'Modular architecture with strict typing and clear separation of concerns.',
            'Performance optimization targeting zero latency bottlenecks and no premature technical debt.',
            'Robust exception handling and multi-layer validation.'
          ]
        : [
            'Desarrollo modular con tipado estricto y separación clara de responsabilidades.',
            'Optimización de performance orientada a cero cuellos de botella y cero deuda técnica prematura.',
            'Manejo robusto de excepciones y validación en capas.'
          ]
    },
    technicalSolution: {
      overview: isEn
        ? `Technical implementation using ${technologies.join(', ')} to overcome operational challenges with architectural rigor.`
        : `Implementación técnica utilizando ${technologies.join(', ')} para superar el desafío operativo planteado con rigor arquitectónico.`,
      snippets: [
        {
          filename: `${project.id.replace(/-/g, '_')}_solution.ts`,
          language: 'typescript',
          code: `// Key Implementation for ${project.title}
// Stack: ${technologies.join(' // ')}

export async function executeEngineWorkflow(config: { id: string; timestamp: number }) {
  console.log('[ENGINE] Processing workflow for ${project.title}:', config.id);

  return {
    status: 'SUCCESS',
    impact: '${impact.replace(/'/g, "\\'")}',
    timestamp: Date.now()
  };
}`
        }
      ]
    },
    challengesAndFixes: [
      {
        challenge: project.challenge,
        solution: impact
      }
    ],
    resultsAndSecondBrainLinks: {
      metrics: [
        { label: isEn ? 'IMPACT' : 'IMPACTO', value: impact.slice(0, 24) + '...' },
        { label: isEn ? 'STATUS' : 'ESTADO', value: isEn ? 'VERIFIED' : 'VERIFICADO' }
      ],
      backlinks: [
        '[[Spec-Driven-Development]]',
        '[[Clean-Code-Practices]]',
        '[[Architecture-Decision-Records]]'
      ],
      conclusion: isEn
        ? `The delivery of ${project.title} fulfilled all technical and operational goals with verified stability.`
        : `La entrega de ${project.title} cumplió los objetivos técnicos y de negocio establecidos con estabilidad comprobada.`
    },
    callouts: [
      {
        type: 'note',
        title: isEn ? 'Second Brain Note' : 'Nota de Segundo Cerebro',
        content: isEn ? 'Synchronized with Dinopengu Dev Obsidian knowledge vault.' : 'Estructura sincronizada con el grafo de conocimiento Obsidian de Dinopengu Dev.'
      }
    ]
  };
}
