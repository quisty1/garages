// Messenger CTA links (tile or footer list variants).

import { company } from '@/lib/site-data';

interface MessengerLinksProps {
  variant?: 'tiles' | 'footer';
}

export function MessengerLinks({ variant = 'tiles' }: MessengerLinksProps) {
  if (variant === 'footer') {
    return (
      <ul
        className="footer-list footer-list--messengers"
        data-footer-messengers
      >
        {company.messengers.map((messenger) => (
          <li key={messenger.id}>
            <a href={messenger.href} target="_blank" rel="noopener noreferrer">
              {messenger.label}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="messenger-links" data-messengers>
      {company.messengers.map((messenger) => (
        <a
          key={messenger.id}
          className={`messenger-link messenger-link--${messenger.id}`}
          href={messenger.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="messenger-link__label">{messenger.label}</span>
          <span className="messenger-link__hint">{messenger.hint}</span>
        </a>
      ))}
    </div>
  );
}
