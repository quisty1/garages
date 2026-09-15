// Address and money display helpers.

import type { Address } from './types';
import { company } from './site-data';

export function formatAddressLine(
  address: Address = company.address as Address,
): string {
  const parts = [
    address.addressLocality ? `г. ${address.addressLocality}` : '',
    address.addressNote || '',
    address.streetAddress || '',
    address.postalCode || '',
  ].filter(Boolean);
  return parts.join(', ');
}

// Prefer the curated mapUrl; otherwise build a Yandex Maps search link.
export function getMapUrl(
  address: Address = company.address as Address,
): string {
  if (address.mapUrl) return address.mapUrl;
  const query = [address.addressLocality, address.streetAddress]
    .filter(Boolean)
    .join(', ');
  if (!query) return '';
  return `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`;
}

const MONEY_FORMATTER = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0,
});

// Format project price as "1 150 000 ₽" (ru-RU, nbsp separators).
export function formatMoneyDisplay(price: number): string {
  const n = Number(price);
  if (!Number.isFinite(n)) return '';
  return `${MONEY_FORMATTER.format(n)}\u00a0₽`;
}

// Project card label: "Цена: 1 150 000 ₽" with non-breaking spaces.
export function formatProjectPrice(price: number): string {
  const display = formatMoneyDisplay(price);
  return display ? `Цена: ${display}` : '';
}
