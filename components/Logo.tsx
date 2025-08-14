// components/Logo.tsx

/**
 * CityScout logo: compact compass/pin mark + wordmark.
 * - SVG scales crisply on screen and in print.
 * - Uses CSS vars defined in globals.css for color.
 */
export default function Logo() {
  return (
    <a href="/" className="inline-flex items-center gap-2" aria-label="CityScout Home">
      {/* Icon (24x24) */}
      <svg
        className="logo-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="true"
      >
        {/* Outer pin/compass circle */}
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* North tick */}
        <path d="M12 3.5 L12 6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Compass arrow (simple diamond) */}
        <path d="M12 8.2 L15.8 12 L12 15.8 L8.2 12 Z" fill="currentColor" />
      </svg>

      {/* Wordmark */}
      <span className="logo-word text-base font-semibold tracking-tight">
        CityScout
      </span>
    </a>
  );
}
