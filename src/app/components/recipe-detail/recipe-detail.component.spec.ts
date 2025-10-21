import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeDetailComponent } from './recipe-detail.component';
import { LanguageService } from '../../services/language.service';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let languageService: LanguageService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RecipeDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            },
            params: of({ id: '1' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeDetailComponent);
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

  it('should load recipe by id', () => {
    expect(component.recipeId).toBe(1);
    expect(component.recipe()).toBeDefined();
  });

  it('should display recipe name in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent).toContain('Spaghetti Carbonara');
  });

  it('should display cuisine in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cuisine = compiled.querySelector('.cuisine-badge');
    expect(cuisine?.textContent).toContain('Italian');
  });

  it('should display difficulty in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const statValues = compiled.querySelectorAll('.stat-value');
    const difficultyValue = Array.from(statValues).find(el =>
      el.textContent?.includes('Medium')
    );
    expect(difficultyValue).toBeTruthy();
  });

  it('should display ingredients section header in English', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ingredientsHeader = Array.from(compiled.querySelectorAll('h2')).find(h2 =>
      h2.textContent?.includes('Ingredients')
    );
    expect(ingredientsHeader).toBeTruthy();
  });

  it('should display instructions section header in English', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const instructionsHeader = Array.from(compiled.querySelectorAll('h2')).find(h2 =>
      h2.textContent?.includes('Instructions')
    );
    expect(instructionsHeader).toBeTruthy();
  });

  it('should display ingredients in English by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ingredients = compiled.querySelector('.ingredients-list');
    expect(ingredients?.textContent).toContain('400g spaghetti');
  });

  it('should update recipe name to Spanish when language changes', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');
    expect(title?.textContent).toContain('Espagueti Carbonara');
  });

  it('should update cuisine to Spanish when language changes', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cuisine = compiled.querySelector('.cuisine-badge');
    expect(cuisine?.textContent).toContain('Italiana');
  });

  it('should update difficulty to Spanish when language changes', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const statValues = compiled.querySelectorAll('.stat-value');
    const difficultyValue = Array.from(statValues).find(el =>
      el.textContent?.includes('Media')
    );
    expect(difficultyValue).toBeTruthy();
  });

  it('should update ingredients to Spanish when language changes', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const ingredients = compiled.querySelector('.ingredients-list');
    expect(ingredients?.textContent).toContain('400g de espagueti');
  });

  it('should update instructions to Spanish when language changes', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const instructions = compiled.querySelector('.instructions-list');
    expect(instructions?.textContent).toContain('Hierve');
  });

  it('should update UI labels to Spanish', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const ingredientsHeader = Array.from(compiled.querySelectorAll('h2')).find(h2 =>
      h2.textContent?.includes('Ingredientes')
    );
    const instructionsHeader = Array.from(compiled.querySelectorAll('h2')).find(h2 =>
      h2.textContent?.includes('Instrucciones')
    );

    expect(ingredientsHeader).toBeTruthy();
    expect(instructionsHeader).toBeTruthy();
  });

  it('should display "Prep Time" label in Spanish', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const statLabels = compiled.querySelectorAll('.stat-label');
    const prepTimeLabel = Array.from(statLabels).find(el =>
      el.textContent?.includes('Tiempo de Prep')
    );
    expect(prepTimeLabel).toBeTruthy();
  });

  it('should display "Cook Time" label in Spanish', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const statLabels = compiled.querySelectorAll('.stat-label');
    const cookTimeLabel = Array.from(statLabels).find(el =>
      el.textContent?.includes('Tiempo de Cocción')
    );
    expect(cookTimeLabel).toBeTruthy();
  });

  it('should display back button text in English', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('.back-button');
    expect(backButton?.textContent).toContain('Back to Recipes');
  });

  it('should display back button text in Spanish when language changes', () => {
    languageService.setLanguage('es');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('.back-button');
    expect(backButton?.textContent).toContain('Volver a Recetas');
  });

  it('should have language toggle component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector('app-language-toggle');
    expect(toggle).toBeTruthy();
  });
});
