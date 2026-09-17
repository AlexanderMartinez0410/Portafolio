import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import type { LabExperiment } from '../types';
import { labExperimentsData } from '../data/lab';
import { 
  ArrowLeft, 
  ArrowRight, 
  Activity, 
  Zap, 
  Cpu, 
  Code2, 
  Play, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Terminal,
  Loader2
} from 'lucide-react';

const LinuxVirtualCli = lazy(() =>
  import('../experiments/LinuxVirtualCli').then((m) => ({ default: m.LinuxVirtualCli }))
);
const PinguVoxelCretaceous = lazy(() =>
  import('../experiments/PinguVoxelCretaceous').then((m) => ({ default: m.PinguVoxelCretaceous }))
);
const VideoScrubbing = lazy(() =>
  import('../experiments/VideoScrubbing').then((m) => ({ default: m.VideoScrubbing }))
);
const WhatsAppBotSimulator = lazy(() =>
  import('../experiments/WhatsAppBotSimulator').then((m) => ({ default: m.WhatsAppBotSimulator }))
);
const PolyphonicSynthAudio = lazy(() =>
  import('../experiments/PolyphonicSynthAudio').then((m) => ({ default: m.PolyphonicSynthAudio }))
);
const NetworkPerformanceLab = lazy(() =>
  import('../experiments/NetworkPerformanceLab').then((m) => ({ default: m.NetworkPerformanceLab }))
);
const GroqLlmStreaming = lazy(() =>
  import('../experiments/GroqLlmStreaming').then((m) => ({ default: m.GroqLlmStreaming }))
);
const RetroPcEmulator = lazy(() =>
  import('../experiments/RetroPcEmulator').then((m) => ({ default: m.RetroPcEmulator }))
);

// Mapa de id → componente lazy
const EXPERIMENT_COMPONENTS: Record<string, React.ComponentType<ExperimentComponentProps>> = {
  'linux-virtual-cli': LinuxVirtualCli as React.ComponentType<ExperimentComponentProps>,
  'pingu-3d-voxel': PinguVoxelCretaceous as React.ComponentType<ExperimentComponentProps>,
  'video-scroll-scrubber': VideoScrubbing as React.ComponentType<ExperimentComponentProps>,
  'whatsapp-bot-simulator': WhatsAppBotSimulator as React.ComponentType<ExperimentComponentProps>,
  'polyphonic-synth-audio': PolyphonicSynthAudio as React.ComponentType<ExperimentComponentProps>,
  'network-performance-lab': NetworkPerformanceLab as React.ComponentType<ExperimentComponentProps>,
  'groq-llm-streaming': GroqLlmStreaming as React.ComponentType<ExperimentComponentProps>,
  'retro-pc-emulator': RetroPcEmulator as React.ComponentType<ExperimentComponentProps>,
};

// Spinner de carga para Suspense
const ExperimentLoader: React.FC = () => (
  <div className="flex-1 flex items-center justify-center py-16 text-fg-muted font-mono text-xs">
    <Loader2 className="w-4 h-4 animate-spin mr-2" />
    <span>Cargando experimento...</span>
  </div>
);

export interface TelemetryMetric {
  label: string;
  value: string | number;
  color?: string;
}

export interface ExperimentCodeSnippet {
  component: string;
  hook: string;
  python?: string;
}

export interface ExperimentComponentProps {
  onTelemetryUpdate?: (data: { 
    renderTime?: number; 
    eventName?: string;
    customMetrics?: TelemetryMetric[];
  }) => void;
  isCodeOpen?: boolean;
}

interface ExperimentDetailProps {
  experiment: LabExperiment;
  onBack: () => void;
  onSelectExperiment: (exp: LabExperiment) => void;
}

