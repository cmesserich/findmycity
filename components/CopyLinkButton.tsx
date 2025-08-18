'use client';

import * as React from 'react';

type Props = {
  className?: string;
  /** Optional path or full URL to copy.
   *  Examples: "/snapshot?city=omaha&salary=100000" or "https://example.com/…"
   *  If omitted, falls back to the current page URL (location.href).
   */
  presetHref?: string;
  label?: string;
};

export default function CopyLinkButton({
  className = 'btn-outline',
  presetHref,
  label = 'Share link',
}: Props) {
  const onClick = async () => {
    try {
      let url = '';
      if (presetHref) {
        // If it's a relative path, resolve against current origin
        try {
          url = new URL(presetHref, location.origin).toString();
        } catch {
          url = presetHref; // best effort
        }
      } else {
        url = location.href;
      }

      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard.');
    } catch {
      // Fallback: at least show the URL
      alert(presetHref || location.href);
    }
  };

  return (
    <button type="button" onClick={onClick} className={`btn ${className}`}>
      {label}
    </button>
  );
}
