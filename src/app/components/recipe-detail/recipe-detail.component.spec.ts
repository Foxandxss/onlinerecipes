import { ActivatedRoute, provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LanguageService } from '../../services/language.service';
import { RecipeDetailComponent } from './recipe-detail.component';

describe('RecipeDetailComponent', () => {
  let languageService: LanguageService;

  const renderComponent = async () => {
    const view = await render(RecipeDetailComponent, {
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1',
              },
            },
            params: of({ id: '1' }),
          },
        },
      ],
    });
    languageService = view.fixture.componentRef.injector.get(LanguageService);
    return view;
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', async () => {
    const view = await renderComponent();
    expect(view.container).toBeInTheDocument();
  });

  it('should load recipe by id', async () => {
    const view = await renderComponent();
    const component = view.fixture.componentInstance;
    expect(component.recipeId).toBe(1);
    expect(component.recipe()).toBeDefined();
  });

  it('should display recipe name in English by default', async () => {
    await renderComponent();
    const title = screen.getByRole('heading', {
      level: 1,
      name: /Spaghetti Carbonara/i,
    });
    expect(title).toBeInTheDocument();
  });

  it('should display cuisine in English by default', async () => {
    await renderComponent();
    expect(screen.getByText('Italian')).toBeInTheDocument();
  });

  it('should display difficulty in English by default', async () => {
    const view = await renderComponent();
    const statValues = view.container.querySelectorAll('.stat-value');
    const difficultyValue = Array.from(statValues).find((el) =>
      el.textContent?.includes('Medium')
    );
    expect(difficultyValue).toBeTruthy();
  });

  it('should display ingredients section header in English', async () => {
    await renderComponent();
    const ingredientsHeader = screen.getByRole('heading', {
      level: 2,
      name: /Ingredients/i,
    });
    expect(ingredientsHeader).toBeInTheDocument();
  });

  it('should display instructions section header in English', async () => {
    await renderComponent();
    const instructionsHeader = screen.getByRole('heading', {
      level: 2,
      name: /Instructions/i,
    });
    expect(instructionsHeader).toBeInTheDocument();
  });

  it('should display ingredients in English by default', async () => {
    await renderComponent();
    expect(screen.getByText(/400g spaghetti/i)).toBeInTheDocument();
  });

  it('should update recipe name to Spanish when language changes', async () => {
    await renderComponent();

    languageService.setLanguage('es');

    const title = await screen.findByRole('heading', {
      level: 1,
      name: /Espagueti Carbonara/i,
    });
    expect(title).toBeInTheDocument();
  });

  it('should update cuisine to Spanish when language changes', async () => {
    await renderComponent();

    languageService.setLanguage('es');

    expect(await screen.findByText('Italiana')).toBeInTheDocument();
  });

  it('should update difficulty to Spanish when language changes', async () => {
    const view = await renderComponent();

    languageService.setLanguage('es');

    await screen.findByText('Italiana'); // Wait for Spanish to load (only one in detail view)
    const statValues = view.container.querySelectorAll('.stat-value');
    const difficultyValue = Array.from(statValues).find((el) =>
      el.textContent?.includes('Media')
    );
    expect(difficultyValue).toBeTruthy();
  });

  it('should update ingredients to Spanish when language changes', async () => {
    await renderComponent();

    languageService.setLanguage('es');

    expect(await screen.findByText(/400g de espagueti/i)).toBeInTheDocument();
  });

  it('should update instructions to Spanish when language changes', async () => {
    await renderComponent();

    languageService.setLanguage('es');

    expect(await screen.findByText(/Hierve/i)).toBeInTheDocument();
  });

  it('should update UI labels to Spanish', async () => {
    await renderComponent();

    languageService.setLanguage('es');

    const ingredientsHeader = await screen.findByRole('heading', {
      level: 2,
      name: /Ingredientes/i,
    });
    const instructionsHeader = await screen.findByRole('heading', {
      level: 2,
      name: /Instrucciones/i,
    });

    expect(ingredientsHeader).toBeInTheDocument();
    expect(instructionsHeader).toBeInTheDocument();
  });

  it('should display "Prep Time" label in Spanish', async () => {
    const view = await renderComponent();

    languageService.setLanguage('es');

    await screen.findByText('Italiana'); // Wait for Spanish to load (only one in detail view)
    const statLabels = view.container.querySelectorAll('.stat-label');
    const prepTimeLabel = Array.from(statLabels).find((el) =>
      el.textContent?.includes('Tiempo de Prep')
    );
    expect(prepTimeLabel).toBeTruthy();
  });

  it('should display "Cook Time" label in Spanish', async () => {
    const view = await renderComponent();

    languageService.setLanguage('es');

    await screen.findByText('Italiana'); // Wait for Spanish to load (only one in detail view)
    const statLabels = view.container.querySelectorAll('.stat-label');
    const cookTimeLabel = Array.from(statLabels).find((el) =>
      el.textContent?.includes('Tiempo de Cocción')
    );
    expect(cookTimeLabel).toBeTruthy();
  });

  it('should display back button text in English', async () => {
    await renderComponent();
    const backButton = screen.getByRole('button', { name: /Back to Recipes/i });
    expect(backButton).toBeInTheDocument();
  });

  it('should display back button text in Spanish when language changes', async () => {
    await renderComponent();

    languageService.setLanguage('es');

    const backButton = await screen.findByRole('button', {
      name: /Volver a Recetas/i,
    });
    expect(backButton).toBeInTheDocument();
  });

  it('should have language toggle component', async () => {
    const view = await renderComponent();
    const toggle = view.container.querySelector('app-language-toggle');
    expect(toggle).toBeTruthy();
  });
});
