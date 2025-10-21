import { Injectable, signal, computed } from '@angular/core';
import { Language, UITranslations } from '../models/translations.model';
import { translations } from '../data/translations';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = signal<Language>('en');

  language = this.currentLanguage.asReadonly();

  translations = computed<UITranslations>(() => translations[this.currentLanguage()]);

  getTranslations(): UITranslations {
    return translations[this.currentLanguage()];
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    localStorage.setItem('preferred-language', lang);
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'en' ? 'es' : 'en';
    this.setLanguage(newLang);
  }

  constructor() {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language') as Language;
    if (savedLang === 'en' || savedLang === 'es') {
      this.currentLanguage.set(savedLang);
    }
  }
}
