'use client';

import * as React from 'react';

type Props = {
  formId: string;
  className?: string;     // e.g. "btn-outline"
  children?: React.ReactNode; // Button text (defaults below)
};

export default function ShareCompareButton({
  formId,
  className = 'btn-outline',
  children,
}: Props) {
  const [copied, setCopied] = React.useState(false);

  async function onClick() {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;

    const data = new FormData(form);
    const a = (data.get('a') || '').toString();
    const b = (data.get('b') || '').toString();
    const salary = (data.get('salary') || '').toString();

    const url = new URL(`${location.origin}/compare`);
    if (a) url.searchParams.set('a', a);
    if (b) url.searchParams.set('b', b);
    if (salary) url.searchParams.set('salary', salary);

    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      // Reset the label after 1.5s
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: open native share if available, otherwise open prompt with URL
      if ((navigator as any).share) {
        try {
          await (navigator as any).share({ url: url.toString(), title: 'CityScout comparison' });
        } catch {}
      } else {
        prompt('Copy this link:', url.toString());
      }
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn ${className}`}
      aria-live="polite"
      aria-label={copied ? 'Link copied' : 'Copy comparison link'}
    >
      {copied ? 'Copied!' : (children ?? 'Share comparison')}
    </button>
  );
}
