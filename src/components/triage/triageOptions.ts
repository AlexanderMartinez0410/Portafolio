import type { LucideIcon } from 'lucide-react';
import { 
  MessageSquare, 
  Sparkles,
  Briefcase,
  Layers,
  Globe,
  Smartphone,
  Server,
  Zap,
  Building2,
  HelpCircle
} from 'lucide-react';
import { sanitizeInput } from '../../utils/security';

export type IntentType = 'freelance' | 'fulltime' | 'consulting' | 'networking' | '';

export interface TriageIconOptionItem {
  id?: string;
  label: string;
  desc: string;
  icon: LucideIcon;
}

export interface TriageBadgeOptionItem {
  label: string;
  desc: string;
  badge: string;
}

export const getObjectiveOptions = (isEs: boolean): TriageIconOptionItem[] => (
  isEs ? [
    { 
      id: 'freelance', 
      label: 'Crear un Proyecto o Idea', 
      desc: 'Hacer una página web, app para celular o sistema para mi negocio', 
      icon: Briefcase 
    },
    { 
      id: 'fulltime', 
      label: 'Vacante Laboral / Contratar', 
      desc: 'Sumarme como ingeniero full stack o líder técnico a tu equipo', 
      icon: Layers 
    },
    { 
      id: 'consulting', 
      label: 'Consultoría o Mejoras Técnicas', 
      desc: 'Modernizar, arreglar o acelerar un sistema o base de datos existente', 
      icon: Sparkles 
    },
    { 
      id: 'networking', 
      label: 'Pregunta Rápida o Conectar', 
      desc: 'Hacer una consulta puntual, proponer una alianza o charlar', 
      icon: MessageSquare 
    }
  ] : [
    { 
      id: 'freelance', 
      label: 'Build a Project or Idea', 
      desc: 'Create a website, mobile app, or internal system for your business', 
      icon: Briefcase 
    },
    { 
      id: 'fulltime', 
      label: 'Job Vacancy / Hire Full-time', 
      desc: 'Hire me as a software engineer or technical lead in your company', 
      icon: Layers 
    },
    { 
      id: 'consulting', 
      label: 'Consulting or Technical Audit', 
      desc: 'Modernize, fix, or optimize an existing platform or database', 
      icon: Sparkles 
    },
    { 
      id: 'networking', 
      label: 'Quick Inquiry or Say Hi', 
      desc: 'Ask a specific question, propose a partnership, or network', 
      icon: MessageSquare 
    }
  ]
);

export const getFreelanceTypeOptions = (isEs: boolean): TriageIconOptionItem[] => (
  isEs ? [
    { label: 'Página o Plataforma Web', desc: 'Para mostrar mi empresa, ofrecer servicios o vender por internet', icon: Globe },
    { label: 'Aplicación para Celulares', desc: 'App descargable para iPhone y Android', icon: Smartphone },
    { label: 'Sistema para Administrar mi Negocio', desc: 'Control de ventas, clientes, reportes o inventario', icon: Server },
    { label: 'Versión Rápida de una Idea (Prototipo)', desc: 'Lanzar algo ágil para probar si funciona en el mercado', icon: Zap }
  ] : [
    { label: 'Website or Web Platform', desc: 'To showcase my business, offer services, or sell online', icon: Globe },
    { label: 'Mobile Application', desc: 'Downloadable mobile app for iPhone and Android', icon: Smartphone },
    { label: 'Business Management System', desc: 'Track sales, customers, reports, or inventory', icon: Server },
    { label: 'Fast Prototype / MVP', desc: 'Build a working first version quickly to validate the idea', icon: Zap }
  ]
);

export const getFreelanceStageOptions = (isEs: boolean): TriageBadgeOptionItem[] => (
  isEs ? [
    { label: 'Tengo solo la idea en mente', desc: 'Necesito orientación para definirla y construirla desde cero', badge: 'Desde cero' },
    { label: 'Ya tengo el diseño visual o bocetos', desc: 'Tengo las pantallas o Figma listos para empezar a programar', badge: 'Con diseño' },
    { label: 'Ya tengo un sistema o app funcionando', desc: 'Quiero renovarla, agregarle nuevas funciones o corregir problemas', badge: 'Mejorar' },
    { label: 'Es algo urgente con fecha fija', desc: 'Necesito tenerlo listo y publicado lo antes posible', badge: 'Urgente' }
  ] : [
    { label: 'I only have the idea so far', desc: 'I need guidance to define requirements and build from scratch', badge: 'From scratch' },
    { label: 'I already have the designs ready', desc: 'Screens or Figma files are ready to start coding', badge: 'Ready designs' },
    { label: 'I already have a working system or app', desc: 'I want to upgrade it, add new features, or fix issues', badge: 'Upgrade' },
    { label: 'It is urgent with a fixed deadline', desc: 'Need to get it built and released as soon as possible', badge: 'Urgent' }
  ]
);

