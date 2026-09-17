// Component tests for Calculator, FAQ accordion, and ThemeToggle.

import { describe, expect, it, beforeEach, vi } from 'vitest';
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

  it('updates all optional inputs and handles an invalid estimate', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: /Толщина панелей/i }),
      '150',
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: /Количество ворот/i }),
      '2',
    );
    await user.click(screen.getByRole('checkbox', { name: 'Основание' }));
    await user.click(screen.getByRole('checkbox', { name: 'Водосток' }));
    await user.click(screen.getByRole('checkbox', { name: 'Водосток' }));

    const length = screen.getByRole('spinbutton', { name: /Длина/i });
    await user.clear(length);
    expect(
      document.querySelector('[data-calculator-price]'),
    ).toBeEmptyDOMElement();
  });
});

describe('FAQ component', () => {
  it('opens one item at a time', async () => {
    const user = userEvent.setup();
    render(
      <Faq
        items={[
          { q: 'Сколько стоит гараж?', a: 'От 22 000 ₽.' },
          { q: 'Сколько стоит навес?', a: 'От 6 000 ₽.' },
        ]}
      />,
    );
    const first = screen.getByText('Сколько стоит гараж?');
    const second = screen.getByText('Сколько стоит навес?');
    await user.click(first);
    expect(first.closest('details')).toHaveClass('is-open');
    await user.click(second);
    expect(second.closest('details')).toHaveClass('is-open');
    expect(first.closest('details')).not.toHaveClass('is-open');
  });

  it('closes immediately when reduced motion is enabled', async () => {
    const user = userEvent.setup();
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(<Faq items={[{ q: 'Вопрос?', a: 'Ответ.' }]} />);
    const question = screen.getByText('Вопрос?');
    await user.click(question);
    expect(question.closest('details')).toHaveAttribute('open');
    await user.click(question);
    expect(question.closest('details')).not.toHaveAttribute('open');
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
