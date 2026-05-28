import { Component, signal, effect, inject, PLATFORM_ID } from '@angular/core';
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
    // Read theme from localStorage if on browser
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      this.isDarkMode.set(savedTheme === 'dark');
      this.updateThemeAttribute(savedTheme);
    }

    // React to dark mode changes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const theme = this.isDarkMode() ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
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
}
