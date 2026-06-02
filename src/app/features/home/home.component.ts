import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../shared/services/language.service';
import { Router } from '@angular/router';

interface HighlightedProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  languageService = inject(LanguageService);
  private router = inject(Router);

  name = signal('Alexander R. Martinez Morillo');
  
  role = computed(() => {
    return this.languageService.currentLanguage() === 'es'
      ? 'Especialista Frontend con capacidades Full Stack'
      : 'Frontend Specialist with Full Stack Capabilities';
  });

  tagline = computed(() => {
    return this.languageService.currentLanguage() === 'es'
      ? 'Especialista en reestructuración y modernización de interfaces. Transformo sistemas complejos en experiencias intuitivas y a prueba de errores, imponiendo manuales de marca estrictos con arquitecturas robustas en Angular, Laravel, .NET y contenedores Docker.'
      : 'Specialist in interface re-architecture and system modernization. I transform complex workflows into highly intuitive, bulletproof user experiences, enforcing strict brand guidelines backed by robust architectures in Angular, Laravel, .NET, and Docker containers.';
  });

  viewProjectDetails(id: string) {
    this.router.navigate(['/projects'], { queryParams: { open: id } });
  }

  featuredProjects = computed<HighlightedProject[]>(() => {
    const lang = this.languageService.currentLanguage();
    return [
      {
        id: 'mathquest',
        title: lang === 'es' ? 'MathQuest — Desafío de Matemáticas' : 'MathQuest - Kids Math Game',
        description: lang === 'es'
          ? 'Juego interactivo 2D educativo para el aprendizaje matemático básico infantil. Desarrollado en Ionic y TypeScript, ofreciendo una interfaz de juego simple y funcional compatible con dispositivos móviles.'
          : "Interactive 2D educational game for children's basic math learning. Developed with Ionic and TypeScript, providing a simple, highly functional game interface optimized for mobile viewports.",
        tags: ['Ionic', 'TypeScript', 'HTML5', 'CSS3'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/Match.png?alt=media&token=11b56ea5-9554-4bb4-8e57-4f3b7eb77d8a',
        githubUrl: 'https://github.com/AlexanderMartinez0410/basic-math-game'
      },
      {
        id: 'bienestar',
        title: lang === 'es' ? 'Bienestar Institucional — Servicios Estudiantiles' : 'Bienestar - Student Welfare Portal',
        description: lang === 'es'
          ? 'Dirección del desarrollo frontend e ingeniería proactiva de datos en el módulo de seguimiento. Diseñé la base de datos de este módulo, construí servicios backend cuando el equipo de APIs estaba ocupado y coordiné toda la integración en Angular.'
          : 'Frontend development lead and proactive database engineer for the tracking module. Designed the module database schema, developed backend API services to unblock frontend sprints, and coordinated the complete system integration in Angular.',
        tags: ['Angular', 'TypeScript', 'REST APIs', 'Swagger'],
        image: 'https://firebasestorage.googleapis.com/v0/b/autentificacion-327d6.firebasestorage.app/o/Bienestar.png?alt=media&token=c6d69817-914d-4502-86b6-56d99d9662c5'
      }
    ];
  });
}
