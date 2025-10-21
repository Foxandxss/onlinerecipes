import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.css']
})
export class LanguageToggleComponent {
  languageService = inject(LanguageService);

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
