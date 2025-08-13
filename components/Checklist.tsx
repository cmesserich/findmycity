'use client';

import * as React from "react";

const DEFAULT_ITEMS = [
  "Shortlist 2 neighborhoods",
  "Get a 1-week coworking pass",
  "Ride transit at commute time",
  "Test gym/parks near target area",
  "Evening walk route after dark",
];

export default function Checklist({ keyId }: { keyId: string }) {
  const storageKey = `brief-checklist:${keyId}`;
  const [items, setItems] = React.useState<{ text: string; done: boolean }[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setItems(raw ? JSON.parse(raw) : DEFAULT_ITEMS.map(t => ({ text: t, done: false })));
    } catch {
      setItems(DEFAULT_ITEMS.map(t => ({ text: t, done: false })));
    }
  }, [storageKey]);

  React.useEffect(() => {
    if (items.length) localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  function toggle(i: number) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, done: !it.done } : it));
  }

  return (
    <div className="card p-4 avoid-break">
      <h3 className="text-lg font-medium">First-week checklist</h3>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <input type="checkbox" checked={it.done} onChange={() => toggle(i)} className="h-4 w-4"/>
            <span className={it.done ? "text-slate-400 line-through" : ""}>{it.text}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-500">Saved locally to your browser.</p>
    </div>
  );
}
