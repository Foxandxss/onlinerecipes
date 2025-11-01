import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { LanguageService } from '../../services/language.service';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

@Component({
  selector: 'app-recipe-list',
  imports: [CommonModule, RouterModule, LanguageToggleComponent],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent {
  private recipeService = inject(RecipeService);
  languageService = inject(LanguageService);

  recipes = this.recipeService.recipes;
  translations = this.languageService.translations;
}
