// Motion tied to useful interface feedback: scroll position, construction detail, workflow progress.
function initPageProgress() {
  let frame = 0;
  const update = () => {
    frame = 0;
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    document.documentElement.style.setProperty(
      '--page-progress',
      Math.min(1, window.scrollY / max).toFixed(4),
    );
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
}

function initHeroBlueprint() {
  const card = document.querySelector('[data-hero-card]');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!card || !finePointer.matches || reduced.matches) return;
  let frame = 0;
  let nextX = 0;
  let nextY = 0;
  const paint = () => {
    frame = 0;
    card.style.setProperty('--hero-ry', `${(nextX * 3.5).toFixed(2)}deg`);
    card.style.setProperty('--hero-rx', `${(-nextY * 3).toFixed(2)}deg`);
    card.style.setProperty('--hero-shift-x', `${(-nextX * 8).toFixed(2)}px`);
    card.style.setProperty('--hero-shift-y', `${(-nextY * 7).toFixed(2)}px`);
  };
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    nextX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    nextY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    if (!frame) frame = requestAnimationFrame(paint);
  });
  card.addEventListener('pointerleave', () => {
    nextX = 0;
    nextY = 0;
    if (!frame) frame = requestAnimationFrame(paint);
  });
}

export { initHeroBlueprint, initPageProgress };
