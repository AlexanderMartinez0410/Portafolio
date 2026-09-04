// =============================================================================
// EXPERIMENTO #06 — Simulador Interactivo de Automatización & Bot de WhatsApp
// Arquitectura:
//   1. Máquina de Estados Finitos (FSM) que controla los pasos del flujo conversacional.
//   2. Emulación realista de interfaz WhatsApp Web con delays humanos y typing indicators.
//   3. Dispatcher de Webhooks/Eventos B2B (Captura de Lead, Confirmación de Pedido, Notificación CRM).
//   4. Inspector en tiempo real del JSON Payload y del árbol de decisiones.
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import type { ExperimentComponentProps } from '../components/ExperimentDetail';
import { 
  Send, 
  Bot, 
  CheckCheck, 
  RotateCcw, 
  Database, 
  ChevronRight,
  Clock,
  Code
} from 'lucide-react';

// Tipos de mensaje
export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  time: string;
  options?: { id: string; label: string; action: string }[];
  payload?: Record<string, any>;
}

// Estados del Bot (FSM)
export type BotStep = 
  | 'INITIAL'
  | 'AWAITING_SERVICE_SELECTION'
  | 'CATALOG_BROWSING'
  | 'COLLECTING_NAME'
  | 'COLLECTING_EMAIL'
  | 'COLLECTING_PHONE'
  | 'ORDER_CONFIRMATION'
  | 'COMPLETED'
  | 'CANCELED'
  | 'OPT_OUT';

export interface LeadData {
  service?: string;
  plan?: string;
  price?: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  event: string;
  status: '200 OK' | 'PENDING' | 'TRIGGERED';
  payload: Record<string, any>;
}

