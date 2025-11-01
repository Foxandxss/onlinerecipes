import { Component, inject, HostListener, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { LanguageService } from '../../services/language.service';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

@Component({
  selector: 'app-recipe-list',
  imports: [CommonModule, RouterModule, LanguageToggleComponent, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent {
  private recipeService = inject(RecipeService);
  languageService = inject(LanguageService);

  allRecipes = this.recipeService.recipes;
  loading = this.recipeService.loading;
  hasMore = this.recipeService.hasMore;
  translations = this.languageService.translations;

  searchQuery = signal<string>('');

  // Filtered recipes based on search query
  recipes = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.allRecipes();
    }
    return this.allRecipes().filter(recipe =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.cuisine.toLowerCase().includes(query) ||
      recipe.category.toLowerCase().includes(query) ||
      recipe.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  @HostListener('window:scroll')
  onScroll(): void {
    // Check if user is near the bottom of the page
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.documentElement.scrollHeight - 500; // 500px before bottom

    if (scrollPosition >= bottomPosition && !this.loading() && this.hasMore() && !this.searchQuery()) {
      this.recipeService.loadMoreRecipes();
    }
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }
}
