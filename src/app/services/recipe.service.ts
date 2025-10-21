import { Injectable, inject, computed } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import recipesData from '../data/recipes.json';
import { LanguageService } from './language.service';

export interface LocalizedRecipe {
  id: number;
  name: string;
  cuisine: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  image: string;
  ingredients: string[];
  instructions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private languageService = inject(LanguageService);
  private recipes: Recipe[] = recipesData as Recipe[];

  private localizedRecipes = computed<LocalizedRecipe[]>(() => {
    const lang = this.languageService.language();
    return this.recipes.map(recipe => this.getLocalizedRecipe(recipe, lang));
  });

  private getLocalizedRecipe(recipe: Recipe, lang: 'en' | 'es'): LocalizedRecipe {
    if (lang === 'es') {
      return {
        id: recipe.id,
        name: recipe.name_es,
        cuisine: recipe.cuisine_es,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty_es,
        image: recipe.image,
        ingredients: recipe.ingredients_es,
        instructions: recipe.instructions_es
      };
    }
    return {
      id: recipe.id,
      name: recipe.name,
      cuisine: recipe.cuisine,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      image: recipe.image,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions
    };
  }

  getRecipes = computed(() => this.localizedRecipes());

  getRecipeById(id: number) {
    return computed(() => this.localizedRecipes().find(recipe => recipe.id === id));
  }
}
