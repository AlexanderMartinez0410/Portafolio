import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../shared/services/language.service';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Frontend' | 'Fullstack' | 'Mobile';
  tags: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
}

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  languageService = inject(LanguageService);
  private route = inject(ActivatedRoute);

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
    
    this.route.queryParams.subscribe(params => {
      const openId = params['open'];
      if (openId) {
        const found = this.projects().find(p => p.id === openId);
        if (found) {
          this.openModal(found);
        }
      }
    });
  }
  projects = computed<Project[]>(() => {
    const lang = this.languageService.currentLanguage();
    const isEs = lang === 'es';
    return [
      {
        id: 'vita',
        title: isEs ? 'Vita — Gestión de Talleres' : 'Vita - Workshop Management Suite',
        description: isEs
          ? 'Reestructuración y rediseño de una plataforma heredada de talleres  para simplificar drásticamente su usabilidad y mejorar la adopción de los usuarios. Rediseñé la interfaz y optimicé flujos del backend en .NET Core manteniendo intacto el modelo de base de datos existente.'
          : 'Re-architecture and redesign of a legacy  workshop system to drastically simplify usability and improve user adoption. Redesigned the visual interface and optimized backend workflows using .NET Core, keeping the existing database schema untouched.',
        category: 'Fullstack',
        tags: ['React', '.NET Core', 'SQL Server', 'Docker'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/Vita.png?alt=media&token=650ea0a1-36d5-4437-9c08-41e353aa7f68'
      },
      {
        id: 'bioregistro',
        title: isEs ? 'Bioregistro — Asistencia Biométrica' : 'Bioregistro - Biometric Attendance',
        description: isEs
          ? 'Aplicación móvil completa para control y registro de asistencia en una institución educativa. Desarrollada en su totalidad como freelance bajo Flutter y Firebase, integrando geolocalización, autenticación de huella dactilar nativa y mapas de código abierto.'
          : 'Full mobile application for attendance and check-in tracking within an educational institution. Developed entirely as a freelance project using Flutter and Firebase, integrating secure GPS tracking, native fingerprint ID, and open-source maps.',
        category: 'Mobile',
        tags: ['Flutter', 'Firebase', 'Biometrics', 'Firestore'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/Bioregistro.png?alt=media&token=5e9afadb-ef50-4fb5-9b0d-f2d512e6ad80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/biometric_attendance'
      },
      {
        id: 'iris',
        title: isEs ? 'Iris — Red Social Estudiantil' : 'Iris - Student Social Network',
        description: isEs
          ? 'Red social estudiantil institucional para el ISTPET. Como líder de desarrollo, diseñé y desplegué el ecosistema frontend y en la nube (AWS EC2, S3) en un tiempo récord de 33 días. Tras su exitosa implementación, el sistema fue entregado al instituto, pero debido a fluctuaciones del personal institucional el proyecto ya no se encuentra desplegado activamente.'
          : 'Institutional student social network for ISTPET. As lead developer, engineered and deployed the entire frontend and cloud infrastructure (AWS EC2, S3) within a record-breaking 33-day timeline. Following its successful implementation, the system was handed over to the institute, but due to institutional staff turnover, the project is no longer actively deployed.',
        category: 'Fullstack',
        tags: ['Angular', 'Laravel', 'AWS S3', 'PostgreSQL'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/Iris.png?alt=media&token=a02cdcbd-60d3-49f3-b9b3-9c13c659226c',
        githubUrl: 'https://github.com/manetao/iris'
      },
      {
        id: 'bienestar',
        title: isEs ? 'Bienestar Institucional — Servicios Estudiantiles' : 'Bienestar - Student Welfare Portal',
        description: isEs
          ? 'Dirección del desarrollo frontend e ingeniería proactiva de datos en el módulo de seguimiento. Diseñé la base de datos de este módulo, construí servicios backend cuando el equipo de APIs estaba ocupado y coordiné toda la integración final en Angular.'
          : 'Frontend development lead and proactive database engineer for the tracking module. Designed the module database schema, developed backend API services to unblock frontend sprints, and coordinated the complete system integration in Angular.',
        category: 'Fullstack',
        tags: ['Angular', 'TypeScript', 'REST APIs', 'Swagger'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/Bienestar.png?alt=media&token=c6d69817-914d-4502-86b6-56d99d9662c5'
      },
      {
        id: 'ammionline',
        title: isEs ? 'AMMI Online — Gestión Académica Monolítica' : 'AMMI Online - School Management Monolith',
        description: isEs
          ? 'Plataforma de gestión educativa desarrollada colaborativamente con Laravel (actualmente en fase de pruebas dentro del instituto). Lideré e implementé casi la totalidad del diseño frontend de la aplicación web y colaboré en integraciones puntuales de backend y base de datos MySQL.'
          : 'Educational management platform built collaboratively with Laravel, currently undergoing a testing and trial phase within the institute. Engineered almost the entire frontend layout and user interface, while collaborating in minor backend integrations and MySQL database updates.',
        category: 'Fullstack',
        tags: ['PHP', 'Laravel', 'MySQL', 'HTML5/CSS3'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/AMMIOnline.png?alt=media&token=7de6a6d3-0640-4665-9d8f-63fb8aaf10f1',
        image_original_unsplash: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'sipleci',
        title: isEs ? 'SIPLECI — Acreditación y Evidencias' : 'SIPLECI - Evidence & Accreditation Portal',
        description: isEs
          ? 'Diseño de la interfaz de usuario (UI/UX) para la plataforma institucional de acreditación y evidencias de calidad académica, construida con Angular y .NET Core. Creé un flujo visual limpio, amigable y estructurado para la carga ágil de archivos.'
          : 'User interface (UI/UX) design for the institutional academic accreditation and evidence tracking portal built on Angular and .NET Core. Crafted a clean, structured, and user-friendly visual layout optimized for frictionless document uploads.',
        category: 'Fullstack',
        tags: ['Angular', '.NET Core', 'UI/UX', 'CSS3'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/Sipleci.png?alt=media&token=1c582fc7-2cee-4e0c-9dd8-e0dadbfbc0aa'
      },
      {
        id: 'mathquest',
        title: isEs ? 'MathQuest — Desafío de Matemáticas' : 'MathQuest - Kids Math Game',
        description: isEs
          ? 'Juego interactivo 2D educativo para el aprendizaje matemático básico infantil. Desarrollado en Ionic y TypeScript, ofreciendo una interfaz de juego simple y funcional compatible con dispositivos móviles.'
          : "Interactive 2D educational game for children's basic math learning. Developed with Ionic and TypeScript, providing a simple, highly functional game interface optimized for mobile viewports.",
        category: 'Frontend',
        tags: ['Ionic', 'TypeScript', 'HTML5', 'CSS3'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/Match.png?alt=media&token=11b56ea5-9554-4bb4-8e57-4f3b7eb77d8a',
        githubUrl: 'https://github.com/AlexanderMartinez0410/basic-math-game'
      },
      {
        id: 'logbook',
        title: isEs ? 'Frontend Logbook — Desafíos UI' : 'Frontend Logbook - Daily UI Log',
        description: isEs
          ? 'Colección personal de desafíos avanzados de interfaz de usuario de corta duración. Un registro de retos rápidos de diseño responsive, maquetación CSS moderna y experimentación visual (desarrollado en un sprint de 3 días).'
          : 'Personal collection of quick, advanced user interface challenges. A micro-log showcasing rapid responsive layouts, modern CSS styling, and visual experiments (engineered within a 3-day sprint).',
        category: 'Frontend',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/LoogBook.png?alt=media&token=6c689dd0-38cf-4e8d-92c0-3b771bef2d63',
        githubUrl: 'https://github.com/AlexanderMartinez0410/Frontend-Logbook'
      },
      {
        id: 'cnc',
        title: isEs ? 'CNC Certificados — Portal de Conferencias' : 'CNC Certificates - Conference Portal',
        description: isEs
          ? 'Sistema para la emisión de certificados de conferencias nacionales. En este proyecto me enfoqué exclusivamente en el diseño y estructuración de la base de datos con Supabase, así como en la elaboración del manual de usuario y documentación técnica detallada, sin desarrollo de frontend.'
          : 'System for issuing certificates for national conferences. For this project, I focused exclusively on database design and architecture using Supabase, along with authoring the user manual and detailed technical documentation, with no frontend development.',
        category: 'Mobile',
        tags: ['Supabase', 'Database Design', 'Documentation', 'SQL'],
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'gacad',
        title: isEs ? 'GACAD — Infraestructura Académica' : 'GACAD - Academic Infrastructure',
        description: isEs
          ? 'Proyecto orientado a la administración de la infraestructura y recursos académicos de la institución. Actualmente el proyecto se encuentra en su fase inicial de modelado y diseño de base de datos relacional.'
          : 'Project aimed at managing the institution\'s academic infrastructure and resources. The project is currently in its initial phase of relational database modeling and design.',
        category: 'Fullstack',
        tags: ['Database Design', 'SQL Server', 'SQL', 'Modeling'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/GaCAD.png?alt=media&token=6165a745-a7d3-4e53-b38d-c06f1eb476b0'
      },
      {
        id: 'ranking',
        title: isEs ? 'Ranking Docentes — Evaluación de Desempeño' : 'Ranking Docentes - Teacher Evaluation System',
        description: isEs
          ? 'Sistema interactivo para la clasificación y evaluación del rendimiento docente en tiempo real. Diseñado con una interfaz moderna y dashboards analíticos elegantes (actualmente en pausa por tiempos de entrega).'
          : 'Interactive portal for real-time teacher evaluation and performance metrics. Designed with a modern UI and elegant responsive analytics dashboards (currently on hold due to timeline constraints).',
        category: 'Fullstack',
        tags: ['React', 'TypeScript', 'Vite', 'Node.js'],
        image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/ranking-docentes'
      },
      {
        id: 'siervos',
        title: isEs ? 'Siervos de Jehová' : 'Jehovah\'s Servants',
        description: isEs
          ? 'Sistema formativo para la gestión interna y organización comunitaria. Desarrollado con una interfaz SPA reactiva en Angular y un backend robusto basado en .NET Core RESTful APIs.'
          : 'Formative system for internal administration and community organization. Developed with a reactive SPA interface in Angular and a robust backend based on .NET Core RESTful APIs.',
        category: 'Fullstack',
        tags: ['Angular', '.NET Core', 'SQL Server', 'Web API'],
        image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80'
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
