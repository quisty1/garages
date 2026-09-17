// Yandex Metrika counter and host allowlist (safe for client bundles).

import type { Company } from './types';

export const analyticsConfig: Company['analytics'] = {
  yandexMetrika: {
    counterId: 110290656,
    // Do not send development and preview traffic to the production counter.
    allowedHosts: ['metallmontage33.ru', 'www.metallmontage33.ru'],
  },
};
