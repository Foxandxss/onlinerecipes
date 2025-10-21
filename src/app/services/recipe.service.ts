import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import recipesData from '../data/recipes.json';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes: Recipe[] = recipesData as Recipe[];

  getRecipes(): Recipe[] {
    return this.recipes;
  }

  getRecipeById(id: number): Recipe | undefined {
    return this.recipes.find(recipe => recipe.id === id);
  }
}
