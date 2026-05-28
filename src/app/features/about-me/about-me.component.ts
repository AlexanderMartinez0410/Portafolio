import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../shared/services/language.service';

interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  description: string;
}

interface SkillCategory {
  title: string;
  skills: string[];
}

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent {
  languageService = inject(LanguageService);

  biography = computed(() => {
    return this.languageService.currentLanguage() === 'es'
      ? "Hola, soy Alexander Martínez. Soy un desarrollador Full-Stack graduado como Tecnólogo y actualmente cursando Ingeniería de Software en la UPS. Me especializo en la concepción de sistemas educativos avanzados y el diseño de arquitecturas de datos seguras. Con una amplia experiencia que abarca desde la ingeniería frontend (React/Angular) hasta backends robustos, aplicativos móviles y control de calidad (QA), me apasiona guiar equipos técnicos y poner en marcha plataformas robustas con una experiencia de usuario premium."
      : "Hi, I'm Alexander Martínez. I'm a Full-Stack Developer graduated as a Software Technologist and currently pursuing a Software Engineering degree at UPS. I specialize in crafting complex educational systems and designing secure database architectures. With a broad expertise spanning frontend engineering (React/Angular), robust backends, high-speed mobile apps, and QA engineering, I thrive at leading technical teams and deploying production-ready platforms with premium UX standards.";
  });

  biographySecond = computed(() => {
    return this.languageService.currentLanguage() === 'es'
      ? "Creo firmemente que el desarrollo de software de excelencia surge de balancear el rendimiento de datos seguro, interfaces pulidas y la sinergia del equipo. Fuera de mi labor diaria como desarrollador y mis estudios de Ingeniería, dedico tiempo a proyectos de impacto social y voluntariado educativo, lo que fortalece continuamente mis habilidades de mentoría, comunicación clara y liderazgo."
      : "I strongly believe that stellar software development comes from balancing secure data performance, polished interfaces, and team synergy. Outside my professional daily tasks and engineering studies, I dedicate time to social impact projects and educational volunteering, continuously strengthening my mentorship, clear communication, and leadership capabilities.";
  });

  experience = computed<ExperienceItem[]>(() => {
    const isEs = this.languageService.currentLanguage() === 'es';
    return [
      {
        year: isEs ? '2025 - Presente' : '2025 - Present',
        role: isEs ? 'Líder Frontend & Desarrollador Full-Stack' : 'Frontend Lead & Full-Stack Developer',
        company: 'ISTPET',
        description: isEs
          ? 'Liderando el desarrollo de interfaces y coordinando el diseño de bases de datos y backend (.NET, Laravel). Diseñé, construí y desplegué con éxito la red social interna e institucional para estudiantes, alojada bajo parámetros de seguridad en AWS.'
          : 'Leading user interface development and coordinating database and backend design (.NET, Laravel). Architected, built, and successfully deployed the secure internal institutional student Social Network hosted on AWS.'
      },
      {
        year: isEs ? '2025 (Contrato)' : '2025 (Contract)',
        role: isEs ? 'Desarrollador Mobile (Freelance)' : 'Mobile Developer (Freelance)',
        company: 'Bioregistro / biometric_attendance',
        description: isEs
          ? 'Diseñé y construí un aplicativo móvil de alta velocidad para el control de asistencia biométrica (reconocimiento facial y huella dactilar), implementando sincronización en tiempo real con bases de datos en la nube y almacenamiento seguro.'
          : 'Designed and engineered a high-speed mobile application for biometric check-ins (face and fingerprint ID), implementing real-time cloud database syncing and secure credentials storage.'
      },
      {
        year: isEs ? '2024 (Transición Profesional)' : '2024 (Professional Transition)',
        role: isEs ? 'Desarrollador de Software (Graduado en Planta)' : 'Software Developer (Graduate Transition)',
        company: 'Consejo Nacional de Competencias (CNC)',
        description: isEs
          ? 'Ingresé para prácticas y rápidamente asumí responsabilidades en planta tras graduarme como Tecnólogo. Desarrollé e implementé el sistema institucional de Help Desk y estructuré la base de datos de control de asistencia nacional en Ionic y Supabase.'
          : 'Began as an intern and quickly assumed full-time responsibilities after graduating as a Software Technologist. Developed and deployed the institutional Help Desk system and structured the national conference attendance database with Ionic and Supabase.'
      },
      {
        year: isEs ? 'Victoria en Concurso' : 'Competition Victory',
        role: isEs ? 'Ganador de 1er Lugar' : '1st Place Winner',
        company: 'UTC Programming Contest',
        description: isEs
          ? 'Obtuve el primer lugar en el Concurso de Programación Universitaria organizado por la UTC, demostrando resolución rápida de problemas complejos, algoritmos estructurados y optimización matemática bajo presión.'
          : 'Achieved first place in the University Programming Competition hosted by UTC, demonstrating rapid problem-solving, clean code standards, and optimization under pressure.'
      }
    ];
  });

  skillCategories = computed<SkillCategory[]>(() => {
    const isEs = this.languageService.currentLanguage() === 'es';
    return [
      {
        title: isEs ? 'Lenguajes de Programación' : 'Programming Languages',
        skills: ['TypeScript', 'JavaScript', 'C++', 'PHP', 'Python', 'Java', 'SQL', 'C# (.NET)']
      },
      {
        title: isEs ? 'Frameworks y Motores' : 'Frameworks & Engines',
        skills: ['Angular', 'Ionic', 'Laravel', 'Flutter', 'React', 'Unity']
      },
      {
        title: isEs ? 'Bases de Datos, Cloud e DevOps' : 'Databases, Cloud & DevOps',
        skills: ['PostgreSQL', 'MySQL', 'Firebase', 'Firestore', 'Supabase', 'AWS', 'Docker', 'Git', 'Vercel']
      },
      {
        title: isEs ? 'Especialidades & Arquitectura' : 'Specializations & Core Focus',
        skills: ['Secure DB', 'System UX', 'QA Engineering', 'Sistemas Educativos', 'Datos Cifrados']
      }
    ];
  });
}
