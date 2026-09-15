'use client';

// FAQ accordion with height/opacity transitions (respects reduced motion).

import { useRef, useState } from 'react';
import { company } from '@/lib/site-data';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggle = (index: number) => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const isOpen = openIndex === index;
    const panel = panelRefs.current[index];

    if (isOpen) {
      if (reducedMotion || !panel) {
        setOpenIndex(null);
        return;
      }
      // Animate height from current scrollHeight down to 0, then clear inline styles.
      panel.style.height = `${panel.scrollHeight}px`;
      panel.style.opacity = '1';
      requestAnimationFrame(() => {
        panel.style.height = '0px';
        panel.style.opacity = '0';
      });
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'height') return;
        panel.removeEventListener('transitionend', onEnd);
        panel.style.height = '';
        panel.style.opacity = '';
        setOpenIndex(null);
      };
      panel.addEventListener('transitionend', onEnd);
      return;
    }

    setOpenIndex(index);
    if (reducedMotion || !panel) return;
    requestAnimationFrame(() => {
      panel.style.height = '0px';
      panel.style.opacity = '0';
      requestAnimationFrame(() => {
        panel.style.height = `${panel.scrollHeight}px`;
        panel.style.opacity = '1';
      });
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'height') return;
        panel.removeEventListener('transitionend', onEnd);
        // Leave height:auto so content can reflow if the viewport changes.
        panel.style.height = 'auto';
      };
      panel.addEventListener('transitionend', onEnd);
    });
  };

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section__head">
          <div>
            <div className="section__eyebrow">Вопросы до замера</div>
            <h2 className="section__title">Частые вопросы</h2>
          </div>
          <p className="section__text">Цены, сроки и условия — кратко о главном.</p>
        </div>

        <div className="faq" data-faq>
          {company.faq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <details
                key={item.q}
                className={`faq-item${isOpen ? ' is-open' : ''}`}
                open={isOpen}
              >
                <summary
                  className="faq-item__question"
                  onClick={(e) => {
                    e.preventDefault();
                    toggle(index);
                  }}
                >
                  <span className="faq-item__label">{item.q}</span>
                  <span className="faq-item__icon" aria-hidden="true" />
                </summary>
                <div
                  className="faq-item__panel"
                  ref={(el) => {
                    panelRefs.current[index] = el;
                  }}
                >
                  <div className="faq-item__answer">
                    <p>{item.a}</p>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
