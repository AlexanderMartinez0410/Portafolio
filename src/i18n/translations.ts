import type { Language } from '../types/i18n';
import type { Project, CatalogProject } from '../types';

export interface Translations {
  nav: {
    'sobre-mi': string;
    proyectos: string;
    experimentos: string;
    experiencia: string;
    contacto: string;
  };
  sidebar: {
    roomNavigation: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    language: string;
    status: string;
    mobileNavTitle: string;
    closeMenu: string;
    directContact: string;
    scrollDown: string;
    phoneCopied: string;
  };
  hero: {
    sectionTag: string;
    role: string;
    editionPrefix: string;
    dateLocale: string;
    headline: string;
    intro1: string;
    intro2: string;
    stackHeader: string;
    stackCategories: {
      frontend: string;
      backend: string;
      data: string;
      ai: string;
    };
    pillarsHeader: string;
    pillarsTag: string;
    pillars: { title: string; detail: string }[];
    exploreSkillsCta: string;
    explorePillarsCta: string;
    stackCtaTitle: string;
    stackCtaSubtitle: string;
    stackCtaButton: string;
    skillsHeader: string;
    skillsTag: string;
    skillsAllTab: string;
    skillsCategoryLabels: Record<string, string>;
    skillsDisclaimer: string;
    toggleSkillsOpen: string;
    toggleSkillsClose: string;
    tierLegend: {
      l7: string;
      l6: string;
      l5: string;
      l4: string;
      l3: string;
      l2: string;
      l1: string;
    };
    skillsGlobalOverview: {
      title: string;
      tag: string;
      profileSummary: string;
      sfiaScope: string;
      productionHighlights: string[];
      calloutHint: string;
    };
    skillsCategoryInsights: Record<
      string,
      {
        title: string;
        tag: string;
        capabilities: string;
        productionCases: string;
        engineeringRationale: string;
        keyHighlights: string[];
      }
    >;
  };
  projects: {
    sectionTag: string;
    triadCount: (count: number) => string;
    categories: Record<string, string>;
    yearType: string;
    roleLabel: string;
    techUsed: string;
    methodologiesLabel: string;
    challenge: string;
    solution: string;
    viewProject: string;
    viewCode: string;
    catalogTitle: string;
    catalogSubtitle: string;
    openCatalog: string;
    closeCatalog: string;
    filterLabel: string;
    codeLabel: string;
    impactLabel: string;
    backToProjects: string;
  };
  experience: {
    sectionTag: string;
    tag: string;
    experienceTitle: string;
    milestonesTitle: string;
    certificationsTitle: string;
    certificationsTag: string;
    viewCredential: string;
    degreeStatusPending: string;
  };
  lab: {
    sectionTag: string;
    tag: string;
    headline: string;
    returnToLab: string;
    filterLabel: string;
    filters: {
      all: string;
      'ui-ux': string;
      '3d-webgl': string;
      'ai-llm': string;
      'audio-dsp': string;
      'cli-systems': string;
    };
  };
  contact: {
    sectionTag: string;
    tag: string;
    headline: string;
    subheadline: string;
    directEmail: string;
    copyEmail: string;
    copied: string;
    cvDownload: string;
    profilesTitle: string;
    timezoneTitle: string;
    locationLabel: string;
    availabilityLabel: string;
  };
  quickContact: {
    directLabel: string;
    emailTooltip: string;
    whatsappTooltip: string;
    phoneTooltip: string;
    copied: string;
    whatsappGreeting: string;
  };
  footerNav: {
    prev: string;
    next: string;
    start: string;
    end: string;
  };
}

