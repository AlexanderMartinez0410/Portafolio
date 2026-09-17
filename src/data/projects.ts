import type { Project, CatalogProject } from '../types';

// ============================================================================
// LA TRÍADA PRINCIPAL (Casos de Estudio Destacados)
// ============================================================================
export const projectsData: Project[] = [
  {
    id: 'ammi-online',
    index: '01',
    title: 'AMMI ONLINE // PLATAFORMA INSTITUCIONAL & GESTIÓN ACADÉMICA',
    role: 'Líder de Proyecto & Lead Full Stack Engineer',
    meta: '[ ANGULAR 20 SSR / .NET 8 / POSTGRESQL / CLEAN ARCHITECTURE / CQRS ]',
    year: '2025 — 2026',
    technologies: ['Angular 20 SSR', '.NET 8', 'PostgreSQL', 'C#', 'TypeScript', 'PrimeNG 21', 'Tailwind CSS'],
    methodologies: ['Clean Architecture (4 Capas)', 'CQRS & MediatR', 'Server-Side Rendering (SSR)', 'Generación Automatizada de Reportes', 'Políticas CORS & Seguridad'],
    format: '[ PRODUCCIÓN // ARQUITECTURA LIMPIA ]',
    challenge:
      'Ausencia total de infraestructura digital: la operación académica, matrículas y reportes se gestionaban en hojas de cálculo de Excel, archivos de Word dispersos en Drive y carpetas físicas en papel.',
    summary:
      'Liderazgo y desarrollo full stack de la plataforma institucional con Angular 20 SSR, Clean Architecture sobre .NET 8 y base de datos PostgreSQL, digitalizando al 100% los procesos y automatizando la generación de reportes.',
    liveUrl: 'https://ammionline.ammi.edu.ec/#/',
    visualType: 'image',
    imageSrc: '/images/AmmiOnline.webp',
    metrics: [
      { label: 'GENERACIÓN REPORTES', value: '2 MIN (ANTES 2 SEM)' },
      { label: 'DIGITALIZACIÓN', value: '100% PROCESOS' },
      { label: 'PERSISTENCIA', value: 'POSTGRESQL CENTRALIZADA' }
    ]
  },
  {
    id: 'bioregistro',
    index: '02',
    title: 'BIOREGISTRO // CONTROL BIOMÉTRICO MÓVIL Y ANTI-FRAUDE',
    role: 'Único Desarrollador (Solo Engineer & Mobile Lead)',
    meta: '[ FLUTTER / LOCAL AUTH / GPS HAVERSINE / FIREBASE / DEVICE LOCK ]',
    year: '2025',
    technologies: ['Flutter SDK', 'Dart', 'Firebase Firestore', 'Firebase Auth', 'Local Auth', 'OpenStreetMap'],
    methodologies: ['Feature-First Architecture', 'Triple Barrera Anti-Fraude', 'Geocercas Haversine', 'Single-Device Lock (UUID)', 'SLA de Emergencia (5 Días)'],
    format: '[ MOBILE // TRIPLE BARRERA ANTI-FRAUDE ]',
    challenge:
      'Fricción continua y disputas por retrasos docentes en entornos educativos donde los relojes de pared resultaban costosos o vulnerables a suplantación. Requerimiento crítico de desarrollo y despliegue a producción en 5 días calendario.',
    summary:
      'Desarrollado en solitario de extremo a extremo: sistema móvil de control biométrico en Flutter con Feature-First Architecture y triple barrera anti-fraude (biometría dactilar/facial, geocercas Haversine y bloqueo de hardware por UUID).',
    visualType: 'image',
    imageSrc: '/images/bioregistro.webp',
    metrics: [
      { label: 'DESPLIEGUE PRODUCCIÓN', value: '5 DÍAS SLA' },
      { label: 'SUPLANTACIÓN IDENTIDAD', value: '0 INCIDENCIAS' },
      { label: 'CAPEX HARDWARE', value: '$0 GASTO' }
    ]
  },
  {
    id: 'desaparecidos-ec',
    index: '03',
    title: 'DESAPARECIDOS EC // ALERTAS INMEDIATAS & ANÁLISIS GEOESPACIAL',
    role: 'Líder de Frontend & UI/UX Engineer',
    meta: '[ FLUTTER / FASTAPI / CELERY / REDIS PUB-SUB / HAVERSINE GEO ]',
    year: '2026',
    technologies: ['Flutter', 'Dart', 'Riverpod 2.6', 'FastAPI', 'Python 3.12', 'Celery', 'Redis Pub/Sub', 'PostgreSQL'],
    methodologies: ['Arquitectura Frontend Reactiva', 'Diseño de Interfaz & Experiencia (UI/UX)', 'Mapas Geoespaciales Interactivos', 'Visualización de Alertas en Tiempo Real'],
    format: '[ PLATAFORMA CÍVICA // LEAD FRONTEND & UI/UX ]',
    challenge:
      'Ineficiencia crítica durante la "Ventana Dorada" (primeras 24-48 horas tras una desaparición). La difusión tradicional depende de boletines estáticos sin focalización espacial, impidiendo alertar a ciudadanos en el radio inmediato.',
    summary:
      'Liderazgo y desarrollo integral del Frontend y diseño UI/UX: aplicación cliente en Flutter con Riverpod, diseño de interfaces intuitivas para emergencias cívicas, mapas perimetrales interactivos y renderizado de alertas en tiempo real.',
    visualType: 'image',
    imageSrc: '/images/AlertaDesaparecidos.webp',
    metrics: [
      { label: 'PROPAGACIÓN ALERTA', value: '< 3 SEGUNDOS' },
      { label: 'CONSULTAS GEO EN MAPA', value: '< 200 MS' },
      { label: 'RADIO PERIMETRAL', value: '500M — 10KM' }
    ]
  }
];

