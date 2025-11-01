import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RecipeService } from './recipe.service';
import { MealDBResponse } from '../models/recipe.model';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;

  const mockMealDBRecipe = {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strDrinkAlternate: null,
    strCategory: 'Chicken',
    strArea: 'Japanese',
    strInstructions: 'Preheat oven to 350° F.\nCombine soy sauce, ½ cup water, brown sugar, ginger and garlic in a small saucepan and cover.',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    strTags: 'Meat,Casserole',
    strYoutube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
    strIngredient1: 'soy sauce',
    strIngredient2: 'water',
    strIngredient3: 'brown sugar',
    strIngredient4: 'ground ginger',
    strIngredient5: 'garlic',
    strIngredient6: 'cornstarch',
    strIngredient7: 'chicken breasts',
    strIngredient8: 'stir-fry vegetables',
    strIngredient9: 'brown rice',
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
    strMeasure4: '1/2 teaspoon',
    strMeasure5: '1/2 teaspoon',
    strMeasure6: '4 Tablespoons',
    strMeasure7: '2',
    strMeasure8: '1 (12 oz.)',
    strMeasure9: '3 cups',
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RecipeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock the 20 random recipe requests made in loadRecipes()
    const requests = httpMock.match('https://www.themealdb.com/api/json/v1/1/random.php');
    requests.forEach(req => {
      req.flush({ meals: [mockMealDBRecipe] } as MealDBResponse);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load 20 recipes on initialization', () => {
    const recipes = service.recipes();
    expect(recipes.length).toBe(20);
  });

  it('should transform MealDB recipe correctly', () => {
    const recipes = service.recipes();
    const recipe = recipes[0];

    expect(recipe.id).toBe('52772');
    expect(recipe.name).toBe('Teriyaki Chicken Casserole');
    expect(recipe.cuisine).toBe('Japanese');
    expect(recipe.category).toBe('Chicken');
    expect(recipe.image).toBe('https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg');
  });

  it('should combine ingredients with measurements', () => {
    const recipes = service.recipes();
    const recipe = recipes[0];

    expect(recipe.ingredients).toContain('3/4 cup soy sauce');
    expect(recipe.ingredients).toContain('1/2 cup water');
    expect(recipe.ingredients).toContain('1/4 cup brown sugar');
  });

  it('should parse tags correctly', () => {
    const recipes = service.recipes();
    const recipe = recipes[0];

    expect(recipe.tags).toBeDefined();
    expect(recipe.tags).toContain('Meat');
    expect(recipe.tags).toContain('Casserole');
  });

  it('should include YouTube URL when available', () => {
    const recipes = service.recipes();
    const recipe = recipes[0];

    expect(recipe.youtubeUrl).toBe('https://www.youtube.com/watch?v=4aZr5hZXP_s');
  });

  it('should find recipe by id', () => {
    const recipe = service.getRecipeById('52772');
    expect(recipe()?.id).toBe('52772');
    expect(recipe()?.name).toBe('Teriyaki Chicken Casserole');
  });

  it('should return undefined for non-existent recipe id', () => {
    const recipe = service.getRecipeById('999');
    expect(recipe()).toBeUndefined();
  });
});
