'use client';
import * as React from 'react';

type Props = {
  className?: string;            // "btn-outline" or "btn-primary"
  label?: string;                 // visible text (default below)
  presetHref?: string;            // copy this URL if provided
  formId?: string;                // compose /compare?a=…&b=…&salary=… from a form
};

export default function CopyLinkButton({
  className = 'btn-outline',
  label = 'Share link',
  presetHref,
  formId,
}: Props) {
  const [copied, setCopied] = React.useState(false);

  async function onClick() {
    try {
      let href = presetHref ?? location.href;

      if (!presetHref && formId) {
        const form = document.getElementById(formId) as HTMLFormElement | null;
        if (form) {
          const data = new FormData(form);
          const a = (data.get('a') || '').toString();
          const b = (data.get('b') || '').toString();
          const salary = (data.get('salary') || '').toString();
          const url = new URL(`${location.origin}/compare`);
          if (a) url.searchParams.set('a', a);
          if (b) url.searchParams.set('b', b);
          if (salary) url.searchParams.set('salary', salary);
          href = url.toString();
        }
      }

      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // last resort—show a prompt so the user can copy manually
      prompt('Copy this link:', presetHref ?? location.href);
    }
  }

  const classes = ['btn', className].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      aria-live="polite"
    >
      {copied ? 'Copied!' : label}
    </button>
  );
}
