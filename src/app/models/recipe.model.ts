export interface Recipe {
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
