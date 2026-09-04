import type { Project, CatalogProject } from '../types';

// ============================================================================
// LA TRÍADA PRINCIPAL (Casos de Estudio Destacados)
// ============================================================================
export const projectsData: Project[] = [
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
    liveUrl: 'https://play.google.com/store',
    sourceUrl: 'https://github.com/dinopengudev',
    visualType: 'audio-engine',
    metrics: [
      { label: 'CANAL', value: 'PLAY STORE' },
      { label: 'OFFLINE', value: 'LOCAL CACHE' },
      { label: 'ESTADO', value: 'PRODUCCIÓN' }
    ]
  }
];

// ============================================================================
// CATÁLOGO COMPLETO DE PROYECTOS (Secundarios y Especialidades)
// ============================================================================
export const catalogProjectsData: CatalogProject[] = [
  // --- FULLSTACK & SISTEMAS INSTITUCIONALES ---
  {
    id: 'distributivos-istpet',
    code: 'SYS-01',
    title: 'Gestión Académica & Distributivos ISTPET',
    category: 'fullstack',
    categoryLabel: 'FULL STACK & SISTEMAS',
    year: '2024',
    badge: 'AUTOMATIZACIÓN 85%',
    stack: ['.NET 8', 'React', 'TypeScript', 'SQL Server', 'Tailwind CSS'],
    challenge: 'Generación manual de distributivos y colisión recurrente de aulas y horarios docentes.',
    impact: 'Motor algorítmico anti-colisión de horarios y aulas que automatizó el 85% de la emisión y validación de contratos docentes.'
  },
  {
    id: 'titulacion-bienestar',
    code: 'SYS-02',
    title: 'Suite de Titulación & Bienestar Institucional',
    category: 'fullstack',
    categoryLabel: 'FULL STACK & SISTEMAS',
    year: '2024',
    badge: '100% DIGITAL / CERO PAPEL',
    stack: ['Angular', 'TypeScript', '.NET 8', 'Python', 'MySQL', 'PostgreSQL'],
    challenge: 'Trámites de grado lentos, burocráticos y con dependencia total de carpetas físicas en papel.',
    impact: 'Máquina de estados para aprobación multinivel de requisitos de grado, eliminando el 100% del uso de papel en trámites institucionales.'
  },
  {
    id: 'evidencias-caces',
    code: 'SYS-03',
    title: 'Gestión de Evidencias CACES (Acreditación Superior)',
    category: 'fullstack',
    categoryLabel: 'FULL STACK & SISTEMAS',
    year: '2024',
    badge: 'ACREDITACIÓN OFICIAL',
    stack: ['React', '.NET', 'SQL Server', 'TypeScript', 'Document Storage'],
    challenge: 'Desorden y falta de trazabilidad en la documentación requerida por evaluadores de educación superior.',
    impact: 'Árbol jerárquico y sistema de trazabilidad documental para procesos oficiales de acreditación universitaria y auditorías externas.'
  },
  {
    id: 'scorecraft-formativas',
    code: 'SYS-04',
    title: 'ScoreCraft // Motor de Evaluación & Formativas',
    category: 'backend',
    categoryLabel: 'BACKEND & ARQUITECTURA',
    year: '2023',
    badge: 'CÁLCULO PONDERADO',
    stack: ['C#', '.NET', 'SQL Server', 'WPF / WinForms', 'Reporting Engine'],
    challenge: 'Discrepancias en el cálculo manual de notas y promedios ponderados en actas institucionales.',
    impact: 'Motor determinista de cálculo de promedios ponderados y generación automatizada de reportería consolidada para autoridades académicas.'
  },
  {
    id: 'mechanic-car',
    code: 'SYS-05',
    title: 'MechanicCar // Sistema de Gestión de Talleres',
    category: 'backend',
    categoryLabel: 'BACKEND & ARQUITECTURA',
    year: '2023',
    badge: 'BLOQUEO OPTIMISTA',
    stack: ['C#', '.NET Web API', 'TypeScript', 'SQL Server', 'Entity Framework'],
    challenge: 'Pérdida de stock de repuestos y descontrol en la asignación de mecánicos a vehículos en servicio.',
    impact: 'Control de inventario de repuestos con bloqueo optimista en base de datos, trazabilidad de órdenes de trabajo y facturación.'
  },
  {
    id: 'iris-red-social',
    code: 'SYS-06',
    title: 'Iris // Red Social Estudiantil en la Nube',
    category: 'fullstack',
    categoryLabel: 'FULL STACK & SISTEMAS',
    year: '2023',
    badge: 'AWS CLOUD S3',
    stack: ['Angular', 'PHP / Laravel', 'AWS EC2', 'AWS S3', 'MySQL'],
    challenge: 'Necesidad de un canal dinámico de comunicación interna entre estudiantes y docentes sin depender de redes comerciales.',
    impact: 'Arquitectura en AWS con almacenamiento multimedia desacoplado en buckets S3, feeds reactivos y autenticación institucional.'
  },

  // --- MOBILE & CLOUD ---
  {
    id: 'radar-civico',
    code: 'MOB-01',
    title: 'Radar Cívico // Alerta Desaparecidos EC',
    category: 'mobile',
    categoryLabel: 'MOBILE & CLOUD',
    year: '2024',
    badge: 'IMPACTO SOCIAL / GEO',
    stack: ['Flutter', 'Dart', 'Figma UI/UX', 'Google Cloud Platform (GCP)', 'Mapas Geo'],
    challenge: 'Lentitud y desconexión en la difusión de alertas tempranas de personas extraviadas en zonas con baja conectividad.',
    impact: 'App móvil de impacto social con renderizado ultra-ligero de mapas y coordenadas optimizado para funcionar en redes 3G/4G.'
  },
  {
    id: 'bioregistro-mobile',
    code: 'MOB-02',
    title: 'Bioregistro Mobile // Marcación Geolocalizada',
    category: 'mobile',
    categoryLabel: 'MOBILE & CLOUD',
    year: '2024',
    badge: 'ANTI-SPOOFING GPS',
    stack: ['Flutter', 'Dart', 'Firebase Auth', 'Biometría Dactilar', 'Geocercas GPS'],
    challenge: 'Fraude por suplantación de ubicación (Fake GPS) en registros de asistencia en campo de brigadas técnicas.',
    impact: 'Control de asistencia en campo con validación biométrica nativa del dispositivo, algoritmos de detección de mock locations y geocercas.'
  },
  {
    id: 'helpdesk-cnc',
    code: 'MOB-03',
    title: 'HelpDesk CNC (Consejo Nacional de Competencias)',
    category: 'mobile',
    categoryLabel: 'MOBILE & CLOUD',
    year: '2023',
    badge: 'RLS SECURITY / LINUX',
    stack: ['Ionic', 'Supabase', 'PostgreSQL (RLS)', 'Ubuntu Server', 'TypeScript'],
    challenge: 'Falta de canal unificado para incidencias técnicas de funcionarios públicos en diversas sedes territoriales.',
    impact: 'Mesa de ayuda institucional con políticas Row Level Security (RLS) en base de datos, desplegada y securizada en servidor Linux.'
  },
  {
    id: 'cnc-certificados',
    code: 'MOB-04',
    title: 'CNC Certificados // Validación Criptográfica QR',
    category: 'mobile',
    categoryLabel: 'MOBILE & CLOUD',
    year: '2023',
    badge: 'CRIPTO QR / VERIFICACIÓN',
    stack: ['Supabase', 'PostgreSQL', 'TypeScript', 'Hashes Criptográficos', 'QR Engine'],
    challenge: 'Riesgo de adulteración y falsificación de certificados de capacitación técnica emitidos por el organismo.',
    impact: 'Emisión automatizada y portal de verificación pública inmediata mediante hashes criptográficos embebidos en códigos QR.'
  },

  // --- FRONTEND & UI ENGINEERING ---
  {
    id: 'rrhh-istpet-web',
    code: 'FRO-01',
    title: 'Gestión de Recursos Humanos ISTPET (Web UI)',
    category: 'frontend',
    categoryLabel: 'FRONTEND & UI',
    year: '2024',
    badge: 'FORMULARIOS REACTIVOS',
    stack: ['Angular', 'TypeScript', 'Tailwind CSS', 'RxJS', 'REST APIs'],
    challenge: 'Gestión fragmentada de expedientes docentes y contratos con tiempos de carga pesados en navegadores de oficina.',
    impact: 'Formularios reactivos modulares con validaciones en tiempo real, gestión de estado por observables y centralización digital de legajos.'
  },
  {
    id: 'portales-sipleci-vita',
    code: 'FRO-02',
    title: 'Portales Institucionales SIPLECI & VITA',
    category: 'frontend',
    categoryLabel: 'FRONTEND & UI',
    year: '2023',
    badge: '-55% TIEMPO DE CARGA',
    stack: ['Angular', 'TypeScript', 'Lazy Loading', 'ChangeDetection OnPush', 'CSS3'],
    challenge: 'Sitios institucionales con alto rebote de visitas por bloqueos de renderizado y bundle JavaScript excesivo.',
    impact: 'Reestructuración con Lazy Loading y estrategia ChangeDetection OnPush que redujo los tiempos de carga inicial en un 55%.'
  },
  {
    id: 'frontend-logbook',
    code: 'FRO-03',
    title: 'Frontend Logbook & UI Engineering Challenges',
    category: 'frontend',
    categoryLabel: 'FRONTEND & UI',
    year: '2023 — 2024',
    badge: 'LIGHTHOUSE 100/100',
    stack: ['HTML5 Semántico', 'CSS3 Moderno', 'JavaScript ES6+', 'Canvas', 'Microinteracciones'],
    challenge: 'Desarrollar componentes visuales complejos sin librerías pesadas manteniendo 60fps constantes.',
    impact: 'Laboratorio de microinteracciones fluidas y técnicas CSS puras con puntuación perfecta de 100/100 en auditorías Lighthouse.'
  },

  // --- IA & ALGORITMOS ---
  {
    id: 'optimizador-parqueaderos',
    code: 'AI-01',
    title: 'Optimizador de Parqueaderos // 1er Lugar UTC',
    category: 'ai',
    categoryLabel: 'IA & ALGORITMOS',
    year: '2023',
    badge: 'MEDALLA DE ORO / UTC',
    stack: ['Java', 'Programación Dinámica', 'Grafos', 'Complejidad O(log n)', 'Algoritmos'],
    challenge: 'Asignación óptima y balanceada de vehículos en espacios restringidos en tiempo de ejecución mínimo.',
    impact: 'Ganador de Medalla de Oro en el Concurso Universitario de Programación UTC al resolver la heurística de asignación con complejidad logarítmica.'
  },
  {
    id: 'pipeline-rag-cerebro',
    code: 'AI-02',
    title: 'Pipeline RAG & Inferencia Local (Segundo Cerebro)',
    category: 'ai',
    categoryLabel: 'IA & ALGORITMOS',
    year: '2024',
    badge: 'LLM LOCAL / VECTOR DB',
    stack: ['Python', 'FastAPI', 'ChromaDB / FAISS', 'Sentence-Transformers', 'LangChain', 'Ollama'],
    challenge: 'Consultar y correlacionar miles de notas de ingeniería y código sin exponer datos confidenciales a la nube.',
    impact: 'Indexación vectorial semántica con ChromaDB y generación de respuestas contextuales con modelos Open Source cuantizados (GGUF).'
  },
  {
    id: 'servidor-inferencia-gpu',
    code: 'AI-03',
    title: 'Servidor de Inferencia Remota en GPU',
    category: 'ai',
    categoryLabel: 'IA & ALGORITMOS',
    year: '2024',
    badge: 'CUDA ACCELERATION',
    stack: ['Python', 'FastAPI', 'Pyngrok', 'HuggingFace Transformers', 'PyTorch / CUDA'],
    challenge: 'Ejecutar modelos de lenguaje y visión que requieren hardware de alta gama sin contar con servidores dedicados permanentes.',
    impact: 'Túnel seguro con FastAPI que expone endpoints REST consumidos desde apps locales hacia entornos acelerados por GPU.'
  }
];
