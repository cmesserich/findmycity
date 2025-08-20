// app/contact/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import ContactMailtoForm from "@/components/ContactMailtoForm";

export const metadata: Metadata = {
  title: "Contact — CityScout",
  description: "Get in touch about partnerships, feedback, and support.",
};

export default function ContactPage() {
  const email = "hello@cityscout.app"; // TODO: replace with your real address

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
        Contact
      </h1>
      <p className="lead">
        Questions, feedback, or partnership ideas? We’d love to hear from you.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Card: Email us */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Email us</h2>
          <p className="mt-2 text-sm text-slate-600">
            The fastest way to reach us. We typically reply within 1–2 business days.
          </p>
          <a
            href={`mailto:${email}?subject=CityScout%20Inquiry`}
            className="mt-4 inline-flex btn btn-primary"
          >
            Email {email}
          </a>
        </div>

        {/* Card: Helpful links */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Helpful links</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="nav-link underline" href="/about">About CityScout</Link></li>
            <li><Link className="nav-link underline" href="/wizard">Find Your City</Link></li>
            <li><Link className="nav-link underline" href="/snapshot">City Scouting Reports</Link></li>
            <li><Link className="nav-link underline" href="/">Compare Cities</Link></li>
          </ul>
        </div>
      </div>

      {/* Client-side mailto form */}
      <div className="mt-10 card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Send a quick note</h2>
        <p className="mt-2 text-sm text-slate-600">
          This opens your email app with the details pre-filled.
        </p>
        <ContactMailtoForm email={email} />
      </div>
    </main>
  );
}
