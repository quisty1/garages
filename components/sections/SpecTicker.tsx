// Marquee strip of key product specs under the hero.

export function SpecTicker() {
  const items = (
    <>
      <span>Сварной каркас</span>
      <b>✦</b>
      <span>Панели 50–250 мм</span>
      <b>✦</b>
      <span>Гарантия 3 года</span>
      <b>✦</b>
      <span>Размер по чертежу</span>
      <b>✦</b>
      <span>Монтаж под ключ</span>
      <b>✦</b>
    </>
  );

  return (
    <div className="spec-ticker" aria-label="Основные параметры производства">
      <div className="spec-ticker__track">
        <div className="spec-ticker__group">{items}</div>
        <div className="spec-ticker__group" aria-hidden="true">
          {items}
        </div>
        <div className="spec-ticker__group" aria-hidden="true">
          {items}
        </div>
        <div className="spec-ticker__group" aria-hidden="true">
          {items}
        </div>
      </div>
    </div>
  );
}
