import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../shared/services/language.service';

interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  description: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent {
  languageService = inject(LanguageService);

  selectedItem = signal<ExperienceItem | null>(null);

  openModal(item: ExperienceItem) {
    this.selectedItem.set(item);
  }

  closeModal() {
    this.selectedItem.set(null);
  }

  experience = computed<ExperienceItem[]>(() => {
    const isEs = this.languageService.currentLanguage() === 'es';
    return [
      {
        year: isEs ? '2025 - Presente' : '2025 - Present',
        role: isEs ? 'Líder Frontend & Desarrollador Full-Stack' : 'Frontend Lead & Full-Stack Developer',
        company: 'ISTPET',
        description: isEs
          ? 'Responsable del rediseño y reestructuración completa de sistemas institucionales para mejorar la usabilidad final bajo manuales de marca estrictos. Lidero el desarrollo frontend en Angular integrado con backends (.NET Core, Laravel) y bases de datos relacionales, además de planificar y desplegar con éxito la red social estudiantil "Iris" en AWS (EC2/S3).'
          : 'Responsible for the complete redesign and re-architecture of institutional platforms to improve final user adoption under strict brand guidelines. Leading frontend engineering with Angular integrated with backends (.NET Core, Laravel) and relational databases, alongside successfully deploying the student social network "Iris" on AWS (EC2/S3).'
      },
      {
        year: isEs ? '2025 (Contrato)' : '2025 (Contract)',
        role: isEs ? 'Desarrollador Mobile (Freelance)' : 'Mobile Developer (Freelance)',
        company: 'Bioregistro / biometric_attendance',
        description: isEs
          ? 'Desarrollé e integré un aplicativo móvil empresarial de uso interno corporativo en Flutter y Firebase. Diseñé flujos interactivos de asistencia mediante geolocalización, autenticación biométrica nativa (registro de huella) y consumo de mapas con librerías gratuitas de código abierto.'
          : 'Developed and integrated an internal enterprise mobile application using Flutter and Firebase. Designed interactive user check-in flows backed by secure geolocation tracking, native biometric authentication (fingerprint ID), and open-source map library integration.'
      },
      {
        year: isEs ? '2024 (Prácticas Preprofesionales)' : '2024 (Pre-professional Internship)',
        role: isEs ? 'Desarrollador de Software (Prácticas)' : 'Software Developer (Internship)',
        company: 'Consejo Nacional de Competencias (CNC)',
        description: isEs
          ? 'Mi primera experiencia formal a través de prácticas preprofesionales. Implementé un sistema Help Desk para la creación y control de tickets en Ionic y Supabase, permitiendo al organismo del estado cumplir con las normativas gubernamentales obligatorias.'
          : 'My first formal professional role completed as a pre-professional internship. Implemented a Help Desk system for ticket creation and tracking using Ionic and Supabase, enabling the government agency to comply with mandatory state ticketing regulations.'
      },
      {
        year: isEs ? '2023 (Logro Competitivo)' : '2023 (Competitive Milestone)',
        role: isEs ? 'Ganador de 1er Lugar' : '1st Place Winner',
        company: 'UTC Programming Contest',
        description: isEs
          ? 'Obtuve el primer lugar en el Concurso Universitario de Programación de la UTC. Resolví retos de lógica computacional y algoritmos complejos bajo presión de tiempo extrema, diseñando e implementando con éxito un sistema interactivo de optimización de parqueaderos.'
          : 'Achieved first place in the UTC University Programming Competition. Solved complex computational logic and algorithmic challenges under extreme time constraints, successfully modeling and implementing an interactive parking lot optimization system.'
      }
    ];
  });
}
