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
    tagCategory: 'cli-systems',
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
    tagCategory: '3d-webgl',
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
    tagCategory: 'audio-dsp',
    url: 'https://github.com/dinopengudev',
    status: 'EN VIVO',
    tech: ['Web Audio API', 'ADSR Envelopes', 'Canvas 2D', 'Fast Fourier Transform (FFT)', 'Polyphony']
  },
  {
    id: 'groq-llm-streaming',
    number: '#04',
    title: 'Asistente Conversacional IA con Streaming de Ultrabaja Latencia',
    description:
      'Sandbox de IA generativa con procesamiento y renderizado token por token en tiempo real mediante Server-Sent Events (SSE), control de temperatura y system prompts, junto con telemetría de tokens/segundo y TTFT (Time to First Token).',
    approach:
      'Manejo de streams asíncronos con ReadableStream de la Fetch API, actualización de UI optimista sin re-renders innecesarios y cálculo de métricas de inferencia en tiempo real.',
    category: '[ AI / LLM & STREAMING ]',
    tagCategory: 'ai-llm',
    url: 'https://github.com/dinopengudev',
    status: 'EN VIVO',
    tech: ['Groq LPU / Llama 3', 'Server-Sent Events (SSE)', 'ReadableStream API', 'Optimistic UI', 'Token Metrics']
  },
  {
    id: 'retro-pc-emulator',
    number: '#05',
    title: 'Retro PC: Emulador de Computadora Antigua & Arcade de Juegos Clásicos',
    description:
      'Emulador interactivo de PC retro (1993) con carcasa CRT, secuencia de arranque BIOS y tres juegos clásicos: Serpiente, Buscaminas y Tetris. Incluye tabla de puntuaciones persistente en localStorage con filtro por juego y guardado de partida.',
    approach:
      'Máquinas de estado puras implementadas en React + refs para evitar closures obsoletos en los game loops. Renderizado de cuadrícula nativo sin canvas. Leaderboard con persistencia localStorage y modal de game-over con captura de nombre.',
    category: '[ RETRO GAMING & EMULATION ]',
    tagCategory: 'cli-systems',
    url: 'https://github.com/dinopengudev',
    status: 'EN VIVO',
    tech: ['React Game Loop', 'localStorage API', 'State Machine FSM', 'Grid Rendering', 'Retro UI / CRT Effect']
  }
];
