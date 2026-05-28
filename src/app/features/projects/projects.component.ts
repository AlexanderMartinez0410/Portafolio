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
          ? 'Sistema completo e institucional para la administración de talleres ISS. Diseñé las interfaces de alta fidelidad, lideré los flujos de QA y documentación técnica, y coordiné la integración del backend.'
          : 'A comprehensive institutional system for ISS workshop administration. Crafted high-fidelity interfaces, led technical QA/documentation flows, and coordinated backend integration.',
        category: 'Fullstack',
        tags: ['React', '.NET Core', 'SQL Server', 'Docker'],
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: isEs ? 'Bioregistro — Asistencia Biométrica' : 'Bioregistro - Biometric Attendance',
        description: isEs
          ? 'Aplicativo móvil de alta velocidad para registro biométrico estudiantil (reconocimiento facial/huella dactilar), desarrollado bajo contrato freelance, con sincronización de logs en tiempo real.'
          : 'High-speed student check-in mobile application integrating fingerprint/facial recognition, built under freelance contract with real-time log streaming.',
        category: 'Mobile',
        tags: ['Flutter', 'Firebase', 'Biometrics', 'Firestore'],
        image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/biometric_attendance'
      },
      {
        title: isEs ? 'Iris — Red Social Estudiantil' : 'Iris - Student Social Network',
        description: isEs
          ? 'Red social interna para estudiantes de ISTPET. Cuenta con comunicación segura en tiempo real, perfiles de usuario, muros dinámicos de publicaciones y gestión multimedia en la nube de AWS.'
          : 'Internal institutional social network for ISTPET students. Features secure real-time chat, profiles, customized dynamic feeds, and media hosting on AWS.',
        category: 'Fullstack',
        tags: ['Angular', 'Laravel', 'AWS S3', 'PostgreSQL'],
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/manetao/iris'
      },
      {
        title: isEs ? 'Bienestar Institucional — Servicios Estudiantiles' : 'Bienestar - Student Welfare Portal',
        description: isEs
          ? 'Sistema en desarrollo para gestión de becas, solicitudes y admisiones estudiantiles. Actúo como Líder de Proyecto y del equipo Frontend, coordinando las integraciones Swagger con backend.'
          : 'Active school portal managing scholarships, request forms, and student admissions. Serving as Project Lead and Frontend Lead, coordinating Swagger-documented API integrations.',
        category: 'Fullstack',
        tags: ['Angular', 'TypeScript', 'REST APIs', 'Swagger'],
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: isEs ? 'AMMI Online — Gestión Académica Monolítica' : 'AMMI Online - School Management Monolith',
        description: isEs
          ? 'Sistema integral de gestión de escuelas. Responsable del desarrollo del frontend, la estructuración de la base de datos, las migraciones de datos complejas y el módulo de reportería académica.'
          : 'Monolithic academic and student management platform. Responsible for frontend development, database structuring, database migrations, and student reporting modules.',
        category: 'Fullstack',
        tags: ['PHP', 'Laravel', 'MySQL', 'HTML5/CSS3'],
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: isEs ? 'SIPLECI — Acreditación y Evidencias' : 'SIPLECI - Evidence & Accreditation Portal',
        description: isEs
          ? 'Plataforma institucional para el control y carga de evidencias académicas. Diseñé la arquitectura del frontend y lideré la re-estructuración integral del sistema basándome en el modelo exitoso de Vita.'
          : 'Institutional platform for managing academic evidence and quality certifications. Designed the frontend architecture and led the system re-architecture modeled after Vita.',
        category: 'Fullstack',
        tags: ['React', 'TypeScript', 'CSS3', 'QA Testing'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: isEs ? 'Ranking Docentes — Evaluación de Desempeño' : 'Ranking Docentes - Teacher Evaluation System',
        description: isEs
          ? 'Proyecto interactivo para evaluar y clasificar el desempeño de docentes en tiempo real, provisto de dashboards interactivos y una interfaz moderna terminal en React.'
          : 'Interactive fullstack system for real-time teacher performance evaluations and metrics, built with responsive dashboards and a modern terminal-style React UI.',
        category: 'Fullstack',
        tags: ['React', 'TypeScript', 'Vite', 'Node.js'],
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/ranking-docentes'
      },
      {
        title: isEs ? 'MathQuest — Desafío de Matemáticas' : 'MathQuest - Kids Math Game',
        description: isEs
          ? 'Un juego interactivo en 2D diseñado para que los niños aprendan y dominen operaciones matemáticas básicas mediante niveles dinámicos y medallas, optimizado para web y móvil.'
          : 'An interactive 2D educational game designed for kids to learn and master basic mathematics operations through friendly levels, badges, and progress tracking.',
        category: 'Frontend',
        tags: ['Ionic', 'TypeScript', 'HTML5', 'CSS3'],
        image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/basic-math-game'
      },
      {
        title: isEs ? 'Frontend Logbook — Desafíos UI' : 'Frontend Logbook - Daily UI Log',
        description: isEs
          ? 'Diario personal de codificación enfocado en diseñar layouts modernos con responsive design estricto, micro-animaciones fluidas, elementos glassmorphic y temas oscuros de nivel premium.'
          : 'An active personal coding challenges journal focused on crafting advanced modern responsive UI layouts, clean micro-animations, glassmorphic elements, and premium dark layouts.',
        category: 'Frontend',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX'],
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/Frontend-Logbook'
      },
      {
        title: isEs ? 'CNC Help Desk — Mesa de Ayuda' : 'CNC Help Desk & Conference Portal',
        description: isEs
          ? 'Mesa de ayuda institucional con panel administrativo web y aplicativo móvil híbrido de alta velocidad para registro de asistencia en conferencias nacionales, integrado con bases de datos en la nube.'
          : 'An institutional administrative Help Desk dashboard and a high-performance check-in mobile application designed for national conferences, integrated with cloud databases.',
        category: 'Mobile',
        tags: ['Ionic', 'Supabase', 'TypeScript'],
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
