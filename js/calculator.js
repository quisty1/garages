// Preliminary price calculator. All coefficients live in site-data.js.
import { company } from './shared.js';
import { sendGoal } from './analytics.js';

const MONEY_FORMATTER = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0,
});

function money(value) {
  return `${MONEY_FORMATTER.format(Math.round(value / 1000) * 1000)} ₽`;
}

function numberValue(form, name) {
  return Number(new FormData(form).get(name));
}

function setGarageFieldsVisibility(form, isGarage) {
  form.querySelectorAll('[data-garage-field]').forEach((field) => {
    field.hidden = !isGarage;
    field.querySelectorAll('select, input').forEach((control) => {
      control.disabled = !isGarage;
    });
  });
}

function calculate(form, config) {
  const data = new FormData(form);
  const type = String(data.get('type') || 'garages');
  const typeConfig = config.types[type];
  const length = numberValue(form, 'length');
  const width = numberValue(form, 'width');
  const area = length * width;

  if (!typeConfig || !Number.isFinite(area) || area <= 0) return null;

  let subtotal = area * typeConfig.rate + typeConfig.baseCost;
  const details = [
    `${typeConfig.label}, ${MONEY_FORMATTER.format(typeConfig.rate)} ₽/м²`,
  ];

  if (type === 'garages') {
    const panelThickness = String(data.get('panelThickness') || '100');
    const panelMultiplier = config.panelMultipliers[panelThickness] || 1;
    const gates = Math.max(1, numberValue(form, 'gates'));
    subtotal *= panelMultiplier;
    subtotal += Math.max(0, gates - 1) * config.extraGateCost;
    details.push(`панели ${panelThickness} мм`, `ворота: ${gates}`);
  }

  if (data.has('foundation')) {
    subtotal += area * config.foundationRate;
    details.push('основание включено');
  }

  const selectedOptions = [];
  data.getAll('options').forEach((optionId) => {
    const option = config.options[optionId];
    if (!option) return;
    subtotal += option.cost;
    selectedOptions.push(option.label);
  });
  if (selectedOptions.length) details.push(selectedOptions.join(', '));

  return {
    type,
    area,
    minimum: subtotal * config.range.minimum,
    maximum: subtotal * config.range.maximum,
    details,
  };
}

function renderResult(host, result) {
  if (!result) return;
  const price = host.querySelector('[data-calculator-price]');
  const minimum = document.createElement('span');
  const maximum = document.createElement('span');
  minimum.textContent = money(result.minimum);
  maximum.textContent = `— ${money(result.maximum)}`;
  price.replaceChildren(minimum, maximum);
  host.querySelector('[data-calculator-area]').textContent =
    `${result.area.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} м²`;
  host.querySelector('[data-calculator-details]').textContent =
    result.details.join(' · ');
}

function initCalculator() {
  const form = document.querySelector('[data-calculator]');
  const resultHost = document.querySelector('[data-calculator-result]');
  const config = company?.calculator;
  if (!form || !resultHost || !config) return;

  let interactionTracked = false;

  const update = () => {
    const isGarage = form.elements.type.value === 'garages';
    setGarageFieldsVisibility(form, isGarage);
    const result = calculate(form, config);
    renderResult(resultHost, result);
    return result;
  };

  form.addEventListener('input', () => {
    if (!interactionTracked) {
      sendGoal('calculator_start');
      interactionTracked = true;
    }
    update();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = update();
    if (!result) return;

    sendGoal('calculator_complete', {
      type: result.type,
      area: Number(result.area.toFixed(1)),
      estimate_min: Math.round(result.minimum),
      estimate_max: Math.round(result.maximum),
    });
    resultHost.focus({ preventScroll: true });
  });

  update();
}

export { calculate, initCalculator };
