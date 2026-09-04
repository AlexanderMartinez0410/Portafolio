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
      role: 'Software & Frontend Engineer',
      company: 'ISTPET (Inst. Sup. Tecnológico Mayor Pedro Traversari)',
      location: isEn ? 'Quito, Ecuador // Active Production' : 'Quito, Ecuador // Producción Activa',
      impact: isEn
        ? 'Design, development, and maintenance of academic and administrative modules in real production. Building reactive interfaces with Angular 21 and TypeScript connected to backend services in .NET 8 (ASP.NET Core) and Python FastAPI. Relational database modeling (PostgreSQL / SQL Server), strict RBAC authentication, and query performance tuning.'
        : 'Diseño, desarrollo y mantenimiento de módulos académicos y administrativos en producción real. Construcción de interfaces reactivas en Angular y TypeScript conectadas a servicios backend en .NET 8 (ASP.NET Core) y FastAPI en Python. Modelado de bases de datos relacionales (PostgreSQL / SQL Server), autenticación con roles estrictos (RBAC) y optimización de consultas.',
      tag: isEn ? '[ INSTITUTIONAL PRODUCTION ]' : '[ PRODUCCIÓN INSTITUCIONAL ]',
      stack: ['Angular 21', 'TypeScript', '.NET 8', 'C#', 'FastAPI', 'PostgreSQL', 'SQL Server', 'Tailwind CSS']
    },
    {
      period: isEn ? '2023 — PRESENT' : '2023 — ACTUALIDAD',
      role: 'Frontend & Software Solutions Developer',
      company: isEn ? 'Independent Projects & Freelance' : 'Proyectos Independientes & Freelance',
      location: isEn ? 'Remote // International' : 'Remoto // Internacional',
      impact: isEn
        ? 'Development of interactive web and mobile applications using React, Next.js, and Flutter. Biometric hardware integration via TCP network sockets (ZKTeco / pyzk), 3D graphics experimentation in Three.js/Canvas, and agile workflow adoption with Spec-Driven Development.'
        : 'Desarrollo de interfaces web y móviles interactivas en React, Next.js y Flutter. Integración de hardware biométrico mediante sockets de red (ZKTeco / pyzk), experimentación con gráficos 3D en Three.js/Canvas y adopción de metodologías ágiles asistidas por IA con Spec-Driven Development.',
      tag: isEn ? '[ FREELANCE // ENGINEERING ]' : '[ FREELANCE // INGENIERÍA ]',
      stack: ['React', 'Next.js', 'Three.js', 'Flutter', 'Python', 'Docker', 'ZKTeco Sockets', 'Vitest']
    }
  ];

  const localizedMilestones = [
    {
      year: '2023',
      title: isEn ? '1st Place — University Algorithm & Programming Competition' : '1er Lugar — Concurso Universitario de Algoritmos & Programación',
      issuer: 'Universidad Técnica de Cotopaxi (UTC)',
      description: isEn
        ? 'First place in university programming competition: solving algorithmic challenges, time/space complexity optimization, and advanced data structures.'
        : 'Primer puesto en la competencia universitaria de programación: resolución de desafíos de algoritmos, optimización de complejidad temporal/espacial y estructuras de datos.',
      badge: '[ 1ER LUGAR / UTC ]'
    },
    {
      year: '2025',
      title: isEn ? 'Official Release on Google Play Store (Mobile App)' : 'Despliegue Oficial en Google Play Store (App Móvil)',
      issuer: 'Comunidad Institucional ISTPET',
      description: isEn
        ? 'Publication and maintenance of institutional mobile app ("Mi ISTPET") on the official Google Play store, integrated with academic and administrative services.'
        : 'Publicación y mantenimiento de la aplicación móvil institucional ("Mi ISTPET") en la tienda oficial de Google Play, conectada a los servicios académicos y administrativos.',
      badge: '[ GOOGLE PLAY STORE ]'
    },
    {
      year: '2024',
      title: isEn ? 'TCP Socket Biometric Hardware Integration' : 'Integración de Hardware Biométrico por Sockets TCP',
      issuer: isEn ? 'Applied Enterprise Systems' : 'Sistemas Enterprise Aplicados',
      description: isEn
        ? 'Autonomous background daemon engineering to capture physical punch logs without data loss, handling intermittent network connection events.'
        : 'Ingeniería de demonio autónomo para captura de marcaciones físicas sin pérdida de datos ante cortes intermitentes de red.',
      badge: '[ IOT / HARDWARE ]'
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
