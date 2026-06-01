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
      ? 'Especialista Frontend con capacidades Full Stack'
      : 'Frontend Specialist with Full Stack Capabilities';
  });

  tagline = computed(() => {
    return this.languageService.currentLanguage() === 'es'
      ? 'Especialista en reestructuración y modernización de interfaces. Transformo sistemas complejos en experiencias intuitivas y a prueba de errores, imponiendo manuales de marca estrictos con arquitecturas robustas en Angular, Laravel, .NET y contenedores Docker.'
      : 'Specialist in interface re-architecture and system modernization. I transform complex workflows into highly intuitive, bulletproof user experiences, enforcing strict brand guidelines backed by robust architectures in Angular, Laravel, .NET, and Docker containers.';
  });

  featuredProjects = computed<HighlightedProject[]>(() => {
    const lang = this.languageService.currentLanguage();
    return [
      {
        title: lang === 'es' ? 'Iris — Red Social Institucional' : 'Iris — Institutional Social Network',
        description: lang === 'es'
          ? 'Red social estudiantil para el instituto ISTPET. Como líder, estructuré y desplegué todo el ecosistema frontend y en la nube (AWS EC2/S3) en solo 33 días, con muros de publicaciones dinámicos y perfiles de usuario.'
          : 'Student social network built for ISTPET institute. As lead, engineered and deployed the entire frontend and cloud (AWS EC2/S3) environment in a 33-day timeline, featuring dynamic feeds and custom profiles.',
        tags: ['Angular', 'Laravel', 'AWS S3', 'PostgreSQL'],
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/manetao/iris'
      },
      {
        title: lang === 'es' ? 'Bioregistro — Control de Asistencia Biométrico' : 'Bioregistro — Biometric Attendance Suite',
        description: lang === 'es'
          ? 'Aplicación móvil completa para el registro y control de asistencia en una institución educativa. Cuenta con validación biométrica de huella dactilar nativa, geolocalización, mapas y base de datos con Firebase.'
          : 'Complete mobile application for student check-ins and attendance tracking inside a school. Built with Flutter and Firebase, featuring native biometric fingerprint verification, secure GPS tracking, and maps.',
        tags: ['Flutter', 'Firebase', 'Biometrics', 'Firestore'],
        image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/AlexanderMartinez0410/biometric_attendance'
      }
    ];
  });
}
