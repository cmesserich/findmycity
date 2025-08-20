'use client';

type Props = {
  className?: string;   // "btn-outline" or "btn-primary"
  label?: string;       // defaults to "Print"
};

export default function PrintButton({
  className = 'btn-outline',
  label = 'Print',
}: Props) {
  const classes = ['btn', className].filter(Boolean).join(' ');
  return (
    <button type="button" onClick={() => window.print()} className={classes}>
      {label}
    </button>
  );
}
