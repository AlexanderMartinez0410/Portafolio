import { Component, inject, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LanguageService } from './shared/services/language.service';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  languageService = inject(LanguageService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  private biosRunning = false;
  showNeofetchModal = false;

  onCliSubmit(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim().toLowerCase();
    if (!value) return;

    input.value = '';

    const isEs = this.languageService.currentLanguage() === 'es';

    if (value === 'help' || value === 'ayuda') {
      const msg = isEs 
        ? "Comandos disponibles:\n- cd [inicio | sobre-mi | proyectos | experiencia | contacto]\n- neofetch\n- theme [light | dark]\n- clear" 
        : "Available commands:\n- cd [home | about-me | projects | experience | contact]\n- neofetch\n- theme [light | dark]\n- clear";
      alert(msg);
    } else if (value === 'neofetch') {
      this.showNeofetchModal = true;
    } else if (value.startsWith('cd ')) {
      const dest = value.substring(3).trim();
      if (dest === 'inicio' || dest === 'home' || dest === 'root') {
        this.router.navigate(['/']);
      } else if (dest === 'sobre-mi' || dest === 'about' || dest === 'about-me') {
        this.router.navigate(['/about-me']);
      } else if (dest === 'proyectos' || dest === 'projects') {
        this.router.navigate(['/projects']);
      } else if (dest === 'experiencia' || dest === 'experience') {
        this.router.navigate(['/experience']);
      } else if (dest === 'contacto' || dest === 'contact') {
        this.router.navigate(['/contact']);
      } else {
        alert(isEs ? `Directorio no encontrado: ${dest}` : `Directory not found: ${dest}`);
      }
    } else if (value.startsWith('theme ')) {
      const theme = value.substring(6).trim();
      if (theme === 'light' || theme === 'claro') {
        this.setTheme(false);
      } else if (theme === 'dark' || theme === 'oscuro') {
        this.setTheme(true);
      } else {
        alert(isEs ? `Tema inválido. Usa 'light' o 'dark'` : `Invalid theme. Use 'light' or 'dark'`);
      }
    } else if (value === 'clear') {
      // Clear action
    } else {
      alert(isEs 
        ? `Comando no reconocido: '${value}'. Escribe 'ayuda' para ver los comandos.` 
        : `Command not recognized: '${value}'. Type 'help' to see commands.`);
    }
  }

  private setTheme(dark: boolean) {
    if (typeof document !== 'undefined') {
      const theme = dark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      try {
        localStorage.setItem('theme', theme);
        document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
      } catch (e) {}
      window.location.reload();
    }
  }

  ngAfterViewInit(): void {
    // Definitive safety check for browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined' && !!document.querySelectorAll) {
      // Organic CRT flickering using GSAP
      gsap.to('.crt-overlay', {
        opacity: 'random(0.08, 0.14)',
        duration: 0.12,
        repeat: -1,
        yoyo: true,
        ease: 'none'
      });

      // Dynamic Glitch Jitter effect on hovered directory links and buttons
      const glitchElements = document.querySelectorAll('.directory-list a, .ssh-card, .btn-primary, .btn-secondary');
      glitchElements.forEach(el => {
        el.classList.add('glitch-hover');
        el.addEventListener('mouseenter', () => {
          gsap.timeline()
            .to(el, { x: 'random(-3, 3)', y: 'random(-2, 2)', duration: 0.05, repeat: 2, yoyo: true })
            .to(el, { x: 0, y: 0, duration: 0.05 });
        });
      });

      // Listen to navigation events to animate terminal typing prompt
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.animateCommandTyping(event.urlAfterRedirects || event.url);
      });

      // Handle BIOS boot sequence (safe for Private/Incognito modes and SSR)
      let hasBooted = null;
      try {
        hasBooted = sessionStorage.getItem('bios_booted');
      } catch (e) {
        // Fallback: If sessionStorage access is blocked by browser security policy (e.g. Incognito)
        hasBooted = 'true';
      }

      const biosOverlay = document.querySelector('.bios-overlay') as HTMLElement;
      const biosLines = document.querySelectorAll('.bios-line');

      if (hasBooted && biosOverlay) {
        // Already booted in this session: hide overlay immediately
        biosOverlay.style.display = 'none';
        this.biosRunning = false;
        this.animateCommandTyping(this.router.url);
      } else if (biosOverlay && biosLines.length) {
        // First boot: play BIOS animation sequence
        this.biosRunning = true;
        biosOverlay.style.display = 'flex'; // Show only when playing animation
        
        // Safety timeout to guarantee overlay is removed even if animation hangs
        const safetyTimeout = setTimeout(() => {
          this.biosRunning = false;
          biosOverlay.style.display = 'none';
          try {
            sessionStorage.setItem('bios_booted', 'true');
          } catch (e) {}
          this.animateCommandTyping(this.router.url);
        }, 3000);

        const biosTl = gsap.timeline({
          onComplete: () => {
            clearTimeout(safetyTimeout);
            gsap.to(biosOverlay, {
              opacity: 0,
              duration: 0.35,
              ease: 'power2.inOut',
              onComplete: () => {
                this.biosRunning = false;
                biosOverlay.style.display = 'none';
                try {
                  sessionStorage.setItem('bios_booted', 'true');
                } catch (e) {}
                this.animateCommandTyping(this.router.url);
              }
            });
          }
        });

        // Sequence bios logs appearing
        biosTl.to(biosLines, {
          opacity: 1,
          duration: 0.01,
          stagger: 0.04
        });

        // Pause briefly on ready state
        biosTl.to({}, { duration: 0.5 });
      } else {
        // Element not found: fallback to regular navigation typing
        if (biosOverlay) {
          biosOverlay.style.display = 'none';
        }
        this.biosRunning = false;
        this.animateCommandTyping(this.router.url);
      }
    }
  }

  private getCommandForUrl(url: string): string {
    const isEs = this.languageService.currentLanguage() === 'es';
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    if (cleanUrl === '/' || cleanUrl === '') {
      return isEs ? 'cd root/inicio/' : 'cd root/home/';
    } else if (cleanUrl.includes('about-me')) {
      return isEs ? 'cd root/sobre-mi/' : 'cd root/about/';
    } else if (cleanUrl.includes('experience')) {
      return isEs ? 'cd root/experiencia/' : 'cd root/experience/';
    } else if (cleanUrl.includes('projects')) {
      return isEs ? 'cd root/proyectos/' : 'cd root/projects/';
    } else if (cleanUrl.includes('contact')) {
      return isEs ? 'cd root/contacto/' : 'cd root/contact/';
    }
    return `cd root${cleanUrl}`;
  }

  private animateCommandTyping(url: string) {
    if (typeof window === 'undefined' || typeof document === 'undefined' || this.biosRunning) return;
    
    const targetText = this.getCommandForUrl(url);
    const textContainer = document.querySelector('.terminal-command-text');
    const contentWrapper = document.querySelector('.router-content-wrapper');
    
    if (!textContainer || !contentWrapper) return;
    
    gsap.killTweensOf(textContainer);
    gsap.killTweensOf(contentWrapper);
    
    const obj = { charIndex: 0 };
    
    gsap.to(obj, {
      charIndex: targetText.length,
      duration: Math.max(0.08, targetText.length * 0.012), // fast parallel typing
      ease: 'none',
      onUpdate: () => {
        textContainer.textContent = targetText.slice(0, Math.floor(obj.charIndex));
      }
    });
  }
}



