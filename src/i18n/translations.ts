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
  };
  projects: {
    sectionTag: string;
    triadCount: (count: number) => string;
    categories: Record<string, string>;
    yearType: string;
    techUsed: string;
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
  };
  lab: {
    sectionTag: string;
    tag: string;
    headline: string;
    returnToLab: string;
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
      closeMenu: 'Cerrar menú'
    },
    hero: {
      sectionTag: 'SOBRE MÍ & ENFOQUE',
      role: 'FRONTEND & AI SOLUTIONS ENGINEER',
      editionPrefix: 'EDICIÓN:',
      dateLocale: 'es-ES',
      headline:
        'Creo interfaces interactivas y productos web de alto impacto, respaldados por backends funcionales y flujos con IA.',
      intro1:
        'Especializado en Frontend moderno (React, Angular 21, TypeScript) y Creative Dev (Three.js y Canvas). Diseño interfaces reactivas, accesibles y estéticamente cuidadas, convirtiendo requerimientos complejos en experiencias de usuario fluidas y de alto rendimiento.',
      intro2:
        'Cuento con la perspectiva del ciclo de software completo: integro APIs y servicios backend en .NET o Python sin fricción, y utilizo flujos dirigidos por IA con Spec-Driven Development para auditar código y entregar soluciones sólidas a gran velocidad.',
      stackHeader: 'STACK TECNOLÓGICO & ARSENAL TÉCNICO',
      stackCategories: {
        frontend: 'FRONTEND & CREATIVE ENGINEERING',
        backend: 'BACKEND & INTEGRACIÓN FUNCIONAL',
        data: 'DATOS, INFRA & HARDWARE',
        ai: 'IA APLICADA & METODOLOGÍA'
      },
      pillarsHeader: 'CÓMO TRABAJO // ENFOQUE DE DESARROLLO',
      pillarsTag: '[ METODOLOGÍA ]',
      pillars: [
        {
          title: 'INGENIERÍA FRONTEND & CREATIVE DEV',
          detail:
            'Construyo interfaces web de alto rendimiento y tipado estricto con Angular 21, React y TypeScript, integrando interactividad 3D con Three.js y Canvas.'
        },
        {
          title: 'VISIÓN FULL-CYCLE & BACKEND FUNCIONAL',
          detail:
            'Entiendo el ciclo de software completo: conecto frontends con APIs en .NET 8 y Python, diseño modelos de datos en PostgreSQL y resuelvo flujos de servidor sin fricción.'
        },
        {
          title: 'DESARROLLO DIRIGIDO POR SPECS Y AGENTES IA',
          detail:
            'Acelero entregas mediante Spec-Driven Development, reglas propias y LLMs como auditores arquitectónicos, logrando código limpio y sin deuda técnica.'
        },
        {
          title: 'COMPUTACIÓN APLICADA & MUNDO REAL',
          detail:
            'Conecto soluciones web con hardware y datos del entorno: sockets con terminales ZKTeco, visión computacional con OpenCV y análisis de patrones de productividad.'
        }
      ]
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
        ai: 'IA & ALGORITMOS'
      },
      yearType: 'AÑO & TIPO DE PROYECTO',
      techUsed: 'TECNOLOGÍAS UTILIZADAS',
      challenge: 'DESAFÍO & ARQUITECTURA',
      solution: 'SOLUCIÓN & CARACTERÍSTICAS TÉCNICAS',
      viewProject: '[ VER PROYECTO ]',
      viewCode: '[ CÓDIGO FUENTE ]',
      catalogTitle: 'CATÁLOGO COMPLETO DE PROYECTOS',
      catalogSubtitle: 'Ver todas las aplicaciones, librerías y sistemas desarrollados (+16)',
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
      milestonesTitle: 'HITOS, RECONOCIMIENTOS & COMPETENCIAS'
    },
    lab: {
      sectionTag: 'LABORATORIO EXPERIMENTAL & PROTOTIPOS',
      tag: '[ CREATIVE DEV & WEBGL ]',
      headline:
        'Espacio de exploración técnica: prototipos interactivos, shaders WebGL, audio síntesis y modelos de lenguaje en el navegador.',
      returnToLab: '[ ← VOLVER AL LABORATORIO ]'
    },
    contact: {
      sectionTag: 'CONTACTO',
      tag: '[ HABLEMOS ]',
      headline: '¿TIENES UN PROYECTO O UNA VACANTE? HABLEMOS.',
      subheadline:
        'Estoy disponible para unirme a equipos de tecnología a tiempo completo, colaborar en proyectos freelance o ayudar a construir aplicaciones web de alto rendimiento desde cero.',
      directEmail: 'CORREO ELECTRÓNICO DIRECTO',
      copyEmail: '[ COPIAR CORREO ]',
      copied: '[ ¡CORREO COPIADO! ]',
      cvDownload: '[ DESCARGAR DOSSIER / CV (PDF) ]',
      profilesTitle: 'REDES & REPOSITORIOS',
      timezoneTitle: 'ZONA HORARIA & UBICACIÓN',
      locationLabel: 'UBICACIÓN PRINCIPAL',
      availabilityLabel: 'MODALIDAD PREFERIDA'
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
      closeMenu: 'Close menu'
    },
    hero: {
      sectionTag: 'ABOUT ME & APPROACH',
      role: 'FRONTEND & AI SOLUTIONS ENGINEER',
      editionPrefix: 'EDITION:',
      dateLocale: 'en-US',
      headline:
        'I build interactive interfaces and high-impact web products, backed by functional backends and AI workflows.',
      intro1:
        'Specialized in modern Frontend (React, Angular 21, TypeScript) and Creative Dev (Three.js and Canvas). I design responsive, accessible, and finely crafted interfaces, turning complex requirements into seamless, high-performance user experiences.',
      intro2:
        'I bring full software lifecycle perspective: seamlessly integrating backend APIs and services in .NET or Python, and leveraging AI-driven workflows with Spec-Driven Development to audit code and deliver robust solutions at high velocity.',
      stackHeader: 'TECH STACK & TECHNICAL ARSENAL',
      stackCategories: {
        frontend: 'FRONTEND & CREATIVE ENGINEERING',
        backend: 'BACKEND & FUNCTIONAL INTEGRATION',
        data: 'DATA, INFRA & HARDWARE',
        ai: 'APPLIED AI & METHODOLOGY'
      },
      pillarsHeader: 'HOW I WORK // DEVELOPMENT APPROACH',
      pillarsTag: '[ METHODOLOGY ]',
      pillars: [
        {
          title: 'FRONTEND ENGINEERING & CREATIVE DEV',
          detail:
            'I build high-performance, strictly typed web interfaces with Angular 21, React, and TypeScript, integrating 3D interactivity using Three.js and Canvas.'
        },
        {
          title: 'FULL-CYCLE VISION & FUNCTIONAL BACKEND',
          detail:
            'I understand the full software lifecycle: connecting frontends with .NET 8 and Python APIs, designing PostgreSQL schemas, and solving server-side flows without friction.'
        },
        {
          title: 'SPEC-DRIVEN DEVELOPMENT & AI AGENTS',
          detail:
            'I accelerate deliveries through Spec-Driven Development, custom rules, and LLMs as architectural auditors, achieving clean code with zero technical debt.'
        },
        {
          title: 'APPLIED COMPUTING & REAL WORLD',
          detail:
            'I connect web solutions with hardware and environment data: sockets with ZKTeco terminals, computer vision with OpenCV, and productivity pattern analysis.'
        }
      ]
    },
    projects: {
      sectionTag: 'CASE STUDIES // FEATURED TRIAD',
      triadCount: (count: number) => `[ ${count} FEATURED PROJECTS ]`,
      categories: {
        all: 'ALL',
        frontend: 'FRONTEND & UI',
        backend: 'BACKEND & ARCHITECTURE',
        fullstack: 'FULL STACK & SYSTEMS',
        mobile: 'MOBILE & CLOUD',
        ai: 'AI & ALGORITHMS'
      },
      yearType: 'YEAR & PROJECT TYPE',
      techUsed: 'TECHNOLOGIES USED',
      challenge: 'CHALLENGE & ARCHITECTURE',
      solution: 'SOLUTION & TECHNICAL FEATURES',
      viewProject: '[ VIEW PROJECT ]',
      viewCode: '[ SOURCE CODE ]',
      catalogTitle: 'FULL PROJECT CATALOG',
      catalogSubtitle: 'Explore all applications, libraries, and systems developed (+16)',
      openCatalog: '[ OPEN CATALOG ]',
      closeCatalog: '[ CLOSE CATALOG ]',
      filterLabel: 'FILTER BY DISCIPLINE:',
      codeLabel: 'CODE',
      impactLabel: 'IMPACT & TECHNIQUE',
      backToProjects: '[ BACK TO FEATURED TRIAD ]'
    },
    experience: {
      sectionTag: 'CAREER & RECOGNITIONS',
      tag: '[ TECHNICAL TIMELINE ]',
      experienceTitle: 'PROFESSIONAL EXPERIENCE & PRODUCTION',
      milestonesTitle: 'MILESTONES, AWARDS & COMPETITIONS'
    },
    lab: {
      sectionTag: 'EXPERIMENTAL LAB & PROTOTYPES',
      tag: '[ CREATIVE DEV & WEBGL ]',
      headline:
        'Technical exploration ground: interactive prototypes, WebGL shaders, audio synthesis, and in-browser language models.',
      returnToLab: '[ ← BACK TO LAB ]'
    },
    contact: {
      sectionTag: 'CONTACT',
      tag: '[ LET’S TALK ]',
      headline: 'HAVE A PROJECT OR AN OPEN ROLE? LET’S TALK.',
      subheadline:
        'I am available to join engineering teams full-time, collaborate on freelance projects, or build high-performance web applications from scratch.',
      directEmail: 'DIRECT EMAIL ADDRESS',
      copyEmail: '[ COPY EMAIL ]',
      copied: '[ EMAIL COPIED! ]',
      cvDownload: '[ DOWNLOAD DOSSIER / CV (PDF) ]',
      profilesTitle: 'PROFILES & REPOSITORIES',
      timezoneTitle: 'TIMEZONE & LOCATION',
      locationLabel: 'PRIMARY LOCATION',
      availabilityLabel: 'PREFERRED WORK MODE'
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
        title: 'AMMI ONLINE // PLATAFORMA EDUCATIVA & GESTIÓN ACADÉMICA',
        meta: '[ .NET 8 / ANGULAR / CLEAN ARCHITECTURE / CQRS / SQL SERVER ]',
        year: '2024 — 2025',
        technologies: ['.NET 8', 'C#', 'ANGULAR', 'TYPESCRIPT', 'CLEAN ARCHITECTURE', 'CQRS', 'SQL SERVER'],
        format: '[ PRODUCCIÓN // ARQUITECTURA LIMPIA ]',
        challenge:
          'Refactorización integral de un sistema monolítico heredado hacia Clean Architecture y CQRS, resolviendo cuellos de botella en procesos de matrículas masivas y reduciendo la latencia de respuesta de la API a menos de 140ms.',
        summary:
          'Plataforma enterprise con separación estricta de dominios, comandos/consultas desacoplados, autenticación basada en roles (RBAC) y control de concurrencia optimizado.',
        liveUrl: 'https://github.com/dinopengudev',
        sourceUrl: 'https://github.com/dinopengudev',
        visualType: 'design-system',
        metrics: [
          { label: 'LATENCIA API', value: '< 140ms' },
          { label: 'PATRÓN', value: 'CQRS + CLEAN' },
          { label: 'DISPONIBILIDAD', value: '99.9%' }
        ]
      },
      {
        id: 'biometrico-rrhh',
        index: '02',
        title: 'SISTEMA BIOMÉTRICO RRHH // MULTI-TENANT & HARDWARE SOCKETS',
        meta: '[ FASTAPI / FLASK / PYTHON / POSTGRESQL / DOCKER / ZKTECO SOCKETS ]',
        year: '2024',
        technologies: ['PYTHON', 'FASTAPI', 'POSTGRESQL', 'DOCKER', 'ZKTeco (pyzk)', 'PANDAS', 'LLMs'],
        format: '[ ENTERPRISE // IOT & MULTI-TENANT ]',
        challenge:
          'Aislamiento de base de datos por institución (Schema-per-tenant), ingesta continua de marcaciones físicas en tiempo real mediante comunicación socket TCP con terminales ZKTeco y reducción del 80% en tiempo de procesamiento de asistencia y reportes de productividad.',
        summary:
          'Infraestructura híbrida de software y hardware físico que automatiza la sincronización de asistencia masiva, valida huellas y alimenta modelos de análisis de productividad asistidos por IA.',
        liveUrl: 'https://github.com/dinopengudev',
        sourceUrl: 'https://github.com/dinopengudev',
        visualType: 'dataviz',
        metrics: [
          { label: 'PROCESAMIENTO', value: '-80% TIEMPO' },
          { label: 'CONEXIÓN', value: 'SOCKETS TCP' },
          { label: 'TENANCY', value: 'SCHEMA-LEVEL' }
        ]
      },
      {
        id: 'mi-istpet-mobile',
        index: '03',
        title: 'MI ISTPET // APP MÓVIL OFICIAL EN GOOGLE PLAY STORE',
        meta: '[ REACT NATIVE / EXPO / TYPESCRIPT / REST APIS / GOOGLE PLAY ]',
        year: '2024 — 2025',
        technologies: ['REACT NATIVE', 'EXPO', 'TYPESCRIPT', 'MYSQL', 'REST APIS', 'GOOGLE PLAY CONSOLE'],
        format: '[ PLAY STORE // APP INSTITUCIONAL OFICIAL ]',
        challenge:
          'Desarrollo, empaquetado seguro (AAB con Keystores) y publicación oficial en Google Play Store para la comunidad estudiantil y docente, incorporando sincronización offline de notas, horarios y alertas académicas.',
        summary:
          'Aplicación móvil en producción activa que optimiza el consumo de APIs institucionales, gestiona caché local para funcionamiento sin conexión y ofrece una experiencia táctil fluida.',
        liveUrl: 'https://play.google.com',
        sourceUrl: 'https://github.com/dinopengudev',
        visualType: 'audio-engine',
        metrics: [
          { label: 'CANAL OFICIAL', value: 'GOOGLE PLAY' },
          { label: 'MODO OFFLINE', value: 'LOCAL STORAGE' },
          { label: 'USUARIOS', value: '+1,500 ACTIVOS' }
        ]
      }
    ];
  }

  return [
    {
      id: 'ammi-online',
      index: '01',
      title: 'AMMI ONLINE // EDUCATIONAL PLATFORM & ACADEMIC MANAGEMENT',
      meta: '[ .NET 8 / ANGULAR / CLEAN ARCHITECTURE / CQRS / SQL SERVER ]',
      year: '2024 — 2025',
      technologies: ['.NET 8', 'C#', 'ANGULAR', 'TYPESCRIPT', 'CLEAN ARCHITECTURE', 'CQRS', 'SQL SERVER'],
      format: '[ PRODUCTION // CLEAN ARCHITECTURE ]',
      challenge:
        'Comprehensive refactoring of a legacy monolithic system into Clean Architecture and CQRS, eliminating bottlenecks in massive enrollment periods and lowering API latency to under 140ms.',
      summary:
        'Enterprise platform featuring strict domain separation, decoupled command/query handling, role-based access control (RBAC), and optimized concurrency management.',
      liveUrl: 'https://github.com/dinopengudev',
      sourceUrl: 'https://github.com/dinopengudev',
      visualType: 'design-system',
      metrics: [
        { label: 'API LATENCY', value: '< 140ms' },
        { label: 'PATTERN', value: 'CQRS + CLEAN' },
        { label: 'UPTIME', value: '99.9%' }
      ]
    },
    {
      id: 'biometrico-rrhh',
      index: '02',
      title: 'HR BIOMETRIC SYSTEM // MULTI-TENANT & HARDWARE SOCKETS',
      meta: '[ FASTAPI / FLASK / PYTHON / POSTGRESQL / DOCKER / ZKTECO SOCKETS ]',
      year: '2024',
      technologies: ['PYTHON', 'FASTAPI', 'POSTGRESQL', 'DOCKER', 'ZKTeco (pyzk)', 'PANDAS', 'LLMs'],
      format: '[ ENTERPRISE // IOT & MULTI-TENANT ]',
      challenge:
        'Database isolation per institution (schema-per-tenant), continuous ingestion of biometric logs in real time via TCP sockets with ZKTeco hardware, reducing attendance and productivity reporting time by 80%.',
      summary:
        'Hybrid software and physical hardware infrastructure that automates large-scale attendance tracking, verifies fingerprints, and feeds AI-assisted productivity analysis models.',
      liveUrl: 'https://github.com/dinopengudev',
      sourceUrl: 'https://github.com/dinopengudev',
      visualType: 'dataviz',
      metrics: [
        { label: 'PROCESSING', value: '-80% TIME' },
        { label: 'CONNECTION', value: 'TCP SOCKETS' },
        { label: 'TENANCY', value: 'SCHEMA-LEVEL' }
      ]
    },
    {
      id: 'mi-istpet-mobile',
      index: '03',
      title: 'MI ISTPET // OFFICIAL MOBILE APP ON GOOGLE PLAY STORE',
      meta: '[ REACT NATIVE / EXPO / TYPESCRIPT / REST APIS / GOOGLE PLAY ]',
      year: '2024 — 2025',
      technologies: ['REACT NATIVE', 'EXPO', 'TYPESCRIPT', 'MYSQL', 'REST APIS', 'GOOGLE PLAY CONSOLE'],
      format: '[ PLAY STORE // OFFICIAL INSTITUTIONAL APP ]',
      challenge:
        'End-to-end development, secure packaging (AAB with custom Keystores), and official publication on Google Play Store for students and faculty, featuring offline caching for grades, schedules, and alerts.',
      summary:
        'Production mobile app optimizing institutional API consumption, managing local offline persistence, and delivering a responsive tactile experience.',
      liveUrl: 'https://play.google.com',
      sourceUrl: 'https://github.com/dinopengudev',
      visualType: 'audio-engine',
      metrics: [
        { label: 'OFFICIAL STORE', value: 'GOOGLE PLAY' },
        { label: 'OFFLINE MODE', value: 'LOCAL STORAGE' },
        { label: 'ACTIVE USERS', value: '+1,500' }
      ]
    }
  ];
};