export const getJobRoleOptions = (isEs: boolean): TriageIconOptionItem[] => (
  isEs ? [
    { label: 'Full Stack Engineer (.NET 8 + Angular / React / Python)', desc: 'Desarrollo integral de arquitectura, backend y frontend', icon: Layers },
    { label: 'Frontend Engineer (Angular SSR / React / TypeScript)', desc: 'Especialista en interfaces modernas y alto rendimiento', icon: Globe },
    { label: 'Mobile Developer (Flutter / iOS & Android)', desc: 'Apps móviles multiplataforma nativas con Flutter', icon: Smartphone },
    { label: 'Líder Técnico / Tech Lead', desc: 'Liderazgo técnico, buenas prácticas y aseguramiento de sistemas', icon: Building2 }
  ] : [
    { label: 'Full Stack Engineer (.NET 8 + Angular / React / Python)', desc: 'End-to-end architecture, backend, and frontend engineering', icon: Layers },
    { label: 'Frontend Engineer (Angular SSR / React / TypeScript)', desc: 'Modern reactive UI, SSR, and web performance specialist', icon: Globe },
    { label: 'Mobile Developer (Flutter / iOS & Android)', desc: 'Cross-platform native mobile applications with Flutter', icon: Smartphone },
    { label: 'Technical Lead / Engineering Lead', desc: 'Technical leadership, Clean Architecture, and system assurance', icon: Building2 }
  ]
);

export const getJobModalityOptions = (isEs: boolean): TriageBadgeOptionItem[] => (
  isEs ? [
    { label: 'Remoto Internacional (B2B / Contractor)', desc: 'Contratación remota para empresa fuera de Ecuador', badge: 'B2B Remoto' },
    { label: 'Remoto / Híbrido (Ecuador o LATAM)', desc: 'Posición remota o con asistencia presencial puntual', badge: 'Híbrido' },
    { label: 'Por Proyecto / Tiempo Determinado', desc: 'Contrato por entrega de objetivos con opción a extensión', badge: 'Contrato' },
    { label: 'Queremos agendar una entrevista técnica', desc: 'Coordinar una primera llamada para conocernos', badge: 'Entrevista' }
  ] : [
    { label: 'International Remote (B2B / Contractor)', desc: 'Remote engagement for international companies', badge: 'B2B Remote' },
    { label: 'Remote / Hybrid (Ecuador or LATAM)', desc: 'Full remote or hybrid schedule in Latin America', badge: 'Hybrid' },
    { label: 'Per Project / Fixed-Term Contract', desc: 'Milestone-based contract with extension option', badge: 'Contract' },
    { label: 'We want to schedule a technical interview', desc: 'Book an introductory alignment call', badge: 'Interview' }
  ]
);

export const getConsultingFocusOptions = (isEs: boolean): TriageIconOptionItem[] => (
  isEs ? [
    { label: 'Modernización de bases de datos antiguas (+20 años)', desc: 'Crear APIs modernas y SPAs sin romper datos históricos', icon: Server },
    { label: 'Auditoría de arquitectura y código (Clean / CQRS)', desc: 'Mejorar estructura, mantenibilidad y eliminar deuda técnica', icon: Layers },
    { label: 'Automatización de procesos e integración con IA', desc: 'Conectar modelos de lenguaje y agilizar operaciones', icon: Sparkles },
    { label: 'Diagnóstico de cuellos de botella y lentitud', desc: 'Optimizar consultas SQL, caché Redis y rendimiento', icon: Zap }
  ] : [
    { label: 'Legacy modernization over 20+ year production databases', desc: 'Build modern APIs and SPAs without disrupting legacy data', icon: Server },
    { label: 'Architecture & code audit (Clean / CQRS)', desc: 'Refactor structure, improve maintainability, and clean debt', icon: Layers },
    { label: 'Process automation & Applied AI integrations', desc: 'Integrate LLMs and streamline operational workflows', icon: Sparkles },
    { label: 'Bottleneck diagnosis & performance optimization', desc: 'Optimize SQL queries, Redis cache, and response times', icon: Zap }
  ]
);

export const getConsultingUrgencyOptions = (isEs: boolean): TriageBadgeOptionItem[] => (
  isEs ? [
    { label: 'Urgente (Problema crítico en producción)', desc: 'Se requiere intervención inmediata', badge: 'Prioridad alta' },
    { label: 'Plan de modernización por etapas', desc: 'Evaluación técnica estructurada', badge: 'Estratégico' },
    { label: 'Asesoría técnica continua', desc: 'Soporte de ingeniería mensual', badge: 'Continuo' },
    { label: 'Auditoría puntual de código y seguridad', desc: 'Informe técnico de diagnóstico', badge: 'Auditoría' }
  ] : [
    { label: 'Urgent (Critical production blocker)', desc: 'Immediate troubleshooting required', badge: 'High priority' },
    { label: 'Phased modernization roadmap', desc: 'Structured architectural assessment', badge: 'Strategic' },
    { label: 'Ongoing technical advisory', desc: 'Monthly engineering support', badge: 'Ongoing' },
    { label: 'Code & security audit report', desc: 'Detailed diagnostic assessment', badge: 'Audit' }
  ]
);