export const translations: Record<Language, Translations> = {
  es: {
    nav: {
      'sobre-mi': 'SOBRE MÍ',
      proyectos: 'PROYECTOS',
      experimentos: 'EXPERIMENTOS',
      experiencia: 'EXPERIENCIA',
      contacto: 'CONTACTO'
    },
    sidebar: {
      roomNavigation: '// NAVEGACIÓN DE SALAS',
      theme: 'TEMA',
      themeLight: 'MODO CLARO',
      themeDark: 'MODO OSCURO',
      language: 'IDIOMA',
      status: 'DISPONIBLE // REMOTO (UTC-5)',
      mobileNavTitle: 'NAVEGACIÓN',
      closeMenu: 'Cerrar menú',
      directContact: '// CANALES DE CONTACTO',
      scrollDown: '[ EXPLORAR CONTENIDO ↓ ]',
      phoneCopied: '¡TELÉFONO COPIADO!'
    },
    hero: {
      sectionTag: 'SOBRE MÍ & ENFOQUE',
      role: 'FULL STACK ENGINEER | FRONTEND ARCHITECTURE & APPLIED AI',
      editionPrefix: 'EDICIÓN:',
      dateLocale: 'es-ES',
      headline:
        'Ingeniería Full Stack con foco en arquitecturas frontend resilientes, sistemas institucionales y automatización con IA.',
      intro1:
        'Especializado en el desarrollo de aplicaciones web de alto rendimiento (Angular 20/21 SSR, React, TypeScript, PrimeNG) y soluciones móviles en Flutter. Diseño interfaces accesibles, tolerantes a fallos y desacopladas de la persistencia de datos.',
      intro2:
        'Cuento con probada experiencia interviniendo y modernizando sistemas sobre bases de datos corporativas con más de 20 años en producción, respaldado por arquitecturas limpias en .NET 8 (CQRS / MediatR), microservicios en Python y flujos asistidos por IA.',
      stackHeader: 'STACK TECNOLÓGICO & ARSENAL TÉCNICO',
      stackCategories: {
        frontend: 'FRONTEND & CREATIVE DEV',
        backend: 'BACKEND & ARQUITECTURA',
        data: 'DATOS, INFRA & CLOUD',
        ai: 'IA APLICADA & METODOLOGÍA'
      },
      pillarsHeader: 'CÓMO TRABAJO // ENFOQUE DE INGENIERÍA',
      pillarsTag: '[ FILOSOFÍA TÉCNICA ]',
      pillars: [
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
      ],
      exploreSkillsCta: 'EXPLORAR HABILIDADES & COMPETENCIAS',
      explorePillarsCta: 'CÓMO TRABAJO // FILOSOFÍA',
      stackCtaTitle: '¿QUIERES CONOCER EL NIVEL EN CADA TECNOLOGÍA Y HABILIDAD?',
      stackCtaSubtitle: 'Autoevaluación interactiva, métricas reales en producción, competencias técnicas y blandas.',
      stackCtaButton: 'VER HABILIDADES & COMPETENCIAS',
      skillsHeader: 'HABILIDADES & COMPETENCIAS',
      skillsTag: 'COMPETENCIAS TÉCNICAS & HABILIDADES INTERPERSONALES · MARCO SFIA',
      skillsAllTab: 'TODOS',
      skillsCategoryLabels: {
        FRONTEND: 'FRONTEND',
        BACKEND: 'BACKEND',
        'BASES DE DATOS': 'BASES DE DATOS',
        'DEVOPS & CLOUD': 'DEVOPS & CLOUD',
        'IA APLICADA': 'IA APLICADA',
        'HABILIDADES BLANDAS': 'HABILIDADES BLANDAS',
      },
      skillsDisclaimer: 'Calificado según los 7 niveles del marco internacional SFIA. Combina rigor técnico en producción con sólidas habilidades blandas orientadas a la colaboración y entrega de resultados.',
      toggleSkillsOpen: '[ HABILIDADES & COMPETENCIAS ↓ ]',
      toggleSkillsClose: '[ OCULTAR COMPETENCIAS ↑ ]',
      tierLegend: {
        l7: 'L7 · Fijar Estrategia / Dirección',
        l6: 'L6 · Iniciar e Influir / Principal',
        l5: 'L5 · Asegurar / Liderazgo Técnico',
        l4: 'L4 · Habilitar / Desarrollo Autónomo',
        l3: 'L3 · Aplicar / Implementación',
        l2: 'L2 · Asistir / Integración',
        l1: 'L1 · Seguir / Herramientas Básicas',
      },
      skillsGlobalOverview: {
        title: 'PANORAMA DE INGENIERÍA, STACK & DINÁMICA HUMANA',
        tag: 'RESUMEN GLOBAL EN PRODUCCIÓN',
        profileSummary: 'Perfil integral que combina ingeniería Full Stack orientada a modernización de plataformas empresariales sobre bases de datos , arquitecturas frontend desacopladas (Angular SSR, React), APIs limpias en .NET 8 y sólidas habilidades de comunicación, trabajo en equipo y empatía con el usuario.',
        sfiaScope: 'Alcance SFIA activo hasta Nivel 5 (Ensure / Advise - Liderazgo Técnico y Aseguramiento Arquitectónico) en Frontend, Backend .NET, Datos y Dinámica de Equipo.',
        productionHighlights: [
          '5 Áreas Técnicas + Habilidades Blandas',
          'Modernización de Esquemas de +20 Años',
          'Arquitecturas Limpias (Clean / CQRS / SSR)',
          'Comunicación Asertiva & Trabajo en Equipo',
        ],
        calloutHint: 'Selecciona una categoría arriba para ver el listado detallado y el informe de experiencia y dinámica laboral.',
      },
      skillsCategoryInsights: {
        FRONTEND: {
          title: 'INGENIERÍA FRONTEND & ARQUITECTURAS REACTIVAS',
          tag: 'EXPERIENCIA EN PRODUCCIÓN',
          capabilities: 'Dominio avanzado en Angular (20/21 SSR con Signals), React, TypeScript estricto, sistemas de diseño (PrimeNG, Tailwind CSS), Flutter en mobile y gráficos 3D en WebGL/Three.js.',
          productionCases: 'Implementado en portales corporativos e institucionales de alta concurrencia, modernizando sistemas críticos con más de 20 años en producción hacia SPAs modulares, rápidas y accesibles.',
          engineeringRationale: 'Desacoplo estrictamente la capa visual de la persistencia de datos. Esto previene roturas por cambios en esquemas legados, acelera el renderizado y asegura mantenibilidad a largo plazo.',
          keyHighlights: ['SSR & Hidratación', 'Sistemas de Diseño Rigurosos', 'Manejo Desacoplado de Estado', 'Optimización Core Web Vitals'],
        },
        BACKEND: {
          title: 'ARQUITECTURA DE SERVICIOS & APIS RESILIENTES',
          tag: 'EXPERIENCIA EN PRODUCCIÓN',
          capabilities: 'Diseño backend en .NET 8 (ASP.NET Core), C# con Clean Architecture, CQRS, MediatR, microservicios en Python (FastAPI/Flask) y Entity Framework Core.',
          productionCases: 'Construcción de capas seguras de abstracción mediante APIs REST sobre bases relacionales legadas, permitiendo interoperabilidad continua sin riesgo de bloqueo.',
          engineeringRationale: 'Aplico CQRS y segregación de interfaces para aislar comandos de consultas, logrando trazabilidad exhaustiva de errores, validaciones tempranas y servicios escalables de forma independiente.',
          keyHighlights: ['Clean Architecture & CQRS', 'Autenticación JWT / RBAC', 'Manejo Global de Excepciones', 'Resiliencia de Conexión'],
        },
        'BASES DE DATOS': {
          title: 'PERSISTENCIA TRANSACCIONAL & BASES DE DATOS',
          tag: 'EXPERIENCIA EN PRODUCCIÓN',
          capabilities: 'Especialista en SQL Server corporativo, MySQL, PostgreSQL, optimización de procedimientos almacenados (SPs), almacenamiento en memoria con Redis (Pub/Sub) y Firebase Firestore.',
          productionCases: 'Optimización y modernización de esquemas relacionales complejos y stored procedures con más de dos décadas en producción activa sobre millones de registros.',
          engineeringRationale: 'Priorizo la consistencia ACID en transacciones críticas, el indexado estratégico para eliminar cuellos de botella y la separación de lecturas mediante cachés.',
          keyHighlights: ['SQL Server & Consultas Complejas', 'Procedimientos Almacenados (SPs)', 'Caché Distribuido con Redis', 'PostgreSQL & Modelado ACID'],
        },
        'DEVOPS & CLOUD': {
          title: 'INTEGRACIÓN CONTINUA, CONTENEDORES & DESPLIEGUE',
          tag: 'EXPERIENCIA EN PRODUCCIÓN',
          capabilities: 'Flujos de trabajo en GitLab (L4), pipelines de CI/CD (L3), contenerización con Docker (L3), despliegues en AWS Cloud (L2) y fundamentos de orquestación con Kubernetes (L1).',
          productionCases: 'Diseño de pipelines de build/test/deploy automatizados, creación de imágenes Docker multicapa optimizadas y gestión de repositorios corporativos.',
          engineeringRationale: 'La reproducibilidad de entornos desde desarrollo local hasta producción y la entrega continua sin fricción eliminan errores y aceleran los despliegues.',
          keyHighlights: ['Pipelines CI/CD en GitLab', 'Dockerización Multicapa', 'Control de Versiones & GitFlow', 'AWS Cloud (Infraestructura Base)'],
        },
        'IA APLICADA': {
          title: 'INGENIERÍA ASISTIDA POR IA & ENTORNOS AGÉNTICOS',
          tag: 'EXPERIENCIA EN PRODUCCIÓN',
          capabilities: 'Flujos avanzados de codificación agéntica con IDEs potenciados por IA (Cursor, Antigravity CLI / AGY, Claude Code), APIs de LLMs (Claude, Gemini, Groq), Spec-Driven Dev con IA y ADRs.',
          productionCases: 'Desarrollo acelerado de aplicaciones full stack, refactorizaciones guiadas por agentes con especificaciones formales, creación de asistentes y auditoría determinista de código.',
          engineeringRationale: 'Aprovecho la IA como un multiplicador de velocidad y alcance técnico, combinándolo siempre con arquitectura limpia, validación determinista y criterio humano riguroso.',
          keyHighlights: ['Agentic Coding (Cursor / AGY)', 'Spec-Driven Development con IA', 'Integración APIs Claude & Gemini', 'Auditoría Determinista de Código'],
        },
        'HABILIDADES BLANDAS': {
          title: 'HABILIDADES INTERPERSONALES & DINÁMICA DE TRABAJO',
          tag: 'ENFOQUE PARA RECURSOS HUMANOS / RH',
          capabilities: 'Comunicación asertiva con clientes y directivos, escucha activa, colaboración constructiva en equipos multidisciplinarios, autonomía, gestión del tiempo y empatía con las necesidades de negocio.',
          productionCases: 'Experiencia directa interactuando con usuarios no técnicos para levantamiento de requerimientos, capacitación de personal operativo y coordinación transparente con líderes de proyecto.',
          engineeringRationale: 'El desarrollo de software tiene impacto cuando resuelve problemas humanos reales. Priorizo la responsabilidad, el buen clima laboral y la claridad en los compromisos asumidos.',
          keyHighlights: ['Comunicación Asertiva & Clientes', 'Trabajo en Equipo & Buen Clima', 'Autonomía & Responsabilidad (Ownership)', 'Capacidad de Escucha y Empatía', 'Rápida Adaptabilidad al Cambio'],
        },
      },
    },
    projects: {
      sectionTag: 'CASOS DE ESTUDIO // TRÍADA DESTACADA',
      triadCount: (count: number) => `[ ${count} PROYECTOS PRINCIPALES ]`,
      categories: {
        all: 'TODOS',
        frontend: 'FRONTEND & UI',
        backend: 'BACKEND & ARQUITECTURA',
        fullstack: 'FULL STACK & SISTEMAS',
        mobile: 'MOBILE & CLOUD',
        ai: 'IA & HARDWARE'
      },
      yearType: 'AÑO & TIPO DE PROYECTO',
      roleLabel: 'ROL // RESPONSABILIDAD',
      techUsed: 'STACK TECNOLÓGICO',
      methodologiesLabel: 'METODOLOGÍAS & PATRONES',
      challenge: 'DESAFÍO & ARQUITECTURA',
      solution: 'SOLUCIÓN & CARACTERÍSTICAS TÉCNICAS',
      viewProject: '[ VER EN PRODUCCIÓN ]',
      viewCode: '[ CÓDIGO FUENTE ]',
      catalogTitle: 'CATÁLOGO COMPLETO DE PROYECTOS',
      catalogSubtitle: 'Ver todas las aplicaciones, subsistemas institucionales y sandboxes (+11)',
      openCatalog: '[ ABRIR CATÁLOGO ]',
      closeCatalog: '[ CERRAR CATÁLOGO ]',
      filterLabel: 'FILTRAR POR DISCIPLINA:',
      codeLabel: 'CÓDIGO',
      impactLabel: 'IMPACTO & TÉCNICA',
      backToProjects: '[ VOLVER A LA TRÍADA ]'
    },
    experience: {
      sectionTag: 'TRAYECTORIA & RECONOCIMIENTOS',
      tag: '[ HISTORIAL TÉCNICO ]',
      experienceTitle: 'EXPERIENCIA PROFESIONAL & PRODUCCIÓN',
      milestonesTitle: 'HITOS, FORMACIÓN & LOGROS TÉCNICOS',
      certificationsTitle: 'CERTIFICACIONES & CREDENCIALES TÉCNICAS',
      certificationsTag: '[ CREDENCIALES VERIFICABLES ]',
      viewCredential: 'VER CREDENCIAL ↗',
      degreeStatusPending: 'EN PROCESO DE REGISTRO SENESCYT'
    },
    lab: {
      sectionTag: 'LABORATORIO EXPERIMENTAL & PROTOTIPOS',
      tag: '[ CREATIVE DEV & WEBGL ]',
      headline:
        'Espacio de exploración técnica: emuladores interactivos, gráficos 3D en WebGL, Web Audio API y experimentos asistidos por IA.',
      returnToLab: '[ ← VOLVER AL LABORATORIO ]',
      filterLabel: 'FILTRAR POR CATEGORÍA:',
      filters: {
        all: 'TODOS',
        'ui-ux': 'UI & INTERFACE MOTION',
        '3d-webgl': '3D & WEBGL',
        'ai-llm': 'IA & STREAMING',
        'audio-dsp': 'WEB AUDIO API',
        'cli-systems': 'CLI & SISTEMAS'
      }
    },
    contact: {
      sectionTag: 'CONTACTO',
      tag: '[ HABLEMOS ]',
      headline: '¿TIENES UN PROYECTO O UNA VACANTE? HABLEMOS.',
      subheadline:
        'Estoy disponible para unirme a equipos de tecnología a tiempo completo (remoto internacional B2B o híbrido), colaborar en proyectos freelance de alta exigencia o modernizar infraestructuras críticas.',
      directEmail: 'CORREO ELECTRÓNICO DIRECTO',
      copyEmail: '[ COPIAR CORREO ]',
      copied: '[ ¡CORREO COPIADO! ]',
      cvDownload: '[ DESCARGAR DOSSIER / CV (PDF) ]',
      profilesTitle: 'REDES & REPOSITORIOS',
      timezoneTitle: 'ZONA HORARIA & UBICACIÓN',
      locationLabel: 'UBICACIÓN PRINCIPAL',
      availabilityLabel: 'MODALIDAD DISPONIBLE'
    },
    quickContact: {
      directLabel: 'CANALES',
      emailTooltip: 'CORREO DIRECTO',
      whatsappTooltip: 'WHATSAPP DIRECTO',
      phoneTooltip: 'LLAMAR / CONTACTO',
      copied: '¡COPIADO!',
      whatsappGreeting: 'Hola Alexander, he visto tu portafolio y me gustaría conversar sobre una oportunidad.'
    },
    footerNav: {
      prev: 'ANTERIOR',
      next: 'SIGUIENTE',
      start: '// INICIO DEL CATÁLOGO',
      end: '// FIN DEL CATÁLOGO'
    }
  },
  en: {
    nav: {
      'sobre-mi': 'ABOUT ME',
      proyectos: 'PROJECTS',
      experimentos: 'EXPERIMENTS',
      experiencia: 'EXPERIENCE',
      contacto: 'CONTACT'
    },
    sidebar: {
      roomNavigation: '// EXHIBIT NAVIGATION',
      theme: 'THEME',
      themeLight: 'LIGHT MODE',
      themeDark: 'DARK MODE',
      language: 'LANGUAGE',
      status: 'AVAILABLE // REMOTE (UTC-5)',
      mobileNavTitle: 'NAVIGATION',
      closeMenu: 'Close menu',
      directContact: '// DIRECT CONTACT CHANNELS',
      scrollDown: '[ EXPLORE CONTENT ↓ ]',
      phoneCopied: 'PHONE COPIED!'
    },
    hero: {
      sectionTag: 'ABOUT ME & APPROACH',
      role: 'FULL STACK ENGINEER | FRONTEND ARCHITECTURE & APPLIED AI',
      editionPrefix: 'EDITION:',
      dateLocale: 'en-US',
      headline:
        'Full Stack Engineering focusing on resilient frontend architectures, institutional platforms, and AI-driven automation.',
      intro1:
        'Specialized in building high-performance web applications (Angular 20/21 SSR, React, TypeScript, PrimeNG) and mobile solutions with Flutter. I design accessible, fault-tolerant user interfaces cleanly decoupled from underlying data layers.',
      intro2:
        'Proven track record modernizing enterprise platforms over legacy relational databases with 20+ years in production, backed by Clean Architecture in .NET 8 (CQRS / MediatR), Python microservices, and AI-augmented engineering.',
      stackHeader: 'TECH STACK & TECHNICAL ARSENAL',
      stackCategories: {
        frontend: 'FRONTEND & CREATIVE DEV',
        backend: 'BACKEND & ARCHITECTURE',
        data: 'DATA, INFRA & CLOUD',
        ai: 'APPLIED AI & METHODOLOGY'
      },
      pillarsHeader: 'HOW I BUILD // ENGINEERING PHILOSOPHY',
      pillarsTag: '[ CORE PILLARS ]',
      pillars: [
        {
          title: 'RIGOROUS FRONTEND ENGINEERING & DESIGN SYSTEMS',
          detail:
            'Prioritizing accessible, fault-tolerant interfaces strictly aligned with corporate design systems, cleanly decoupling presentation logic from data consumers.'
        },
        {
          title: 'LEGACY SYSTEM MODERNIZATION & RESILIENCE',
          detail:
            'Demonstrated ability to design modern abstraction layers (.NET REST APIs, Angular SPAs, UI/UX refactoring) over monolithic databases with over two decades in production.'
        },
        {
          title: 'PRAGMATIC AI INTEGRATION & AUTOMATION',
          detail:
            'Leveraging LLMs and AI as technical augmentation tools while preserving strict human architectural judgment and deterministically verifying all outputs.'
        },
        {
          title: 'END-TO-END USER-CENTRIC SOFTWARE DELIVERY',
          detail:
            'Executing the full software lifecycle: technical requirements gathering, schema modeling, full stack engineering, deployment, and direct operator training.'
        }
      ],
      exploreSkillsCta: 'EXPLORE SKILLS & COMPETENCIES',
      explorePillarsCta: 'HOW I BUILD // PHILOSOPHY',
      stackCtaTitle: 'WANT TO SEE THE PROFICIENCY IN EACH TECH & SOFT SKILL?',
      stackCtaSubtitle: 'Interactive self-assessment, real production metrics, technical and interpersonal competencies.',
      stackCtaButton: 'VIEW SKILLS & COMPETENCIES',
      skillsHeader: 'SKILLS & COMPETENCIES',
      skillsTag: 'TECHNICAL PROFILE & SOFT SKILLS · SFIA FRAMEWORK',
      skillsAllTab: 'ALL',
      skillsCategoryLabels: {
        FRONTEND: 'FRONTEND',
        BACKEND: 'BACKEND',
        'BASES DE DATOS': 'DATABASES',
        'DEVOPS & CLOUD': 'DEVOPS & CLOUD',
        'IA APLICADA': 'APPLIED AI',
        'HABILIDADES BLANDAS': 'SOFT SKILLS',
      },
      skillsDisclaimer: 'Rated according to the global 7-level SFIA framework. Combines technical depth in production with solid interpersonal skills focused on teamwork and value delivery.',
      toggleSkillsOpen: '[ SKILLS & COMPETENCIES ↓ ]',
      toggleSkillsClose: '[ HIDE COMPETENCIES ↑ ]',
      tierLegend: {
        l7: 'L7 · Set Strategy / Executive',
        l6: 'L6 · Initiate & Influence / Principal',
        l5: 'L5 · Ensure & Advise / Technical Leadership',
        l4: 'L4 · Enable / Autonomous Delivery',
        l3: 'L3 · Apply / Implementation',
        l2: 'L2 · Assist / Integration',
        l1: 'L1 · Follow / Basic Tooling',
      },
      skillsGlobalOverview: {
        title: 'CROSS-STACK ENGINEERING & INTERPERSONAL DYNAMICS',
        tag: 'GLOBAL PRODUCTION SUMMARY',
        profileSummary: 'Comprehensive Full Stack Engineering profile specializing in enterprise platform modernization, legacy database integration, decoupled frontend architectures (Angular SSR and React), and clean .NET 8 APIs, complemented by strong communication, teamwork, and user empathy.',
        sfiaScope: 'Active SFIA scope up to Level 5 (Ensure / Advise - Technical Leadership & Architectural Assurance) across Frontend, .NET Backend, Data Layers, and Team Dynamics.',
        productionHighlights: [
          '5 Technical Areas + Soft Skills',
          'Modernization Over 20+ Year Legacy Databases',
          'Clean Architecture (Clean / CQRS / SSR)',
          'Assertive Communication & Teamwork',
        ],
        calloutHint: 'Select any category above to view individual competencies and the deep-dive workplace report.',
      },
      skillsCategoryInsights: {
        FRONTEND: {
          title: 'FRONTEND ENGINEERING & REACTIVE ARCHITECTURES',
          tag: 'PRODUCTION EXPERIENCE',
          capabilities: 'Advanced proficiency in Angular (20/21 SSR with Signals), React, strict TypeScript, design systems (PrimeNG, Tailwind CSS), Flutter on mobile, and 3D graphics in WebGL/Three.js.',
          productionCases: 'Engineered high-concurrency institutional web platforms, modernizing legacy enterprise systems with 20+ years in production into resilient, accessible SPAs.',
          engineeringRationale: 'I strictly decouple presentation layers from data providers, preventing breaking changes from legacy schemas while ensuring instant response and zero performance degradation.',
          keyHighlights: ['SSR & Hydration', 'Rigorous Design Systems', 'Decoupled State Management', 'Web Vitals Optimization'],
        },
        BACKEND: {
          title: 'SERVICE ARCHITECTURE & RESILIENT APIS',
          tag: 'PRODUCTION EXPERIENCE',
          capabilities: 'Backend engineering in .NET 8 (ASP.NET Core), C# with Clean Architecture, CQRS, MediatR, Python microservices (FastAPI/Flask), and EF Core persistence.',
          productionCases: 'Built secure abstraction API layers over monolithic enterprise databases, allowing modern applications to interact with mission-critical data with zero downtime.',
          engineeringRationale: 'Employing CQRS and interface segregation isolates read and write pipelines, providing deterministic error tracking, early validation, and independently scalable services.',
          keyHighlights: ['Clean Architecture & CQRS', 'JWT / RBAC Security', 'Global Exception Handling', 'Connection Resilience'],
        },
        'BASES DE DATOS': {
          title: 'TRANSACTIONAL STORAGE & RELATIONAL DATABASES',
          tag: 'PRODUCTION EXPERIENCE',
          capabilities: 'Enterprise SQL Server, MySQL, PostgreSQL, stored procedure optimization, in-memory caching with Redis (Pub/Sub), and real-time syncing with Firebase Firestore.',
          productionCases: 'Optimized and modernized complex relational schemas and stored procedures operating in mission-critical production for 20+ years.',
          engineeringRationale: 'Prioritizing ACID transactional integrity, strategic query indexing to remove latency bottlenecks, and read caching.',
          keyHighlights: ['SQL Server & Complex Stored Procs', 'PostgreSQL & ACID Modeling', 'Redis Distributed Caching', 'Relational Schema Optimization'],
        },
        'DEVOPS & CLOUD': {
          title: 'CONTINUOUS INTEGRATION, CONTAINERS & DEPLOYMENT',
          tag: 'PRODUCTION EXPERIENCE',
          capabilities: 'Version control & repository governance in GitLab (L4), CI/CD automated pipelines (L3), Docker containerization (L3), AWS Cloud builder (L2), and Kubernetes fundamentals (L1).',
          productionCases: 'Engineered automated build/test/deploy pipelines, created multi-stage optimized Docker images, and managed repository branch protection.',
          engineeringRationale: 'Ensuring total environment reproducibility from local dev to staging/production, eliminating deployment friction and human error.',
          keyHighlights: ['GitLab CI/CD Automated Pipelines', 'Multi-Stage Docker Containers', 'GitFlow & Repository Strategy', 'AWS Cloud Fundamentals'],
        },
        'IA APLICADA': {
          title: 'AI-AUGMENTED ENGINEERING & AGENTIC WORKFLOWS',
          tag: 'PRODUCTION EXPERIENCE',
          capabilities: 'Advanced agentic coding with AI-powered IDEs (Cursor, Google Antigravity CLI / AGY, Claude Code), LLM APIs (Claude, Gemini, Groq), Spec-Driven Development, and Architecture Decision Records (ADRs).',
          productionCases: 'High-velocity full-stack engineering, agent-guided legacy refactoring via formal specs, automated code audits, and conversational institutional bots.',
          engineeringRationale: 'Using AI as a technical velocity multiplier, strictly bound by human architectural judgment, Clean Architecture principles, and deterministic verification.',
          keyHighlights: ['Agentic Coding (Cursor / AGY)', 'AI Spec-Driven Development', 'Claude & Gemini API Integrations', 'Deterministic Code Audits'],
        },
        'HABILIDADES BLANDAS': {
          title: 'INTERPERSONAL SKILLS & WORKPLACE DYNAMICS',
          tag: 'HUMAN RESOURCES (HR) OVERVIEW',
          capabilities: 'Clear and assertive communication with clients and executives, active listening, constructive collaboration in multidisciplinary teams, ownership, time management, and business empathy.',
          productionCases: 'Direct experience collaborating with non-technical users for requirement elicitation, operational training, and transparent communication with project leaders.',
          engineeringRationale: 'Software delivers true impact when it solves real human needs. I prioritize ethical accountability, team morale, and reliability in every commitment.',
          keyHighlights: ['Assertive Communication & Client-Facing', 'Teamwork & Positive Culture', 'Ownership & Accountability', 'Empathy & Active Listening', 'Fast Adaptability to Change'],
        },
      },
    },
    projects: {
      sectionTag: 'CASE STUDIES // FEATURED TRIAD',
      triadCount: (count: number) => `[ ${count} PRIMARY PROJECTS ]`,
      categories: {
        all: 'ALL',
        frontend: 'FRONTEND & UI',
        backend: 'BACKEND & ARCHITECTURE',
        fullstack: 'FULL STACK & SYSTEMS',
        mobile: 'MOBILE & CLOUD',
        ai: 'AI & HARDWARE'
      },
      yearType: 'YEAR & PROJECT TYPE',
      roleLabel: 'ROLE // RESPONSIBILITY',
      techUsed: 'TECH STACK',
      methodologiesLabel: 'METHODOLOGIES & PATTERNS',
      challenge: 'CHALLENGE & ARCHITECTURE',
      solution: 'TECHNICAL SOLUTION & SPECS',
      viewProject: '[ VIEW IN PRODUCTION ]',
      viewCode: '[ SOURCE CODE ]',
      catalogTitle: 'COMPLETE PROJECT CATALOG',
      catalogSubtitle: 'Explore all institutional subsystems, apps, and sandbox projects (+11)',
      openCatalog: '[ OPEN CATALOG ]',
      closeCatalog: '[ CLOSE CATALOG ]',
      filterLabel: 'FILTER BY DISCIPLINE:',
      codeLabel: 'CODE',
      impactLabel: 'IMPACT & TECHNIQUE',
      backToProjects: '[ BACK TO FEATURED TRIAD ]'
    },
    experience: {
      sectionTag: 'CAREER & ACHIEVEMENTS',
      tag: '[ TECHNICAL TIMELINE ]',
      experienceTitle: 'PROFESSIONAL EXPERIENCE & PRODUCTION',
      milestonesTitle: 'MILESTONES, EDUCATION & ACHIEVEMENTS',
      certificationsTitle: 'CERTIFICATIONS & TECHNICAL CREDENTIALS',
      certificationsTag: '[ VERIFIABLE CREDENTIALS ]',
      viewCredential: 'VIEW CREDENTIAL ↗',
      degreeStatusPending: 'SENESCYT REGISTRATION IN PROGRESS'
    },
    lab: {
      sectionTag: 'EXPERIMENTAL LAB & PROTOTYPES',
      tag: '[ CREATIVE DEV & WEBGL ]',
      headline:
        'Technical sandbox: interactive terminal emulators, 3D WebGL scenes, Web Audio synthesis, and in-browser AI experiments.',
      returnToLab: '[ ← BACK TO LAB ]',
      filterLabel: 'FILTER BY CATEGORY:',
      filters: {
        all: 'ALL',
        'ui-ux': 'UI & INTERFACE MOTION',
        '3d-webgl': '3D & WEBGL',
        'ai-llm': 'AI & STREAMING',
        'audio-dsp': 'WEB AUDIO API',
        'cli-systems': 'CLI & SYSTEMS'
      }
    },
    contact: {
      sectionTag: 'CONTACT',
      tag: '[ LET’S TALK ]',
      headline: 'HAVE A PROJECT OR AN OPEN ROLE? LET’S TALK.',
      subheadline:
        'I am available to join engineering teams full-time (international remote B2B or hybrid), collaborate on high-demand freelance projects, or modernize mission-critical systems.',
      directEmail: 'DIRECT EMAIL ADDRESS',
      copyEmail: '[ COPY EMAIL ]',
      copied: '[ EMAIL COPIED! ]',
      cvDownload: '[ DOWNLOAD DOSSIER / CV (PDF) ]',
      profilesTitle: 'PROFILES & REPOSITORIES',
      timezoneTitle: 'TIMEZONE & LOCATION',
      locationLabel: 'PRIMARY LOCATION',
      availabilityLabel: 'AVAILABLE MODE'
    },
    quickContact: {
      directLabel: 'CHANNELS',
      emailTooltip: 'DIRECT EMAIL',
      whatsappTooltip: 'DIRECT WHATSAPP',
      phoneTooltip: 'CALL / REACH OUT',
      copied: 'COPIED!',
      whatsappGreeting: 'Hi Alexander, I saw your portfolio and would like to talk about an opportunity.'
    },
    footerNav: {
      prev: 'PREVIOUS',
      next: 'NEXT',
      start: '// CATALOG START',
      end: '// CATALOG END'
    }
  }
};