const GET_INITIAL_METRICS = (expId: string): TelemetryMetric[] => {
  switch (expId) {
    case 'linux-virtual-cli':
      return [
        { label: 'Shell', value: 'DinoBash 5.2', color: 'text-emerald-500' },
        { label: 'CMD', value: '0', color: 'text-red-500' },
        { label: 'Ruta', value: '~', color: 'text-blue-500' }
      ];
    case 'pingu-3d-voxel':
      return [
        { label: 'Acción', value: 'IDLE', color: 'text-emerald-400' },
        { label: 'Posición', value: 'X:0.0 Z:0.0', color: 'text-blue-400' },
        { label: 'Entorno', value: 'Cretácico Voxel', color: 'text-purple-400' }
      ];
    case 'video-scroll-scrubber':
      return [
        { label: 'Controlador', value: 'Frame a Frame', color: 'text-emerald-400' },
        { label: 'Timeline', value: '0.0%', color: 'text-amber-400' },
        { label: 'Modo', value: 'Python Scrubbing', color: 'text-blue-400' }
      ];
    case 'polyphonic-synth-audio':
      return [
        { label: 'Voces', value: '0 activas', color: 'text-fg-muted' },
        { label: 'Cutoff', value: '2500Hz', color: 'text-amber-400' },
        { label: 'Onda', value: 'SAWTOOTH', color: 'text-blue-400' }
      ];
    case 'network-performance-lab':
      return [
        { label: 'Assets Reales', value: 'Cargando DOM...', color: 'text-emerald-400' },
        { label: 'Payload', value: '0 KB', color: 'text-blue-400' },
        { label: 'DOM Interactivo', value: '0ms', color: 'text-amber-400' }
      ];
    case 'whatsapp-bot-simulator':
      return [
        { label: 'Estado FSM', value: 'AWAITING_SERVICE_SELECTION', color: 'text-emerald-400' },
        { label: 'Msgs', value: '1 chat', color: 'text-amber-400' },
        { label: 'Webhooks', value: '0 POST', color: 'text-fg-muted' }
      ];
    case 'terminal-linux-virtual':
      return [
        { label: 'Terminal', value: 'bash 5.2', color: 'text-emerald-400' },
        { label: 'Memoria', value: '128 MB', color: 'text-blue-400' },
        { label: 'Estado', value: 'Online', color: 'text-amber-400' }
      ];
    case 'groq-llm-streaming':
      return [
        { label: 'Modelo', value: 'Llama-3-70B', color: 'text-emerald-400' },
        { label: 'Velocidad', value: '0 tok/s', color: 'text-blue-400' },
        { label: 'TTFT', value: '0ms', color: 'text-amber-400' }
      ];
    case 'retro-pc-emulator':
      return [
        { label: 'Juego', value: 'Menú', color: 'text-amber-400' },
        { label: 'Puntos', value: 0, color: 'text-green-400' },
        { label: 'Records', value: '0', color: 'text-blue-400' }
      ];
    case 'pathfinding-visualizer':
      return [
        { label: 'Nodos', value: '0 evaluados', color: 'text-emerald-400' },
        { label: 'Algoritmo', value: 'A* Search', color: 'text-blue-400' },
        { label: 'Costo', value: '0', color: 'text-amber-400' }
      ];
    default:
      return [
        { label: 'Estado', value: 'Listo', color: 'text-emerald-400' },
        { label: 'Modo', value: 'Interactivo', color: 'text-blue-400' },
        { label: 'Latencia', value: '0ms', color: 'text-amber-400' }
      ];
  }
};

