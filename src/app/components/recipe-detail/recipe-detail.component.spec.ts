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
    const ingredients = screen.getAllByText(/400g spaghetti/i);
    expect(ingredients.length).toBeGreaterThan(0);
    expect(ingredients[0]).toBeInTheDocument();
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

    const ingredients = await screen.findAllByText(/400g de espagueti/i);
    expect(ingredients.length).toBeGreaterThan(0);
    expect(ingredients[0]).toBeInTheDocument();
  });

  it('should update instructions to Spanish when language changes', async () => {
    await renderComponent();

    languageService.setLanguage('es');

    const instructions = await screen.findAllByText(/Hierve/i);
    expect(instructions.length).toBeGreaterThan(0);
    expect(instructions[0]).toBeInTheDocument();
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

  describe('Cooking Mode', () => {
    it('should display cooking mode button', async () => {
      await renderComponent();
      const cookingButton = screen.getByRole('button', {
        name: /Start Cooking/i,
      });
      expect(cookingButton).toBeInTheDocument();
    });

    it('should toggle cooking mode when button is clicked', async () => {
      const view = await renderComponent();
      const component = view.fixture.componentInstance;
      const cookingButton = screen.getByRole('button', {
        name: /Start Cooking/i,
      });

      expect(component.cookingMode()).toBe(false);

      cookingButton.click();
      view.fixture.detectChanges();

      expect(component.cookingMode()).toBe(true);
      expect(
        screen.getByRole('button', { name: /Exit Cooking Mode/i })
      ).toBeInTheDocument();
    });

    it('should toggle ingredient checked state in cooking mode', async () => {
      const view = await renderComponent();
      const component = view.fixture.componentInstance;

      // Enter cooking mode
      const cookingButton = screen.getByRole('button', {
        name: /Start Cooking/i,
      });
      cookingButton.click();
      view.fixture.detectChanges();

      // Toggle ingredient
      expect(component.isIngredientChecked(0)).toBe(false);
      component.toggleIngredient(0);
      expect(component.isIngredientChecked(0)).toBe(true);

      // Toggle again
      component.toggleIngredient(0);
      expect(component.isIngredientChecked(0)).toBe(false);
    });

    it('should toggle step checked state in cooking mode', async () => {
      const view = await renderComponent();
      const component = view.fixture.componentInstance;

      // Enter cooking mode
      const cookingButton = screen.getByRole('button', {
        name: /Start Cooking/i,
      });
      cookingButton.click();
      view.fixture.detectChanges();

      // Toggle step
      expect(component.isStepChecked(0)).toBe(false);
      component.toggleStep(0);
      expect(component.isStepChecked(0)).toBe(true);

      // Toggle again
      component.toggleStep(0);
      expect(component.isStepChecked(0)).toBe(false);
    });

    it('should save progress to localStorage when in cooking mode', async () => {
      const view = await renderComponent();
      const component = view.fixture.componentInstance;

      // Enter cooking mode
      const cookingButton = screen.getByRole('button', {
        name: /Start Cooking/i,
      });
      cookingButton.click();
      view.fixture.detectChanges();

      // Toggle ingredient
      component.toggleIngredient(0);
      view.fixture.detectChanges();

      // Wait for effect to run
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check localStorage
      const saved = localStorage.getItem('cooking-progress-1');
      expect(saved).toBeTruthy();
      const progress = JSON.parse(saved!);
      expect(progress.checkedIngredients).toContain(0);
    });

    it('should clear progress when exiting cooking mode', async () => {
      const view = await renderComponent();
      const component = view.fixture.componentInstance;

      // Enter cooking mode and toggle ingredient
      const cookingButton = screen.getByRole('button', {
        name: /Start Cooking/i,
      });
      cookingButton.click();
      view.fixture.detectChanges();

      component.toggleIngredient(0);
      component.toggleStep(0);
      view.fixture.detectChanges();

      // Exit cooking mode
      const exitButton = screen.getByRole('button', {
        name: /Exit Cooking Mode/i,
      });
      exitButton.click();
      view.fixture.detectChanges();

      // Check that progress is cleared
      expect(component.cookingMode()).toBe(false);
      expect(component.checkedIngredients().size).toBe(0);
      expect(component.checkedSteps().size).toBe(0);
      expect(localStorage.getItem('cooking-progress-1')).toBeNull();
    });

    it('should load saved progress from localStorage', async () => {
      // Set up saved progress
      localStorage.setItem(
        'cooking-progress-1',
        JSON.stringify({
          checkedIngredients: [0, 1],
          checkedSteps: [0],
        })
      );

      const view = await renderComponent();
      const component = view.fixture.componentInstance;

      // Check that progress is loaded
      expect(component.isIngredientChecked(0)).toBe(true);
      expect(component.isIngredientChecked(1)).toBe(true);
      expect(component.isStepChecked(0)).toBe(true);
    });

    it('should display cooking mode button in Spanish', async () => {
      await renderComponent();

      languageService.setLanguage('es');

      const cookingButton = await screen.findByRole('button', {
        name: /Empezar a Cocinar/i,
      });
      expect(cookingButton).toBeInTheDocument();
    });

    it('should display exit cooking mode button in Spanish', async () => {
      await renderComponent();

      languageService.setLanguage('es');

      // Enter cooking mode
      const cookingButton = await screen.findByRole('button', {
        name: /Empezar a Cocinar/i,
      });
      cookingButton.click();

      const exitButton = await screen.findByRole('button', {
        name: /Salir del Modo Cocinar/i,
      });
      expect(exitButton).toBeInTheDocument();
    });
  });
});
