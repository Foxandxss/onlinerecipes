import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { LanguageService } from '../../services/language.service';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule, RouterModule, LanguageToggleComponent],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  languageService = inject(LanguageService);

  recipeId: number = 0;
  recipe;
  translations = this.languageService.translations;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.recipeId = idParam ? parseInt(idParam, 10) : 0;
    this.recipe = this.recipeService.getRecipeById(this.recipeId);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
