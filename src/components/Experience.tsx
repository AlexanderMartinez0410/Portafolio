import React from 'react';
import { SectionFooterNav } from './SectionFooterNav';
import { Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { FadeUp } from './FadeUp';

export const Experience: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const isEn = language === 'en';

  const localizedExperience = [
    {
      period: isEn ? '2025 — PRESENT' : '2025 — ACTUALIDAD',
      role: isEn ? 'Full Stack Software Developer (.NET & Frontend Specialist)' : 'Desarrollador de Software Full Stack (Especialidad Frontend / .NET)',
      company: 'Instituto Superior Tecnológico Central Técnico (ISTPET)',
      location: isEn ? 'Quito, Ecuador // Active Production' : 'Quito, Ecuador // Producción Activa',
      impact: isEn
        ? 'Full software lifecycle execution (Requirements → Architecture → Deployment → Training). Systematic development of Angular SPAs backed by .NET microservices and Web APIs, decoupling presentation logic from data engines. Refactoring and extending transactional schemas over a centralized corporate database with 20+ years in production. Design of centralized Role-Based Access Control (RBAC).'
        : 'Ciclo de vida completo (Requerimientos → Arquitectura → Despliegue → Capacitación). Desarrollo sistemático de SPAs en Angular respaldadas por microservicios y Web APIs en .NET, desacoplando la lógica de interfaz del motor de datos. Intervención, refactorización y extensión de esquemas transaccionales sobre una base de datos corporativa centralizada con más de 20 años en producción, garantizando integridad referencial y retrocompatibilidad. Diseño del motor centralizado de autenticación y autorización basado en roles (RBAC).',
      tag: isEn ? '[ INSTITUTIONAL PRODUCTION ]' : '[ PRODUCCIÓN INSTITUCIONAL ]',
      stack: ['Angular 20/21', '.NET 8', 'C#', 'SQL Server', 'MySQL', 'RBAC', 'Clean Architecture', 'Tailwind CSS']
    },
    {
      period: isEn ? '2024 — PRESENT' : '2024 — ACTUALIDAD',
      role: isEn ? 'Freelance Software Engineer & Tech Consultant' : 'Ingeniero de Software Freelance & Tech Consultant',
      company: isEn ? 'Independent Consulting & Freelance' : 'Consultoría Independiente & Desarrollo Freelance',
      location: isEn ? 'Remote International (B2B / Full-time)' : 'Remoto Internacional (B2B / Full-time)',
      impact: isEn
        ? 'Turnkey delivery of mobile and full stack applications with critical time-to-market constraints and hardware integrations (e.g. developing Bioregistro with triple anti-fraud barrier within a 5-day calendar SLA). Engineering automation pipelines integrating Webhooks and messaging APIs (Telegram / WhatsApp) with cloud storage services.'
        : 'Entrega llave en mano de aplicaciones móviles con requerimientos críticos de tiempo y hardware (como el desarrollo de Bioregistro con triple barrera anti-fraude en 5 días calendario). Desarrollo de pipelines de automatización integrando Webhooks y APIs de mensajería (Telegram / WhatsApp) con Google Drive y microservicios de almacenamiento en la nube.',
      tag: isEn ? '[ FREELANCE // ENGINEERING ]' : '[ FREELANCE // INGENIERÍA ]',
      stack: ['Flutter', 'Dart', 'FastAPI', 'Python', 'Firebase', 'WebSockets', 'Redis', 'Docker']
    }
  ];

  const localizedMilestones = [
    {
      year: '2026',
      title: isEn ? 'Software Engineering Student & AWS Builder' : 'Formación en Ingeniería de Software & AWS Builder',
      issuer: 'Universidad Politécnica Salesiana / AWS',
      description: isEn
        ? 'Software Engineering degree (UPS, in progress) and active member of AWS Builder Student program focused on modern cloud architectures and AWS deployments.'
        : 'Estudiante de Ingeniería en Desarrollo de Software (UPS) y miembro activo del programa AWS Builder Student enfocado en arquitecturas cloud y despliegues en infraestructura AWS.',
      badge: '[ INGENIERÍA & AWS ]'
    },
    {
      year: '2025',
      title: isEn ? 'Higher Technician in Software Development' : 'Tecnólogo Superior en Desarrollo de Software',
      issuer: 'Instituto Superior Tecnológico Central Técnico',
      description: isEn
        ? 'Graduated with comprehensive technical training in full software development lifecycle, relational database modeling, and scalable system architectures.'
        : 'Graduado con formación técnica integral en ciclo de vida de desarrollo de software, modelado de bases de datos relacionales y arquitectura de sistemas.',
      badge: '[ GRADUADO // TITULACIÓN ]'
    },
    {
      year: '2023',
      title: isEn ? 'Algorithmic Competitions & Data Structures' : 'Competencias de Algoritmia & Programación',
      issuer: isEn ? 'University & Competitive Programming' : 'Concursos Universitarios & Competitivos',
      description: isEn
        ? 'Participation and distinguished performance in programming contests: resolving algorithmic problems, graph theory, dynamic programming, and computational complexity optimization.'
        : 'Participación y destacados resultados en competencias de programación: resolución de desafíos de algoritmos, teoría de grafos, programación dinámica y optimización de complejidad computacional.',
      badge: '[ ALGORITMOS & ESTRUCTURAS ]'
    }
  ];

  return (
    <div className="flex-1 flex flex-col justify-between space-y-12">
      {/* Contenido Principal */}
      <div className="space-y-12">
        {/* Encabezado */}
        <FadeUp keyTrigger={language} yOffset={6} className="flex items-center justify-between border-b border-border pb-4 font-mono text-xs text-fg-muted">
          <div className="flex items-center space-x-2">
            <span className="text-fg font-semibold">03 /</span>
            <span className="tracking-wider uppercase font-medium">{t.experience.sectionTag}</span>
          </div>
          <span className="tracking-wider text-[11px] text-fg-subtle uppercase font-medium">
            {t.experience.tag}
          </span>
        </FadeUp>

        {/* Lista cronológica */}
        <FadeUp keyTrigger={language} delay={0.06} yOffset={10} className="divide-y divide-border border-t border-border">
          {localizedExperience.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start hover:bg-bg-subtle/50 px-2 -mx-2 transition-colors"
            >
              {/* Izquierda: Período y Ubicación (3 cols) */}
              <div className="md:col-span-3 font-mono text-xs text-fg font-medium space-y-1">
                <span className="tracking-wider font-semibold">{item.period}</span>
                <span className="block text-[10px] text-fg-subtle uppercase font-normal">{item.location}</span>
              </div>

              {/* Centro: Rol, Empresa e Impacto (6 cols) */}
              <div className="md:col-span-6 space-y-3">
                <div>
                  <h4 className="text-base font-semibold text-fg">{item.role}</h4>
                  <span className="font-mono text-xs text-fg-muted uppercase tracking-wider font-medium">
                    {item.company}
                  </span>
                </div>
                <p className="text-sm text-fg-muted leading-relaxed font-sans">
                  {item.impact}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.stack.map((tech, sIdx) => (
                    <span
                      key={sIdx}
                      className="font-mono text-[10px] text-fg font-medium px-2 py-0.5 border border-border bg-bg-subtle uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Derecha: Tag del tipo de rol (3 cols) */}
              <div className="md:col-span-3 md:text-right font-mono text-xs text-fg-subtle">
                <span className="inline-block px-2.5 py-1 border border-border bg-bg text-[10px] tracking-wider uppercase font-medium">
                  {item.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </FadeUp>

        {/* Sección de Reconocimientos e Hitos Clave */}
        <FadeUp keyTrigger={language} delay={0.12} yOffset={10} className="space-y-6 pt-6">
          <div className="flex items-center space-x-2 font-mono text-xs text-fg font-semibold border-b border-border pb-3">
            <Trophy className="w-4 h-4 text-fg-muted" />
            <span className="tracking-wider uppercase">{t.experience.milestonesTitle}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {localizedMilestones.map((milestone, mIdx) => (
              <motion.div
                key={mIdx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: mIdx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="p-5 border border-border bg-bg-subtle space-y-3 flex flex-col justify-between hover:border-border-strong transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] text-fg-subtle border-b border-border pb-2">
                    <span className="font-semibold text-fg">{milestone.year}</span>
                    <span className="uppercase">{milestone.badge}</span>
                  </div>
                  <h5 className="font-semibold text-sm text-fg leading-snug">
                    {milestone.title}
                  </h5>
                  <span className="font-mono text-[11px] text-fg-muted uppercase tracking-wide block">
                    {milestone.issuer}
                  </span>
                  <p className="text-xs text-fg-muted leading-relaxed font-sans pt-1">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </div>

      {/* Navegación fijada al suelo */}
      <div className="mt-auto pt-10">
        <SectionFooterNav />
      </div>
    </div>
  );
};
