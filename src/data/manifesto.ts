import type { AuthorProfile, TechnicalPillar, TechCategory } from '../types';

export const authorProfile: AuthorProfile = {
  name: 'ALEXANDER RAFAEL MARTÍNEZ MORILLO',
  shortName: 'ALEXANDER MARTÍNEZ',
  tagline: 'DINOPENGU DEV (PINGUDEV)',
  discipline: 'FULL STACK ENGINEER | FRONTEND ARCHITECTURE & APPLIED AI',
  status: 'DISPONIBLE // REMOTO (UTC-5)',
  isAvailable: true,
  email: 'alkut202@gmail.com',
  phone: '+593999999999',
  whatsapp: '593999999999',
  github: 'https://github.com/AlexanderMartinez0410',
  linkedin: 'https://www.linkedin.com/in/alexander-martinez-a1261921a/',
  dossierUrl: '/cv_alexander_martinez.pdf',
  location: 'QUITO, ECUADOR // REMOTO (UTC-5)',
  timezone: 'UTC-5'
};

export const techStackData: TechCategory[] = [
  {
    title: 'FRONTEND & CREATIVE ENGINEERING',
    skills: [
      'Angular 20/21 (SSR)',
      'TypeScript & React',
      'PrimeNG & Tailwind',
      'Flutter (Riverpod)',
      'Three.js & WebGL',
      'Vanilla DOM & CSS3'
    ]
  },
  {
    title: 'BACKEND & INTEGRACIÓN FUNCIONAL',
    skills: [
      '.NET 8 / ASP.NET Core',
      'C# (Clean & CQRS)',
      'Python (FastAPI/Flask)',
      'Entity Framework Core',
      'MediatR & Validation',
      'RBAC Central & JWT'
    ]
  },
  {
    title: 'DATOS, INFRA & HARDWARE',
    skills: [
      'SQL Server & MySQL',
      'PostgreSQL',
      'Redis (Pub/Sub)',
      'Firebase (Auth/Store)',
      'Docker & Sockets TCP',
      'Haversine & GeoMaps'
    ]
  },
  {
    title: 'IA APLICADA & METODOLOGÍA',
    skills: [
      'Spec-Driven Dev',
      'Agentes IA & Prompting',
      'Feature-First Design',
      'Auditoría Determinista',
      'Architecture Records (ADR)',
      'AWS Cloud (Builder)'
    ]
  }
];

