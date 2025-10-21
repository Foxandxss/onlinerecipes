import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { RecipeService } from './recipe.service';
import { LanguageService } from './language.service';

describe('RecipeService', () => {
  let service: RecipeService;
  let languageService: LanguageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeService);
    languageService = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 10 recipes', () => {
    const recipes = service.getRecipes;
    expect(recipes().length).toBe(10);
  });

  it('should return recipes in English by default', () => {
    const recipes = service.getRecipes;
    const firstRecipe = recipes()[0];

    expect(firstRecipe.name).toBe('Spaghetti Carbonara');
    expect(firstRecipe.cuisine).toBe('Italian');
    expect(firstRecipe.difficulty).toBe('Medium');
  });

  it('should return recipes in Spanish when language is Spanish', () => {
    languageService.setLanguage('es');
    const recipes = service.getRecipes;
    const firstRecipe = recipes()[0];

    expect(firstRecipe.name).toBe('Espagueti Carbonara');
    expect(firstRecipe.cuisine).toBe('Italiana');
    expect(firstRecipe.difficulty).toBe('Media');
  });

  it('should reactively update recipes when language changes', () => {
    const recipes = service.getRecipes;
    let firstRecipe = recipes()[0];
    expect(firstRecipe.name).toBe('Spaghetti Carbonara');

    languageService.setLanguage('es');
    firstRecipe = recipes()[0];
    expect(firstRecipe.name).toBe('Espagueti Carbonara');
  });

  it('should find recipe by id', () => {
    const recipe = service.getRecipeById(1);
    expect(recipe()?.id).toBe(1);
    expect(recipe()?.name).toBe('Spaghetti Carbonara');
  });

  it('should return undefined for non-existent recipe id', () => {
    const recipe = service.getRecipeById(999);
    expect(recipe()).toBeUndefined();
  });

  it('should return recipe with correct ingredients in English', () => {
    const recipe = service.getRecipeById(1);
    const ingredients = recipe()?.ingredients || [];

    expect(ingredients).toContain('400g spaghetti');
    expect(ingredients).toContain('200g pancetta or guanciale');
  });

  it('should return recipe with correct ingredients in Spanish', () => {
    languageService.setLanguage('es');
    const recipe = service.getRecipeById(1);
    const ingredients = recipe()?.ingredients || [];

    expect(ingredients).toContain('400g de espagueti');
    expect(ingredients).toContain('200g de pancetta o guanciale');
  });

  it('should return recipe with correct instructions in Spanish', () => {
    languageService.setLanguage('es');
    const recipe = service.getRecipeById(1);
    const instructions = recipe()?.instructions || [];

    expect(instructions[0]).toContain('Hierve una olla grande de agua con sal');
  });

  it('should translate all cuisines correctly', () => {
    const recipes = service.getRecipes;
    const italianRecipe = recipes().find(r => r.id === 1);
    const indianRecipe = recipes().find(r => r.id === 2);
    const americanRecipe = recipes().find(r => r.id === 3);

    expect(italianRecipe?.cuisine).toBe('Italian');
    expect(indianRecipe?.cuisine).toBe('Indian');
    expect(americanRecipe?.cuisine).toBe('American');

    languageService.setLanguage('es');
    const recipesEs = service.getRecipes;
    const italianRecipeEs = recipesEs().find(r => r.id === 1);
    const indianRecipeEs = recipesEs().find(r => r.id === 2);
    const americanRecipeEs = recipesEs().find(r => r.id === 3);

    expect(italianRecipeEs?.cuisine).toBe('Italiana');
    expect(indianRecipeEs?.cuisine).toBe('India');
    expect(americanRecipeEs?.cuisine).toBe('Americana');
  });

  it('should translate all difficulty levels correctly', () => {
    const recipes = service.getRecipes;
    const easyRecipe = recipes().find(r => r.difficulty === 'Easy');
    const mediumRecipe = recipes().find(r => r.difficulty === 'Medium');

    expect(easyRecipe).toBeDefined();
    expect(mediumRecipe).toBeDefined();

    languageService.setLanguage('es');
    const recipesEs = service.getRecipes;
    const easyRecipeEs = recipesEs().find(r => r.difficulty === 'Fácil');
    const mediumRecipeEs = recipesEs().find(r => r.difficulty === 'Media');

    expect(easyRecipeEs).toBeDefined();
    expect(mediumRecipeEs).toBeDefined();
  });
});
