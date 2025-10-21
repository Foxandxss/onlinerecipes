import { Route } from '@angular/router';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: RecipeListComponent
  },
  {
    path: 'recipe/:id',
    component: RecipeDetailComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