export const technicalPillars: TechnicalPillar[] = [
  {
    title: 'INGENIERÍA FRONTEND Y SISTEMAS DE DISEÑO RIGUROSOS',
    detail:
      'Priorización de interfaces accesibles, tolerantes a fallos y con estricto apego a normativas de diseño corporativo, desacoplando la lógica de presentación del consumo de datos.'
  },
  {
    title: 'MODERNIZACIÓN Y RESILIENCIA SOBRE SISTEMAS LEGADOS',
    detail:
      'Capacidad probada para diseñar capas de abstracción modernas (APIs REST en .NET, SPAs en Angular y refactorización UI/UX) sobre bases de datos relacionales monolíticas con más de dos décadas en producción.'
  },
  {
    title: 'INTEGRACIÓN PRAGMÁTICA DE IA Y AUTOMATIZACIÓN',
    detail:
      'Empleo de modelos de lenguaje e inteligencia artificial como herramientas de aumento técnico, manteniendo el criterio humano de arquitectura y validando determinísticamente cada resultado.'
  },
  {
    title: 'DESARROLLO INTEGRAL ORIENTADO AL USUARIO (END-TO-END)',
    detail:
      'Ejecución del ciclo completo de software: levantamiento técnico de requerimientos, diseño de esquemas, desarrollo full stack, despliegue y capacitación operativa directa.'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS PROFICIENCY DATA
// Estándar internacional SFIA (Skills Framework for the Information Age - 7 Niveles).
// Niveles activos: L1 (Seguir) | L2 (Asistir) | L3 (Aplicar) | L4 (Habilitar) | L5 (Asegurar / Liderazgo Técnico)
// ─────────────────────────────────────────────────────────────────────────────
export type SfiaLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface SkillEntry {
  name: string;
  sfiaLevel: SfiaLevel; // 1 a 7 (con alcance activo en producción hasta L5)
  sfiaLabel: string;   // Etiqueta descriptiva del nivel SFIA
}

export interface SkillGroup {
  category: string;
  color: string;        // Tailwind text color class for accent
  barColor: string;     // Tailwind bg color class for the bar fill
  skills: SkillEntry[];
}

export const skillsData: SkillGroup[] = [
  {
    category: 'FRONTEND',
    color: 'text-sky-400',
    barColor: 'bg-sky-500',
    skills: [
      { name: 'Angular (20/21 SSR & Signals)',         sfiaLevel: 5, sfiaLabel: 'SFIA L5 · ENSURE / LEAD' },
      { name: 'TypeScript (Tipado Estricto & Tipos)',  sfiaLevel: 5, sfiaLabel: 'SFIA L5 · ENSURE / LEAD' },
      { name: 'React (Hooks & Ecosistema)',           sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
      { name: 'Sistemas UI (PrimeNG & Tailwind)',     sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
      { name: 'Flutter & Dart (Mobile)',              sfiaLevel: 3, sfiaLabel: 'SFIA L3 · APPLY'         },
      { name: 'Three.js & WebGL (3D)',                sfiaLevel: 2, sfiaLabel: 'SFIA L2 · ASSIST'        },
    ],
  },
  {
    category: 'BACKEND',
    color: 'text-emerald-400',
    barColor: 'bg-emerald-500',
    skills: [
      { name: '.NET 8 / ASP.NET Core',                sfiaLevel: 5, sfiaLabel: 'SFIA L5 · ENSURE / LEAD' },
      { name: 'C# (Clean Architecture & CQRS)',       sfiaLevel: 5, sfiaLabel: 'SFIA L5 · ENSURE / LEAD' },
      { name: 'Python (FastAPI & Automatización)',    sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
      { name: 'Entity Framework Core',                sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
      { name: 'APIs RESTful (JWT & RBAC)',            sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
    ],
  },
  {
    category: 'BASES DE DATOS',
    color: 'text-violet-400',
    barColor: 'bg-violet-500',
    skills: [
      { name: 'SQL Server (Corporativo)',             sfiaLevel: 5, sfiaLabel: 'SFIA L5 · ENSURE / LEAD' },
      { name: 'MySQL & MariaDB',                      sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
      { name: 'PostgreSQL',                           sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
      { name: 'Optimización SQL & SPs Legados',       sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
      { name: 'Redis (Caché & Pub/Sub)',              sfiaLevel: 3, sfiaLabel: 'SFIA L3 · APPLY'         },
      { name: 'Firebase (Auth & Firestore)',          sfiaLevel: 3, sfiaLabel: 'SFIA L3 · APPLY'         },
    ],
  },
  {
    category: 'DEVOPS & CLOUD',
    color: 'text-blue-400',
    barColor: 'bg-blue-500',
    skills: [
      { name: 'GitLab (SCM & Repositorios)',          sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
      { name: 'Pipelines CI/CD',                      sfiaLevel: 3, sfiaLabel: 'SFIA L3 · APPLY'         },
      { name: 'Docker (Contenedores)',                sfiaLevel: 3, sfiaLabel: 'SFIA L3 · APPLY'         },
      { name: 'AWS Cloud (Infraestructura Base)',     sfiaLevel: 2, sfiaLabel: 'SFIA L2 · ASSIST'        },
      { name: 'Kubernetes (K8s Básico)',              sfiaLevel: 1, sfiaLabel: 'SFIA L1 · FOLLOW'        },
    ],
  },
  {
    category: 'IA APLICADA',
    color: 'text-amber-400',
    barColor: 'bg-amber-500',
    skills: [
      { name: 'Cursor & Entornos Agénticos',          sfiaLevel: 5, sfiaLabel: 'SFIA L5 · ENSURE / LEAD' },
      { name: 'Spec-Driven Development con IA',       sfiaLevel: 5, sfiaLabel: 'SFIA L5 · ENSURE / LEAD' },
      { name: 'Integración LLMs (Claude/Gemini/Groq)',sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
      { name: 'Prompt Engineering & Flujos IA',       sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
      { name: 'Auditoría Determinista de Código',     sfiaLevel: 4, sfiaLabel: 'SFIA L4 · ENABLE'        },
    ],
  },
];


