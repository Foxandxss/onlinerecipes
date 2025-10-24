import { UITranslations } from '../models/translations.model';

export const translations: Record<'en' | 'es', UITranslations> = {
  en: {
    title: 'Online Recipes',
    subtitle: 'Discover delicious recipes from around the world',
    backToRecipes: 'Back to Recipes',
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    prepTime: 'Prep Time',
    cookTime: 'Cook Time',
    servings: 'Servings',
    difficulty: 'Difficulty',
    recipeNotFound: 'Recipe not found',
    minutes: 'min',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    cookingMode: 'Cooking Mode',
    startCooking: 'Start Cooking',
    exitCooking: 'Exit Cooking Mode'
  },
  es: {
    title: 'Recetas Online',
    subtitle: 'Descubre deliciosas recetas de todo el mundo',
    backToRecipes: 'Volver a Recetas',
    ingredients: 'Ingredientes',
    instructions: 'Instrucciones',
    prepTime: 'Tiempo de Prep.',
    cookTime: 'Tiempo de Cocción',
    servings: 'Porciones',
    difficulty: 'Dificultad',
    recipeNotFound: 'Receta no encontrada',
    minutes: 'min',
    easy: 'Fácil',
    medium: 'Media',
    hard: 'Difícil',
    cookingMode: 'Modo de Cocinar',
    startCooking: 'Empezar a Cocinar',
    exitCooking: 'Salir del Modo Cocinar'
  }
};