// ============================================================================
// CATÁLOGO COMPLETO DE PROYECTOS (Secundarios y Especialidades)
// ============================================================================
export const catalogProjectsData: CatalogProject[] = [
  // --- ECOSISTEMA INSTITUCIONAL ISTPET (Angular + .NET sobre Monolito 20+ Años) ---
  {
    id: 'bienestar-institucional',
    code: 'SYS-01',
    title: 'Bienestar ISTPET',
    role: 'Full Stack Engineer (.NET + Angular)',
    category: 'fullstack',
    categoryLabel: 'FULL STACK & SISTEMAS',
    year: '2025',
    badge: 'BECAS & CASOS',
    stack: ['Angular', '.NET Core', 'SQL Server', 'Tailwind CSS', 'TypeScript'],
    methodologies: ['Modernización de Monolito', 'Digitalización de Procesos', 'Flujos de Validación'],
    challenge: 'Gestión desarticulada de solicitudes de becas y expedientes vulnerables de estudiantes en formatos físicos.',
    impact: 'Digitalización del ciclo de vida de casos estudiantiles, gestión de becas y régimen de permisos internos.',
    imageSrc: '/proyectosSecundarios/BIENESTAR.webp'
  },
  {
    id: 'distributivos-istpet',
    code: 'SYS-02',
    title: 'Academia ISTPET',
    role: 'Full Stack Engineer (.NET + Angular)',
    category: 'fullstack',
    categoryLabel: 'FULL STACK & SISTEMAS',
    year: '2025',
    badge: 'DISTRIBUTIVOS DOCENTES',
    stack: ['.NET 8', 'Angular', 'TypeScript', 'SQL Server', 'Tailwind CSS'],
    methodologies: ['Orquestación de Horarios', 'Detección de Colisiones', 'Arquitectura Modular'],
    challenge: 'Generación manual de distributivos y colisión recurrente de aulas, asignaturas y horarios docentes.',
    impact: 'Orquestación automatizada de distributivos de carga horaria, asignación de aulas y calendarios docentes.',
    imageSrc: '/proyectosSecundarios/ACADEMIA.webp'
  },
  {
    id: 'rrhh-istpet',
    code: 'SYS-03',
    title: 'RRHH ISTPET',
    role: 'Full Stack Engineer (.NET + Angular)',
    category: 'fullstack',
    categoryLabel: 'FULL STACK & SISTEMAS',
    year: '2025',
    badge: 'MIN. TRABAJO EC',
    stack: ['Angular', '.NET Core', 'SQL Server', 'Plantillas Dinámicas', 'TypeScript'],
    methodologies: ['Motor de Plantillas Dinámicas', 'Auditoría Normativa', 'Generación de Contratos'],
    challenge: 'Emisión manual y desfasada de contratos laborales con riesgos de inconsistencias legales normativas.',
    impact: 'Motor de plantillas dinámicas para emisión de contratos laborales bajo normativas del Ministerio del Trabajo de Ecuador.',
    imageSrc: '/proyectosSecundarios/RRHH.webp'
  },
  {
    id: 'auth-core-istpet',
    code: 'SYS-04',
    title: 'Admin ISTPET',
    role: 'Backend & Security Engineer (.NET)',
    category: 'backend',
    categoryLabel: 'BACKEND & ARQUITECTURA',
    year: '2025',
    badge: 'RBAC CENTRALIZADO',
    stack: ['.NET Core', 'C#', 'Angular', 'SQL Server', 'JWT Security'],
    methodologies: ['RBAC Centralizado', 'Seguridad JWT Token', 'Desacoplamiento de Subsistemas'],
    challenge: 'Falta de un sistema de control de accesos unificado entre múltiples subsistemas académicos.',
    impact: 'Módulo centralizado de control de acceso basado en roles (RBAC) que autentica y autoriza transacciones entre subsistemas.',
    imageSrc: '/proyectosSecundarios/Admin.webp'
  },
  {
    id: 'vita-talleres',
    code: 'SYS-05',
    title: 'VITA',
    role: 'Frontend Architect & UI/UX Engineer',
    category: 'frontend',
    categoryLabel: 'FRONTEND & UI',
    year: '2025',
    badge: 'REFACTOR UI/UX',
    stack: ['Angular', 'TypeScript', '.NET Web API', 'Tailwind CSS'],
    methodologies: ['ChangeDetection OnPush', 'Refactorización UI/UX', 'Component-Driven Dev'],
    challenge: 'Interfaz obsoleta y fricción operativa en control de inventario de repuestos y órdenes de servicio técnico.',
    impact: 'Reestructuración integral de UI/UX sobre sistema existente para optimizar la usabilidad en inventarios y mantenimiento de talleres mecánicos.',
    imageSrc: '/proyectosSecundarios/VITA.webp'
  },
  {
    id: 'siplici-caces',
    code: 'SYS-06',
    title: 'SIPLECI',
    role: 'Frontend & Reporting Engineer',
    category: 'frontend',
    categoryLabel: 'FRONTEND & UI',
    year: '2025',
    badge: 'ACREDITACIÓN CACES',
    stack: ['Angular', 'TypeScript', '.NET Web API', 'Document Storage'],
    methodologies: ['Carga Masiva de Evidencias', 'Motor de Reportes de Acreditación', 'Validación de Formatos'],
    challenge: 'Complejidad y lentitud en la carga masiva y auditoría de evidencias para acreditación de educación superior.',
    impact: 'Modernización de interfaces dinámicas para carga masiva de evidencias y generación de reportes de acreditación universitaria ante el CACES.',
    imageSrc: '/proyectosSecundarios/Sipleci.webp'
  },
  {
    id: 'titulacion-istpet',
    code: 'SYS-07',
    title: 'Titulacion ISTPET',
    role: 'Frontend & Process Engineer',
    category: 'frontend',
    categoryLabel: 'FRONTEND & UI',
    year: '2025',
    badge: 'EXPEDIENTES DE GRADO',
    stack: ['Angular', 'TypeScript', '.NET Web API', 'Tailwind CSS'],
    methodologies: ['Máquinas de Estado Finito (FSM)', 'Trazabilidad de Expedientes', 'Workflow Multi-Actor'],
    challenge: 'Pérdida de trazabilidad en expedientes de grado, validación de prerrequisitos y etapas de defensa de tesis.',
    impact: 'Portal de seguimiento, recepción de expedientes y fiscalización de etapas de grado para estudiantes y tribunales.',
    imageSrc: '/proyectosSecundarios/TITULACION.webp'
  },
  {
    id: 'sincronizador-biometrico-telnet',
    code: 'SYS-08',
    title: 'Biometrico ISTPET',
    role: 'Embedded & Backend Integration Engineer',
    category: 'ai',
    categoryLabel: 'IA & HARDWARE',
    year: '2025',
    badge: 'IOT & TELNET',
    stack: ['Angular', '.NET Core', 'Telnet Protocols', 'TCP Sockets', 'Hardware Local'],
    methodologies: ['Sockets TCP/IP en Tiempo Real', 'Protocolo Telnet Local', 'Sincronización Offline'],
    challenge: 'Escuelas de conducción y centros formativos aislados sin salida a internet para reporte de asistencia física.',
    impact: 'Captura y sincronización local en tiempo real con relojes biométricos vía Telnet para reportes de escuelas de conducción sin salida a internet.',
    imageSrc: '/proyectosSecundarios/BIOMETRICO.webp'
  },
  {
    id: 'mi-istpet-mobile-sec',
    code: 'SYS-09',
    title: 'MIISTPET',
    role: 'Mobile & Integration Developer',
    category: 'mobile',
    categoryLabel: 'MOBILE & CLOUD',
    year: '2025',
    badge: 'CARNETIZACIÓN DIGITAL',
    stack: ['Mobile Client', '.NET Web API', 'TypeScript', 'SQL Server', 'Offline Storage'],
    methodologies: ['Carnetización Digital', 'Validación QR Segura', 'Persistencia Local'],
    challenge: 'Demanda de consultas estudiantiles inmediatas y validación de permisos en sitio sin acudir a ventanilla.',
    impact: 'Solución móvil para carnetización digital, validación de permisos en sitio y consulta segura de notas institucionales.',
    imageSrc: '/proyectosSecundarios/MIISTPET.webp'
  },

  // --- PROYECTOS PERSONALES & SANDBOX ---
  {
    id: 'rpg-expense-tracker',
    code: 'SAND-01',
    title: 'RPG',
    role: 'Mobile Creator & Creative Dev',
    category: 'mobile',
    categoryLabel: 'MOBILE & CLOUD',
    year: '2024',
    badge: 'GAMIFIED FINTECH',
    stack: ['Flutter', 'Dart', 'Local Storage', 'Custom Shaders'],
    methodologies: ['Gamificación FinTech', 'Mecánicas de Progresión RPG', 'Animaciones de Alto Rendimiento'],
    challenge: 'Monotonía y abandono temprano en el registro cotidiano de gastos y finanzas personales.',
    impact: 'Aplicación móvil de finanzas personales con mecánicas de progresión RPG y retroalimentación visual interactiva.',
    githubUrl: 'https://github.com/AlexanderMartinez0410/Gestor-Gastos',
    imageSrc: '/proyectosSecundarios/MAtchQuest.webp'
  },
  {
    id: 'frontend-logbook-vanilla',
    code: 'SAND-02',
    title: 'Frontend Logbook',
    role: 'Frontend Vanilla Specialist',
    category: 'frontend',
    categoryLabel: 'FRONTEND & UI',
    year: '2024',
    badge: 'VANILLA MASTERY',
    stack: ['HTML5 Semántico', 'CSS3 Puro', 'JavaScript Nativo (ES6+)', 'DOM API'],
    methodologies: ['No-Framework Vanilla Mastery', 'Manipulación Directa del DOM', 'Estándares W3C Estrictos'],
    challenge: 'Dependencia excesiva de librerías y abstracciones automáticas en el diseño de interfaces complejas.',
    impact: 'Reconstrucción pixel-perfect de interfaces complejas prescindiendo intencionalmente de frameworks para mantener dominio estricto del DOM y estándares web.',
    githubUrl: 'https://github.com/AlexanderMartinez0410/Frontend-Logbook',
    imageSrc: '/proyectosSecundarios/FroontDe.webp'
  }
];

