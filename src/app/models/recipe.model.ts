export interface Recipe {
  id: number;
  name: string;
  name_es: string;
  cuisine: string;
  cuisine_es: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  difficulty_es: string;
  image: string;
  ingredients: string[];
  ingredients_es: string[];
  instructions: string[];
  instructions_es: string[];
}
