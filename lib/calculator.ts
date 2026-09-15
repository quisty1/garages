// Pure preliminary price calculator. Coefficients live in site-data.

import type { CalculatorConfig } from './types';

const MONEY_FORMATTER = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0,
});

export type CalculatorInput = {
  type: string;
  length: number;
  width: number;
  panelThickness?: string | number;
  gates?: number;
  foundation?: boolean;
  options?: string[];
};

export type CalculatorResult = {
  type: string;
  area: number;
  minimum: number;
  maximum: number;
  details: string[];
};

// Round to the nearest thousand for a cleaner estimate display.
export function money(value: number): string {
  return `${MONEY_FORMATTER.format(Math.round(value / 1000) * 1000)} ₽`;
}

export function calculate(
  input: CalculatorInput,
  config: CalculatorConfig,
): CalculatorResult | null {
  const type = String(input.type || 'garages');
  const typeConfig = config.types[type];
  const length = Number(input.length);
  const width = Number(input.width);
  const area = length * width;

  if (!typeConfig || !Number.isFinite(area) || area <= 0) return null;

  // Base: area × rate + fixed type cost, then garage-only and option add-ons.
  let subtotal = area * typeConfig.rate + typeConfig.baseCost;
  const details: string[] = [
    `${typeConfig.label}, ${MONEY_FORMATTER.format(typeConfig.rate)} ₽/м²`,
  ];

  if (type === 'garages') {
    const panelThickness = String(input.panelThickness ?? '100');
    const panelMultiplier = config.panelMultipliers[panelThickness] || 1;
    const gates = Math.max(1, Number(input.gates ?? 0));
    subtotal *= panelMultiplier;
    // First gate is included; each extra gate is charged separately.
    subtotal += Math.max(0, gates - 1) * config.extraGateCost;
    details.push(`панели ${panelThickness} мм`, `ворота: ${gates}`);
  }

  if (input.foundation) {
    subtotal += area * config.foundationRate;
    details.push('основание включено');
  }

  const selectedOptions: string[] = [];
  for (const optionId of input.options ?? []) {
    const option = config.options[optionId];
    if (!option) continue;
    subtotal += option.cost;
    selectedOptions.push(option.label);
  }
  if (selectedOptions.length) details.push(selectedOptions.join(', '));

  // Publish a min–max band instead of a single figure (see config.range).
  return {
    type,
    area,
    minimum: subtotal * config.range.minimum,
    maximum: subtotal * config.range.maximum,
    details,
  };
}
