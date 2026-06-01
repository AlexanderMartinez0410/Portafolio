import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../shared/services/language.service';

interface Project {
  title: string;
  description: string;
  category: 'Frontend' | 'Fullstack' | 'Mobile';
  tags: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  languageService = inject(LanguageService);

  categories = computed<string[]>(() => {
    return this.languageService.currentLanguage() === 'es'
      ? ['Todos', 'Frontend', 'Fullstack', 'Móvil']
      : ['All', 'Frontend', 'Fullstack', 'Mobile'];
  });

  selectedCategory = signal<string>('All');
  selectedProject = signal<Project | null>(null);

  openModal(project: Project) {
    this.selectedProject.set(project);
  }

  closeModal() {
    this.selectedProject.set(null);
  }

  // Reactively reset selection if language changes between spanish / english
  constructor() {
    this.selectedCategory.set(this.languageService.currentLanguage() === 'es' ? 'Todos' : 'All');
  }
  projects = computed<Project[]>(() => {
    const lang = this.languageService.currentLanguage();
    const isEs = lang === 'es';
    return [
      {
        title: isEs ? 'Vita — Gestión de Talleres' : 'Vita - Workshop Management Suite',
        description: isEs
          ? 'Reestructuración y rediseño de una plataforma heredada de talleres  para simplificar drásticamente su usabilidad y mejorar la adopción de los usuarios. Rediseñé la interfaz y optimicé flujos del backend en .NET Core manteniendo intacto el modelo de base de datos existente.'
          : 'Re-architecture and redesign of a legacy  workshop system to drastically simplify usability and improve user adoption. Redesigned the visual interface and optimized backend workflows using .NET Core, keeping the existing database schema untouched.',
        category: 'Fullstack',
        tags: ['React', '.NET Core', 'SQL Server', 'Docker'],
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: isEs ? 'Bioregistro — Asistencia Biométrica' : 'Bioregistro - Biometric Attendance',
        description: isEs
          ? 'Aplicación móvil completa para control y registro de asistencia en una institución educativa. Desarrollada en su totalidad como freelance bajo Flutter y Firebase, integrando geolocalización, autenticación de huella dactilar nativa y mapas de código abierto.'
          : 'Full mobile application for attendance and check-in tracking within an educational institution. Developed entirely as a freelance project using Flutter and Firebase, integrating secure GPS tracking, native fingerprint ID, and open-source maps.',
        category: 'Mobile',
        tags: ['Flutter', 'Firebase', 'Biometrics', 'Firestore'],
        image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/biometric_attendance'
      },
      {
        title: isEs ? 'Iris — Red Social Estudiantil' : 'Iris - Student Social Network',
        description: isEs
          ? 'Red social estudiantil institucional para el ISTPET. Como líder de desarrollo, diseñé y desplegué todo el ecosistema frontend y en la nube (AWS EC2, S3) en un tiempo récord de 33 días, implementando muros de publicaciones dinámicos y perfiles interactivos.'
          : 'Institutional student social network for ISTPET. As lead developer, engineered and deployed the entire frontend and cloud infrastructure on AWS (EC2, S3) within a record-breaking 33-day timeline, structuring dynamic post feeds and interactive user profiles.',
        category: 'Fullstack',
        tags: ['Angular', 'Laravel', 'AWS S3', 'PostgreSQL'],
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/manetao/iris'
      },
      {
        title: isEs ? 'Bienestar Institucional — Servicios Estudiantiles' : 'Bienestar - Student Welfare Portal',
        description: isEs
          ? 'Dirección del desarrollo frontend e ingeniería proactiva de datos en el módulo de seguimiento. Diseñé la base de datos de este módulo, construí servicios backend cuando el equipo de APIs estaba ocupado y coordiné toda la integración final en Angular.'
          : 'Frontend development lead and proactive database engineer for the tracking module. Designed the module database schema, developed backend API services to unblock frontend sprints, and coordinated the complete system integration in Angular.',
        category: 'Fullstack',
        tags: ['Angular', 'TypeScript', 'REST APIs', 'Swagger'],
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: isEs ? 'AMMI Online — Gestión Académica Monolítica' : 'AMMI Online - School Management Monolith',
        description: isEs
          ? 'Plataforma de gestión educativa desarrollada colaborativamente con Laravel. Lideré e implementé casi la totalidad del diseño frontend de la aplicación web y colaboré en integraciones puntuales de backend y base de datos MySQL.'
          : 'Educational management platform built collaboratively with Laravel. Engineered almost the entire frontend layout and user interface, while collaborating in minor backend integrations and MySQL database updates.',
        category: 'Fullstack',
        tags: ['PHP', 'Laravel', 'MySQL', 'HTML5/CSS3'],
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: isEs ? 'SIPLECI — Acreditación y Evidencias' : 'SIPLECI - Evidence & Accreditation Portal',
        description: isEs
          ? 'Diseño de la interfaz de usuario (UI/UX) para la plataforma institucional de acreditación y evidencias de calidad académica, construida con Angular y .NET Core. Creé un flujo visual limpio, amigable y estructurado para la carga ágil de archivos.'
          : 'User interface (UI/UX) design for the institutional academic accreditation and evidence tracking portal built on Angular and .NET Core. Crafted a clean, structured, and user-friendly visual layout optimized for frictionless document uploads.',
        category: 'Fullstack',
        tags: ['Angular', '.NET Core', 'UI/UX', 'CSS3'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: isEs ? 'Ranking Docentes — Evaluación de Desempeño' : 'Ranking Docentes - Teacher Evaluation System',
        description: isEs
          ? 'Sistema interactivo para la clasificación y evaluación del rendimiento docente en tiempo real. Diseñado con una interfaz moderna y dashboards analíticos elegantes (actualmente en pausa por tiempos de entrega).'
          : 'Interactive portal for real-time teacher evaluation and performance metrics. Designed with a modern UI and elegant responsive analytics dashboards (currently on hold due to timeline constraints).',
        category: 'Fullstack',
        tags: ['React', 'TypeScript', 'Vite', 'Node.js'],
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/ranking-docentes'
      },
      {
        title: isEs ? 'MathQuest — Desafío de Matemáticas' : 'MathQuest - Kids Math Game',
        description: isEs
          ? 'Juego interactivo 2D educativo para el aprendizaje matemático básico infantil. Desarrollado en Ionic y TypeScript, ofreciendo una interfaz de juego simple y funcional compatible con dispositivos móviles.'
          : "Interactive 2D educational game for children's basic math learning. Developed with Ionic and TypeScript, providing a simple, highly functional game interface optimized for mobile viewports.",
        category: 'Frontend',
        tags: ['Ionic', 'TypeScript', 'HTML5', 'CSS3'],
        image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/basic-math-game'
      },
      {
        title: isEs ? 'Frontend Logbook — Desafíos UI' : 'Frontend Logbook - Daily UI Log',
        description: isEs
          ? 'Colección personal de desafíos avanzados de interfaz de usuario de corta duración. Un registro de retos rápidos de diseño responsive, maquetación CSS moderna y experimentación visual (desarrollado en un sprint de 3 días).'
          : 'Personal collection of quick, advanced user interface challenges. A micro-log showcasing rapid responsive layouts, modern CSS styling, and visual experiments (engineered within a 3-day sprint).',
        category: 'Frontend',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX'],
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/Frontend-Logbook'
      },
      {
        title: isEs ? 'CNC Certificados — Portal de Conferencias' : 'CNC Certificates - Conference Portal',
        description: isEs
          ? 'Sistema para la emisión de certificados de conferencias nacionales. Diseñé y estructuré toda la base de datos inicial con Supabase y elaboré documentación técnica exhaustiva para garantizar un traspaso óptimo del proyecto.'
          : 'Web system for issuing certificates for national conferences. Designed and architected the entire initial database layout on Supabase and authored extensive technical documentation to ensure a seamless project handoff.',
        category: 'Mobile',
        tags: ['Supabase', 'Database Design', 'Documentation', 'SQL'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      }
    ];
  });

  filteredProjects = computed(() => {
    const category = this.selectedCategory();
    const allProjects = this.projects();

    if (category === 'All' || category === 'Todos') {
      return allProjects;
    }

    const categoryMap: { [key: string]: string } = {
      'Frontend': 'Frontend',
      'Fullstack': 'Fullstack',
      'Móvil': 'Mobile',
      'Mobile': 'Mobile'
    };

    const targetCategory = categoryMap[category] || category;
    return allProjects.filter(p => p.category === targetCategory);
  });

  setCategory(category: string) {
    this.selectedCategory.set(category);
  }
}
