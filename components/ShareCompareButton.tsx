// components/ShareCompareButton.tsx
'use client';

import * as React from 'react';

type Props = {
  formId: string;
  className?: string; // e.g. "btn-outline", "btn-primary"
  label?: string;     // button text override
};

export default function ShareCompareButton({
  formId,
  className = 'btn-outline',
  label = 'Share comparison',
}: Props) {
  const handleClick = async () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;

    const data = new FormData(form);
    const a = (data.get('a') ?? '').toString().trim();
    const b = (data.get('b') ?? '').toString().trim();
    const salary = (data.get('salary') ?? '').toString().trim();

    const url = new URL('/compare', window.location.origin);
    if (a) url.searchParams.set('a', a);
    if (b) url.searchParams.set('b', b);
    if (salary) url.searchParams.set('salary', salary);

    try {
      await navigator.clipboard.writeText(url.toString());
      // Swap alert with your toast system if available
      alert('Comparison link copied to clipboard.');
    } catch {
      // Fallback: show a copyable prompt
      window.prompt('Copy this URL:', url.toString());
    }
  };

  return (
    <button type="button" onClick={handleClick} className={`btn ${className}`}>
      {label}
    </button>
  );
}
