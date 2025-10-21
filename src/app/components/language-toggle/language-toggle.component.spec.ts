import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LanguageService } from '../../services/language.service';
import { LanguageToggleComponent } from './language-toggle.component';

describe('LanguageToggleComponent', () => {
  let languageService: LanguageService;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', async () => {
    const view = await render(LanguageToggleComponent);
    expect(view.container).toBeInTheDocument();
  });

  it('should display EN when current language is English', async () => {
    await render(LanguageToggleComponent);
    const button = screen.getByRole('button', { name: /EN/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('EN');
  });

  it('should display ES when current language is Spanish', async () => {
    const view = await render(LanguageToggleComponent);
    languageService = view.fixture.componentRef.injector.get(LanguageService);

    languageService.setLanguage('es');

    const button = await screen.findByRole('button', { name: /ES/i });
    expect(button).toHaveTextContent('ES');
  });

  it('should toggle language when clicked', async () => {
    const user = userEvent.setup();
    const view = await render(LanguageToggleComponent);
    languageService = view.fixture.componentRef.injector.get(LanguageService);

    expect(languageService.language()).toBe('en');

    const button = screen.getByRole('button');
    await user.click(button);

    expect(languageService.language()).toBe('es');
  });

  it('should update button text after toggle', async () => {
    const user = userEvent.setup();
    await render(LanguageToggleComponent);

    const button = screen.getByRole('button', { name: /EN/i });
    expect(button).toHaveTextContent('EN');

    await user.click(button);

    expect(button).toHaveTextContent('ES');
  });

  it('should toggle back to English from Spanish', async () => {
    const user = userEvent.setup();
    const view = await render(LanguageToggleComponent);
    languageService = view.fixture.componentRef.injector.get(LanguageService);

    languageService.setLanguage('es');

    const button = await screen.findByRole('button', { name: /ES/i });
    expect(languageService.language()).toBe('es');

    await user.click(button);

    expect(languageService.language()).toBe('en');
  });
});
