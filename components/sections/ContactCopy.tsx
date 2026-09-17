'use client';

// Clipboard copy buttons for phone, email, and legal requisites.

import { useState } from 'react';

const COPY_LABELS = ['телефон', 'email', 'реквизиты'] as const;

function textById(id: string): string {
  return document.getElementById(id)?.textContent?.trim() || '';
}

function labelledLine(label: string, id: string): string {
  const value = textById(id);
  return value ? `${label} ${value}` : '';
}

// Flatten the hidden requisites panel into a multi-line clipboard string.
export function readRequisites(): string {
  const root = document.getElementById('requisites');
  if (!root || root.hidden) return '';

  return [
    root.querySelector('.requisites-panel__title')?.textContent?.trim() || '',
    textById('requisites-name'),
    labelledLine('ОГРНИП', 'requisites-ogrnip'),
    labelledLine('ИНН', 'requisites-inn'),
    root.querySelector('.requisites-panel__subtitle')?.textContent?.trim() ||
      '',
    labelledLine('Банк', 'requisites-bank'),
    labelledLine('Р/с', 'requisites-account'),
    labelledLine('К/с', 'requisites-corr-account'),
    labelledLine('БИК', 'requisites-bic'),
  ]
    .filter(Boolean)
    .join('\n');
}

export function ContactCopy() {
  const [status, setStatus] = useState('');

  const read = (label: string) => {
    if (label === 'телефон') {
      return (
        document
          .querySelector('.contacts-panel a[href^="tel:"] .contact-tile__value')
          ?.textContent?.trim() || ''
      );
    }
    if (label === 'email') {
      return (
        document.getElementById('contact-email')?.textContent?.trim() || ''
      );
    }
    return readRequisites();
  };

  return (
    <div
      className="contact-copy"
      role="group"
      aria-label="Скопировать контактные данные"
    >
      {COPY_LABELS.map((label) => (
        <button
          key={label}
          type="button"
          className="contact-copy__button"
          data-analytics-goal="contact_copy"
          data-analytics-label={label}
          onClick={async () => {
            setStatus('');
            try {
              if (!navigator.clipboard?.writeText) {
                throw new Error('Clipboard API unavailable');
              }
              await navigator.clipboard.writeText(read(label));
              setStatus('Скопировано в буфер обмена');
            } catch {
              setStatus(
                'Не удалось скопировать. Выделите нужный текст и скопируйте вручную.',
              );
            }
          }}
        >
          Скопировать {label}
        </button>
      ))}
      <p className="contact-copy__status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
