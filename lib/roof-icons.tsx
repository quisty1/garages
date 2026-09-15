// Inline SVG schematics for gable / side / back roof types.

import type { RoofIconKey } from './types';

export function RoofIconGable() {
  return (
    <svg
      viewBox="0 0 64 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 34 L32 8 L60 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="4"
        y1="34"
        x2="60"
        y2="34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RoofIconSide() {
  return (
    <svg
      viewBox="0 0 64 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 12 L58 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="6"
        y1="34"
        x2="58"
        y2="34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RoofIconBack() {
  return (
    <svg
      viewBox="0 0 64 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M58 12 L6 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="6"
        y1="34"
        x2="58"
        y2="34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RoofIcon({ icon }: { icon: RoofIconKey }) {
  if (icon === 'gable') return <RoofIconGable />;
  if (icon === 'side') return <RoofIconSide />;
  return <RoofIconBack />;
}