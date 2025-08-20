'use client';

import * as React from 'react';

export default function ContactMailtoForm({
  email = 'hello@cityscout.app',
}: { email?: string }) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent(String(fd.get('subject') || 'CityScout inquiry'));
    const bodyLines = [
      `Name: ${fd.get('name') || ''}`,
      `Email: ${fd.get('from') || ''}`,
      '',
      String(fd.get('message') || ''),
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input name="name" className="input mt-1" placeholder="Jane Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Your email</label>
          <input name="from" type="email" className="input mt-1" placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Subject</label>
        <input name="subject" className="input mt-1" placeholder="Partnership / Feedback / Support" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Message</label>
        <textarea name="message" rows={5} className="input mt-1" placeholder="How can we help?" />
      </div>
      <div>
        <button className="btn btn-primary">Open in my email app</button>
      </div>
    </form>
  );
}