export const getNetworkingReasonOptions = (isEs: boolean): TriageIconOptionItem[] => (
  isEs ? [
    { label: 'Consulta técnica o feedback', desc: 'Una pregunta sobre arquitectura o tecnología', icon: HelpCircle },
    { label: 'Propuesta de alianza o negocio', desc: 'Unir fuerzas para un proyecto conjunto', icon: Briefcase },
    { label: 'Saludo profesional / Conectar', desc: 'Conectar y mantener el contacto profesional', icon: MessageSquare },
    { label: 'Invitación a charla o evento', desc: 'Participar en un espacio de tecnología o comunidad', icon: Globe }
  ] : [
    { label: 'Technical question or feedback', desc: 'Ask about architecture or technology approaches', icon: HelpCircle },
    { label: 'Partnership or business proposal', desc: 'Join forces on a mutual venture', icon: Briefcase },
    { label: 'Professional greeting / Connect', desc: 'Connect and stay in touch', icon: MessageSquare },
    { label: 'Event or speaking invitation', desc: 'Join a tech community talk or workshop', icon: Globe }
  ]
);

export interface GenerateMessageParams {
  isEs: boolean;
  intent: IntentType;
  freelanceType?: string;
  freelanceStage?: string;
  jobRole?: string;
  jobModality?: string;
  consultingFocus?: string;
  consultingUrgency?: string;
  networkingReason?: string;
  name?: string;
  contactHandle?: string;
  notes?: string;
}

export const generateHumanMessage = (params: GenerateMessageParams): string => {
  const {
    isEs,
    intent,
    freelanceType,
    freelanceStage,
    jobRole,
    jobModality,
    consultingFocus,
    consultingUrgency,
    networkingReason,
    name = '',
    contactHandle = '',
    notes = ''
  } = params;

  const cleanName = sanitizeInput(name, 60);
  const cleanContact = sanitizeInput(contactHandle, 80);
  const cleanNotes = sanitizeInput(notes, 400);

  if (isEs) {
    let msg = `Hola Alexander, ¿cómo estás? Te escribo desde tu portafolio.`;

    if (intent === 'freelance') {
      if (freelanceType) msg += ` Me gustaría cotizar o conversar sobre un proyecto: ${freelanceType}.`;
      if (freelanceStage) msg += ` Actualmente: ${freelanceStage.toLowerCase()}.`;
    } else if (intent === 'fulltime') {
      if (jobRole) msg += ` Te contacto porque tenemos una oportunidad abierta como ${jobRole}.`;
      if (jobModality) msg += ` El esquema es: ${jobModality}.`;
    } else if (intent === 'consulting') {
      if (consultingFocus) msg += ` Me interesa consultarte sobre: ${consultingFocus.toLowerCase()}.`;
      if (consultingUrgency) msg += ` La prioridad es: ${consultingUrgency.toLowerCase()}.`;
    } else if (intent === 'networking') {
      if (networkingReason) msg += ` Te escribo con motivo de: ${networkingReason.toLowerCase()}.`;
    }

    if (cleanNotes) {
      msg += `\n\nTe comparto un breve detalle: "${cleanNotes}".`;
    }

    if (cleanName && cleanContact) {
      msg += `\n\nQuedo atento a tu respuesta. Mi nombre es ${cleanName} y me puedes escribir a ${cleanContact}.`;
    } else if (cleanName) {
      msg += `\n\nQuedo atento a tus comentarios. Saludos, ${cleanName}.`;
    } else if (cleanContact) {
      msg += `\n\nMe puedes responder directamente a: ${cleanContact}.`;
    } else {
      msg += `\n\nQuedo atento a tu respuesta. ¡Un saludo!`;
    }

    return msg;
  } else {
    let msg = `Hi Alexander, hope you're doing well! I'm reaching out from your portfolio.`;

    if (intent === 'freelance') {
      if (freelanceType) msg += ` I'd like to discuss building a project: ${freelanceType}.`;
      if (freelanceStage) msg += ` Current status: ${freelanceStage.toLowerCase()}.`;
    } else if (intent === 'fulltime') {
      if (jobRole) msg += ` I'm reaching out regarding an open position as ${jobRole}.`;
      if (jobModality) msg += ` The arrangement is: ${jobModality}.`;
    } else if (intent === 'consulting') {
      if (consultingFocus) msg += ` I'd like to consult you regarding: ${consultingFocus.toLowerCase()}.`;
      if (consultingUrgency) msg += ` Priority level: ${consultingUrgency.toLowerCase()}.`;
    } else if (intent === 'networking') {
      if (networkingReason) msg += ` Reaching out regarding: ${networkingReason.toLowerCase()}.`;
    }

    if (cleanNotes) {
      msg += `\n\nHere is a quick note: "${cleanNotes}".`;
    }

    if (cleanName && cleanContact) {
      msg += `\n\nLooking forward to hearing from you. My name is ${cleanName} and you can reply to ${cleanContact}.`;
    } else if (cleanName) {
      msg += `\n\nLooking forward to hearing from you. Best, ${cleanName}.`;
    } else if (cleanContact) {
      msg += `\n\nYou can reach me directly at: ${cleanContact}.`;
    } else {
      msg += `\n\nLooking forward to your reply. Cheers!`;
    }

    return msg;
  }
};
