import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe, MealDBRecipe, MealDBResponse } from '../models/recipe.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

  // Signal to hold all recipes
  private recipesSignal = signal<Recipe[]>([]);
  private loadingSignal = signal<boolean>(false);
  private hasMoreSignal = signal<boolean>(true);
  private searchLetterIndex = 0;
  private readonly SEARCH_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // Public computed signal for recipes
  recipes = computed(() => this.recipesSignal());
  loading = computed(() => this.loadingSignal());
  hasMore = computed(() => this.hasMoreSignal());

  constructor() {
    this.loadRecipes();
  }

  /**
   * Transforms a MealDB recipe to our internal Recipe format
   */
  private transformMealDBRecipe(mealDBRecipe: MealDBRecipe): Recipe {
    // Extract ingredients and measurements
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = mealDBRecipe[`strIngredient${i}` as keyof MealDBRecipe] as string;
      const measure = mealDBRecipe[`strMeasure${i}` as keyof MealDBRecipe] as string;

      if (ingredient && ingredient.trim()) {
        const ingredientText = measure && measure.trim()
          ? `${measure.trim()} ${ingredient.trim()}`
          : ingredient.trim();
        ingredients.push(ingredientText);
      }
    }

    // Split instructions into steps (by period or newline)
    const instructions = mealDBRecipe.strInstructions
      .split(/\r?\n/)
      .map(step => step.trim())
      .filter(step => step.length > 0);

    // Parse tags
    const tags = mealDBRecipe.strTags
      ? mealDBRecipe.strTags.split(',').map(tag => tag.trim())
      : undefined;

    return {
      id: mealDBRecipe.idMeal,
      name: mealDBRecipe.strMeal,
      cuisine: mealDBRecipe.strArea,
      category: mealDBRecipe.strCategory,
      image: mealDBRecipe.strMealThumb,
      ingredients,
      instructions,
      youtubeUrl: mealDBRecipe.strYoutube || undefined,
      tags
    };
  }

  /**
   * Load initial recipes from TheMealDB API
   * Fetches recipes by searching with first letter
   */
  private loadRecipes(): void {
    this.loadingSignal.set(true);
    const letter = this.SEARCH_LETTERS[this.searchLetterIndex];

    this.http.get<MealDBResponse>(`${this.API_BASE_URL}/search.php?f=${letter}`).pipe(
      map(response => {
        if (!response.meals) return [];
        return response.meals.map(meal => this.transformMealDBRecipe(meal));
      }),
      catchError(() => of([]))
    ).subscribe({
      next: (recipes) => {
        this.recipesSignal.set(recipes);
        this.loadingSignal.set(false);
        this.searchLetterIndex++;
      },
      error: (error) => {
        console.error('Error loading recipes from TheMealDB:', error);
        this.recipesSignal.set([]);
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Load more recipes for infinite scroll
   */
  loadMoreRecipes(): void {
    if (this.loadingSignal() || !this.hasMoreSignal()) {
      return;
    }

    if (this.searchLetterIndex >= this.SEARCH_LETTERS.length) {
      this.hasMoreSignal.set(false);
      return;
    }

    this.loadingSignal.set(true);
    const letter = this.SEARCH_LETTERS[this.searchLetterIndex];

    this.http.get<MealDBResponse>(`${this.API_BASE_URL}/search.php?f=${letter}`).pipe(
      map(response => {
        if (!response.meals) return [];
        return response.meals.map(meal => this.transformMealDBRecipe(meal));
      }),
      catchError(() => of([]))
    ).subscribe({
      next: (newRecipes) => {
        // Filter out duplicates by ID
        const currentRecipes = this.recipesSignal();
        const existingIds = new Set(currentRecipes.map(r => r.id));
        const uniqueNewRecipes = newRecipes.filter(r => !existingIds.has(r.id));

        this.recipesSignal.set([...currentRecipes, ...uniqueNewRecipes]);
        this.loadingSignal.set(false);
        this.searchLetterIndex++;

        if (this.searchLetterIndex >= this.SEARCH_LETTERS.length) {
          this.hasMoreSignal.set(false);
        }
      },
      error: (error) => {
        console.error('Error loading more recipes:', error);
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Get a recipe by ID
   */
  getRecipeById(id: string) {
    return computed(() => this.recipesSignal().find(recipe => recipe.id === id));
  }

  /**
   * Search recipes by name
   */
  searchRecipesByName(name: string) {
    return this.http.get<MealDBResponse>(`${this.API_BASE_URL}/search.php?s=${name}`).pipe(
      map(response => {
        if (!response.meals) return [];
        return response.meals.map(meal => this.transformMealDBRecipe(meal));
      }),
      catchError(() => of([]))
    );
  }

  /**
   * Fetch a specific meal by ID from the API
   */
  fetchRecipeById(id: string) {
    return this.http.get<MealDBResponse>(`${this.API_BASE_URL}/lookup.php?i=${id}`).pipe(
      map(response => {
        if (!response.meals || response.meals.length === 0) return null;
        return this.transformMealDBRecipe(response.meals[0]);
      }),
      catchError(() => of(null))
    );
  }
}
