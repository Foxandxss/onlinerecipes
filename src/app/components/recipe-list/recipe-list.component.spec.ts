import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeListComponent } from './recipe-list.component';
import { LanguageService } from '../../services/language.service';
import { RecipeService } from '../../services/recipe.service';
import { provideRouter } from '@angular/router';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let languageService: LanguageService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RecipeListComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeListComponent);
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

  it('should display title in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent).toContain('Online Recipes');
  });

  it('should display subtitle in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtitle = compiled.querySelector('.subtitle');
    expect(subtitle?.textContent).toContain('Discover delicious recipes from around the world');
  });

  it('should display 10 recipe cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.recipe-card');
    expect(cards.length).toBe(10);
  });

  it('should display recipe names in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstRecipeName = compiled.querySelector('.recipe-card h2');
    expect(firstRecipeName?.textContent).toContain('Spaghetti Carbonara');
  });

  it('should display cuisine badges in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstCuisine = compiled.querySelector('.cuisine-badge');
    expect(firstCuisine?.textContent).toContain('Italian');
  });

  it('should display difficulty in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const difficulties = compiled.querySelectorAll('.difficulty');
    const hasMedium = Array.from(difficulties).some(d => d.textContent?.includes('Medium'));
    expect(hasMedium).toBe(true);
  });

  it('should update to Spanish when language changes', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent).toContain('Recetas Online');
  });

  it('should display recipe names in Spanish when language is Spanish', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const firstRecipeName = compiled.querySelector('.recipe-card h2');
    expect(firstRecipeName?.textContent).toContain('Espagueti Carbonara');
  });

  it('should display cuisine badges in Spanish when language is Spanish', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const firstCuisine = compiled.querySelector('.cuisine-badge');
    expect(firstCuisine?.textContent).toContain('Italiana');
  });

  it('should display difficulty in Spanish when language is Spanish', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const difficulties = compiled.querySelectorAll('.difficulty');
    const hasMedia = Array.from(difficulties).some(d => d.textContent?.includes('Media'));
    const hasFacil = Array.from(difficulties).some(d => d.textContent?.includes('Fácil'));
    expect(hasMedia || hasFacil).toBe(true);
  });

  it('should display "servings" label in Spanish', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const metaItems = compiled.querySelectorAll('.meta-item');
    const hasServings = Array.from(metaItems).some(item =>
      item.textContent?.toLowerCase().includes('porciones')
    );
    expect(hasServings).toBe(true);
  });

  it('should have language toggle component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector('app-language-toggle');
    expect(toggle).toBeTruthy();
  });

  it('should reactively update all recipe content when toggling language', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Check English content
    let firstRecipeName = compiled.querySelector('.recipe-card h2');
    let firstCuisine = compiled.querySelector('.cuisine-badge');
    expect(firstRecipeName?.textContent).toContain('Spaghetti Carbonara');
    expect(firstCuisine?.textContent).toContain('Italian');

    // Toggle to Spanish
    languageService.setLanguage('es');
    fixture.detectChanges();

    // Check Spanish content
    firstRecipeName = compiled.querySelector('.recipe-card h2');
    firstCuisine = compiled.querySelector('.cuisine-badge');
    expect(firstRecipeName?.textContent).toContain('Espagueti Carbonara');
    expect(firstCuisine?.textContent).toContain('Italiana');

    // Toggle back to English
    languageService.setLanguage('en');
    fixture.detectChanges();

    // Check English content again
    firstRecipeName = compiled.querySelector('.recipe-card h2');
    firstCuisine = compiled.querySelector('.cuisine-badge');
    expect(firstRecipeName?.textContent).toContain('Spaghetti Carbonara');
    expect(firstCuisine?.textContent).toContain('Italian');
  });
});
