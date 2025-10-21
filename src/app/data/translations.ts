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
    hard: 'Hard'
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
    hard: 'Difícil'
  }
};