export const ExperimentDetail: React.FC<ExperimentDetailProps> = ({
  experiment,
  onBack,
  onSelectExperiment
}) => {
  // Inicia siempre en modo DEMO con el código cerrado por defecto
  const [showCode, setShowCode] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFileTab, setSelectedFileTab] = useState<'component' | 'hook' | 'python'>('component');

  // Telemetría dinámica en tiempo real inicializada con los valores reales del proyecto
  const [renderTime, setRenderTime] = useState<number>(0.15);
  const [eventCount, setEventCount] = useState<number>(0);
  const [lastEvent, setLastEvent] = useState<string>('Listo para interactuar');
  const [customMetrics, setCustomMetrics] = useState<TelemetryMetric[]>(() => GET_INITIAL_METRICS(experiment.id));

  // Sincronizar métricas iniciales cuando cambia el experimento según patrón idiomático de React 19
  const [prevExperimentId, setPrevExperimentId] = useState(experiment.id);
  if (experiment.id !== prevExperimentId) {
    setPrevExperimentId(experiment.id);
    setCustomMetrics(GET_INITIAL_METRICS(experiment.id));
    setEventCount(0);
    setLastEvent('Inicializado');
  }

  // Manejo de pantalla completa: bloquear scroll del body y tecla Escape
  useEffect(() => {
    if (isMaximized) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMaximized(false);
          setShowCode(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isMaximized]);

  // Callback para telemetría contextual (recibe métricas vivas del experimento)
  const handleTelemetryUpdate = useCallback((data: {
    renderTime?: number;
    eventName?: string;
    customMetrics?: TelemetryMetric[];
  }) => {
    if (data.renderTime !== undefined) setRenderTime(data.renderTime);
    if (data.eventName !== undefined) setLastEvent(data.eventName);
    if (data.customMetrics && data.customMetrics.length > 0) {
      setCustomMetrics(data.customMetrics);
    }
    setEventCount((prev) => prev + 1);
  }, []);

  // Encontrar anterior y siguiente
  const currentIndex = labExperimentsData.findIndex((item) => item.id === experiment.id);
  const prevExp = currentIndex > 0 ? labExperimentsData[currentIndex - 1] : null;
  const nextExp =
    currentIndex < labExperimentsData.length - 1 ? labExperimentsData[currentIndex + 1] : null;

  // ── Snippets de código REAL por experimento ─────────────────────────────
  const REAL_CODE: Record<string, ExperimentCodeSnippet> = {
    'pingu-3d-voxel': {
      component: `// PinguVoxelCretaceous.tsx — Motor 3D Procedural Voxel con Three.js & WebGL
// Renderiza a Pingu con pijama de dinosaurio en un bioma cretácico de cubos
// con animación esquelética de alas, patas y cola, además de físicas de salto y baile.

export const PinguVoxelCretaceous: React.FC<ExperimentComponentProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Construcción del bioma cretácico de cubos (tierra, roca, agua y cordillera volcánica)
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const matPajama = new THREE.MeshLambertMaterial({ color: 0x16a34a });
    const matSpikes = new THREE.MeshLambertMaterial({ color: 0xf59e0b });

    // Jerarquía de Pingu con pijama (alas articuladas, cresta dorsal y cola)
    const pingu = new THREE.Group();
    // Bucle de render a 60 FPS con cinemática de marcha, salto gravitatorio y baile...
  }, []);
};`,
      hook: `// Arquitectura Voxel 3D & Cinemática WebGL:
// 1. Scene Graph Jerárquico:
//    [Scene] ──> [Terrain Voxels (Cordillera Volcánica)]
//      │
//      ▼
//   [Pingu Root Group]
//      ├── [Body + Dinosaur Pajama]
//      ├── [Articulated Wings (L/R)] ──> Giro en eje Z con Math.sin(t)
//      ├── [Dino Tail Mesh] ──> Meneo lateral en eje Y
//      └── [Legs (L/R)] ──> Ciclo de caminata inverso en eje X

// 2. Físicas Parabólicas:
//    y(t) = y0 + vy * dt;   vy -= gravity * dt; (detecta contacto con suelo z=0)`,
    },
    'video-scroll-scrubber': {
      component: `// VideoScrubbing.tsx — Motor 100% Client-Side en memoria (0 bytes en disco)
// Decodifica el video del usuario directamente en el navegador con HTML5 Video + OffscreenCanvas
// y almacena los fotogramas en GPU RAM como ImageBitmap para scrubbing a 60 FPS sin latencia.

export const VideoScrubbing: React.FC = () => {
  const bitmapsRef = useRef<ImageBitmap[]>([]);
  const [activeFrameIdx, setActiveFrameIdx] = useState(0);

  // Extracción pura en navegador: cero peticiones a backend, cero persistencia
  const processVideoInBrowser = async (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = blobUrl;
    await video.play(); video.pause();

    const offscreen = document.createElement('canvas');
    offscreen.width = 800; offscreen.height = 450;
    const ctx = offscreen.getContext('2d');

    const total = 60;
    for (let i = 0; i < total; i++) {
      video.currentTime = (i / total) * video.duration;
      await new Promise(r => video.onseeked = r);
      ctx.drawImage(video, 0, 0, 800, 450);
      bitmapsRef.current.push(await createImageBitmap(offscreen));
    }
    URL.revokeObjectURL(blobUrl); // Liberación inmediata del blob
  };

  // Scrubbing con wheel o drag continuo a 60 FPS:
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const nextIdx = clamp(activeFrameIdx + Math.sign(e.deltaY), 0, total - 1);
    setActiveFrameIdx(nextIdx);
  };
};`,
      hook: `// Arquitectura 100% Web & Memoria Volátil:
// 1. Offscreen Pipeline:
//    [Usuario sube Video MP4/WebM] 
//          │ (URL.createObjectURL)
//          ▼
//    [HTMLVideoElement (Offscreen)] ──> Seek determinista de frames
//          │
//          ▼
//    [createImageBitmap(OffscreenCanvas)] ──> Memoria Gráfica VRAM
//          │
//          ▼
//    [URL.revokeObjectURL] ──> Video original liberado de RAM
//
// 2. Cero Almacenamiento:
//    - 0 bytes guardados en disco duro o servidor backend.
//    - bitmaps.forEach(b => b.close()) al cerrar o cambiar de video.`,
      python: `#!/usr/bin/env python3
# video_to_frames.py — Extracción headless opcional con OpenCV
# Nota: La demo web ejecuta la extracción 100% en memoria en el cliente con OffscreenCanvas.

import cv2
import sys

def extract_keyframes(video_path: str, output_dir: str = "./frames", max_frames: int = 60):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error abriendo video: {video_path}")
        return

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step = max(1, total_frames // max_frames)
    frame_idx = 0

    for i in range(0, total_frames, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if not ret:
            break
        cv2.imwrite(f"{output_dir}/frame_{frame_idx:03d}.webp", frame, [cv2.IMWRITE_WEBP_QUALITY, 85])
        frame_idx += 1

    cap.release()
    print(f"Extracción finalizada: {frame_idx} fotogramas generados.")`,
    },
    'whatsapp-bot-simulator': {
      component: `// WhatsAppBotSimulator.tsx — Flujo conversacional FSM interactivo
// Emula la UI de WhatsApp Cloud API, gestiona el árbol de decisiones
// y despacha webhooks simulados en cada punto de interacción.

export const WhatsAppBotSimulator: React.FC<ExperimentComponentProps> = ({
  onTelemetryUpdate
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<BotStep>('INITIAL');
  const [leadData, setLeadData] = useState<LeadData>({});

  // Máquina de estados finitos que valida cada respuesta
  const handleSendMessage = (text: string) => {
    if (currentStep === 'COLLECTING_EMAIL') {
      if (!text.includes('@')) {
        return botReply('⚠️ Por favor ingresa un correo válido:');
      }
      setLeadData(prev => ({ ...prev, email: text }));
      botReply('Anotado. ¿Cuál es tu teléfono?', 'COLLECTING_PHONE');
    }
  };
};`,
      hook: `// Arquitectura FSM (Finite State Machine) para Automatización B2B:
// Estados del pipeline conversacional y validación estricta de leads.

export type BotStep =
  | 'INITIAL'                      // Saludo inicial y bienvenida
  | 'AWAITING_SERVICE_SELECTION'   // Opciones de catálogo de servicios
  | 'CATALOG_BROWSING'             // Navegación de planes y precios
  | 'COLLECTING_NAME'              // Captura de datos: Nombre
  | 'COLLECTING_EMAIL'             // Captura de datos: Correo corporativo
  | 'COLLECTING_PHONE'             // Captura de datos: WhatsApp / Móvil
  | 'ORDER_CONFIRMATION'           // Resumen y confirmación de datos
  | 'COMPLETED';                   // Despacho de Webhook HTTP 200 hacia CRM`,
      python: `#!/usr/bin/env python3
# webhook_receiver.py — FastAPI Webhook Receiver para WhatsApp Cloud API
# Recibe las notificaciones de Meta Graph API y enruta a la base de datos

from fastapi import FastAPI, Request, BackgroundTasks
import httpx

app = FastAPI(title="WhatsApp Webhook Dispatcher")

@app.post("/webhook/whatsapp")
async def receive_whatsapp_event(request: Request, bg_tasks: BackgroundTasks):
    data = await request.json()
    event_type = data.get("event")
    payload = data.get("payload", {})
    
    # Procesamiento asíncrono hacia CRM / HubSpot
    print(f"Evento recibido: {event_type} para {payload.get('email')}")
    return {"status": "success", "code": 200}`
    },
    'polyphonic-synth-audio': {
      component: `// PolyphonicSynthAudio.tsx — Sintetizador Polifónico Nativo
// Generación en tiempo real con Web Audio API (OscillatorNode, GainNode, BiquadFilterNode)
// y osciloscopio analógico Canvas 2D a 60 FPS.

export const PolyphonicSynthAudio: React.FC<ExperimentComponentProps> = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeVoicesRef = useRef<Map<string, ActiveVoice>>(new Map());

  // Activación de voz con envolvente ADSR
  const playNote = (noteDef: NoteDefinition) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const voiceGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = waveform;
    osc.frequency.setValueAtTime(noteDef.freq, ctx.currentTime);

    // Envolvente de volumen (Attack / Decay / Sustain)
    voiceGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    voiceGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + attack);
    voiceGain.gain.exponentialRampToValueAtTime(sustain, ctx.currentTime + attack + decay);

    osc.connect(filter);
    filter.connect(voiceGain);
    voiceGain.connect(masterGain);
    osc.start();
  };
};`,
      hook: `// Arquitectura DSP & Visualización FFT:
// Grafo de Nodos de Audio y Análisis de Espectro en Frecuencia

// 1. Grafo de Audio:
// [OscillatorNode] ──> [BiquadFilterNode (Cutoff/Resonance)] ──> [GainNode (ADSR)]
//         │
//         ▼
//   [MasterGainNode] ──> [AnalyserNode (FFT)] ──> [AudioDestinationNode (Speakers)]

// 2. Visualizador en Tiempo Real:
// AnalyserNode.getByteTimeDomainData() ──> requestAnimationFrame ──> Canvas 2D (60 FPS)`,
    },
    'network-performance-lab': {
      component: `// NetworkPerformanceLab.tsx — Simulador de Pipeline de Rendimiento Web
// Mide en vivo tiempos de latencia TTFB, descarga en cascada (waterfall) de assets
// y calcula Core Web Vitals (FCP, LCP, CLS, TBT) bajo diferentes arquitecturas (CSR / SSR / Edge).

export const NetworkPerformanceLab: React.FC<ExperimentComponentProps> = () => {
  const [network, setNetwork] = useState<NetworkProfile>('4g');
  const [arch, setArch] = useState<RenderingArchitecture>('ssr');

  const runPerformanceAudit = () => {
    const net = NETWORK_PROFILES[network];
    // Simulación asíncrona de descarga HTTP/2 Multiplexing
    const assets = generateWaterfallAssets(net, arch);
    const vitals = computeCoreWebVitals(assets, arch);
    setResources(assets);
    setVitals(vitals);
  };
};`,
      hook: `// Arquitectura de Medición de Core Web Vitals:
// 1. TTFB (Time to First Byte): Latencia de red DNS + TCP + TLS + Tiempo de respuesta del servidor.
// 2. FCP (First Contentful Paint): Momento en que el navegador renderiza el primer fragmento del DOM.
// 3. LCP (Largest Contentful Paint): Descarga y render del bloque visual o imagen hero principal.
// 4. CLS (Cumulative Layout Shift): Estabilidad visual y ausencia de desplazamientos inesperados.
// 5. TBT (Total Blocking Time): Tiempo de bloqueo del hilo principal durante la ejecución del bundle JS.`,
    },
    'groq-llm-streaming': {
      component: `// GroqLlmStreaming.tsx — Inferencia LLM con Streaming Server-Sent Events (SSE)
// Consumo en tiempo real de tokens generados por Groq LPU mediante ReadableStream API.

export const GroqLlmStreaming: React.FC<ExperimentComponentProps> = () => {
  const handleSendMessage = async (prompt: string) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiKey}\`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        stream: true
      })
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      // Procesar chunks SSE: "data: {...}" y renderizar token por token
    }
  };
};`,
      hook: `// Arquitectura de Ultrabaja Latencia Groq LPU:
// 1. Conexión HTTP/2 persistente hacia endpoints de inferencia Groq.
// 2. Transmisión Server-Sent Events (SSE) con chunks JSON incrementales.
// 3. Decodificación asíncrona con ReadableStreamDefaultReader.
// 4. Cálculo en vivo de métricas de hardware:
//    - TTFT (Time to First Token) = t_first_token - t_request_start
//    - Velocidad = total_tokens / total_duration_seconds (tok/s)`,
    },
  };

  const fallbackCode: ExperimentCodeSnippet = {
    component: `// [ ${experiment.id} ] — Demo en construcción
// El código fuente real de este experimento
// estará disponible cuando se implemente el demo interactivo.
//
// Próximamente:
// → ${experiment.title}
// → ${experiment.category}`,
    hook: `// Stack tecnológico de este experimento:
${(experiment.tech ?? []).map((t) => `// · ${t}`).join('\n')}

// Enfoque arquitectónico:
// ${experiment.approach ?? '—'}`,
  };

  const codeMap: ExperimentCodeSnippet = REAL_CODE[experiment.id] ?? fallbackCode;
  const currentCodeSnippet =
    selectedFileTab === 'component'
      ? codeMap.component
      : selectedFileTab === 'python'
      ? (codeMap.python ?? codeMap.component)
      : codeMap.hook;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mainContent = (
    <div
      className={`transition-all duration-200 ${
        isMaximized
          ? 'fixed inset-0 z-[99999] w-screen h-screen bg-bg text-fg p-4 md:p-6 flex flex-col gap-3.5 overflow-hidden'
          : 'w-full space-y-3.5'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. CABECERA LIMPIA: TÍTULO SIN SALTOS + BOTÓN VER CÓDIGO SIMULTÁNEO       */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border min-h-[44px]">
        {/* Izquierda: Volver + Número + Título con truncado inteligente */}
        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="shrink-0 px-2.5 py-1.5 border border-border bg-bg-subtle hover:border-fg hover:text-fg text-fg-muted font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all"
            title="Volver al laboratorio"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">[ VOLVER ]</span>
          </button>

          <span className="shrink-0 font-mono text-xs font-bold text-fg bg-bg-surface px-2 py-1 border border-border">
            {experiment.number}
          </span>

          <h1
            className="text-xs sm:text-sm md:text-base font-bold text-fg truncate leading-none"
            title={experiment.title}
          >
            {experiment.title}
          </h1>
        </div>

        {/* Derecha: Toggle Código Simultáneo + Maximizar */}
        <div className="flex items-center space-x-2 shrink-0 font-mono text-xs">
          {/* Botón Ver Código a la vez que el Demo */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`px-3 py-1.5 border flex items-center space-x-1.5 transition-all ${
              showCode
                ? 'border-fg bg-fg text-bg font-bold'
                : 'border-border bg-bg-subtle text-fg-muted hover:border-fg hover:text-fg font-medium'
            }`}
            title="Ver código fuente al lado del demo"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showCode ? '[ CERRAR CÓDIGO ]' : '[ VER CÓDIGO ]'}</span>
          </button>

          {/* Maximizar — abre código automáticamente en modo fullscreen */}
          <button
            onClick={() => {
              const next = !isMaximized;
              setIsMaximized(next);
              if (next) setShowCode(true);   // fullscreen → siempre con código
              else setShowCode(false);        // restaurar → cierra código
            }}
            className="p-1.5 border border-border bg-bg-subtle hover:border-fg text-fg transition-all"
            title={isMaximized ? 'Restaurar pantalla' : 'Maximizar con código'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HUD DE TELEMETRÍA CONTEXTUAL DINÁMICA                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
        {customMetrics.length >= 3 ? (
          // Si el experimento emite métricas personalizadas vivas, se muestran éstas
          customMetrics.slice(0, 3).map((metric, idx) => (
            <div key={idx} className="px-3 py-1.5 border border-border bg-bg-subtle flex items-center justify-between">
              <span className="text-[11px] text-fg-subtle uppercase">{metric.label}:</span>
              <span className={`font-bold ${metric.color || 'text-fg'}`}>{metric.value}</span>
            </div>
          ))
        ) : (
          // Métricas por defecto
          <>
            <div className="px-3 py-1.5 border border-border bg-bg-subtle flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-fg-subtle">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Latencia:</span>
              </div>
              <span className="font-bold text-fg">{renderTime.toFixed(2)} ms</span>
            </div>

            <div className="px-3 py-1.5 border border-border bg-bg-subtle flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-fg-subtle">
                <Cpu className="w-3 h-3 text-blue-500" />
                <span>Operaciones:</span>
              </div>
              <span className="font-bold text-fg">{eventCount}</span>
            </div>

            <div className="px-3 py-1.5 border border-border bg-bg-subtle flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-fg-subtle">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span>Interacciones:</span>
              </div>
              <span className="font-bold text-fg">{eventCount > 0 ? 'Activo' : 'En reposo'}</span>
            </div>
          </>
        )}

        {/* 4ta columna: Último evento / Estado vivo */}
        <div className="px-3 py-1.5 border border-border bg-bg-subtle flex items-center justify-between truncate">
          <div className="flex items-center space-x-1.5 text-[11px] text-fg-subtle shrink-0">
            <Terminal className="w-3 h-3 text-purple-500" />
            <span>Último:</span>
          </div>
          <span className="font-bold text-fg text-[10px] truncate max-w-[130px] pl-1.5" title={lastEvent}>
            {lastEvent}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ESPACIO PRINCIPAL: DEMO VIVO (+ CÓDIGO SIMULTÁNEO SI ESTÁ ABIERTO)     */}
      {/* ========================================================================= */}
      <div
        className={`grid gap-3.5 transition-all ${
          isMaximized
            ? showCode
              ? 'grid-cols-1 lg:grid-cols-12 flex-1 min-h-0'
              : 'grid-cols-1 flex-1 min-h-0'
            : showCode
            ? 'grid-cols-1 lg:grid-cols-12 min-h-[480px] lg:h-[calc(100vh-250px)]'
            : 'grid-cols-1 min-h-[480px] lg:h-[calc(100vh-250px)]'
        }`}
      >
        {/* PANEL DEL DEMO EN VIVO */}
        <div
          className={`border border-border bg-bg flex flex-col min-h-0 ${
            showCode ? 'col-span-1 lg:col-span-7' : 'col-span-1'
          } overflow-hidden`}
        >
          {/* Cabecera del Panel Demo */}
          <div className="px-3.5 py-2 bg-bg-subtle border-b border-border flex items-center justify-between font-mono text-[11px] text-fg-muted shrink-0">
            <span className="font-bold text-fg flex items-center space-x-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="truncate">DEMO EN VIVO // [{experiment.id}]</span>
            </span>
            <span className="text-[10px] text-fg-subtle shrink-0">React 19 Interactive</span>
          </div>

          {/* Contenedor del Componente — scroll interno para ver carrusel */}
          <div className={`flex-1 min-h-0 overflow-y-auto flex flex-col relative bg-bg ${
            EXPERIMENT_COMPONENTS[experiment.id] ? 'p-4 md:p-5' : 'p-4 md:p-6 justify-center items-center'
          }`}>
            {/* ── Si hay componente real registrado, renderízalo ── */}
            {EXPERIMENT_COMPONENTS[experiment.id] ? (
              <Suspense fallback={<ExperimentLoader />}>
                {React.createElement(EXPERIMENT_COMPONENTS[experiment.id], {
                  onTelemetryUpdate: handleTelemetryUpdate,
                  isCodeOpen: showCode,
                })}
              </Suspense>
            ) : (
              /* ── Placeholder genérico para experimentos aún no implementados ── */
              <div className="w-full max-w-xl text-center space-y-5 py-6">
                <div className="w-12 h-12 mx-auto border border-border bg-bg-subtle flex items-center justify-center text-fg">
                  <Play className="w-6 h-6 fill-current" />
                </div>
                <div className="space-y-2">
                  <div className="inline-block px-2.5 py-0.5 border border-border bg-bg-subtle text-[10px] font-mono text-fg-subtle uppercase">
                    {experiment.category}
                  </div>
                  <h3 className="font-mono text-sm md:text-base font-bold text-fg">
                    {experiment.title}
                  </h3>
                  <p className="text-xs text-fg-muted font-sans leading-relaxed max-w-lg mx-auto">
                    {experiment.description}
                  </p>
                </div>

                {/* Enfoque de Arquitectura */}
                {experiment.approach && (
                  <div className="p-3.5 border border-border bg-bg-subtle/80 text-left font-mono text-xs space-y-1">
                    <span className="text-[10px] text-fg font-bold uppercase tracking-wider block">
                      [ ENFOQUE ARQUITECTÓNICO & ESPECIFICACIÓN ]
                    </span>
                    <p className="font-sans text-xs text-fg-muted leading-relaxed">
                      {experiment.approach}
                    </p>
                  </div>
                )}

                {/* Tecnologías */}
                {experiment.tech && (
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                    {experiment.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 border border-border bg-bg text-[10px] font-mono text-fg"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Botón de prueba para disparar telemetría dinámica */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const start = performance.now();
                      const mockDuration = Math.max(0.12, performance.now() - start + Math.random() * 0.7);
                      handleTelemetryUpdate({
                        renderTime: mockDuration,
                        eventName: `Acción reactiva procesada (${mockDuration.toFixed(2)}ms)`
                      });
                    }}
                    className="px-4 py-2 border border-border hover:border-fg bg-bg-surface font-mono text-xs font-semibold text-fg transition-all hover:bg-fg hover:text-bg"
                  >
                    [ SIMULAR ACCIÓN REACTIVA & TESTEAR TELEMETRÍA ]
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PANEL DE CÓDIGO SIMULTÁNEO (Se muestra al presionar [ VER CÓDIGO ]) */}
        {showCode && (
          <div className="col-span-1 lg:col-span-5 min-h-0 border border-border bg-bg flex flex-col overflow-hidden animate-fadeIn">
            {/* Selector de Archivos + Botón Copiar */}
            <div className="px-3 py-1.5 bg-bg-subtle border-b border-border flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-1">
                {/* Nombres de tab dinámicos según el experimento */}
                {([
                  {
                    key: 'component' as const,
                    label: experiment.id === 'video-scroll-scrubber'
                      ? 'VideoScrubbing.tsx'
                      : experiment.id === 'whatsapp-bot-simulator'
                      ? 'WhatsAppBotSimulator.tsx'
                      : experiment.id === 'polyphonic-synth-audio'
                      ? 'PolyphonicSynthAudio.tsx'
                      : 'Component.tsx',
                  },
                  {
                    key: 'hook' as const,
                    label: experiment.id === 'video-scroll-scrubber'
                      ? 'Architecture.ts'
                      : experiment.id === 'whatsapp-bot-simulator'
                      ? 'FSM_Workflow.ts'
                      : experiment.id === 'polyphonic-synth-audio'
                      ? 'DSP_AudioGraph.ts'
                      : 'useCustomHook.ts',
                  },
                  ...(experiment.id === 'video-scroll-scrubber' || experiment.id === 'whatsapp-bot-simulator' ? [{
                    key: 'python' as const,
                    label: experiment.id === 'whatsapp-bot-simulator' ? 'webhook_receiver.py' : 'video_to_frames.py',
                  }] : []),
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFileTab(key)}
                    className={`px-2 py-1 text-[11px] border transition-all ${
                      selectedFileTab === key
                        ? 'border-border bg-bg text-fg font-bold'
                        : 'border-transparent text-fg-muted hover:text-fg'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="px-2 py-1 border border-border hover:border-fg bg-bg text-[10px] text-fg font-semibold flex items-center space-x-1 transition-all"
                title="Copiar código fuente"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            {/* Visor de Código con Scroll */}
            <div className="flex-1 p-3.5 bg-bg overflow-auto font-mono text-xs leading-relaxed text-fg-muted select-text">
              <pre className="text-[11px] text-fg whitespace-pre font-mono">
                <code>{currentCodeSnippet}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. NAVEGACIÓN INFERIOR COMPACTA                                           */}
      {/* ========================================================================= */}
      <div className="pt-1.5 flex items-center justify-between font-mono text-xs text-fg-muted">
        {prevExp ? (
          <button
            onClick={() => onSelectExperiment(prevExp)}
            className="flex items-center space-x-1.5 hover:text-fg transition-colors truncate max-w-[45%]"
          >
            <ArrowLeft className="w-3 h-3 shrink-0" />
            <span className="text-[11px] truncate">← {prevExp.number} {prevExp.title}</span>
          </button>
        ) : (
          <span />
        )}

        {nextExp ? (
          <button
            onClick={() => onSelectExperiment(nextExp)}
            className="flex items-center space-x-1.5 hover:text-fg transition-colors ml-auto truncate max-w-[45%]"
          >
            <span className="text-[11px] truncate">{nextExp.number} {nextExp.title} →</span>
            <ArrowRight className="w-3 h-3 shrink-0" />
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );

  return isMaximized && typeof document !== 'undefined'
    ? createPortal(mainContent, document.body)
    : mainContent;
};
