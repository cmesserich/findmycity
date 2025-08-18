export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
        Contact
      </h1>
      <p className="lead">Questions, partnerships, or feedback? We’d love to hear from you.</p>

      <div className="card p-5 mt-6">
        <p className="text-sm text-slate-700">
          Email: <a className="underline" href="mailto:hello@cityscout.app">hello@cityscout.app</a>
        </p>
        <p className="text-sm text-slate-700 mt-2">
          For City Reports or press inquiries, include your timeline and the cities you’re considering.
        </p>
      </div>
    </main>
  );
}