export const getLocalizedCatalog = (lang: Language): CatalogProject[] => {
  // Retorna el catálogo con descripciones acordes al idioma
  const isEn = lang === 'en';
  return [
    {
      id: 'zksync-daemon',
      code: 'CAT-01',
      title: 'ZKTeco Network Polling Daemon & Sockets',
      category: 'backend',
      categoryLabel: isEn ? 'BACKEND & INFRA' : 'BACKEND & INFRA',
      stack: ['Python', 'pyzk', 'TCP Sockets', 'PostgreSQL', 'Systemd'],
      challenge: isEn
        ? 'Real-time synchronization with physical biometric devices across distributed LAN/WAN networks.'
        : 'Sincronización en tiempo real con dispositivos biométricos físicos en redes LAN/WAN distribuidas.',
      impact: isEn
        ? 'Zero dropped attendance punch records; autonomous daemon resilient to power/network cuts.'
        : 'Cero pérdidas de marcaciones de asistencia; demonio autónomo resistente a cortes de energía y red.',
      badge: isEn ? '[ HARDWARE IOT ]' : '[ HARDWARE IOT ]',
      year: '2024'
    },
    {
      id: 'dinopengu-3d',
      code: 'CAT-02',
      title: 'Voxel Cretaceous 3D Mascot Sandbox',
      category: 'frontend',
      categoryLabel: isEn ? 'CREATIVE DEV' : 'CREATIVE DEV',
      stack: ['Three.js', 'React', 'WebGL', 'GLTF', 'Custom Shaders'],
      challenge: isEn
        ? 'Rendering interactive voxel character with real-time lighting at 60 FPS across mobile and desktop.'
        : 'Renderizado de personaje voxel interactivo con iluminación en tiempo real a 60 FPS en móvil y desktop.',
      impact: isEn
        ? 'Interactive brand identity; procedural idle animations and reactive camera controls.'
        : 'Identidad de marca interactiva; animaciones procedurales idle y control de cámara reactivo.',
      badge: isEn ? '[ THREE.JS / 3D ]' : '[ THREE.JS / 3D ]',
      year: '2025'
    },
    {
      id: 'groq-stream-ui',
      code: 'CAT-03',
      title: 'Sub-second LLM Streaming & Token Speed Bench',
      category: 'ai',
      categoryLabel: isEn ? 'AI & ALGORITHMS' : 'IA & ALGORITMOS',
      stack: ['Groq API', 'Server-Sent Events', 'React', 'TypeScript', 'Tailwind'],
      challenge: isEn
        ? 'Handling high-speed token streaming (>300 tok/s) without UI stuttering or layout repaints.'
        : 'Manejo de streaming de tokens a alta velocidad (>300 tok/s) sin bloqueos de UI ni repintados.',
      impact: isEn
        ? 'Instantaneous responses with real-time token metrics and markdown syntax highlight on the fly.'
        : 'Respuestas instantáneas con métricas de tokens en tiempo real y resaltado de sintaxis al vuelo.',
      badge: isEn ? '[ AI STREAMING ]' : '[ IA STREAMING ]',
      year: '2025'
    },
    {
      id: 'linux-cli-sim',
      code: 'CAT-04',
      title: 'Virtual Linux Terminal & Filesystem Simulator',
      category: 'frontend',
      categoryLabel: isEn ? 'FRONTEND & UI' : 'FRONTEND & UI',
      stack: ['React', 'TypeScript', 'Virtual Tree FS', 'ANSI Parser'],
      challenge: isEn
        ? 'Simulating a POSIX hierarchical filesystem in memory with piping, history, and auto-complete.'
        : 'Simulación de sistema de archivos POSIX jerárquico en memoria con piping, historial y auto-completado.',
      impact: isEn
        ? 'Interactive portfolio sandbox; tactile developer experience mimicking an authentic shell.'
        : 'Sandbox interactivo para portafolio; experiencia táctil que emula un shell auténtico.',
      badge: isEn ? '[ VIRTUAL CLI ]' : '[ VIRTUAL CLI ]',
      year: '2024'
    },
    {
      id: 'audio-synth-engine',
      code: 'CAT-05',
      title: 'Polyphonic Web Audio Synthesizer & Canvas Scope',
      category: 'frontend',
      categoryLabel: isEn ? 'CREATIVE DEV' : 'CREATIVE DEV',
      stack: ['Web Audio API', 'Canvas 2D', 'Oscillators', 'BiquadFilter'],
      challenge: isEn
        ? 'Ultra-low latency audio processing and real-time oscilloscope waveform rendering.'
        : 'Procesamiento de audio de latencia ultrabaja y renderizado de forma de onda en osciloscopio en tiempo real.',
      impact: isEn
        ? 'Pure native web audio engine without third-party audio packages; 60 FPS canvas visualization.'
        : 'Motor de audio web nativo puro sin librerías pesadas; visualización en canvas a 60 FPS.',
      badge: isEn ? '[ WEB AUDIO API ]' : '[ WEB AUDIO API ]',
      year: '2024'
    },
    {
      id: 'whatsapp-bot-crm',
      code: 'CAT-06',
      title: 'Conversational WhatsApp Bot & Admission CRM',
      category: 'fullstack',
      categoryLabel: isEn ? 'FULL STACK' : 'FULL STACK',
      stack: ['Python', 'FastAPI', 'Meta Cloud API', 'PostgreSQL', 'Webhooks'],
      challenge: isEn
        ? 'Automating academic leads onboarding via asynchronous webhooks and conversation flow states.'
        : 'Automatización de captación de postulantes académicos mediante webhooks asíncronos y estados de flujo.',
      impact: isEn
        ? '90% automated qualification rate for prospective student questions 24/7.'
        : '90% de tasa de calificación automática para dudas de postulantes 24/7 sin intervención manual.',
      badge: isEn ? '[ META WEBHOOKS ]' : '[ META WEBHOOKS ]',
      year: '2024'
    }
  ];
};
