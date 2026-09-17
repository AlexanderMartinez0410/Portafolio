import type { ExperienceItem, MilestoneItem } from '../types';

export const experienceData: ExperienceItem[] = [
  {
    period: '2025 — ACTUALIDAD',
    role: 'Desarrollador de Software Full Stack (Especialidad Frontend / .NET)',
    company: 'Instituto Superior Tecnológico Central Técnico (ISTPET)',
    location: 'Quito, Ecuador // Producción Activa',
    impact:
      'Ciclo de vida completo (Requerimientos → Arquitectura → Despliegue → Capacitación). Desarrollo de SPAs en Angular respaldadas por microservicios y Web APIs en .NET, desacoplando la lógica de interfaz del motor de datos. Intervención, refactorización y extensión de esquemas transaccionales sobre una base de datos corporativa centralizada con más de 20 años en producción, garantizando integridad referencial y retrocompatibilidad. Diseño del motor centralizado de autenticación y autorización basado en roles (RBAC).',
    tag: '[ PRODUCCIÓN INSTITUCIONAL ]',
    stack: ['Angular 20/21', '.NET 8', 'C#', 'SQL Server', 'MySQL', 'RBAC', 'Clean Architecture', 'Tailwind CSS']
  },
  {
    period: '2024 — ACTUALIDAD',
    role: 'Ingeniero de Software Freelance & Tech Consultant',
    company: 'Consultoría Independiente & Desarrollo Freelance',
    location: 'Remoto Internacional (B2B / Full-time)',
    impact:
      'Entrega llave en mano de aplicaciones móviles con requerimientos críticos de tiempo y hardware (como el desarrollo de Bioregistro en 5 días calendario). Desarrollo de pipelines de automatización integrando Webhooks y APIs de mensajería (Telegram / WhatsApp) con Google Drive y microservicios de almacenamiento en la nube.',
    tag: '[ FREELANCE // INGENIERÍA ]',
    stack: ['Flutter', 'Dart', 'FastAPI', 'Python', 'Firebase', 'WebSockets', 'Redis', 'Docker']
  }
];

export const milestonesData: MilestoneItem[] = [
  {
    year: '2026',
    title: 'Formación en Ingeniería de Software & AWS Builder',
    issuer: 'Universidad Politécnica Salesiana / AWS',
    description:
      'Estudiante de Ingeniería en Desarrollo de Software (UPS) y miembro activo del programa AWS Builder Student enfocado en arquitecturas cloud y despliegues en infraestructura AWS.',
    badge: '[ INGENIERÍA & AWS ]'
  },
  {
    year: '2025',
    title: 'Tecnólogo Superior en Desarrollo de Software',
    issuer: 'Instituto Superior Tecnológico Central Técnico',
    description:
      'Graduado con formación técnica integral en ciclo de vida de desarrollo de software, modelado de bases de datos relacionales y arquitectura de sistemas.',
    badge: '[ GRADUADO // TITULACIÓN ]'
  },
  {
    year: '2023',
    title: 'Competencias de Algoritmia & Programación',
    issuer: 'Concursos Universitarios & Competitivos',
    description:
      'Participación y destacados resultados en competencias de programación: resolución de desafíos de algoritmos, optimización de complejidad temporal/espacial y estructuras de datos avanzadas.',
    badge: '[ ALGORITMOS & ESTRUCTURAS ]'
  }
];