export const WhatsAppBotSimulator: React.FC<ExperimentComponentProps> = ({
  onTelemetryUpdate
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<BotStep>('INITIAL');
  const [leadData, setLeadData] = useState<LeadData>({});
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'lead' | 'webhook'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Disparar log de webhook simulado
  const triggerWebhook = (eventName: string, data: Record<string, any>) => {
    const newLog: WebhookLog = {
      id: 'WH-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
      event: eventName,
      status: '200 OK',
      payload: data
    };

    setWebhookLogs(prev => [newLog, ...prev]);

    onTelemetryUpdate?.({
      renderTime: 0.18 + Math.random() * 0.15,
      eventName: `Webhook [${eventName}] despachado (HTTP 200)`,
      customMetrics: [
        { label: 'Estado FSM', value: currentStep, color: 'text-emerald-400' },
        { label: 'Msgs', value: `${messages.length + 1} chats`, color: 'text-amber-400' },
        { label: 'Webhooks', value: `${webhookLogs.length + 1} POST 200`, color: 'text-blue-400' }
      ]
    });
  };

  // Inicialización del bot
  const startBotConversation = () => {
    const startMsg: ChatMessage = {
      id: 'm1',
      sender: 'bot',
      text: 'Bienvenido a *TechSolutions Automation*. Soy DevBot, tu asistente de calificación y soporte técnico.\n\n¿En qué podemos asistirte hoy?',
      time: getCurrentTime(),
      options: [
        { id: 'opt_services', label: 'Ver Servicios & Planes', action: 'show_services' },
        { id: 'opt_demo', label: 'Agendar Demo Técnica', action: 'book_demo' },
        { id: 'opt_support', label: 'Soporte Técnico', action: 'tech_support' }
      ]
    };

    setMessages([startMsg]);
    setCurrentStep('AWAITING_SERVICE_SELECTION');
    setLeadData({});
    setWebhookLogs([]);

    onTelemetryUpdate?.({
      renderTime: 0.22,
      eventName: 'FSM Initialized: AWAITING_SERVICE_SELECTION',
      customMetrics: [
        { label: 'Estado FSM', value: 'AWAITING_SERVICE_SELECTION', color: 'text-emerald-400' },
        { label: 'Msgs', value: '1 chat', color: 'text-amber-400' },
        { label: 'Webhooks', value: '0 POST', color: 'text-fg-muted' }
      ]
    });
  };

  useEffect(() => {
    startBotConversation();
  }, []);

  // Simular respuesta del bot con delay humanizado
  const botReply = (
    text: string, 
    nextStep: BotStep, 
    options?: { id: string; label: string; action: string }[],
    webhookEvent?: { name: string; data: Record<string, any> }
  ) => {
    setIsTyping(true);
    const delay = Math.min(1000, 450 + text.length * 5);

    setTimeout(() => {
      setIsTyping(false);
      const newMsg: ChatMessage = {
        id: 'msg_' + Date.now(),
        sender: 'bot',
        text,
        time: getCurrentTime(),
        options
      };
      setMessages(prev => [...prev, newMsg]);
      setCurrentStep(nextStep);

      if (webhookEvent) {
        triggerWebhook(webhookEvent.name, webhookEvent.data);
      }
    }, delay);
  };

  // Manejador de selección de opciones rápidas
  const handleOptionClick = (opt: { id: string; label: string; action: string }) => {
    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: opt.label,
      time: getCurrentTime()
    };
    setMessages(prev => [...prev, userMsg]);

    onTelemetryUpdate?.({
      renderTime: 0.15,
      eventName: `Usuario seleccionó: ${opt.action}`
    });

    if (opt.action === 'show_services' || opt.action === 'book_demo') {
      botReply(
        'Planes de automatización empresarial disponibles:\n\n' +
        '[01] *Plan Starter ($299/mes)*: Chatbot FSM con WhatsApp Cloud API + 1,000 leads.\n' +
        '[02] *Plan Pro ($599/mes)*: Agente con OpenAI + Webhooks + CRM Hubspot sync.\n' +
        '[03] *Plan Enterprise (Custom)*: Infraestructura dedicada, multi-agente y SLA 99.9%.\n\n' +
        'Selecciona el plan que mejor se adapte a tu empresa:',
        'CATALOG_BROWSING',
        [
          { id: 'plan_starter', label: '[01] Plan Starter ($299)', action: 'select_starter' },
          { id: 'plan_pro', label: '[02] Plan Pro ($599)', action: 'select_pro' },
          { id: 'plan_ent', label: '[03] Plan Enterprise', action: 'select_ent' }
        ]
      );
    } else if (opt.action === 'tech_support') {
      botReply(
        '*Área de Soporte Técnico*\n\nNuestros ingenieros atienden incidencias de lunes a viernes. Para generar un ticket prioritario, indícanos tu nombre completo:',
        'COLLECTING_NAME'
      );
      setLeadData(prev => ({ ...prev, service: 'Soporte Técnico Especializado' }));
    } else if (opt.action.startsWith('select_')) {
      let chosenPlan = 'Plan Starter';
      let price = '$299 USD/mes';
      if (opt.action === 'select_pro') {
        chosenPlan = 'Plan Pro (IA & CRM)';
        price = '$599 USD/mes';
      } else if (opt.action === 'select_ent') {
        chosenPlan = 'Plan Enterprise Custom';
        price = 'A cotizar';
      }

      const updatedLead = { ...leadData, service: 'Automatización WhatsApp', plan: chosenPlan, price };
      setLeadData(updatedLead);

      botReply(
        `Has seleccionado: *${chosenPlan}* (${price}).\n\nPara enviarte la propuesta técnica detallada y preparar tu entorno de pruebas, ¿cuál es tu *Nombre y Apellido*?`,
        'COLLECTING_NAME'
      );
    } else if (opt.action === 'confirm_lead') {
      const finalData = {
        ...leadData,
        createdAt: new Date().toISOString(),
        channel: 'WhatsApp Business API'
      };
      setLeadData(finalData);

      botReply(
        '*Lead cualificado y registrado en el pipeline.*\n\n' +
        'Se ha despachado el Webhook hacia el CRM. Un especialista técnico se pondrá en contacto en breve.\n\n' +
        '¿Deseas reiniciar la simulación para evaluar otro flujo?',
        'COMPLETED',
        [
          { id: 'restart', label: '[ REINICIAR FLUJO ]', action: 'restart' }
        ],
        {
          name: 'LEAD_CAPTURED_AND_PIPELINE_UPDATED',
          data: finalData
        }
      );
    } else if (opt.action === 'cancel_flow') {
      botReply(
        'Has cancelado la operación. El proceso se ha detenido y tus datos no han sido transferidos ni almacenados.\n\nEscribe cualquier mensaje si en el futuro requieres consultar nuestros servicios.',
        'CANCELED',
        [{ id: 'restart', label: 'Reiniciar Asistente', action: 'restart' }],
        {
          name: 'USER_CANCELED_FLOW',
          data: { reason: 'User chose to abort conversation', step: currentStep }
        }
      );
    } else if (opt.action === 'opt_out') {
      botReply(
        'Confirmado: Te hemos dado de baja del servicio de mensajería automatizada (Opt-Out). Se ha registrado la exclusión en el CRM conforme a las políticas de WhatsApp Business.\n\nNo recibirás más mensajes de esta línea.',
        'OPT_OUT',
        [{ id: 'restart', label: 'Reactivar Conversación', action: 'restart' }],
        {
          name: 'GDPR_META_OPT_OUT_DISPATCHED',
          data: { status: 'UNSUBSCRIBED', phone: leadData.phone || 'anonymous' }
        }
      );
    } else if (opt.action === 'restart') {
      startBotConversation();
    }
  };

  // Manejador del input de texto libre del usuario
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      time: getCurrentTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    const lower = text.toLowerCase();

    // 1. Detección global de STOP / BAJA / OPT-OUT (Norma oficial WhatsApp/Meta)
    if (['stop', 'baja', 'salir', 'cancelar suscripcion', 'no molestar', 'desuscribir'].includes(lower)) {
      botReply(
        'Confirmado: Has solicitado la baja inmediata (STOP/Opt-Out). Tu número ha sido marcado como NO CONTACTAR en el CRM.\n\nSi deseas volver a comunicarte en el futuro, escribe "RESTART".',
        'OPT_OUT',
        [{ id: 'restart', label: 'Reactivar Conversación', action: 'restart' }],
        {
          name: 'LEAD_OPT_OUT_RECEIVED',
          data: { command: lower, timestamp: new Date().toISOString() }
        }
      );
      return;
    }

    // 2. Detección de rechazo o cancelación explícita en cualquier punto
    if (['no', 'no gracias', 'cancelar', 'no deseo', 'cancel', 'abortar', 'ninguno', 'detener'].includes(lower)) {
      botReply(
        'Entendido. No insistiremos ni repetiremos el menú. Se ha cerrado la sesión de calificación sin guardar información pendiente.\n\n¿Deseas algo más o prefieres dar por concluida la atención?',
        'CANCELED',
        [
          { id: 'restart', label: 'Empezar de nuevo', action: 'restart' },
          { id: 'opt_out', label: 'Dar de baja mi número (STOP)', action: 'opt_out' }
        ],
        {
          name: 'SESSION_TERMINATED_BY_USER',
          data: { lastStep: currentStep, input: text }
        }
      );
      return;
    }

    onTelemetryUpdate?.({
      renderTime: 0.16,
      eventName: `Mensaje procesado en estado: ${currentStep}`
    });

    // 3. Manejo de estados si el usuario está en modo CANCELED u OPT_OUT
    if (currentStep === 'CANCELED' || currentStep === 'OPT_OUT') {
      if (['reiniciar', 'hola', 'menu', 'inicio', 'restart'].includes(lower)) {
        startBotConversation();
      } else {
        botReply(
          'La interacción anterior fue finalizada. Para iniciar una nueva consulta técnica, escribe "inicio" o presiona el botón inferior:',
          'CANCELED',
          [{ id: 'restart', label: 'Iniciar Nueva Consulta', action: 'restart' }]
        );
      }
      return;
    }

    // 4. Lógica según la Máquina de Estados FSM
    if (currentStep === 'COLLECTING_NAME') {
      setLeadData(prev => ({ ...prev, name: text }));
      botReply(
        `Registrado: *${text}*.\n\nPor favor indícanos tu *correo corporativo* para enviarte la propuesta y credenciales de acceso (o escribe "cancelar" si no deseas continuar):`,
        'COLLECTING_EMAIL'
      );
    } else if (currentStep === 'COLLECTING_EMAIL') {
      const emailValid = text.includes('@') && text.includes('.');
      if (!emailValid) {
        botReply(
          '[AVISO] El formato del correo parece inválido. Escribe un correo válido (ej: usuario@empresa.com) o "cancelar" para detener el flujo:',
          'COLLECTING_EMAIL',
          [{ id: 'cancel', label: 'Cancelar Solicitud', action: 'cancel_flow' }]
        );
        return;
      }
      setLeadData(prev => ({ ...prev, email: text }));
      botReply(
        `Anotado: *${text}*.\n\nPor último, déjanos tu *número telefónico / WhatsApp* (con código de país, ej: +51 987654321):`,
        'COLLECTING_PHONE'
      );
    } else if (currentStep === 'COLLECTING_PHONE') {
      const updatedLead = { ...leadData, phone: text };
      setLeadData(updatedLead);

      const summaryText = 
        '*Resumen de tu Solicitud:*\n' +
        `• Servicio: ${updatedLead.service || 'Automatización B2B'}\n` +
        `• Plan: ${updatedLead.plan || 'Demo Express'}\n` +
        `• Contacto: ${updatedLead.name}\n` +
        `• Email: ${updatedLead.email}\n` +
        `• Teléfono: ${text}\n\n` +
        '¿Autorizas el envío de estos datos al equipo técnico?';

      botReply(
        summaryText,
        'ORDER_CONFIRMATION',
        [
          { id: 'conf_yes', label: 'Confirmar y Enviar al CRM', action: 'confirm_lead' },
          { id: 'conf_no', label: 'No Autorizar / Cancelar', action: 'cancel_flow' }
        ],
        {
          name: 'DRAFT_LEAD_GENERATED',
          data: updatedLead
        }
      );
    } else if (currentStep === 'COMPLETED') {
      botReply(
        'El flujo actual ya ha sido cerrado. Si requieres otra gestión, presiona reiniciar:',
        'COMPLETED',
        [{ id: 'restart', label: '[ REINICIAR FLUJO ]', action: 'restart' }]
      );
    } else {
      // Estado libre / inicial
      botReply(
        `Mensaje recibido: "${text}".\nSelecciona una opción del menú o escribe "salir" para declinar la atención:`,
        'AWAITING_SERVICE_SELECTION',
        [
          { id: 'opt_services', label: 'Ver Servicios & Planes', action: 'show_services' },
          { id: 'opt_demo', label: 'Agendar Demo Técnica', action: 'book_demo' },
          { id: 'opt_cancel', label: 'No Requiero Asistencia', action: 'cancel_flow' }
        ]
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 font-sans text-fg">
      {/* Barra superior de pestañas del simulador */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs font-bold tracking-wider uppercase">
            WHATSAPP CLOUD API // BOT SIMULATOR ENGINE
          </span>
        </div>

        {/* Tabs de inspección */}
        <div className="flex items-center space-x-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 border transition-all flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'border-fg bg-fg text-bg font-bold'
                : 'border-border bg-bg-subtle text-fg-muted hover:text-fg'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chat ({messages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('lead')}
            className={`px-3 py-1 border transition-all flex items-center space-x-1.5 ${
              activeTab === 'lead'
                ? 'border-fg bg-fg text-bg font-bold'
                : 'border-border bg-bg-subtle text-fg-muted hover:text-fg'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>FSM Lead State</span>
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`px-3 py-1 border transition-all flex items-center space-x-1.5 ${
              activeTab === 'webhook'
                ? 'border-fg bg-fg text-bg font-bold'
                : 'border-border bg-bg-subtle text-fg-muted hover:text-fg'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Webhooks ({webhookLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col border border-border bg-bg overflow-hidden shadow-sm min-h-[460px]">
          {/* Header del Chat WhatsApp */}
          <div className="px-4 py-3 bg-[#075E54] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center border border-emerald-400">
                  <Bot className="w-5 h-5 text-emerald-200" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
              </div>
              <div className="leading-tight">
                <h4 className="font-semibold text-sm tracking-wide flex items-center space-x-1.5">
                  <span>TechSolutions Bot</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-800 border border-emerald-400/40 text-emerald-200 rounded font-mono font-normal">
                    VERIFICADO
                  </span>
                </h4>
                <p className="text-[11px] text-emerald-100/80 font-mono">
                  {isTyping ? 'escribiendo...' : 'en línea • Cloud API'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={startBotConversation}
                title="Reiniciar chat"
                className="p-1.5 hover:bg-emerald-800 rounded transition-colors text-emerald-100 flex items-center space-x-1 text-xs font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reiniciar</span>
              </button>
            </div>
          </div>

          {/* Área de Mensajes con wallpaper sutil */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-subtle/50 relative">
            <div className="text-center my-2">
              <span className="bg-bg border border-border px-3 py-1 rounded text-[10px] font-mono text-fg-subtle uppercase tracking-wider">
                TLS 1.3 End-to-End • FSM Node: {currentStep}
              </span>
            </div>

            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} space-y-1.5`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3 text-xs leading-relaxed shadow-sm ${
                      isBot
                        ? 'bg-bg border border-border text-fg'
                        : 'bg-[#DCF8C6] dark:bg-[#056162] text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    {/* Contenido con formateo básico de asteriscos en negrita */}
                    <div className="whitespace-pre-line">
                      {m.text.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className="mb-1 last:mb-0">
                          {line.split(/(\*[^*]+\*)/g).map((chunk, cIdx) => {
                            if (chunk.startsWith('*') && chunk.endsWith('*')) {
                              return <strong key={cIdx} className="font-bold">{chunk.slice(1, -1)}</strong>;
                            }
                            return chunk;
                          })}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-fg-subtle">
                      <span>{m.time}</span>
                      {!isBot && <CheckCheck className="w-3 h-3 text-sky-500" />}
                    </div>
                  </div>

                  {/* Opciones Interactivas / Botones de WhatsApp */}
                  {isBot && m.options && m.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 max-w-[85%] pt-1">
                      {m.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleOptionClick(opt)}
                          className="px-3 py-1.5 bg-bg hover:bg-bg-subtle border border-border hover:border-emerald-500 text-[11px] font-medium text-fg rounded shadow-sm flex items-center space-x-1.5 transition-all text-left group"
                        >
                          <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Indicador de typing */}
            {isTyping && (
              <div className="flex items-center space-x-1.5 bg-bg border border-border px-3 py-2 rounded-lg w-fit">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-fg-subtle font-mono ml-1">Escribiendo...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 bg-bg border-t border-border flex items-center space-x-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe un mensaje o responde a la pregunta..."
              className="flex-1 bg-bg-subtle border border-border px-3.5 py-2 text-xs text-fg focus:outline-none focus:border-emerald-500 transition-colors rounded"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Pestaña: Inspector de Estado FSM */}
      {activeTab === 'lead' && (
        <div className="flex-1 border border-border bg-bg p-5 flex flex-col space-y-4 font-mono text-xs overflow-y-auto min-h-[460px]">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-bold text-fg uppercase text-sm">
              MÁQUINA DE ESTADOS FINITOS (FSM) // CAPTURA DE LEADS
            </span>
            <span className="text-[11px] px-2 py-0.5 border border-emerald-500/50 bg-emerald-500/10 text-emerald-500 font-semibold">
              ESTADO ACTUAL: {currentStep}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border bg-bg-subtle space-y-3">
              <span className="text-[11px] font-bold text-fg block">ESTADO EN MEMORIA (REACT STATE)</span>
              <div className="space-y-1.5 text-fg-muted text-[11px]">
                <div>• <strong className="text-fg">Servicio:</strong> {leadData.service || '(Pendiente)'}</div>
                <div>• <strong className="text-fg">Plan:</strong> {leadData.plan || '(Pendiente)'}</div>
                <div>• <strong className="text-fg">Precio:</strong> {leadData.price || '(Pendiente)'}</div>
                <div>• <strong className="text-fg">Cliente:</strong> {leadData.name || '(Esperando input)'}</div>
                <div>• <strong className="text-fg">Email:</strong> {leadData.email || '(Esperando input)'}</div>
                <div>• <strong className="text-fg">WhatsApp:</strong> {leadData.phone || '(Esperando input)'}</div>
              </div>
            </div>

            <div className="p-4 border border-border bg-bg-subtle space-y-3">
              <span className="text-[11px] font-bold text-fg block">JSON SCHEMA DE TRANSMISIÓN</span>
              <pre className="text-[10px] text-fg leading-relaxed overflow-x-auto p-2 bg-bg border border-border">
                {JSON.stringify(leadData, null, 2)}
              </pre>
            </div>
          </div>

          <div className="p-4 border border-border bg-bg-subtle space-y-2">
            <span className="text-[11px] font-bold text-fg block">DIAGRAMA DE TRANSICIONES (FSM GRAPH)</span>
            <div className="text-[11px] text-fg-muted space-y-1">
              <p>1. <code>INITIAL</code> ➔ <code>AWAITING_SERVICE_SELECTION</code> (Trigger: Saludo automático)</p>
              <p>2. <code>AWAITING_SERVICE_SELECTION</code> ➔ <code>CATALOG_BROWSING</code> (Trigger: Botón 'Ver Servicios')</p>
              <p>3. <code>CATALOG_BROWSING</code> ➔ <code>COLLECTING_NAME</code> (Trigger: Selección de Plan)</p>
              <p>4. <code>COLLECTING_NAME</code> ➔ <code>COLLECTING_EMAIL</code> (Trigger: Input Nombre)</p>
              <p>5. <code>COLLECTING_EMAIL</code> ➔ <code>COLLECTING_PHONE</code> (Trigger: Regex Email Validado)</p>
              <p>6. <code>COLLECTING_PHONE</code> ➔ <code>ORDER_CONFIRMATION</code> (Trigger: Input WhatsApp)</p>
              <p>7. <code>ORDER_CONFIRMATION</code> ➔ <code>COMPLETED</code> (Trigger: Webhook HTTP 200 CRM Sync)</p>
              <p>8. <code>*CUALQUIER ESTADO*</code> ➔ <code>CANCELED</code> (Trigger: 'No', 'Cancelar', 'Abortar' o botón rechazar)</p>
              <p>9. <code>*CUALQUIER ESTADO*</code> ➔ <code>OPT_OUT</code> (Trigger: 'STOP', 'Baja', 'Desuscribir' conforme política Meta)</p>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña: Registro de Webhooks en Vivo */}
      {activeTab === 'webhook' && (
        <div className="flex-1 border border-border bg-bg p-5 flex flex-col space-y-4 font-mono text-xs overflow-y-auto min-h-[460px]">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-bold text-fg uppercase text-sm">
              EVENT DISPATCHER & WEBHOOK PIPELINE
            </span>
            <span className="text-fg-subtle text-[11px]">
              {webhookLogs.length} DISPAROS REGISTRADOS
            </span>
          </div>

          {webhookLogs.length === 0 ? (
            <div className="text-center py-12 text-fg-muted space-y-2">
              <Clock className="w-8 h-8 mx-auto text-fg-subtle" />
              <p>No se han emitido eventos todavía. Interactúa con el chat para activar los webhooks automáticos.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {webhookLogs.map((log) => (
                <div key={log.id} className="p-3.5 border border-border bg-bg-subtle space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                        {log.status}
                      </span>
                      <strong className="text-fg">{log.event}</strong>
                    </div>
                    <span className="text-fg-subtle">{log.timestamp} • ID: {log.id}</span>
                  </div>

                  <pre className="text-[10px] text-fg bg-bg p-2.5 border border-border overflow-x-auto">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
