// =============================================================================
// EXPERIMENTO #05 — Asistente Conversacional IA con Streaming de Ultrabaja Latencia
// Conexión directa a la API de Groq LPU (Language Processing Unit) con streaming SSE (Server-Sent Events)
// Arquitectura:
//   1. Cliente HTTP fetch con ReadableStream para consumir chunks token a token en tiempo real.
//   2. Medición en vivo de telemetría de inferencia: TTFT (Time to First Token), tokens/segundo, total tokens y latencia.
//   3. Configuración dinámica de modelo (Llama-3.3-70b-versatile, Llama-3.1-8b-instant, Mixtral-8x7b-32768, Gemma2-9b-it).
//   4. Selector de System Prompts y control preciso de Temperatura (0.0 a 1.5).
//   5. Apikey protegida por variable de entorno o configurable por el usuario.
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import type { ExperimentComponentProps } from '../components/ExperimentDetail';
import { 
  Send, 
  Trash2, 
  Sliders, 
  Key, 
  Sparkles, 
  Square,
  Copy,
  Check
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokensCount?: number;
  timeMs?: number;
  tokensPerSec?: number;
  ttftMs?: number;
}

// DIRECTIVA DE ALMA / SOUL PARA CONSUMO ULTRABAJO DE TOKENS
export const GROQ_SOUL_DIRECTIVE = `[SOUL DIRECTIVE: GROQ MICRO-AGENT]
MISIÓN: Respuestas técnicas quirúrgicas, instantáneas y ultra-eficientes.
REGLAS INMUTABLES:
1. Longitud máxima: 100 caracteres estrictos por respuesta.
2. Cero saludos ni rellenos ("Hola", "Entendido"). Ve directo al grano.
3. Responde únicamente preguntas directas y concretas de tecnología, código o arquitectura.`;

const AVAILABLE_MODELS = [
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant (Ultra-rápido)', desc: 'Máxima velocidad y mínimo consumo de recursos' },
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', desc: 'Máxima capacidad de razonamiento' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (MoE)', desc: 'Mixture of Experts' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B Instruct', desc: 'Modelo compacto optimizado' },
];

const PRESET_SYSTEM_PROMPTS = [
  { label: 'SOUL // Micro-Agent (Máx 100 carac.)', prompt: GROQ_SOUL_DIRECTIVE },
  { label: 'Ingeniero Senior Conciso', prompt: `${GROQ_SOUL_DIRECTIVE}\nRol: Arquitecto senior.` },
  { label: 'Comandos & Terminal Directa', prompt: `${GROQ_SOUL_DIRECTIVE}\nRol: Devuelve solo comandos shell o sintaxis exacta.` },
];

