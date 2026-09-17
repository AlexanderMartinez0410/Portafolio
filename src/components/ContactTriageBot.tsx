import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  CheckCircle2, 
  ArrowLeft, 
  MessageCircle, 
  Mail, 
  Copy, 
  Check, 
  RotateCcw,
  UserCheck,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { checkRateLimit, getObfuscatedContact } from '../utils/security';
import {
  type IntentType,
  getObjectiveOptions,
  getFreelanceTypeOptions,
  getFreelanceStageOptions,
  getJobRoleOptions,
  getJobModalityOptions,
  getConsultingFocusOptions,
  getConsultingUrgencyOptions,
  getNetworkingReasonOptions,
  generateHumanMessage
} from './triage/triageOptions';

export const ContactTriageBot: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  // Estados del flujo interactivo
  const [step, setStep] = useState<number>(1);
  const [intent, setIntent] = useState<IntentType>('');

  // Respuestas del flujo Freelance / Clientes
  const [freelanceType, setFreelanceType] = useState<string>('');
  const [freelanceStage, setFreelanceStage] = useState<string>('');

  // Respuestas del flujo Full-time / Recruiter
  const [jobRole, setJobRole] = useState<string>('');
  const [jobModality, setJobModality] = useState<string>('');

  // Respuestas del flujo Consultoría / Refactor
  const [consultingFocus, setConsultingFocus] = useState<string>('');
  const [consultingUrgency, setConsultingUrgency] = useState<string>('');

  // Respuestas del flujo Networking / Consulta
  const [networkingReason, setNetworkingReason] = useState<string>('');

  // Datos finales comunes
  const [name, setName] = useState<string>('');
  const [contactHandle, setContactHandle] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [sentAlert, setSentAlert] = useState<boolean>(false);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);

  // Honeypot anti-bots (campo invisible)
  const [honeypot, setHoneypot] = useState<string>('');

  // Total de pasos según el flujo elegido
  const totalSteps = intent === 'networking' ? 3 : 4;

  const objectiveOptions = getObjectiveOptions(isEs);
  const freelanceTypeOptions = getFreelanceTypeOptions(isEs);
  const freelanceStageOptions = getFreelanceStageOptions(isEs);
  const jobRoleOptions = getJobRoleOptions(isEs);
  const jobModalityOptions = getJobModalityOptions(isEs);
  const consultingFocusOptions = getConsultingFocusOptions(isEs);
  const consultingUrgencyOptions = getConsultingUrgencyOptions(isEs);
  const networkingReasonOptions = getNetworkingReasonOptions(isEs);

  const humanMessage = generateHumanMessage({
    isEs,
    intent,
    freelanceType,
    freelanceStage,
    jobRole,
    jobModality,
    consultingFocus,
    consultingUrgency,
    networkingReason,
    name,
    contactHandle,
    notes
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(humanMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Despacho seguro con validación de Honeypot y Rate Limiting
  const handleSecureDispatch = (channel: 'whatsapp' | 'email') => {
    setSecurityAlert(null);

    // 1. Detección Honeypot
    if (honeypot.trim().length > 0) {
      return;
    }

    // 2. Control de Frecuencia
    const rateCheck = checkRateLimit('contact_action', 3, 600000);
    if (!rateCheck.allowed) {
      setSecurityAlert(
        isEs
          ? `[SEGURIDAD] Has alcanzado el límite de envíos recientes. Por favor espera ${rateCheck.waitMinutes} minuto(s).`
          : `[SECURITY] Rate limit reached. Please wait ${rateCheck.waitMinutes} minute(s).`
      );
      return;
    }

    // 3. Obtención en memoria de datos ofuscados
    const { email, phone } = getObfuscatedContact();
    const cleanPhoneNum = phone.replace(/[^0-9]/g, '');

    if (channel === 'whatsapp') {
      const whatsappUrl = `https://wa.me/${cleanPhoneNum}?text=${encodeURIComponent(humanMessage)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else {
      const subject = isEs
        ? `Contacto // Portafolio Alexander Martínez ${name ? '— ' + name : ''}`
        : `Portfolio Inquiry // Alexander Martínez ${name ? '— ' + name : ''}`;
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(humanMessage)}`;
      window.location.href = mailtoUrl;
    }

    setSentAlert(true);
    setTimeout(() => setSentAlert(false), 4000);
  };

  const handleReset = () => {
    setStep(1);
    setIntent('');
    setFreelanceType('');
    setFreelanceStage('');
    setJobRole('');
    setJobModality('');
    setConsultingFocus('');
    setConsultingUrgency('');
    setNetworkingReason('');
    setName('');
    setContactHandle('');
    setNotes('');
    setHoneypot('');
    setSentAlert(false);
    setSecurityAlert(null);
  };

  return (
    <div className="border border-border bg-bg-subtle p-5 sm:p-6 space-y-5 font-mono relative overflow-hidden shadow-sm">
      {/* Honeypot invisible */}
      <input
        type="text"
        name="website_security_hp"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden opacity-0 absolute -z-50 pointer-events-none"
        aria-hidden="true"
      />

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 border border-border bg-bg text-fg">
            <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-fg">
                // {isEs ? 'ESCRIBE DIRECTO A ALEXANDER' : 'DROP ALEXANDER A MESSAGE'}
              </span>
              <span className="px-1.5 py-0.2 border border-emerald-500/40 bg-emerald-500/10 text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase flex items-center space-x-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>{isEs ? 'CANAL DIRECTO' : 'DIRECT CHANNEL'}</span>
              </span>
            </div>
            <p className="text-[11px] text-fg-subtle font-sans mt-0.5">
              {isEs 
                ? 'Elige un par de opciones y te dejo el mensaje redactado para enviármelo por WhatsApp o correo.' 
                : 'Pick a few quick options and get a ready-to-send message for WhatsApp or email.'}
            </p>
          </div>
        </div>

        {/* Indicador de pasos dinámico */}
        <div className="flex items-center space-x-2 text-xs text-fg-muted font-mono self-start sm:self-auto">
          <span className="text-fg font-bold">[{step}/{totalSteps}]</span>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`h-1.5 w-6 transition-colors ${
                  s === step
                    ? 'bg-fg'
                    : s < step
                    ? 'bg-emerald-500'
                    : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contenedor dinámico compacto y equilibrado */}
      <div>
        {/* ========================================================================= */}
        {/* PASO 1: OBJETIVO INICIAL                                                  */}
        {/* ========================================================================= */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-3.5"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                // {isEs ? 'PASO 1 // ¿DE QUÉ TRATA TU CONSULTA?' : 'STEP 1 // WHAT IS YOUR INQUIRY ABOUT?'}
              </span>
              <h3 className="text-sm font-semibold text-fg tracking-tight font-sans">
                {isEs ? 'Selecciona la opción que mejor describa lo que necesitas:' : 'Select the option that best describes what you need:'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {objectiveOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = intent === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setIntent(opt.id as IntentType);
                      setStep(2);
                    }}
                    className={`p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between space-y-1.5 group cursor-pointer ${
                      isSelected
                        ? 'border-fg bg-fg text-bg shadow-sm'
                        : 'border-border bg-bg hover:border-fg text-fg hover:bg-bg-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-bg' : 'text-fg-muted group-hover:text-fg'}`} />
                        <span className="text-xs font-semibold tracking-tight font-sans">{opt.label}</span>
                      </div>
                      <span className="text-[10px] opacity-70 font-mono">
                        {isSelected ? '[✓]' : '[ → ]'}
                      </span>
                    </div>
                    <p className={`text-[11px] font-sans leading-relaxed ${isSelected ? 'text-bg/85' : 'text-fg-muted'}`}>
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* PASO 2: FLUJOS ESPECÍFICOS SEGÚN INTENCIÓN                                 */}
        {/* ========================================================================= */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-3.5"
          >
            {/* Rama 1: Freelance / Clientes */}
            {intent === 'freelance' && (
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                    // {isEs ? 'PASO 2 // ¿QUÉ QUIERES CONSTRUIR?' : 'STEP 2 // WHAT DO YOU WANT TO BUILD?'}
                  </span>
                  <h3 className="text-sm font-semibold text-fg tracking-tight font-sans">
                    {isEs ? '¿Qué tipo de solución buscas desarrollar?' : 'What kind of solution are you looking to develop?'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {freelanceTypeOptions.map((opt, idx) => {
                    const Icon = opt.icon;
                    const isSelected = freelanceType === opt.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFreelanceType(opt.label);
                          setStep(3);
                        }}
                        className={`p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-fg bg-fg text-bg font-semibold shadow-sm'
                            : 'border-border bg-bg hover:border-fg text-fg hover:bg-bg-subtle'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 opacity-80" />
                            <span className="text-xs font-semibold font-sans">{opt.label}</span>
                          </div>
                          <span className="text-[10px] shrink-0 opacity-70 font-mono">
                            {isSelected ? '[✓]' : '[→]'}
                          </span>
                        </div>
                        <p className={`text-[11px] font-sans leading-tight ${isSelected ? 'text-bg/85' : 'text-fg-muted'}`}>
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rama 2: Full-time / Recruiter */}
            {intent === 'fulltime' && (
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                    // {isEs ? 'PASO 2 // PERFIL Y ESPECIALIDAD' : 'STEP 2 // ROLE & SPECIALTY'}
                  </span>
                  <h3 className="text-sm font-semibold text-fg tracking-tight font-sans">
                    {isEs ? '¿Qué rol o perfil buscan incorporar a su equipo?' : 'Which role are you looking to bring to your team?'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {jobRoleOptions.map((opt, idx) => {
                    const Icon = opt.icon;
                    const isSelected = jobRole === opt.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setJobRole(opt.label);
                          setStep(3);
                        }}
                        className={`p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-fg bg-fg text-bg font-semibold shadow-sm'
                            : 'border-border bg-bg hover:border-fg text-fg hover:bg-bg-subtle'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 opacity-80" />
                            <span className="text-xs font-semibold font-sans">{opt.label}</span>
                          </div>
                          <span className="text-[10px] shrink-0 opacity-70 font-mono">
                            {isSelected ? '[✓]' : '[→]'}
                          </span>
                        </div>
                        <p className={`text-[11px] font-sans leading-tight ${isSelected ? 'text-bg/85' : 'text-fg-muted'}`}>
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rama 3: Consultoría */}
            {intent === 'consulting' && (
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                    // {isEs ? 'PASO 2 // DESAFÍO TÉCNICO' : 'STEP 2 // TECHNICAL CHALLENGE'}
                  </span>
                  <h3 className="text-sm font-semibold text-fg tracking-tight font-sans">
                    {isEs ? '¿Cuál es el foco o desafío prioritario a resolver?' : 'What is the primary engineering focus or challenge?'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {consultingFocusOptions.map((opt, idx) => {
                    const Icon = opt.icon;
                    const isSelected = consultingFocus === opt.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setConsultingFocus(opt.label);
                          setStep(3);
                        }}
                        className={`p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-fg bg-fg text-bg font-semibold shadow-sm'
                            : 'border-border bg-bg hover:border-fg text-fg hover:bg-bg-subtle'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 opacity-80" />
                            <span className="text-xs font-semibold font-sans">{opt.label}</span>
                          </div>
                          <span className="text-[10px] shrink-0 opacity-70 font-mono">
                            {isSelected ? '[✓]' : '[→]'}
                          </span>
                        </div>
                        <p className={`text-[11px] font-sans leading-tight ${isSelected ? 'text-bg/85' : 'text-fg-muted'}`}>
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rama 4: Networking */}
            {intent === 'networking' && (
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                    // {isEs ? 'PASO 2 // MOTIVO DE CONTACTO' : 'STEP 2 // PURPOSE'}
                  </span>
                  <h3 className="text-sm font-semibold text-fg tracking-tight font-sans">
                    {isEs ? '¿Sobre qué te gustaría que conversemos?' : 'What would you like to chat about?'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {networkingReasonOptions.map((opt, idx) => {
                    const Icon = opt.icon;
                    const isSelected = networkingReason === opt.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNetworkingReason(opt.label);
                          setStep(3); // Pasa directo a datos finales
                        }}
                        className={`p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-fg bg-fg text-bg font-semibold shadow-sm'
                            : 'border-border bg-bg hover:border-fg text-fg hover:bg-bg-subtle'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 opacity-80" />
                            <span className="text-xs font-semibold font-sans">{opt.label}</span>
                          </div>
                          <span className="text-[10px] shrink-0 opacity-70 font-mono">
                            {isSelected ? '[✓]' : '[→]'}
                          </span>
                        </div>
                        <p className={`text-[11px] font-sans leading-tight ${isSelected ? 'text-bg/85' : 'text-fg-muted'}`}>
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-border/50">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1.5 border border-border hover:border-fg text-fg text-xs font-mono flex items-center space-x-1.5 transition-all bg-bg cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>[ {isEs ? 'VOLVER' : 'BACK'} ]</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* PASO 3: ETAPA / MODALIDAD / O FORMULARIO FINAL                             */}
        {/* ========================================================================= */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-3.5"
          >
            {/* Freelance: Estado del proyecto */}
            {intent === 'freelance' && (
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                    // {isEs ? 'PASO 3 // ESTADO ACTUAL DE TU PROYECTO' : 'STEP 3 // CURRENT PROJECT STAGE'}
                  </span>
                  <h3 className="text-sm font-semibold text-fg tracking-tight font-sans">
                    {isEs ? '¿En qué punto se encuentra tu idea o desarrollo?' : 'What point is your idea or product currently at?'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {freelanceStageOptions.map((opt, idx) => {
                    const isSelected = freelanceStage === opt.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFreelanceStage(opt.label);
                          setStep(4);
                        }}
                        className={`p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-fg bg-fg text-bg font-semibold shadow-sm'
                            : 'border-border bg-bg hover:border-fg text-fg hover:bg-bg-subtle'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 border text-[9px] font-mono uppercase font-semibold ${isSelected ? 'border-bg/40 bg-bg/20 text-bg' : 'border-border bg-bg-subtle text-fg-subtle'}`}>
                            {opt.badge}
                          </span>
                          <span className="text-[10px] shrink-0 opacity-70 font-mono">
                            {isSelected ? '[✓]' : '[→]'}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs font-semibold font-sans">{opt.label}</div>
                          <p className={`text-[11px] font-sans leading-tight mt-0.5 ${isSelected ? 'text-bg/85' : 'text-fg-muted'}`}>
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Full-time: Modalidad */}
            {intent === 'fulltime' && (
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                    // {isEs ? 'PASO 3 // ESQUEMA DE TRABAJO' : 'STEP 3 // WORKING ARRANGEMENT'}
                  </span>
                  <h3 className="text-sm font-semibold text-fg tracking-tight font-sans">
                    {isEs ? '¿Bajo qué esquema o modalidad sería la contratación?' : 'What is the working arrangement or next step?'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {jobModalityOptions.map((opt, idx) => {
                    const isSelected = jobModality === opt.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setJobModality(opt.label);
                          setStep(4);
                        }}
                        className={`p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-fg bg-fg text-bg font-semibold shadow-sm'
                            : 'border-border bg-bg hover:border-fg text-fg hover:bg-bg-subtle'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 border text-[9px] font-mono uppercase font-semibold ${isSelected ? 'border-bg/40 bg-bg/20 text-bg' : 'border-border bg-bg-subtle text-fg-subtle'}`}>
                            {opt.badge}
                          </span>
                          <span className="text-[10px] shrink-0 opacity-70 font-mono">
                            {isSelected ? '[✓]' : '[→]'}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs font-semibold font-sans">{opt.label}</div>
                          <p className={`text-[11px] font-sans leading-tight mt-0.5 ${isSelected ? 'text-bg/85' : 'text-fg-muted'}`}>
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Consultoría: Urgencia */}
            {intent === 'consulting' && (
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
                    // {isEs ? 'PASO 3 // URGENCIA Y ALCANCE' : 'STEP 3 // URGENCY & SCOPE'}
                  </span>
                  <h3 className="text-sm font-semibold text-fg tracking-tight font-sans">
                    {isEs ? '¿Cuál es el nivel de urgencia de la intervención?' : 'What is the priority level for this intervention?'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {consultingUrgencyOptions.map((opt, idx) => {
                    const isSelected = consultingUrgency === opt.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setConsultingUrgency(opt.label);
                          setStep(4);
                        }}
                        className={`p-3 sm:p-3.5 text-left border transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-fg bg-fg text-bg font-semibold shadow-sm'
                            : 'border-border bg-bg hover:border-fg text-fg hover:bg-bg-subtle'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 border text-[9px] font-mono uppercase font-semibold ${isSelected ? 'border-bg/40 bg-bg/20 text-bg' : 'border-border bg-bg-subtle text-fg-subtle'}`}>
                            {opt.badge}
                          </span>
                          <span className="text-[10px] shrink-0 opacity-70 font-mono">
                            {isSelected ? '[✓]' : '[→]'}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs font-semibold font-sans">{opt.label}</div>
                          <p className={`text-[11px] font-sans leading-tight mt-0.5 ${isSelected ? 'text-bg/85' : 'text-fg-muted'}`}>
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Networking va directo a datos finales en Paso 3 */}
            {intent === 'networking' && (
              <FinalFormSection
                isEs={isEs}
                name={name}
                setName={setName}
                contactHandle={contactHandle}
                setContactHandle={setContactHandle}
                notes={notes}
                setNotes={setNotes}
                humanMessage={humanMessage}
                copied={copied}
                handleCopy={handleCopy}
                securityAlert={securityAlert}
                sentAlert={sentAlert}
                handleSecureDispatch={handleSecureDispatch}
                handleReset={handleReset}
              />
            )}

            <div className="pt-2 flex items-center justify-between border-t border-border/50">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-3 py-1.5 border border-border hover:border-fg text-fg text-xs font-mono flex items-center space-x-1.5 transition-all bg-bg cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>[ {isEs ? 'VOLVER' : 'BACK'} ]</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* PASO 4: FORMULARIO FINAL & DESPACHO (Para Freelance, Fulltime y Consulting) */}
        {/* ========================================================================= */}
        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-3.5"
          >
            <FinalFormSection
              isEs={isEs}
              name={name}
              setName={setName}
              contactHandle={contactHandle}
              setContactHandle={setContactHandle}
              notes={notes}
              setNotes={setNotes}
              humanMessage={humanMessage}
              copied={copied}
              handleCopy={handleCopy}
              securityAlert={securityAlert}
              sentAlert={sentAlert}
              handleSecureDispatch={handleSecureDispatch}
              handleReset={handleReset}
            />

            <div className="pt-2 flex items-center justify-between border-t border-border/50">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-3 py-1.5 border border-border hover:border-fg text-fg text-xs font-mono flex items-center space-x-1.5 transition-all bg-bg cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>[ {isEs ? 'VOLVER' : 'BACK'} ]</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer seguro */}
      <div className="flex items-center justify-between pt-3 border-t border-border text-[10px] text-fg-subtle">
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isEs ? 'CANAL DIRECTO // PRIVACIDAD TOTAL & ANTI-BOTS' : 'DIRECT CHANNEL // TOTAL PRIVACY & ANTI-BOTS'}</span>
        </span>
        <span className="hidden sm:inline font-mono text-emerald-600 dark:text-emerald-400">
          [ DIRECT DISPATCH ]
        </span>
      </div>
    </div>
  );
};

// ─── Subcomponente para el formulario final y despacho de mensaje ──────────────
interface FinalFormProps {
  isEs: boolean;
  name: string;
  setName: (v: string) => void;
  contactHandle: string;
  setContactHandle: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  humanMessage: string;
  copied: boolean;
  handleCopy: () => void;
  securityAlert: string | null;
  sentAlert: boolean;
  handleSecureDispatch: (channel: 'whatsapp' | 'email') => void;
  handleReset: () => void;
}

const FinalFormSection: React.FC<FinalFormProps> = ({
  isEs,
  name,
  setName,
  contactHandle,
  setContactHandle,
  notes,
  setNotes,
  humanMessage,
  copied,
  handleCopy,
  securityAlert,
  sentAlert,
  handleSecureDispatch,
  handleReset
}) => {
  return (
    <div className="space-y-3.5">
      <div className="space-y-0.5">
        <span className="text-[10px] text-fg-subtle uppercase tracking-widest block font-semibold">
          // {isEs ? 'PASO FINAL // TUS DATOS & ENVÍO' : 'FINAL STEP // YOUR INFO & SEND'}
        </span>
        <h3 className="text-sm font-semibold text-fg tracking-tight font-sans">
          {isEs ? 'Completa tus datos (opcional) y envía tu mensaje con un toque:' : 'Fill in your details (optional) and send your message with one tap:'}
        </h3>
      </div>

      {/* Inputs con AUTOCOMPLETE nativo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label htmlFor="contact-user-name" className="text-[10px] text-fg-subtle uppercase tracking-wider block font-semibold">
            {isEs ? 'Tu nombre o empresa:' : 'Your name or company:'}
          </label>
          <input
            id="contact-user-name"
            name="name"
            type="text"
            maxLength={60}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isEs ? 'Ej: Carlos / Mi Empresa' : 'E.g., Carlos / My Company'}
            className="w-full px-3 py-2 border border-border bg-bg text-fg text-xs font-mono focus:border-fg focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="contact-user-info" className="text-[10px] text-fg-subtle uppercase tracking-wider block font-semibold">
            {isEs ? 'Tu correo o WhatsApp (opcional):' : 'Your email or WhatsApp (optional):'}
          </label>
          <input
            id="contact-user-info"
            name="email"
            type="text"
            maxLength={80}
            autoComplete="email tel"
            value={contactHandle}
            onChange={(e) => setContactHandle(e.target.value)}
            placeholder={isEs ? 'correo@empresa.com o +593...' : 'email@company.com or +1...'}
            className="w-full px-3 py-2 border border-border bg-bg text-fg text-xs font-mono focus:border-fg focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Nota o contexto opcional */}
      <div className="space-y-1">
        <label htmlFor="contact-user-notes" className="text-[10px] text-fg-subtle uppercase tracking-wider block font-semibold">
          {isEs ? '¿Algún detalle extra que quieras añadir? (opcional):' : 'Any extra details you want to add? (optional):'}
        </label>
        <textarea
          id="contact-user-notes"
          name="notes"
          maxLength={400}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder={isEs ? 'Ej: Queremos lanzar el próximo mes, tenemos fotos y contenidos listos...' : 'E.g., Looking to launch next month, we have photos and content ready...'}
          className="w-full px-3 py-2 border border-border bg-bg text-fg text-xs font-mono focus:border-fg focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Vista previa tipo Mensaje Humano */}
      <div className="p-3.5 border border-border/90 bg-bg rounded-none space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-fg-subtle border-b border-border/60 pb-1.5">
          <span className="flex items-center space-x-1.5 font-semibold text-fg">
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isEs ? 'ASÍ LE LLEGARÁ TU MENSAJE A ALEXANDER:' : 'THIS IS HOW YOUR MESSAGE WILL READ:'}</span>
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="hover:text-fg transition-colors flex items-center space-x-1 cursor-pointer font-mono"
            title="Copiar texto"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">{isEs ? 'COPIADO' : 'COPIED'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>[ {isEs ? 'COPIAR' : 'COPY'} ]</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-fg leading-relaxed font-sans whitespace-pre-line select-text italic opacity-95">
          "{humanMessage}"
        </p>
      </div>

      {/* Alerta de seguridad o rate limit */}
      {securityAlert && (
        <div className="p-2.5 border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{securityAlert}</span>
        </div>
      )}

      {/* Confirmación visual al enviar */}
      {sentAlert && (
        <div className="p-2 border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {isEs 
              ? '¡Listo! Se abrió tu aplicación para enviar el mensaje con un toque.' 
              : 'All set! Your app opened with the message ready to send.'}
          </span>
        </div>
      )}

      {/* Botones de Envío */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={() => handleSecureDispatch('whatsapp')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>[ {isEs ? 'ENVIAR POR WHATSAPP' : 'SEND VIA WHATSAPP'} ]</span>
        </button>

        <button
          type="button"
          onClick={() => handleSecureDispatch('email')}
          className="px-4 py-2 border border-border hover:border-fg bg-bg text-fg font-mono text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
        >
          <Mail className="w-4 h-4 text-fg-muted" />
          <span>[ {isEs ? 'ENVIAR POR CORREO' : 'SEND VIA EMAIL'} ]</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-2 border border-border hover:border-fg bg-bg text-fg-muted hover:text-fg font-mono text-xs flex items-center space-x-1.5 transition-all ml-auto cursor-pointer"
          title="Volver a empezar"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isEs ? 'EMPEZAR DE NUEVO' : 'START OVER'}</span>
        </button>
      </div>
    </div>
  );
};
