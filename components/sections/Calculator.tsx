'use client';

// Interactive preliminary cost calculator; coefficients come from site-data.

import { useMemo, useState } from 'react';
import { calculate, money } from '@/lib/calculator';
import { GOAL, sendGoal } from '@/lib/analytics';
import { company } from '@/lib/site-data';

export function Calculator() {
  const config = company.calculator;
  const [type, setType] = useState('garages');
  const [length, setLength] = useState(6);
  const [width, setWidth] = useState(4);
  const [panelThickness, setPanelThickness] = useState('100');
  const [gates, setGates] = useState(1);
  const [foundation, setFoundation] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  // Fire calculator_start only once per session of interaction.
  const [started, setStarted] = useState(false);

  const isGarage = type === 'garages';

  const result = useMemo(
    () =>
      calculate(
        {
          type,
          length,
          width,
          panelThickness,
          gates,
          foundation,
          options,
        },
        config,
      ),
    [type, length, width, panelThickness, gates, foundation, options, config],
  );

  const trackStart = () => {
    if (started) return;
    setStarted(true);
    sendGoal(GOAL.calculator_start);
  };

  const toggleOption = (id: string) => {
    trackStart();
    setOptions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <section className="section section--muted" id="calculator">
      <div className="container">
        <div className="section__head">
          <div>
            <div className="section__eyebrow">Предварительная стоимость</div>
            <h2 className="section__title">Калькулятор проекта</h2>
          </div>
          <p className="section__text">
            Укажите основные параметры и получите ориентировочный диапазон.
            Точную смету подготовим после замера и согласования проекта.
          </p>
        </div>

        <div className="calculator">
          <form
            className="calculator__form"
            data-calculator
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="calculator__fields">
              <label className="calculator__field calculator__field--wide">
                <span className="calculator__label">Что строим</span>
                <select
                  className="calculator__input"
                  name="type"
                  value={type}
                  onChange={(e) => {
                    trackStart();
                    setType(e.target.value);
                  }}
                >
                  <option value="garages">Гараж</option>
                  <option value="canopies">Навес</option>
                </select>
              </label>

              <label className="calculator__field">
                <span className="calculator__label">Длина, м</span>
                <input
                  className="calculator__input"
                  name="length"
                  type="number"
                  min={3}
                  max={30}
                  step={0.5}
                  value={length}
                  inputMode="decimal"
                  required
                  onChange={(e) => {
                    trackStart();
                    setLength(Number(e.target.value));
                  }}
                />
              </label>

              <label className="calculator__field">
                <span className="calculator__label">Ширина, м</span>
                <input
                  className="calculator__input"
                  name="width"
                  type="number"
                  min={3}
                  max={30}
                  step={0.5}
                  value={width}
                  inputMode="decimal"
                  required
                  onChange={(e) => {
                    trackStart();
                    setWidth(Number(e.target.value));
                  }}
                />
              </label>

              <label
                className="calculator__field"
                data-garage-field
                hidden={!isGarage}
              >
                <span className="calculator__label">Толщина панелей</span>
                <select
                  className="calculator__input"
                  name="panelThickness"
                  value={panelThickness}
                  disabled={!isGarage}
                  onChange={(e) => {
                    trackStart();
                    setPanelThickness(e.target.value);
                  }}
                >
                  <option value="50">50 мм</option>
                  <option value="100">100 мм</option>
                  <option value="150">150 мм</option>
                  <option value="200">200 мм</option>
                  <option value="250">250 мм</option>
                </select>
              </label>

              <label
                className="calculator__field"
                data-garage-field
                hidden={!isGarage}
              >
                <span className="calculator__label">Количество ворот</span>
                <select
                  className="calculator__input"
                  name="gates"
                  value={gates}
                  disabled={!isGarage}
                  onChange={(e) => {
                    trackStart();
                    setGates(Number(e.target.value));
                  }}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>

              <fieldset className="calculator__options">
                <legend className="calculator__legend">
                  Добавить в расчёт
                </legend>
                <div className="calculator__checks">
                  <label className="calculator__check">
                    <input
                      type="checkbox"
                      name="foundation"
                      checked={foundation}
                      onChange={(e) => {
                        trackStart();
                        setFoundation(e.target.checked);
                      }}
                    />
                    Основание
                  </label>
                  <label className="calculator__check">
                    <input
                      type="checkbox"
                      name="options"
                      value="drain"
                      checked={options.includes('drain')}
                      onChange={() => toggleOption('drain')}
                    />
                    Водосток
                  </label>
                  <label className="calculator__check">
                    <input
                      type="checkbox"
                      name="options"
                      value="snow"
                      checked={options.includes('snow')}
                      onChange={() => toggleOption('snow')}
                    />
                    Снегозадержание
                  </label>
                  <label className="calculator__check">
                    <input
                      type="checkbox"
                      name="options"
                      value="ventilation"
                      checked={options.includes('ventilation')}
                      onChange={() => toggleOption('ventilation')}
                    />
                    Вытяжка
                  </label>
                </div>
              </fieldset>
            </div>
          </form>

          <aside
            className="calculator__result"
            data-calculator-result
            aria-live="polite"
          >
            <div className="calculator__result-label">
              Ориентировочная стоимость
            </div>
            <div className="calculator__price" data-calculator-price>
              {result ? (
                <>
                  <span>{money(result.minimum)}</span>
                  <span>— {money(result.maximum)}</span>
                </>
              ) : null}
            </div>
            <p className="calculator__summary">
              <strong className="calculator__area" data-calculator-area>
                {result
                  ? `${result.area.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} м²`
                  : ''}
              </strong>{' '}
              <span data-calculator-details>
                {result ? result.details.join(' · ') : ''}
              </span>
            </p>
            <p className="calculator__note">
              Расчёт предварительный и не является публичной офертой. Доставка,
              особенности участка и нестандартные решения уточняются после
              замера.
            </p>
            <a
              className="btn btn--ghost"
              href="#contact"
              data-analytics-goal={GOAL.calculator_complete}
            >
              Уточнить смету
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
