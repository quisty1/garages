// Unit tests for calculator math, image helpers, and SEO/JSON-LD builders.

import { describe, expect, it } from 'vitest';
import { calculate, money } from '@/lib/calculator';
import { calculatorConfig } from '@/lib/calculator-config';
import { mediumPath, previewPath, seoImageAlt } from '@/lib/images';
import { company } from '@/lib/site-data';
import { buildJsonLd, formatPrice } from '@/lib/seo';
import { ANALYTICS_GOALS } from '@/lib/constants';

describe('calculator', () => {
  const config = calculatorConfig;

  it('computes garage base range for 6x4 panels 100', () => {
    const result = calculate(
      {
        type: 'garages',
        length: 6,
        width: 4,
        panelThickness: '100',
        gates: 1,
      },
      config,
    );
    expect(result).not.toBeNull();
    expect(result!.area).toBe(24);
    // 24*22000 + 400000 = 928000; *1.1 = 1020800; *0.9/1.15
    expect(Math.round(result!.minimum)).toBe(Math.round(1020800 * 0.9));
    expect(Math.round(result!.maximum)).toBe(Math.round(1020800 * 1.15));
    expect(money(result!.minimum)).toMatch(/₽$/);
  });

  it('adds foundation and options', () => {
    const result = calculate(
      {
        type: 'canopies',
        length: 6,
        width: 4,
        foundation: true,
        options: ['drain', 'snow'],
      },
      config,
    );
    expect(result).not.toBeNull();
    // 24*6000 + 120000 = 264000 + 24*6500 + 35000 + 30000 = 485000
    expect(Math.round(result!.minimum)).toBe(Math.round(485000 * 0.9));
  });

  it('returns null for invalid area', () => {
    expect(
      calculate({ type: 'garages', length: 0, width: 4 }, config),
    ).toBeNull();
  });

  it.each([0, 1, 3.2, 30.5, Number.NaN])(
    'rejects invalid length %s',
    (length) => {
      expect(
        calculate({ type: 'garages', length, width: 4 }, config),
      ).toBeNull();
    },
  );

  it('rounds money to thousands', () => {
    expect(money(919400)).toMatch(/^919\s000 ₽$/);
  });
});

describe('helpers', () => {
  it('builds preview paths', () => {
    expect(previewPath('/assets/garage-6x4.webp')).toBe(
      '/assets/garage-6x4-560.webp',
    );
    expect(mediumPath('/assets/garage-project.webp')).toBe(
      '/assets/garage-project-960.webp',
    );
  });

  it('builds SEO alts', () => {
    expect(seoImageAlt('Гараж 6×4 м', 'garage')).toContain('сэндвич-панелей');
    expect(seoImageAlt('Навес для авто', 'canopy')).toContain('под ключ');
  });
});

describe('seo', () => {
  it('builds JSON-LD with minPrice offers and FAQ', () => {
    const jsonLd = buildJsonLd(company);
    const text = JSON.stringify(jsonLd);
    expect(text).toContain('HomeAndConstructionBusiness');
    expect(text).toContain('FAQPage');
    expect(text).toContain('"minPrice":22000');
    expect(text).toContain('"minPrice":6000');
    expect(text).not.toContain('"@type":"Product"');
    expect(formatPrice(6000)).toMatch(/^6\s000$/);
  });

  it('keeps analytics goal ids', () => {
    expect(ANALYTICS_GOALS).toEqual([
      'cta_calculate',
      'cta_contact',
      'phone_click',
      'email_click',
      'messenger_click',
      'map_click',
      'contact_copy',
      'calculator_start',
      'calculator_complete',
    ]);
  });
});
