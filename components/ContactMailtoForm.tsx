'use client';

import * as React from 'react';
import { CONTACT_EMAIL } from '@/lib/constants';

type Props = {
  /** Override the destination email if needed; defaults to CONTACT_EMAIL */
  email?: string;
};

export default function ContactMailtoForm({ email = CONTACT_EMAIL }: Props) {
  const handleSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get('name') || '').trim();
    const from = String(fd.get('from') || '').trim();
    const subjectRaw = String(fd.get('subject') || 'CityScout inquiry').trim();
    const message = String(fd.get('message') || '').trim();

    // CRLF line breaks play nicer with some desktop clients
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${from}`,
      '',
      message,
    ];
    const subject = encodeURIComponent(subjectRaw);
    const body = encodeURIComponent(bodyLines.join('\r\n'));

    // Launch the user's default mail client with prefilled content
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }, [email]);

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium text-slate-700">Name</label>
          <input
            id="cf-name"
            name="name"
            className="input mt-1"
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="cf-from" className="block text-sm font-medium text-slate-700">Your email</label>
          <input
            id="cf-from"
            name="from"
            type="email"
            className="input mt-1"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-subject" className="block text-sm font-medium text-slate-700">Subject</label>
        <input
          id="cf-subject"
          name="subject"
          className="input mt-1"
          placeholder="Partnership / Feedback / Support"
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-sm font-medium text-slate-700">Message</label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          className="input mt-1"
          placeholder="How can we help?"
        />
      </div>

      <div>
        <button type="submit" className="btn btn-primary">
          Open in my email app
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Clicking the button opens your default mail app with everything prefilled. If nothing opens,
        check your browser’s default mail handler settings.
      </p>
    </form>
  );
}
