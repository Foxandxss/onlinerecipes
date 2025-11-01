/// <reference types="@testing-library/jest-dom" />
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LanguageService } from '../../services/language.service';
import { RecipeListComponent } from './recipe-list.component';
import { MealDBResponse } from '../../models/recipe.model';

describe('RecipeListComponent', () => {
  let languageService: LanguageService;
  let httpMock: HttpTestingController;

  const mockMealDBRecipe = {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken',
    strDrinkAlternate: null,
    strCategory: 'Chicken',
    strArea: 'Japanese',
    strInstructions: 'Preheat oven to 350° F.',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    strTags: 'Meat',
    strYoutube: 'https://www.youtube.com/watch?v=test',
    strIngredient1: 'soy sauce',
    strIngredient2: 'water',
    strIngredient3: '',
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
    strMeasure3: '',
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
    const view = await render(RecipeListComponent, {
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    languageService = view.fixture.componentRef.injector.get(LanguageService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock the 20 random recipe requests
    const requests = httpMock.match('https://www.themealdb.com/api/json/v1/1/random.php');
    requests.forEach(req => {
      req.flush({ meals: [mockMealDBRecipe] } as MealDBResponse);
    });

    return view;
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should create', async () => {
    const view = await renderComponent();
    expect(view.container).toBeInTheDocument();
  });

  it('should display title in English by default', async () => {
    await renderComponent();
    const title = screen.getByRole('heading', {
      level: 1,
      name: /Online Recipes/i,
    });
    expect(title).toBeInTheDocument();
  });

  it('should display subtitle in English by default', async () => {
    await renderComponent();
    expect(
      screen.getByText(/Discover delicious recipes from around the world/i)
    ).toBeInTheDocument();
  });

  it('should display 20 recipe cards from API', async () => {
    const view = await renderComponent();
    view.fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for async updates

    const cards = view.container.querySelectorAll('.recipe-card');
    expect(cards.length).toBe(20);
  });

  it('should display recipe with category badge', async () => {
    const view = await renderComponent();
    view.fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100));

    const categoryBadges = view.container.querySelectorAll('.category-badge');
    expect(categoryBadges.length).toBeGreaterThan(0);
  });

  it('should display cuisine badges', async () => {
    const view = await renderComponent();
    view.fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100));

    const cuisineBadges = view.container.querySelectorAll('.cuisine-badge');
    expect(cuisineBadges.length).toBeGreaterThan(0);
  });

  it('should update to Spanish when language changes', async () => {
    await renderComponent();

    languageService.setLanguage('es');

    const title = await screen.findByRole('heading', {
      level: 1,
      name: /Recetas Online/i,
    });
    expect(title).toBeInTheDocument();
  });

  it('should have language toggle component', async () => {
    const view = await renderComponent();
    const toggle = view.container.querySelector('app-language-toggle');
    expect(toggle).toBeTruthy();
  });

  it('should reactively update UI labels when toggling language', async () => {
    await renderComponent();

    // Check English content
    expect(screen.getByText(/Online Recipes/i)).toBeInTheDocument();

    // Toggle to Spanish
    languageService.setLanguage('es');

    expect(await screen.findByText(/Recetas Online/i)).toBeInTheDocument();

    // Toggle back to English
    languageService.setLanguage('en');

    expect(await screen.findByText(/Online Recipes/i)).toBeInTheDocument();
  });
});
