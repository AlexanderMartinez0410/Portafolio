import type { ExperienceItem, MilestoneItem } from '../types';

export const experienceData: ExperienceItem[] = [
  {
    period: '2025 — ACTUALIDAD',
    role: 'Software & Frontend Engineer',
    company: 'ISTPET (Inst. Sup. Tecnológico Mayor Pedro Traversari)',
    location: 'Quito, Ecuador // Producción Activa',
    impact:
      'Diseño, desarrollo y mantenimiento de módulos académicos y administrativos en producción real. Construcción de interfaces reactivas en Angular y TypeScript conectadas a servicios backend en .NET 8 (ASP.NET Core) y FastAPI en Python. Modelado de bases de datos relacionales (PostgreSQL / SQL Server), autenticación con roles estrictos (RBAC) y optimización de consultas.',
    tag: '[ PRODUCCIÓN INSTITUCIONAL ]',
    stack: ['Angular 21', 'TypeScript', '.NET 8', 'C#', 'FastAPI', 'PostgreSQL', 'SQL Server', 'Tailwind CSS']
  },
  {
    period: '2023 — ACTUALIDAD',
    role: 'Frontend & Software Solutions Developer',
    company: 'Proyectos Independientes & Freelance',
    location: 'Remoto // Internacional',
    impact:
      'Desarrollo de interfaces web y móviles interactivas en React, Next.js y Flutter. Integración de hardware biométrico mediante sockets de red (ZKTeco / pyzk), experimentación con gráficos 3D en Three.js/Canvas y adopción de metodologías ágiles asistidas por IA con Spec-Driven Development.',
    tag: '[ FREELANCE // INGENIERÍA ]',
    stack: ['React', 'Next.js', 'Three.js', 'Flutter', 'Python', 'Docker', 'ZKTeco Sockets', 'Vitest']
  }
];

export const milestonesData: MilestoneItem[] = [
  {
    year: '2023',
    title: '1er Lugar — Concurso Universitario de Algoritmos & Programación',
    issuer: 'Universidad Técnica de Cotopaxi (UTC)',
    description:
      'Primer puesto en la competencia universitaria de programación: resolución de desafíos de algoritmos, optimización de complejidad temporal/espacial y estructuras de datos.',
    badge: '[ 1ER LUGAR / UTC ]'
  },
  {
    year: '2025',
    title: 'Despliegue Oficial en Google Play Store (App Móvil)',
    issuer: 'Comunidad Institucional ISTPET',
    description:
      'Publicación y mantenimiento de la aplicación móvil institucional ("Mi ISTPET") en la tienda oficial de Google Play, conectada a los servicios académicos y administrativos.',
    badge: '[ GOOGLE PLAY STORE ]'
  },
  {
    year: '2024',
    title: 'Integración de Hardware Biométrico por Sockets TCP',
    issuer: 'Control de Asistencia & RRHH',
    description:
      'Implementación de comunicación socket a bajo nivel con terminales físicos ZKTeco para lectura, validación y sincronización automatizada de registros de asistencia.',
    badge: '[ HARDWARE & PROTOCOLOS ]'
  }
];

