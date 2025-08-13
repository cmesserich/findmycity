'use client';

export default function PrintButton({ className = "btn" }: { className?: string }) {
  return (
    <button
      type="button"
      className={className + " no-print"}
      onClick={() => window.print()}
    >
      Print / Save PDF
    </button>
  );
}
