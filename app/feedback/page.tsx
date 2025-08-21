// app/feedback/page.tsx
export const dynamic = "force-dynamic";

export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Share your feedback</h1>
      <p className="mt-2 text-slate-600">
        This goes straight to the team. Thank you so much!
      </p>

      <div className="mt-6 overflow-hidden rounded-md border border-[color:var(--border)]">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfyqRHYlnIEhuetelXGEunWqHiQQjbdhAOufzacwtjfLKGM7g/viewform?embedded=true"
          width="100%"
          height="1200"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>

      <p className="mt-4 text-sm text-slate-600-bold">
        Prefer email? <a className="underline" href={`mailto:${process.env.NEXT_PUBLIC_CONTACT ?? "contactcityscout@gmail.com"}?subject=CityScout%20feedback`}>Send us a note</a>.
      </p>
    </main>
  );
}
