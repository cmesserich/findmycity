'use client';

export default function ShareCompareButton({ formId }: { formId: string }) {
  return (
    <button
      type="button"
      className="btn w-full sm:w-auto"
      onClick={() => {
        const form = document.getElementById(formId) as HTMLFormElement | null;
        if (!form) return;
        const a = (form.querySelector('input[name="a"]') as HTMLInputElement)?.value || "";
        const b = (form.querySelector('input[name="b"]') as HTMLInputElement)?.value || "";
        const salary = (form.querySelector('input[name="salary"]') as HTMLInputElement)?.value || "100000";
        const url = `${window.location.origin}/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&salary=${encodeURIComponent(salary)}`;
        navigator.clipboard?.writeText(url);
        alert("Comparison link copied!");
      }}
    >
      Share comparison
    </button>
  );
}
