/// <reference types="@testing-library/jest-dom" />
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../../services/language.service';
import { RecipeDetailComponent } from './recipe-detail.component';
import { MealDBResponse } from '../../models/recipe.model';

describe('RecipeDetailComponent', () => {
  let languageService: LanguageService;
  let httpMock: HttpTestingController;

  const mockMealDBRecipe = {
    idMeal: '1',
    strMeal: 'Teriyaki Chicken Casserole',
    strDrinkAlternate: null,
    strCategory: 'Chicken',
    strArea: 'Japanese',
    strInstructions: 'Preheat oven to 350° F.\nCombine ingredients.\nBake for 30 minutes.',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    strTags: 'Meat,Casserole',
    strYoutube: 'https://www.youtube.com/watch?v=test',
    strIngredient1: 'soy sauce',
    strIngredient2: 'water',
    strIngredient3: 'brown sugar',
    strIngredient4: '',
    strIngredient5: '',
    strIngredient6: '',
    strIngredient7: '',
    strIngredient8: '',
    strIngredient9: '',
    strIngredient10: '',
    strIngredient11: '',
    strIngredient12: '',
    strIngredient13: '',
    strIngredient14: '',
    strIngredient15: '',
    strIngredient16: '',
    strIngredient17: '',
    strIngredient18: '',
    strIngredient19: '',
    strIngredient20: '',
    strMeasure1: '3/4 cup',
    strMeasure2: '1/2 cup',
    strMeasure3: '1/4 cup',
    strMeasure4: '',
    strMeasure5: '',
    strMeasure6: '',
    strMeasure7: '',
    strMeasure8: '',
    strMeasure9: '',
    strMeasure10: '',
    strMeasure11: '',
    strMeasure12: '',
    strMeasure13: '',
    strMeasure14: '',
    strMeasure15: '',
    strMeasure16: '',
    strMeasure17: '',
    strMeasure18: '',
    strMeasure19: '',
    strMeasure20: '',
    strSource: '',
    strImageSource: null,
    strCreativeCommonsConfirmed: null,
    dateModified: null
  };

  const renderComponent = async () => {
    const view = await render(RecipeDetailComponent, {
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
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
    httpMock = TestBed.inject(HttpTestingController);

    // Mock the initial 20 random recipe requests
    const randomRequests = httpMock.match('https://www.themealdb.com/api/json/v1/1/random.php');
    randomRequests.forEach(req => {
      req.flush({ meals: [mockMealDBRecipe] } as MealDBResponse);
    });

    return view;
  };

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    localStorage.clear();
    if (httpMock) {
      httpMock.verify();
    }
    vi.restoreAllMocks();
  });

  it('should create', async () => {
    const view = await renderComponent();
    expect(view.container).toBeInTheDocument();
  });

  it('should load recipe by id', async () => {
    const view = await renderComponent();
    const component = view.fixture.componentInstance;
    expect(component.recipeId).toBe('1');
    expect(component.recipe()).toBeDefined();
  });

  it('should display recipe name', async () => {
    const view = await renderComponent();
    view.fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(screen.getByText('Teriyaki Chicken Casserole')).toBeInTheDocument();
  });

  it('should display recipe image', async () => {
    const view = await renderComponent();
    view.fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100));

    const images = view.container.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should display ingredients list', async () => {
    const view = await renderComponent();
    view.fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100));

    const ingredientsList = view.container.querySelector('.ingredients-list');
    expect(ingredientsList).toBeInTheDocument();
  });

  it('should display instructions list', async () => {
    const view = await renderComponent();
    view.fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100));

    const instructionsList = view.container.querySelector('.instructions-list');
    expect(instructionsList).toBeInTheDocument();
  });

  it('should have back button', async () => {
    const view = await renderComponent();
    const backButton = view.container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();
  });

  it('should have language toggle component', async () => {
    const view = await renderComponent();
    const toggle = view.container.querySelector('app-language-toggle');
    expect(toggle).toBeTruthy();
  });

  describe('Cooking Mode', () => {
    it('should display cooking mode button', async () => {
      const view = await renderComponent();
      const cookingButton = view.container.querySelector('.cooking-mode-button');
      expect(cookingButton).toBeInTheDocument();
    });

    it('should toggle cooking mode when button is clicked', async () => {
      const user = userEvent.setup();
      const view = await renderComponent();
      view.fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 100));

      const cookingButton = view.container.querySelector('.cooking-mode-button') as HTMLElement;
      expect(cookingButton).toBeInTheDocument();

      await user.click(cookingButton);
      view.fixture.detectChanges();

      expect(cookingButton.classList.contains('active')).toBe(true);
    });

    it('should save progress to localStorage when in cooking mode', async () => {
      const user = userEvent.setup();
      const view = await renderComponent();
      view.fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 100));

      const cookingButton = view.container.querySelector('.cooking-mode-button') as HTMLElement;
      await user.click(cookingButton);
      view.fixture.detectChanges();

      // Find and click an ingredient checkbox
      const ingredientItems = view.container.querySelectorAll('.ingredients-list li');
      if (ingredientItems.length > 0) {
        await user.click(ingredientItems[0] as HTMLElement);
        view.fixture.detectChanges();

        // Check if localStorage.setItem was called
        expect(localStorage.setItem).toHaveBeenCalled();
      }
    });

    it('should clear progress when exiting cooking mode', async () => {
      const user = userEvent.setup();
      const view = await renderComponent();
      view.fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 100));

      const cookingButton = view.container.querySelector('.cooking-mode-button') as HTMLElement;

      // Enter cooking mode
      await user.click(cookingButton);
      view.fixture.detectChanges();

      // Exit cooking mode
      await user.click(cookingButton);
      view.fixture.detectChanges();

      expect(localStorage.removeItem).toHaveBeenCalled();
    });

    it('should display cooking mode button in Spanish', async () => {
      await renderComponent();

      languageService.setLanguage('es');

      expect(await screen.findByText(/Empezar a Cocinar/i)).toBeInTheDocument();
    });

    it('should display exit cooking mode button in Spanish', async () => {
      const user = userEvent.setup();
      const view = await renderComponent();
      view.fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 100));

      languageService.setLanguage('es');
      await new Promise(resolve => setTimeout(resolve, 100));

      const cookingButton = view.container.querySelector('.cooking-mode-button') as HTMLElement;
      await user.click(cookingButton);
      view.fixture.detectChanges();

      expect(await screen.findByText(/Salir del Modo Cocina/i)).toBeInTheDocument();
    });
  });

  describe('Translations', () => {
    it('should display back button text in English', async () => {
      await renderComponent();
      expect(screen.getByText(/Back to Recipes/i)).toBeInTheDocument();
    });

    it('should display back button text in Spanish when language changes', async () => {
      await renderComponent();

      languageService.setLanguage('es');

      expect(await screen.findByText(/Volver a Recetas/i)).toBeInTheDocument();
    });
  });
});
