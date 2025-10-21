import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageToggleComponent } from './language-toggle.component';
import { LanguageService } from '../../services/language.service';

describe('LanguageToggleComponent', () => {
  let component: LanguageToggleComponent;
  let fixture: ComponentFixture<LanguageToggleComponent>;
  let languageService: LanguageService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LanguageToggleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageToggleComponent);
    component = fixture.componentInstance;
    languageService = TestBed.inject(LanguageService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display EN when current language is English', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.language-toggle span');
    expect(button?.textContent?.trim()).toBe('EN');
  });

  it('should display ES when current language is Spanish', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.language-toggle span');
    expect(button?.textContent?.trim()).toBe('ES');
  });

  it('should toggle language when clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.language-toggle') as HTMLButtonElement;

    expect(languageService.language()).toBe('en');
    button.click();
    expect(languageService.language()).toBe('es');
  });

  it('should update button text after toggle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.language-toggle') as HTMLButtonElement;
    const span = compiled.querySelector('.language-toggle span');

    expect(span?.textContent?.trim()).toBe('EN');

    button.click();
    fixture.detectChanges();

    expect(span?.textContent?.trim()).toBe('ES');
  });

  it('should toggle back to English from Spanish', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.language-toggle') as HTMLButtonElement;

    expect(languageService.language()).toBe('es');
    button.click();
    expect(languageService.language()).toBe('en');
  });
});
