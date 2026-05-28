import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../shared/services/language.service';

interface HighlightedProject {
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

  name = signal('Alexander R. Martinez Morillo');
  
  role = computed(() => {
    return this.languageService.currentLanguage() === 'es'
      ? 'Arquitecto Técnico Principal & Líder Técnico'
      : 'Lead Technical Architect & Tech Lead';
  });

  tagline = computed(() => {
    return this.languageService.currentLanguage() === 'es'
      ? 'Especializado en arquitecturas frontend premium, backends de alto rendimiento, ingeniería de bases de datos, desarrollo móvil y dirección de equipos multidisciplinarios desde la concepción del cliente hasta el despliegue seguro.'
      : 'Specialized in premium frontend architectures, high-performance backends, database engineering, mobile development, and orchestrating cross-functional teams from client kickoff to secure deployment.';
  });

  featuredProjects = computed<HighlightedProject[]>(() => {
    const lang = this.languageService.currentLanguage();
    return [
      {
        title: lang === 'es' ? 'Iris — Red Social Institucional' : 'Iris — Institutional Social Network',
        description: lang === 'es'
          ? 'Una red social completa diseñada para el instituto ISTPET. Cuenta con comunicación segura en tiempo real, muros de publicaciones personalizados, perfiles de usuario y gestión multimedia en AWS EC2 y S3.'
          : 'A complete social network engineered for the ISTPET institute. Features secure real-time student communications, custom feeds, user profiles, and media storage on AWS EC2 & S3.',
        tags: ['Angular', 'Laravel', 'AWS S3', 'PostgreSQL'],
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/manetao/iris'
      },
      {
        title: lang === 'es' ? 'Bioregistro — Control de Asistencia Biométrico' : 'Bioregistro — Biometric Attendance Suite',
        description: lang === 'es'
          ? 'Un sistema de control de accesos e ingresos de alta velocidad que integra validación biométrica local (huella dactilar/reconocimiento facial), transmisión de logs en tiempo real y registro automatizado de puntualidad.'
          : 'A high-performance security and check-in system integrating local biometric validations (fingerprint/face ID), real-time transaction streams, and automated student tardiness records.',
        tags: ['Flutter', 'Firebase', 'Biometrics', 'Firestore'],
        image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/biometric_attendance'
      }
    ];
  });
}
