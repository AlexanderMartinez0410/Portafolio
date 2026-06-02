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
          ? 'Lidero la reestructuración y rediseño de plataformas institucionales para más de 130 usuarios activos (docentes y alumnos), logrando interfaces más simples, limpias e incrementando la satisfacción del usuario. Adicionalmente, colaboré en un equipo de 5 integrantes asumiendo la responsabilidad principal del desarrollo frontend e integración para diseñar y desplegar con éxito la red social estudiantil "Iris" (con ~80 estudiantes registrados) en AWS (EC2/S3) en tiempo récord de 33 días.'
          : 'Leading the re-architecture and redesign of institutional platforms for over 130 active users (faculty and students), delivering simpler, cleaner interfaces and significantly increasing user satisfaction. Additionally, collaborated within a 5-member team, assuming primary responsibility for frontend development and cloud integration to successfully design and deploy the student social network "Iris" (~80 registered students) on AWS (EC2/S3) within a record-breaking 33-day timeline.'
      },
      {
        year: isEs ? '2025 (Contrato)' : '2025 (Contract)',
        role: isEs ? 'Desarrollador Mobile (Freelance)' : 'Mobile Developer (Freelance)',
        company: 'Bioregistro / biometric_attendance',
        description: isEs
          ? 'Diseñé y desarrollé desde cero una aplicación móvil nativa en Flutter y Firebase para control de asistencia, registrando exitosamente a más de 40 usuarios activos. Implementé flujos interactivos de asistencia respaldados por geolocalización, autenticación biométrica nativa (huella dactilar) y consumo de mapas con librerías gratuitas de código abierto.'
          : 'Designed and developed from scratch a native mobile application using Flutter and Firebase for attendance tracking, successfully onboarding over 40 active users. Implemented interactive check-in flows backed by secure geolocation tracking, native biometric authentication (fingerprint ID), and open-source map library integration.'
      },
      {
        year: isEs ? '2024 (Prácticas Preprofesionales)' : '2024 (Pre-professional Internship)',
        role: isEs ? 'Desarrollador de Software (Prácticas)' : 'Software Developer (Internship)',
        company: 'Consejo Nacional de Competencias (CNC)',
        description: isEs
          ? 'Desarrollé e implementé un sistema Help Desk de control de incidentes con Ionic y Supabase. Logré el 100% de cumplimiento de las normativas de auditoría estatal obligatorias y me encargué de impartir capacitaciones técnicas básicas a los usuarios finales para garantizar una adopción y transición exitosa.'
          : 'Developed and implemented a Help Desk ticket control system using Ionic and Supabase. Achieved 100% compliance with mandatory state audit regulations and personally delivered basic technical training to end-users to guarantee a smooth and successful transition.'
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
