// Component tests for Calculator, FAQ accordion, and ThemeToggle.

import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from '@/components/sections/Calculator';
import { Faq } from '@/components/sections/Faq';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

describe('Calculator component', () => {
  it('updates estimate when dimensions change', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    const length = screen.getByRole('spinbutton', { name: /Длина/i });
    await user.clear(length);
    await user.type(length, '8');
    expect(
      document.querySelector('[data-calculator-area]')?.textContent,
    ).toMatch(/м²/);
    expect(
      document.querySelector('[data-calculator-price]')?.textContent,
    ).toMatch(/₽/);
  });

  it('hides garage fields for canopies', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    await user.selectOptions(
      screen.getByRole('combobox', { name: /Что строим/i }),
      'canopies',
    );
    const panel = document.querySelector('[data-garage-field]');
    expect(panel).toHaveAttribute('hidden');
  });
});

describe('FAQ component', () => {
  it('opens one item at a time', async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const first = screen.getByText('Сколько стоит гараж?');
    const second = screen.getByText('Сколько стоит навес?');
    await user.click(first);
    expect(first.closest('details')).toHaveClass('is-open');
    await user.click(second);
    expect(second.closest('details')).toHaveClass('is-open');
    expect(first.closest('details')).not.toHaveClass('is-open');
  });
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('toggles data-theme on html', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /тему/i });
    const initial = document.documentElement.getAttribute('data-theme');
    await user.click(button);
    const next = document.documentElement.getAttribute('data-theme');
    expect(next).not.toBe(initial);
    expect(['light', 'dark']).toContain(next);
  });
});
