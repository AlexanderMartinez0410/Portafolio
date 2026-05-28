import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private platformId = inject(PLATFORM_ID);
  
  // Default language is Spanish ('es') for a personalized Ecuadorian context, can switch to English ('en')
  currentLanguage = signal<'en' | 'es'>('es');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('language') as 'en' | 'es';
      if (savedLang === 'en' || savedLang === 'es') {
        this.currentLanguage.set(savedLang);
      }
    }
  }

  setLanguage(lang: 'en' | 'es') {
    this.currentLanguage.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
    }
  }

  toggleLanguage() {
    this.setLanguage(this.currentLanguage() === 'en' ? 'es' : 'en');
  }
}
