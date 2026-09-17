// Editable coefficients for the preliminary on-page calculator.

import type { CalculatorConfig } from './types';

export const calculatorConfig: CalculatorConfig = {
  types: {
    garages: {
      label: 'Гараж',
      rate: 22000,
      baseCost: 400000,
    },
    canopies: {
      label: 'Навес',
      rate: 6000,
      baseCost: 120000,
    },
  },
  panelMultipliers: {
    50: 1,
    100: 1.1,
    150: 1.2,
    200: 1.3,
    250: 1.4,
  },
  extraGateCost: 140000,
  foundationRate: 6500,
  options: {
    drain: { label: 'водосток', cost: 35000 },
    snow: { label: 'снегозадержание', cost: 30000 },
    ventilation: { label: 'вытяжка', cost: 45000 },
  },
  range: { minimum: 0.9, maximum: 1.15 },
};
