/// <reference types="@testing-library/jest-dom" />
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LanguageService } from '../../services/language.service';
import { RecipeListComponent } from './recipe-list.component';

describe('RecipeListComponent', () => {
  let languageService: LanguageService;

  const renderComponent = async () => {
    const view = await render(RecipeListComponent, {
      providers: [provideRouter([])],
    });
    languageService = view.fixture.componentRef.injector.get(LanguageService);
    return view;
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', async () => {
    const view = await renderComponent();
    expect(view.container).toBeInTheDocument();
  });

  it('should display title in English by default', async () => {
    await renderComponent();
    const title = screen.getByRole('heading', {
      level: 1,
      name: /Online Recipes/i,
    });
    expect(title).toBeInTheDocument();
  });

  it('should display subtitle in English by default', async () => {
    await renderComponent();
    expect(
      screen.getByText(/Discover delicious recipes from around the world/i)
    ).toBeInTheDocument();
  });

  it('should display 10 recipe cards', async () => {
    const view = await renderComponent();
    const cards = view.container.querySelectorAll('.recipe-card');
    expect(cards.length).toBe(10);
  });

  it('should display recipe names in English by default', async () => {
    await renderComponent();
    expect(
      screen.getByRole('heading', { level: 2, name: /Spaghetti Carbonara/i })
    ).toBeInTheDocument();
  });

  it('should display cuisine badges in English by default', async () => {
    const view = await renderComponent();
    const italianBadges = view.container.querySelectorAll('.cuisine-badge');
    const hasItalian = Array.from(italianBadges).some((badge) =>
      badge.textContent?.includes('Italian')
    );
    expect(hasItalian).toBe(true);
  });

  it('should display difficulty in English by default', async () => {
    const view = await renderComponent();
    const difficulties = view.container.querySelectorAll('.difficulty');
    const hasMedium = Array.from(difficulties).some((d) =>
      d.textContent?.includes('Medium')
    );
    expect(hasMedium).toBe(true);
  });

  it('should update to Spanish when language changes', async () => {
    await renderComponent();

    languageService.setLanguage('es');

    const title = await screen.findByRole('heading', {
      level: 1,
      name: /Recetas Online/i,
    });
    expect(title).toBeInTheDocument();
  });

  it('should display recipe names in Spanish when language is Spanish', async () => {
    await renderComponent();

    languageService.setLanguage('es');

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Espagueti Carbonara/i,
      })
    ).toBeInTheDocument();
  });

  it('should display cuisine badges in Spanish when language is Spanish', async () => {
    const view = await renderComponent();

    languageService.setLanguage('es');

    await screen.findAllByText('Italiana'); // Wait for Spanish (multiple items)
    const italianBadges = view.container.querySelectorAll('.cuisine-badge');
    const hasItaliana = Array.from(italianBadges).some((badge) =>
      badge.textContent?.includes('Italiana')
    );
    expect(hasItaliana).toBe(true);
  });

  it('should display difficulty in Spanish when language is Spanish', async () => {
    const view = await renderComponent();

    languageService.setLanguage('es');

    await screen.findAllByText('Italiana'); // Wait for Spanish to load (multiple items)
    const difficulties = view.container.querySelectorAll('.difficulty');
    const hasMedia = Array.from(difficulties).some((d) =>
      d.textContent?.includes('Media')
    );
    const hasFacil = Array.from(difficulties).some((d) =>
      d.textContent?.includes('Fácil')
    );
    expect(hasMedia || hasFacil).toBe(true);
  });

  it('should display "servings" label in Spanish', async () => {
    const view = await renderComponent();

    languageService.setLanguage('es');

    await screen.findAllByText('Italiana'); // Wait for Spanish to load (multiple items)
    const metaItems = view.container.querySelectorAll('.meta-item');
    const hasServings = Array.from(metaItems).some((item) =>
      item.textContent?.toLowerCase().includes('porciones')
    );
    expect(hasServings).toBe(true);
  });

  it('should have language toggle component', async () => {
    const view = await renderComponent();
    const toggle = view.container.querySelector('app-language-toggle');
    expect(toggle).toBeTruthy();
  });

  it('should reactively update all recipe content when toggling language', async () => {
    const view = await renderComponent();

    // Check English content
    expect(
      screen.getByRole('heading', { level: 2, name: /Spaghetti Carbonara/i })
    ).toBeInTheDocument();
    let badges = view.container.querySelectorAll('.cuisine-badge');
    expect(
      Array.from(badges).some((b) => b.textContent?.includes('Italian'))
    ).toBe(true);

    // Toggle to Spanish
    languageService.setLanguage('es');

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Espagueti Carbonara/i,
      })
    ).toBeInTheDocument();
    badges = view.container.querySelectorAll('.cuisine-badge');
    expect(
      Array.from(badges).some((b) => b.textContent?.includes('Italiana'))
    ).toBe(true);

    // Toggle back to English
    languageService.setLanguage('en');

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Spaghetti Carbonara/i,
      })
    ).toBeInTheDocument();
    badges = view.container.querySelectorAll('.cuisine-badge');
    expect(
      Array.from(badges).some((b) => b.textContent?.includes('Italian'))
    ).toBe(true);
  });
});
