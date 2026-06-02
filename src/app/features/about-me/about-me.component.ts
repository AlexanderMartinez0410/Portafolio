import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../shared/services/language.service';

interface SkillCategory {
  title: string;
  skills: string[];
}

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent {
  languageService = inject(LanguageService);

  biography = computed(() => {
    return this.languageService.currentLanguage() === 'es'
      ? "¡Hola! Soy Alexander Martínez, Full-Stack Developer (Angular / .NET Core) y actual estudiante de Ingeniería de Software en la UPS. Creo firmemente que el desarrollo de software de excelencia nace en la intersección entre la rigurosidad técnica y la empatía con las personas. Combinando buenas prácticas (QA meticuloso, seguridad de datos y entornos contenerizados con Docker) con un enfoque cercano, busco construir interfaces que no solo sean eficientes y estables, sino que también alegren y simplifiquen el día a día de quienes las usan."
      : "Hi! I'm Alexander Martínez, a Full-Stack Developer (Angular / .NET Core) and Software Engineering student at UPS. I strongly believe that excellent software development is born at the intersection of technical discipline and human empathy. By combining clean coding standards (rigorous QA, secure databases, and containerized Docker setups) with a warm and approachable perspective, I aim to craft systems that are not only robust and highly efficient, but also genuinely delightful and easy for real people to use.";
  });

  biographySecond = computed(() => {
    return this.languageService.currentLanguage() === 'es'
      ? "Detrás del código hay una parte muy humana: disfruto muchísimo ayudar a otros y enseñar, lo cual me ha enseñado sobre paciencia, empatía y comunicación clara en equipos de trabajo. Además, me apasiona el anime y la cultura otaku, juego videojuegos y disfruto un montón de la música; pasatiempos que mantienen mi creatividad al máximo al momento de diseñar interfaces interactivas."
      : "Beyond the screen, I have a very human side: I truly enjoy helping others and teaching—which has taught me endless patience, empathy, and clear communication within teams. I'm also passionate about anime and otaku culture, love playing video games, and enjoy music; hobbies that constantly fuel my creative spark when designing interactive user interfaces.";
  });

  biographyThird = computed(() => {
    return this.languageService.currentLanguage() === 'es'
      ? "Además, me entusiasma liderar el desarrollo potenciado por Inteligencia Artificial. Domino la ingeniería de prompts y la integro estratégicamente con herramientas generativas y Gemini CLI para prototipar e iterar ideas a la velocidad de la luz. El diseño de este portafolio estilo consola interactiva refleja precisamente esta filosofía: mi pasión por la informática pura, la terminal de comandos y el desarrollo de sistemas robustos desde su núcleo."
      : "Additionally, I am excited to pioneer AI-assisted development. I have a strong command of prompt engineering and strategically leverage it alongside generative tools and Gemini CLI to prototype and iterate ideas at lightning speed. The interactive console-style design of this portfolio perfectly reflects this mindset: my passion for pure computing, command-line terminals, and building robust systems from their very core.";
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
        title: isEs ? 'Especialidades & AI Co-Creation' : 'Specializations & AI Co-Creation',
        skills: ['System UX', 'QA Engineering', 'Prompt Engineering', 'AI Co-Creation', 'Gemini CLI', 'Secure DB']
      },
      {
        title: isEs ? 'Idiomas & Próximas Metas' : 'Languages & Future Milestones',
        skills: [
          isEs ? 'Inglés: B1 (Técnico / Intermedio)' : 'English: B1 (Technical / Intermediate)',
          isEs ? 'Ruta AWS Cloud Practitioner (En curso)' : 'AWS Cloud Practitioner Path (In Progress)',
          isEs ? 'Preparación Scrum Master (Meta 2026)' : 'Scrum Master Prep (2026 Goal)'
        ]
      }
    ];
  });
}