export const getLocalizedProjects = (lang: Language): Project[] => {
  if (lang === 'es') {
    return [
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
  }

  return [
    {
      id: 'ammi-online',
      index: '01',
      title: 'AMMI ONLINE // INSTITUTIONAL PLATFORM & ACADEMIC SUITE',
      role: 'Project Lead & Lead Full Stack Engineer',
      meta: '[ ANGULAR 20 SSR / .NET 8 / POSTGRESQL / CLEAN ARCHITECTURE / CQRS ]',
      year: '2025 — 2026',
      technologies: ['Angular 20 SSR', '.NET 8', 'PostgreSQL', 'C#', 'TypeScript', 'PrimeNG 21', 'Tailwind CSS'],
      methodologies: ['Clean Architecture (4 Layers)', 'CQRS & MediatR', 'Server-Side Rendering (SSR)', 'Automated Report Generation Engine', 'CORS & Security Policies'],
      format: '[ PRODUCTION // CLEAN ARCHITECTURE ]',
      challenge:
        'Total absence of digital infrastructure: operations, admissions, and academic reports were managed manually across Excel sheets, loose Drive Word docs, and physical paper binders.',
      summary:
        'Technical leadership and full stack engineering of the enterprise institutional portal using Angular 20 SSR, .NET 8 Clean Architecture, and PostgreSQL, achieving 100% digitalization and instant automated reports.',
      liveUrl: 'https://ammionline.ammi.edu.ec/#/',
      visualType: 'image',
      imageSrc: '/images/AmmiOnline.webp',
      metrics: [
        { label: 'REPORT GENERATION', value: '2 MIN (WAS 2 WEEKS)' },
        { label: 'DIGITALIZATION', value: '100% PROCESSES' },
        { label: 'PERSISTENCE', value: 'CENTRALIZED POSTGRESQL' }
      ]
    },
    {
      id: 'bioregistro',
      index: '02',
      title: 'BIOREGISTRO // MOBILE BIOMETRIC ATTENDANCE & ANTI-FRAUD',
      role: 'Sole Software Engineer & Mobile Lead',
      meta: '[ FLUTTER / LOCAL AUTH / GPS HAVERSINE / FIREBASE / DEVICE LOCK ]',
      year: '2025',
      technologies: ['Flutter SDK', 'Dart', 'Firebase Firestore', 'Firebase Auth', 'Local Auth', 'OpenStreetMap'],
      methodologies: ['Feature-First Architecture', 'Triple Anti-Fraud Barrier', 'Haversine Geofencing', 'Single-Device Lock (UUID)', 'Emergency 5-Day SLA'],
      format: '[ MOBILE // TRIPLE ANTI-FRAUD BARRIER ]',
      challenge:
        'Persistent disputes over faculty attendance where dedicated wall-mounted clocks were cost-prohibitive or prone to identity proxying. Critical 5-day emergency SLA for full production rollout.',
      summary:
        'End-to-end solo engineering: mobile biometric attendance app in Flutter featuring Feature-First Architecture and a triple anti-fraud barrier (native fingerprint/Face ID, Haversine perimeter geofencing, and hardware UUID locking).',
      visualType: 'image',
      imageSrc: '/images/bioregistro.webp',
      metrics: [
        { label: 'PRODUCTION SLA', value: '5 DAYS ROLLOUT' },
        { label: 'IDENTITY FRAUD', value: '0 INCIDENTS' },
        { label: 'HARDWARE CAPEX', value: '$0 SPENT' }
      ]
    },
    {
      id: 'desaparecidos-ec',
      index: '03',
      title: 'DESAPARECIDOS EC // CIVIC RAPID ALERTS & GEOSPATIAL ENGINE',
      role: 'Frontend Lead & UI/UX Engineer',
      meta: '[ FLUTTER / FASTAPI / CELERY / REDIS PUB-SUB / HAVERSINE GEO ]',
      year: '2026',
      technologies: ['Flutter', 'Dart', 'Riverpod 2.6', 'FastAPI', 'Python 3.12', 'Celery', 'Redis Pub/Sub', 'PostgreSQL'],
      methodologies: ['Reactive Frontend Architecture', 'UI/UX Interface & Experience Design', 'Interactive Geospatial Maps', 'Real-Time Alert Rendering'],
      format: '[ CIVIC TECH // LEAD FRONTEND & UI/UX ]',
      challenge:
        'Critical inefficiencies during the "Golden Window" (first 24-48 hours after disappearance). Static social media flyers lack spatial targeting, failing to alert citizens in the immediate perimeter in time.',
      summary:
        'Technical leadership and complete frontend execution & UI/UX design: Flutter client with Riverpod, intuitive civic emergency interface design, interactive perimeter maps, and sub-second real-time alert visualization.',
      visualType: 'image',
      imageSrc: '/images/AlertaDesaparecidos.webp',
      metrics: [
        { label: 'ALERT PROPAGATION', value: '< 3 SECONDS' },
        { label: 'MAP GEO QUERIES', value: '< 200 MS' },
        { label: 'PERIMETER RADIUS', value: '500M — 10KM' }
      ]
    }
  ];
};

export const getLocalizedCatalog = (lang: Language): CatalogProject[] => {
  const isEn = lang === 'en';
  return [
    // --- ECOSISTEMA INSTITUCIONAL ISTPET ---
    {
      id: 'bienestar-institucional',
      code: 'SYS-01',
      title: 'Bienestar ISTPET',
      role: isEn ? 'Full Stack Engineer (.NET + Angular)' : 'Full Stack Engineer (.NET + Angular)',
      category: 'fullstack',
      categoryLabel: isEn ? 'FULL STACK & SYSTEMS' : 'FULL STACK & SISTEMAS',
      year: '2025',
      badge: isEn ? 'SCHOLARSHIPS & CASES' : 'BECAS & CASOS',
      stack: ['Angular', '.NET Core', 'SQL Server', 'Tailwind CSS', 'TypeScript'],
      methodologies: isEn ? ['Monolith Modernization', 'Process Digitalization', 'Validation Workflows'] : ['Modernización de Monolito', 'Digitalización de Procesos', 'Flujos de Validación'],
      challenge: isEn
        ? 'Fragmented management of scholarship applications and vulnerable student records in physical paper binders.'
        : 'Gestión desarticulada de solicitudes de becas y expedientes vulnerables de estudiantes en formatos físicos.',
      impact: isEn
        ? 'Complete digital lifecycle for student cases, scholarship grants, and internal permission workflows.'
        : 'Digitalización del ciclo de vida de casos estudiantiles, gestión de becas y régimen de permisos internos.',
      imageSrc: '/proyectosSecundarios/BIENESTAR.webp'
    },
    {
      id: 'distributivos-istpet',
      code: 'SYS-02',
      title: 'Academia ISTPET',
      role: isEn ? 'Full Stack Engineer (.NET + Angular)' : 'Full Stack Engineer (.NET + Angular)',
      category: 'fullstack',
      categoryLabel: isEn ? 'FULL STACK & SYSTEMS' : 'FULL STACK & SISTEMAS',
      year: '2025',
      badge: isEn ? 'FACULTY WORKLOAD' : 'DISTRIBUTIVOS DOCENTES',
      stack: ['.NET 8', 'Angular', 'TypeScript', 'SQL Server', 'Tailwind CSS'],
      methodologies: isEn ? ['Schedule Orchestration', 'Collision Detection', 'Modular Architecture'] : ['Orquestación de Horarios', 'Detección de Colisiones', 'Arquitectura Modular'],
      challenge: isEn
        ? 'Manual workload generation and recurring collisions across classrooms, subjects, and professor schedules.'
        : 'Generación manual de distributivos y colisión recurrente de aulas, asignaturas y horarios docentes.',
      impact: isEn
        ? 'Automated orchestration of teaching workload distributions, classroom allocations, and academic calendars.'
        : 'Orquestación automatizada de distributivos de carga horaria, asignación de aulas y calendarios docentes.',
      imageSrc: '/proyectosSecundarios/ACADEMIA.webp'
    },
    {
      id: 'rrhh-istpet',
      code: 'SYS-03',
      title: 'RRHH ISTPET',
      role: isEn ? 'Full Stack Engineer (.NET + Angular)' : 'Full Stack Engineer (.NET + Angular)',
      category: 'fullstack',
      categoryLabel: isEn ? 'FULL STACK & SYSTEMS' : 'FULL STACK & SISTEMAS',
      year: '2025',
      badge: isEn ? 'LABOR MINISTRY COMPLIANT' : 'MIN. TRABAJO EC',
      stack: ['Angular', '.NET Core', 'SQL Server', 'Dynamic Templates', 'TypeScript'],
      methodologies: isEn ? ['Dynamic Templating Engine', 'Regulatory Auditing', 'Contract Generation'] : ['Motor de Plantillas Dinámicas', 'Auditoría Normativa', 'Generación de Contratos'],
      challenge: isEn
        ? 'Manual and delayed generation of employment contracts with risks of regulatory non-compliance.'
        : 'Emisión manual y desfasada de contratos laborales con riesgos de inconsistencias legales normativas.',
      impact: isEn
        ? 'Dynamic templating engine for employment contracts strictly complying with Ecuadorian Labor Ministry standards.'
        : 'Motor de plantillas dinámicas para emisión de contratos laborales bajo normativas del Ministerio del Trabajo de Ecuador.',
      imageSrc: '/proyectosSecundarios/RRHH.webp'
    },
    {
      id: 'auth-core-istpet',
      code: 'SYS-04',
      title: 'Admin ISTPET',
      role: isEn ? 'Backend & Security Engineer (.NET)' : 'Backend & Security Engineer (.NET)',
      category: 'backend',
      categoryLabel: isEn ? 'BACKEND & ARCHITECTURE' : 'BACKEND & ARQUITECTURA',
      year: '2025',
      badge: isEn ? 'CENTRALIZED RBAC' : 'RBAC CENTRALIZADO',
      stack: ['.NET Core', 'C#', 'Angular', 'SQL Server', 'JWT Security'],
      methodologies: isEn ? ['Centralized RBAC', 'JWT Token Security', 'Subsystem Decoupling'] : ['RBAC Centralizado', 'Seguridad JWT Token', 'Desacoplamiento de Subsistemas'],
      challenge: isEn
        ? 'Absence of unified access control across multiple institutional web subsystems.'
        : 'Falta de un sistema de control de accesos unificado entre múltiples subsistemas académicos.',
      impact: isEn
        ? 'Centralized Role-Based Access Control (RBAC) module authenticating and authorizing transactions across all apps.'
        : 'Módulo centralizado de control de acceso basado en roles (RBAC) que autentica y autoriza transacciones entre subsistemas.',
      imageSrc: '/proyectosSecundarios/Admin.webp'
    },
    {
      id: 'vita-talleres',
      code: 'SYS-05',
      title: 'VITA',
      role: isEn ? 'Frontend Architect & UI/UX Engineer' : 'Frontend Architect & UI/UX Engineer',
      category: 'frontend',
      categoryLabel: isEn ? 'FRONTEND & UI' : 'FRONTEND & UI',
      year: '2025',
      badge: isEn ? 'UI/UX REFACTOR' : 'REFACTOR UI/UX',
      stack: ['Angular', 'TypeScript', '.NET Web API', 'Tailwind CSS'],
      methodologies: isEn ? ['ChangeDetection OnPush', 'UI/UX Overhaul', 'Component-Driven Dev'] : ['ChangeDetection OnPush', 'Refactorización UI/UX', 'Component-Driven Dev'],
      challenge: isEn
        ? 'Outdated interface and severe operational friction in spare parts stock management and service work orders.'
        : 'Interfaz obsoleta y fricción operativa en control de inventario de repuestos y órdenes de servicio técnico.',
      impact: isEn
        ? 'Comprehensive UI/UX overhaul over legacy backend to optimize usability in workshop inventories and repair pipelines.'
        : 'Reestructuración integral de UI/UX sobre sistema existente para optimizar la usabilidad en inventarios y mantenimiento de talleres mecánicos.',
      imageSrc: '/proyectosSecundarios/VITA.webp'
    },
    {
      id: 'siplici-caces',
      code: 'SYS-06',
      title: 'SIPLECI',
      role: isEn ? 'Frontend & Reporting Engineer' : 'Frontend & Reporting Engineer',
      category: 'frontend',
      categoryLabel: isEn ? 'FRONTEND & UI' : 'FRONTEND & UI',
      year: '2025',
      badge: isEn ? 'CACES ACCREDITATION' : 'ACREDITACIÓN CACES',
      stack: ['Angular', 'TypeScript', '.NET Web API', 'Document Storage'],
      methodologies: isEn ? ['Bulk Evidence Ingestion', 'Accreditation Reporting Engine', 'Strict Schema Validation'] : ['Carga Masiva de Evidencias', 'Motor de Reportes de Acreditación', 'Validación de Formatos'],
      challenge: isEn
        ? 'Complexity and latency in bulk uploading and auditing evidence dossiers for university accreditation.'
        : 'Complejidad y lentitud en la carga masiva y auditoría de evidencias para acreditación de educación superior.',
      impact: isEn
        ? 'Modernized dynamic interface for bulk evidence ingestion and automated audit report generation for CACES auditors.'
        : 'Modernización de interfaces dinámicas para carga masiva de evidencias y generación de reportes de acreditación universitaria ante el CACES.',
      imageSrc: '/proyectosSecundarios/Sipleci.webp'
    },
    {
      id: 'titulacion-istpet',
      code: 'SYS-07',
      title: 'Titulacion ISTPET',
      role: isEn ? 'Frontend & Process Engineer' : 'Frontend & Process Engineer',
      category: 'frontend',
      categoryLabel: isEn ? 'FRONTEND & UI' : 'FRONTEND & UI',
      year: '2025',
      badge: isEn ? 'GRADUATION EXPEDIENTS' : 'EXPEDIENTES DE GRADO',
      stack: ['Angular', 'TypeScript', '.NET Web API', 'Tailwind CSS'],
      methodologies: isEn ? ['Finite State Machines (FSM)', 'Audit Trail Traceability', 'Multi-Actor Workflow'] : ['Máquinas de Estado Finito (FSM)', 'Trazabilidad de Expedientes', 'Workflow Multi-Actor'],
      challenge: isEn
        ? 'Loss of traceability in degree requirements, prerequisite checks, and thesis tribunal defense stages.'
        : 'Pérdida de trazabilidad en expedientes de grado, validación de prerrequisitos y etapas de defensa de tesis.',
      impact: isEn
        ? 'Tracking and submission portal for student graduation files with multi-stage approval audits for academic boards.'
        : 'Portal de seguimiento, recepción de expedientes y fiscalización de etapas de grado para estudiantes y tribunales.',
      imageSrc: '/proyectosSecundarios/TITULACION.webp'
    },
    {
      id: 'sincronizador-biometrico-telnet',
      code: 'SYS-08',
      title: 'Biometrico ISTPET',
      role: isEn ? 'Embedded & Backend Integration Engineer' : 'Embedded & Backend Integration Engineer',
      category: 'ai',
      categoryLabel: isEn ? 'AI & HARDWARE' : 'IA & HARDWARE',
      year: '2025',
      badge: isEn ? 'IOT & TELNET' : 'IOT & TELNET',
      stack: ['Angular', '.NET Core', 'Telnet Protocols', 'TCP Sockets', 'Hardware Local'],
      methodologies: isEn ? ['Real-Time TCP/IP Sockets', 'Local Telnet Protocol', 'Offline Sync'] : ['Sockets TCP/IP en Tiempo Real', 'Protocolo Telnet Local', 'Sincronización Offline'],
      challenge: isEn
        ? 'Driving academies and isolated technical branches without public internet connection needing physical attendance logs.'
        : 'Escuelas de conducción y centros formativos aislados sin salida a internet para reporte de asistencia física.',
      impact: isEn
        ? 'Real-time local capturing and synchronization with physical biometric clocks over Telnet for offline compliance.'
        : 'Captura y sincronización local en tiempo real con relojes biométricos vía Telnet para reportes de escuelas de conducción sin salida a internet.',
      imageSrc: '/proyectosSecundarios/BIOMETRICO.webp'
    },
    {
      id: 'mi-istpet-mobile-sec',
      code: 'SYS-09',
      title: 'MIISTPET',
      role: isEn ? 'Mobile & Integration Developer' : 'Mobile & Integration Developer',
      category: 'mobile',
      categoryLabel: isEn ? 'MOBILE & CLOUD' : 'MOBILE & CLOUD',
      year: '2025',
      badge: isEn ? 'DIGITAL ID CARD' : 'CARNETIZACIÓN DIGITAL',
      stack: ['Mobile Client', '.NET Web API', 'TypeScript', 'SQL Server', 'Offline Storage'],
      methodologies: isEn ? ['Digital ID Credentialing', 'Secure QR Verification', 'Local Persistence'] : ['Carnetización Digital', 'Validación QR Segura', 'Persistencia Local'],
      challenge: isEn
        ? 'Need for instant digital credential checks and on-site student permission validation without visiting physical offices.'
        : 'Demanda de consultas estudiantiles inmediatas y validación de permisos en sitio sin acudir a ventanilla.',
      impact: isEn
        ? 'Mobile solution for digital student credentialing, on-campus permission validation, and secure academic grade lookup.'
        : 'Solución móvil para carnetización digital, validación de permisos en sitio y consulta segura de notas institucionales.',
      imageSrc: '/proyectosSecundarios/MIISTPET.webp'
    },

    // --- PROYECTOS PERSONALES & SANDBOX ---
    {
      id: 'rpg-expense-tracker',
      code: 'SAND-01',
      title: 'RPG',
      role: isEn ? 'Mobile Creator & Creative Dev' : 'Mobile Creator & Creative Dev',
      category: 'mobile',
      categoryLabel: isEn ? 'MOBILE & CLOUD' : 'MOBILE & CLOUD',
      year: '2024',
      badge: isEn ? 'GAMIFIED FINTECH' : 'GAMIFIED FINTECH',
      stack: ['Flutter', 'Dart', 'Local Storage', 'Custom Shaders'],
      methodologies: isEn ? ['FinTech Gamification', 'RPG Progression Mechanics', 'High-Performance Shaders'] : ['Gamificación FinTech', 'Mecánicas de Progresión RPG', 'Animaciones de Alto Rendimiento'],
      challenge: isEn
        ? 'Boredom and early abandonment in day-to-day personal finance tracking.'
        : 'Monotonía y abandono temprano en el registro cotidiano de gastos y finanzas personales.',
      impact: isEn
        ? 'Personal finance mobile app built with RPG progression mechanics and interactive visual feedback.'
        : 'Aplicación móvil de finanzas personales con mecánicas de progresión RPG y retroalimentación visual interactiva.',
      githubUrl: 'https://github.com/AlexanderMartinez0410/Gestor-Gastos',
      imageSrc: '/proyectosSecundarios/MAtchQuest.webp'
    },
    {
      id: 'frontend-logbook-vanilla',
      code: 'SAND-02',
      title: 'Frontend Logbook',
      role: isEn ? 'Frontend Vanilla Specialist' : 'Frontend Vanilla Specialist',
      category: 'frontend',
      categoryLabel: isEn ? 'FRONTEND & UI' : 'FRONTEND & UI',
      year: '2024',
      badge: isEn ? 'VANILLA MASTERY' : 'VANILLA MASTERY',
      stack: ['Semantic HTML5', 'Pure CSS3', 'Vanilla JavaScript (ES6+)', 'DOM API'],
      methodologies: isEn ? ['No-Framework Vanilla Mastery', 'Direct DOM Manipulation', 'Strict W3C Standards'] : ['No-Framework Vanilla Mastery', 'Manipulación Directa del DOM', 'Estándares W3C Estrictos'],
      challenge: isEn
        ? 'Excessive reliance on heavy frameworks and automated UI scaffolding for complex interfaces.'
        : 'Dependencia excesiva de librerías y abstracciones automáticas en el diseño de interfaces complejas.',
      impact: isEn
        ? 'Pixel-perfect reconstruction of sophisticated user interfaces intentionally without frameworks to maintain strict DOM mastery.'
        : 'Reconstrucción pixel-perfect de interfaces complejas prescindiendo intencionalmente de frameworks para mantener dominio estricto del DOM y estándares web.',
      githubUrl: 'https://github.com/AlexanderMartinez0410/Frontend-Logbook',
      imageSrc: '/proyectosSecundarios/FroontDe.webp'
    }
  ];
};
