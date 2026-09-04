import type { LabExperiment } from '../types';

export const labExperimentsData: LabExperiment[] = [
  {
    id: 'linux-virtual-cli',
    number: '#01',
    title: 'Terminal Linux Virtual & Sistema de Archivos en Memoria',
    description:
      'Emulador interactivo de entorno Bash/POSIX con árbol de archivos virtual (VFS) en memoria: comandos reales (ls, cat, cd, pwd, whoami, clear), autocompletado con [Tab], historial con [↑/↓], botones táctiles rápidos y lectura interactiva de CV, biografía, avatar/foto, poesías y datos al azar.',
    approach:
      'Parser de comandos CLI interactivo con emulación de streams stdout/stderr, navegación en árbol virtual VFS y renderizado dinámico de texto enriquecido e imágenes.',
    category: '[ CLI / SISTEMAS & BASH ]',
    url: 'https://github.com/dinopengudev',
    status: 'EN VIVO',
    tech: ['Virtual FileSystem (VFS)', 'Bash Command Parser', 'React & TypeScript', 'Terminal Emulation', 'Interactive CLI']
  },
  {
    id: 'pingu-3d-voxel',
    number: '#02',
    title: 'Pingu Voxel Cretácico: Visor 3D Interactivo & WebGL',
    description:
      'Mascota Pingu voxelizada con pijama de dinosaurio (cuernos, capucha, escamas dorsales y cola) en un bioma cretácico interactivo de cubos (tierra, agua, palmeras y volcanes) con soporte de caminata 360°, saltos con física parabólica y animaciones de baile.',
    approach:
      'Renderizado de escena procedural con Three.js y WebGL, cinemática esquelética para marcha y aleteo, físicas de gravedad, animación de agua ondulante y cámara orbital táctil/ratón.',
    category: '[ 3D / WEBGL & GRAPHICS ]',
    url: 'https://github.com/dinopengudev',
    status: 'EN VIVO',
    tech: ['Three.js', 'WebGL', 'Voxel Engine', 'Procedural 3D Biome', 'Kinematics']
  },
  {
    id: 'polyphonic-synth-audio',
    number: '#03',
    title: 'Sintetizador Polifónico & Osciloscopio Web Audio API',
    description:
      'Motor de síntesis sonora nativa en el navegador con soporte polifónico de notas (C4 a C5), 3 osciladores con formas de onda seleccionables (seno, sierra, cuadrada), envolvente ADSR y visualizador de frecuencias FFT en tiempo real.',
    approach:
      'Uso directo del grafo de audio de Web Audio API (AudioNodes, GainNode, AnalyserNode) y renderizado del osciloscopio en Canvas 2D a 60 FPS mediante requestAnimationFrame.',
    category: '[ WEB AUDIO API / DSP ]',
    url: 'https://github.com/dinopengudev',
    status: 'EN VIVO',
    tech: ['Web Audio API', 'ADSR Envelopes', 'Canvas 2D', 'Fast Fourier Transform (FFT)', 'Polyphony']
  },
  {
    id: 'network-performance-lab',
    number: '#04',
    title: 'Laboratorio de Rendimiento Web, Latencia & Waterfall en Vivo',
    description:
      'Banco de pruebas interactivo que simula y mide en vivo tiempos de respuesta, latencia TTFB, descarga en cascada (waterfall) de bundles JS/CSS y diferencias de rendimiento entre arquitecturas CSR, SSR y Edge Caching con perfiles de red (Fibra, 4G, 3G Throttling).',
    approach:
      'Simulador de pipeline de carga basado en métricas de Core Web Vitals (FCP, LCP, CLS, TTFB), motor de throttling de red asíncrono y gráfico de cascada interactivo.',
    category: '[ PERFORMANCE & CORE WEB VITALS ]',
    url: 'https://github.com/dinopengudev',
    status: 'EN VIVO',
    tech: ['Core Web Vitals API', 'Network Throttling', 'Waterfall Profiler', 'SSR/CSR/Edge', 'DOM Metrics']
  },
  {
    id: 'groq-llm-streaming',
    number: '#05',
    title: 'Asistente Conversacional IA con Streaming de Ultrabaja Latencia',
    description:
      'Sandbox de IA generativa con procesamiento y renderizado token por token en tiempo real mediante Server-Sent Events (SSE), control de temperatura y system prompts, junto con telemetría de tokens/segundo y TTFT (Time to First Token).',
    approach:
      'Manejo de streams asíncronos con ReadableStream de la Fetch API, actualización de UI optimista sin re-renders innecesarios y cálculo de métricas de inferencia en tiempo real.',
    category: '[ AI / LLM & STREAMING ]',
    url: 'https://github.com/dinopengudev',
    status: 'EN VIVO',
    tech: ['Groq LPU / Llama 3', 'Server-Sent Events (SSE)', 'ReadableStream API', 'Optimistic UI', 'Token Metrics']
  },
  {
    id: 'whatsapp-bot-simulator',
    number: '#06',
    title: 'Simulador Interactivo de Automatización & Bot de WhatsApp',
    description:
      'Simulador interactivo de interfaz WhatsApp Web/Móvil con árbol de decisiones en tiempo real: catálogos interactivos, toma de pedidos estructurados, captura de leads calificados y simulación de triggers/webhooks hacia backend.',
    approach:
      'Máquina de estados finitos (FSM) para el árbol conversacional, persistencia local de sesión y emulación de respuestas automáticas con delay humanizado.',
    category: '[ AUTOMATION & B2B LEADS ]',
    url: 'https://github.com/dinopengudev',
    status: 'EN VIVO',
    tech: ['Finite State Machine (FSM)', 'Conversational UI', 'Webhook Triggers', 'JSON Schema', 'Lead Capture']
  },
  {
    id: 'video-scroll-scrubber',
    number: '#07',
    title: 'Controlador de Video Scrubbing Frame a Frame por Scroll & Slider',
    description:
      'Micro-experimento de UI Motion estilo showcase de producto Apple que mapea la posición del scroll o de un slider táctil directamente con el tiempo de reproducción de video cuadro a cuadro con aceleración suave.',
    approach:
      'Sincronización de currentTime del video HTML5 con interpolación lineal (lerp) dentro de un bucle requestAnimationFrame para evitar saltos o jittering visual.',
    category: '[ UI MOTION & VIDEO APIS ]',
    url: 'https://github.com/dinopengudev',
    status: 'EN VIVO',
    tech: ['HTML5 Video API', 'requestAnimationFrame', 'Linear Interpolation (Lerp)', 'Scroll Observer', 'Canvas Fallback']
  }
];
