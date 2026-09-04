import type { AuthorProfile, TechnicalPillar, TechCategory } from '../types';

export const authorProfile: AuthorProfile = {
  name: 'ALEXANDER R. MARTÍNEZ MORILLO',
  tagline: 'DINOPENGU DEV',
  discipline: 'FRONTEND & AI SOLUTIONS ENGINEER',
  status: 'DISPONIBLE // REMOTO (UTC-5)',
  isAvailable: true,
  email: 'contacto@dinopengu.dev',
  github: 'https://github.com/dinopengudev',
  linkedin: 'https://linkedin.com/in/alexander-martinez-dev',
  dossierUrl: '/cv_alexander_martinez.pdf',
  location: 'QUITO, ECUADOR // REMOTO INTERNACIONAL',
  timezone: 'UTC-5'
};

export const techStackData: TechCategory[] = [
  {
    title: 'FRONTEND & CREATIVE ENGINEERING',
    skills: [
      'TypeScript',
      'React / Next.js',
      'Angular 21 (RxJS)',
      'Three.js / Canvas 3D',
      'Tailwind CSS',
      'Flutter / Dart',
      'React Native',
      'Creative Dev & Shaders'
    ]
  },
  {
    title: 'BACKEND & INTEGRACIÓN FUNCIONAL',
    skills: [
      '.NET 8 / ASP.NET Core',
      'C#',
      'Python (FastAPI & Flask)',
      'Clean Architecture',
      'Entity Framework Core',
      'APIs RESTful & Sockets',
      'Control de Acceso RBAC',
      'SQLAlchemy 2.0'
    ]
  },
  {
    title: 'DATOS, INFRA & HARDWARE',
    skills: [
      'PostgreSQL (Multi-tenant)',
      'MySQL / MariaDB',
      'Docker & Compose',
      'CI/CD (GitHub Actions)',
      'Integración ZKTeco (pyzk)',
      'OpenCV / Visión Computacional',
      'xUnit & Vitest',
      'Modelos Geoespaciales'
    ]
  },
  {
    title: 'IA APLICADA & METODOLOGÍA',
    skills: [
      'Spec-Driven Development',
      'Agentes & Rules de IA',
      'Auditoría de Código con LLMs',
      'Análisis de Datos & Patrones',
      'Architecture Records (ADR)',
      'Testing & Cobertura Rigurosa'
    ]
  }
];

export const technicalPillars: TechnicalPillar[] = [
  {
    title: 'INGENIERÍA FRONTEND & CREATIVE DEV',
    detail: 'Construyo interfaces web de alto rendimiento y tipado estricto con Angular 21, React y TypeScript, integrando interactividad 3D con Three.js y Canvas.'
  },
  {
    title: 'VISIÓN FULL-CYCLE & BACKEND FUNCIONAL',
    detail: 'Entiendo el ciclo de software completo: conecto frontends con APIs en .NET 8 y Python, diseño modelos de datos en PostgreSQL y resuelvo flujos de servidor sin fricción.'
  },
  {
    title: 'DESARROLLO DIRIGIDO POR SPECS Y AGENTES IA',
    detail: 'Acelero entregas mediante Spec-Driven Development, reglas propias y LLMs como auditores arquitectónicos, logrando código limpio y sin deuda técnica.'
  },
  {
    title: 'COMPUTACIÓN APLICADA & MUNDO REAL',
    detail: 'Conecto soluciones web con hardware y datos del entorno: sockets con terminales ZKTeco, visión computacional con OpenCV y análisis de patrones de productividad.'
  }
];
