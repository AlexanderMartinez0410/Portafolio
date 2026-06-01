import { Component, signal, effect, inject, PLATFORM_ID, REQUEST } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private platformId = inject(PLATFORM_ID);
  languageService = inject(LanguageService);
  
  isMobileMenuOpen = signal(false);
  isDarkMode = signal(true);

  constructor() {
    let initialTheme: 'light' | 'dark' = 'dark';

    if (isPlatformBrowser(this.platformId)) {
      // 1. Recuperar el tema desde el navegador (data-theme de html, cookie, localStorage o preferencia del sistema)
      const docTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
      const cookieTheme = this.getCookie('theme') as 'light' | 'dark' | null;
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      
      const theme = docTheme || cookieTheme || savedTheme || 
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      
      initialTheme = theme === 'light' ? 'light' : 'dark';
      this.isDarkMode.set(initialTheme === 'dark');
      this.updateThemeAttribute(initialTheme);
    } else {
      // 2. Recuperar el tema desde la petición al servidor (SSR) usando cookies
      const request = inject(REQUEST, { optional: true });
      if (request) {
        const cookieHeader = request.headers.get('cookie');
        const theme = this.getThemeFromCookies(cookieHeader);
        if (theme) {
          initialTheme = theme;
          this.isDarkMode.set(initialTheme === 'dark');
        }
      }
    }

    // Reaccionar a los cambios del tema y guardarlos tanto en localStorage como en cookie
    effect(() => {
      const isDark = this.isDarkMode();
      const theme = isDark ? 'dark' : 'light';
      
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', theme);
        document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
        this.updateThemeAttribute(theme);
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  toggleTheme() {
    this.isDarkMode.update(val => !val);
  }

  private updateThemeAttribute(theme: string) {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  private getThemeFromCookies(cookieHeader: string | null): 'light' | 'dark' | null {
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/(^|;)\s*theme\s*=\s*([^;]+)/);
    return match ? (match[2] as 'light' | 'dark') : null;
  }
}