export const GroqLlmStreaming: React.FC<ExperimentComponentProps> = ({
  onTelemetryUpdate
}) => {
  // Configuración de API Key: Prioriza .env.local, permite override en UI
  const defaultEnvKey = import.meta.env.VITE_GROQ_API_KEY || '';
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('groq_custom_key') || defaultEnvKey;
  });
  const [showKeyConfig, setShowKeyConfig] = useState<boolean>(false);

  // Parámetros del Modelo
  const [selectedModel, setSelectedModel] = useState<string>('llama-3.3-70b-versatile');
  const [temperature, setTemperature] = useState<number>(0.6);
  const [systemPrompt, setSystemPrompt] = useState<string>(PRESET_SYSTEM_PROMPTS[0].prompt);

  // Estado del Chat y Streaming
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: 'Motor de inferencia Groq LPU inicializado. Conexión establecida mediante Server-Sent Events (SSE). ¿Qué consulta técnica o arquitectura deseas analizar hoy?'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Telemetría de la última generación
  const [lastMetrics, setLastMetrics] = useState<{
    ttft: number;
    tokensPerSec: number;
    totalTokens: number;
    durationMs: number;
  }>({ ttft: 0, tokensPerSec: 0, totalTokens: 0, durationMs: 0 });

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll al final del chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Actualizar telemetría inicial
  useEffect(() => {
    onTelemetryUpdate?.({
      renderTime: 0.12,
      eventName: `Groq LPU listo: ${selectedModel.split('-')[0].toUpperCase()}`,
      customMetrics: [
        { label: 'Modelo', value: selectedModel.split('-')[0].toUpperCase(), color: 'text-emerald-400' },
        { label: 'Velocidad', value: '0 tok/s', color: 'text-blue-400' },
        { label: 'TTFT', value: '0ms', color: 'text-amber-400' }
      ]
    });
  }, [selectedModel, onTelemetryUpdate]);

  // Guardar key personalizada
  const handleSaveApiKey = (key: string) => {
    setApiKey(key.trim());
    localStorage.setItem('groq_custom_key', key.trim());
    setShowKeyConfig(false);
  };

  // Detener generación activa
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  // Enviar mensaje y procesar streaming SSE en tiempo real
  const handleSendMessage = async () => {
    const prompt = inputPrompt.trim();
    if (!prompt || isStreaming) return;

    if (!apiKey) {
      setShowKeyConfig(true);
      return;
    }

    setInputPrompt('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: prompt
    };

    const assistantMsgId = `ast-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: ''
    };

    setMessages(prev => [...prev, userMessage, initialAssistantMsg]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const startTime = performance.now();
    let firstTokenTime = 0;
    let accumulatedText = '';
    let tokenCount = 0;

    // Medida estricta de eficiencia: Solo enviar los últimos 2 mensajes previos de contexto
    const recentContext = messages
      .filter(m => m.id !== 'init-1')
      .slice(-2)
      .map(m => ({ role: m.role, content: m.content }));

    const conversationHistory = [
      { role: 'system', content: systemPrompt },
      ...recentContext,
      { role: 'user', content: prompt }
    ];

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: conversationHistory,
          temperature,
          max_tokens: 50, // Límite estricto para garantizar menos de 100 caracteres
          stream: true
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `HTTP ${response.status} Error`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream no disponible');

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;

          if (trimmed === 'data: [DONE]') {
            break;
          }

          if (trimmed.startsWith('data: ')) {
            try {
              const json = JSON.parse(trimmed.slice(6));
              const deltaContent = json.choices?.[0]?.delta?.content || '';

              if (deltaContent) {
                if (tokenCount === 0) {
                  firstTokenTime = performance.now();
                }
                tokenCount++;
                accumulatedText += deltaContent;

                // Actualizar burbuja del asistente sin re-renderizar todo
                setMessages(prev => prev.map(m => 
                  m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                ));
              }
            } catch {
              // Fragmento JSON parcial, ignorar
            }
          }
        }
      }

      const endTime = performance.now();
      const totalDurationSec = Math.max(0.05, (endTime - startTime) / 1000);
      const measuredTtft = firstTokenTime > 0 ? Math.round(firstTokenTime - startTime) : Math.round(totalDurationSec * 1000);
      const measuredSpeed = Number((tokenCount / totalDurationSec).toFixed(1));

      setLastMetrics({
        ttft: measuredTtft,
        tokensPerSec: measuredSpeed,
        totalTokens: tokenCount,
        durationMs: Math.round(totalDurationSec * 1000)
      });

      // Actualizar el mensaje final con su telemetría
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId ? { 
          ...m, 
          tokensCount: tokenCount, 
          timeMs: Math.round(totalDurationSec * 1000),
          tokensPerSec: measuredSpeed,
          ttftMs: measuredTtft
        } : m
      ));

      // Emitir métricas vivas al HUD superior
      onTelemetryUpdate?.({
        renderTime: 0.18,
        eventName: `Generación completada: ${tokenCount} tokens`,
        customMetrics: [
          { label: 'Modelo', value: selectedModel.split('-')[0].toUpperCase(), color: 'text-emerald-400' },
          { label: 'Velocidad', value: `${measuredSpeed} tok/s`, color: 'text-blue-400' },
          { label: 'TTFT', value: `${measuredTtft}ms`, color: measuredTtft < 250 ? 'text-emerald-400' : 'text-amber-400' }
        ]
      });

    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setMessages(prev => prev.map(m => 
          m.id === assistantMsgId 
            ? { ...m, content: `[ERROR EN GROQ API]: ${(err as Error).message}` } 
            : m
        ));
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init-1',
        role: 'assistant',
        content: 'Historial reiniciado. Motor Groq LPU listo para recibir nuevas instrucciones.'
      }
    ]);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 font-mono text-fg select-none">
      {/* 1. Barra de Control Superior */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="font-bold tracking-wider uppercase">
            GROQ LPU INFERENCE ENGINE // REAL-TIME SSE STREAMING
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Selector de Modelo */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isStreaming}
            className="px-2.5 py-1 border border-border bg-bg-subtle text-fg text-xs focus:outline-none focus:border-fg"
          >
            {AVAILABLE_MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {/* Botón Configurar Llave */}
          <button
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className={`p-1.5 border transition-all ${
              apiKey ? 'border-border bg-bg-subtle text-fg hover:border-fg' : 'border-amber-500 bg-amber-500/10 text-amber-400'
            }`}
            title="Configurar Groq API Key"
          >
            <Key className="w-3.5 h-3.5" />
          </button>

          {/* Limpiar Chat */}
          <button
            onClick={clearChat}
            disabled={isStreaming}
            className="p-1.5 border border-border bg-bg-subtle hover:border-fg text-fg transition-all"
            title="Limpiar conversación"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal / Panel colapsable de API Key */}
      {showKeyConfig && (
        <div className="p-3 border border-border bg-bg-subtle space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-fg uppercase flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-500" />
              <span>CONFIGURACIÓN DE GROQ API KEY</span>
            </span>
            <span className="text-[10px] text-fg-subtle">
              {apiKey ? 'Llave cargada en sesión' : 'Se requiere llave activa'}
            </span>
          </div>
          <div className="flex space-x-2">
            <input
              type="password"
              placeholder="gsk_..."
              defaultValue={apiKey}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveApiKey((e.target as HTMLInputElement).value);
              }}
              className="flex-1 px-3 py-1.5 border border-border bg-bg text-fg text-xs focus:outline-none focus:border-fg"
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                handleSaveApiKey(input.value);
              }}
              className="px-3 py-1.5 border border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold hover:bg-emerald-500/25 transition-all"
            >
              [ GUARDAR ]
            </button>
          </div>
          <p className="text-[10px] text-fg-muted">
            La llave se mantiene local en tu navegador y nunca se expone fuera de las llamadas directas a `api.groq.com`.
          </p>
        </div>
      )}

      {/* 2. Barra de Parámetros de Inferencia (Temperatura & System Prompt) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
        {/* Temperatura */}
        <div className="p-2.5 border border-border bg-bg-subtle flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-fg-subtle uppercase">
            <Sliders className="w-3 h-3 text-emerald-500" />
            <span>TEMP: {temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.5"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-28 accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* System Prompt Presets */}
        <div className="p-2.5 border border-border bg-bg-subtle md:col-span-2 flex items-center justify-between space-x-2">
          <span className="text-[10px] text-fg-subtle uppercase shrink-0">ROL:</span>
          <select
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            disabled={isStreaming}
            className="flex-1 px-2 py-0.5 border border-border bg-bg text-fg text-[11px] truncate focus:outline-none focus:border-fg"
          >
            {PRESET_SYSTEM_PROMPTS.map((p, idx) => (
              <option key={idx} value={p.prompt}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Panel de Chat & Transcripción en Streaming */}
      <div className="border border-border bg-bg flex flex-col flex-1 min-h-[320px] overflow-hidden shadow-sm">
        <div className="flex-1 p-3 overflow-y-auto space-y-3">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            const isSystem = m.role === 'system';

            return (
              <div
                key={m.id}
                className={`flex flex-col space-y-1 ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Cabecera del mensaje */}
                <div className="flex items-center space-x-2 text-[10px] text-fg-subtle">
                  <span className="font-bold uppercase">
                    {isUser ? 'USUARIO' : isSystem ? 'SISTEMA' : 'GROQ LPU'}
                  </span>
                  {m.tokensPerSec !== undefined && (
                    <span className="text-blue-400 font-bold">
                      {m.tokensPerSec} tok/s • TTFT: {m.ttftMs}ms
                    </span>
                  )}
                </div>

                {/* Burbuja del mensaje */}
                <div
                  className={`p-3 max-w-[92%] sm:max-w-[85%] text-xs leading-relaxed border relative group ${
                    isUser
                      ? 'border-border bg-bg-subtle text-fg'
                      : 'border-emerald-500/40 bg-emerald-500/5 text-fg'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-mono">
                    {m.content || (isStreaming && m.role === 'assistant' ? 'Generando respuesta en streaming...' : '')}
                  </div>

                  {/* Botón copiar mensaje */}
                  {m.content && !isUser && (
                    <button
                      onClick={() => copyToClipboard(m.content, m.id)}
                      className="absolute top-2 right-2 p-1 border border-border bg-bg opacity-0 group-hover:opacity-100 hover:border-fg transition-all text-fg"
                      title="Copiar texto"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Botones de Preguntas Fáciles y Concretas para Máximo Ahorro de Tokens */}
        <div className="px-3 py-1.5 bg-bg/80 border-t border-border flex items-center space-x-1.5 overflow-x-auto text-[10px]">
          <span className="text-fg-subtle shrink-0">Preguntas Fáciles:</span>
          {[
            '¿Diferencia entre let y const?',
            '¿Qué es un closure en JS?',
            'Comando git para deshacer commit',
            '¿Qué hace Docker COPY?',
            '¿Qué es TTFB en web?'
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputPrompt(q);
              }}
              disabled={isStreaming}
              className="px-2 py-0.5 border border-border/80 bg-bg-subtle hover:border-fg text-fg-muted hover:text-fg truncate shrink-0 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Barra de Entrada de Consulta con Límite de 100 Caracteres */}
        <div className="p-2.5 border-t border-border bg-bg-subtle flex items-center space-x-2">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              maxLength={100}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isStreaming ? 'Recibiendo tokens desde Groq...' : 'Pregunta concisa (Máx 100 caracteres)...'}
              disabled={isStreaming}
              className="w-full px-3 py-2 pr-14 border border-border bg-bg text-fg text-xs focus:outline-none focus:border-fg disabled:opacity-50"
            />
            {/* Contador de caracteres */}
            <span className={`absolute right-2 text-[10px] ${
              inputPrompt.length >= 90 ? 'text-amber-500 font-bold' : 'text-fg-subtle'
            }`}>
              {inputPrompt.length}/100
            </span>
          </div>

          {isStreaming ? (
            <button
              onClick={handleStopStreaming}
              className="px-3 py-2 border border-rose-500 bg-rose-500/10 text-rose-400 font-bold hover:bg-rose-500/20 transition-all text-xs flex items-center space-x-1.5"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>[ DETENER ]</span>
            </button>
          ) : (
            <button
              onClick={handleSendMessage}
              disabled={!inputPrompt.trim()}
              className="px-3 py-2 border border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold hover:bg-emerald-500/25 transition-all text-xs flex items-center space-x-1.5 disabled:opacity-40"
            >
              <Send className="w-3 h-3" />
              <span>[ ENVIAR ]</span>
            </button>
          )}
        </div>
      </div>

      {/* Telemetría Detallada en el pie */}
      {lastMetrics.totalTokens > 0 && (
        <div className="p-2.5 border border-border bg-bg-subtle flex flex-wrap items-center justify-between gap-3 text-[11px] text-fg-subtle">
          <div>• Tokens Generados: <strong className="text-fg">{lastMetrics.totalTokens}</strong></div>
          <div>• Velocidad: <strong className="text-blue-400">{lastMetrics.tokensPerSec} tok/s</strong></div>
          <div>• TTFT (Time to First Token): <strong className="text-amber-400">{lastMetrics.ttft} ms</strong></div>
          <div>• Duración Total: <strong className="text-fg">{lastMetrics.durationMs} ms</strong></div>
        </div>
      )}
    </div>
  );
};
