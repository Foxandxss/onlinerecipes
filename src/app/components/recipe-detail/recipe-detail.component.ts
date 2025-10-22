import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { LanguageService } from '../../services/language.service';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';

interface CookingProgress {
  checkedIngredients: Set<number>;
  checkedSteps: Set<number>;
}

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule, RouterModule, LanguageToggleComponent, Tabs, TabList, Tab, TabPanels, TabPanel, Checkbox, Button],
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

  // Cooking mode state
  cookingMode = signal<boolean>(false);
  checkedIngredients = signal<Set<number>>(new Set());
  checkedSteps = signal<Set<number>>(new Set());

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.recipeId = idParam ? parseInt(idParam, 10) : 0;
    this.recipe = this.recipeService.getRecipeById(this.recipeId);

    // Load cooking progress from localStorage
    this.loadCookingProgress();

    // Save cooking progress when it changes
    effect(() => {
      if (this.cookingMode()) {
        this.saveCookingProgress();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  toggleCookingMode(): void {
    const newMode = !this.cookingMode();
    this.cookingMode.set(newMode);

    if (!newMode) {
      // Clear progress when exiting cooking mode
      this.checkedIngredients.set(new Set());
      this.checkedSteps.set(new Set());
      this.clearCookingProgress();
    }
  }

  toggleIngredient(index: number): void {
    const current = new Set(this.checkedIngredients());
    if (current.has(index)) {
      current.delete(index);
    } else {
      current.add(index);
    }
    this.checkedIngredients.set(current);
  }

  toggleStep(index: number): void {
    const current = new Set(this.checkedSteps());
    if (current.has(index)) {
      current.delete(index);
    } else {
      current.add(index);
    }
    this.checkedSteps.set(current);
  }

  isIngredientChecked(index: number): boolean {
    return this.checkedIngredients().has(index);
  }

  isStepChecked(index: number): boolean {
    return this.checkedSteps().has(index);
  }

  private getStorageKey(): string {
    return `cooking-progress-${this.recipeId}`;
  }

  private saveCookingProgress(): void {
    const progress: CookingProgress = {
      checkedIngredients: this.checkedIngredients(),
      checkedSteps: this.checkedSteps()
    };
    localStorage.setItem(
      this.getStorageKey(),
      JSON.stringify({
        checkedIngredients: Array.from(progress.checkedIngredients),
        checkedSteps: Array.from(progress.checkedSteps)
      })
    );
  }

  private loadCookingProgress(): void {
    const saved = localStorage.getItem(this.getStorageKey());
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        this.checkedIngredients.set(new Set(progress.checkedIngredients || []));
        this.checkedSteps.set(new Set(progress.checkedSteps || []));
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }

  private clearCookingProgress(): void {
    localStorage.removeItem(this.getStorageKey());
  }
}
