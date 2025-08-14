'use client';

import * as React from "react";
import { CITIES } from "@/lib/data/cities";

type Props = {
  /** Name for the hidden <input> that holds the slug (e.g. "a" or "b") */
  name: string;
  /** Optional visible label above the input */
  label?: string;
  /** Starting selection as a slug (e.g. "washington-dc") */
  defaultSlug?: string;
  /** Placeholder text for the visible text box */
  placeholder?: string;
  /** Notify parent when the selected slug changes (optional) */
  onChangeSlug?: (slug: string) => void;
  /** Optional id to link label and input (accessibility) */
  id?: string;
};

type CityItem = typeof CITIES[number];

function displayLabel(c: CityItem) {
  return `${c.name}, ${c.state}`;
}

function findBySlug(slug?: string | null): CityItem | undefined {
  if (!slug) return undefined;
  return CITIES.find(c => c.slug === slug);
}

function score(q: string, c: CityItem) {
  const s = q.toLowerCase();
  const label = `${c.name}, ${c.state}`.toLowerCase();
  const slug = c.slug.toLowerCase();
  if (!s) return 9999;
  if (label.startsWith(s) || slug.startsWith(s)) return 0;      // best
  if (label.includes(s) || slug.includes(s)) return 1;          // good
  return 2;                                                     // meh
}

export default function CityAutocomplete({
  name,
  label = "City",
  defaultSlug,
  placeholder = "Start typing a city…",
  onChangeSlug,
  id,
}: Props) {
  const initial = findBySlug(defaultSlug);
  const [query, setQuery] = React.useState(initial ? displayLabel(initial) : "");
  const [slug, setSlug] = React.useState(initial?.slug ?? "");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Filter suggestions
  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = CITIES.slice();
    if (q) {
      arr = arr
        .map(c => ({ c, s: score(q, c) }))
        .sort((a, b) => a.s - b.s || a.c.name.localeCompare(b.c.name))
        .slice(0, 8)
        .map(x => x.c);
    } else {
      // Default: first 8 alphabetically for discoverability
      arr = arr.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 8);
    }
    return arr;
  }, [query]);

  function choose(city: CityItem) {
    setQuery(displayLabel(city));
    setSlug(city.slug);
    setOpen(false);
    setActive(0);
    onChangeSlug?.(city.slug);
    // return focus for quick tabbing
    inputRef.current?.focus();
  }

  function onBlur() {
    // If the visible text exactly matches a city label, keep it;
    // else if there are suggestions, pick the first one; otherwise clear.
    const exact = CITIES.find(c => displayLabel(c).toLowerCase() === query.trim().toLowerCase());
    if (exact) {
      if (exact.slug !== slug) {
        setSlug(exact.slug);
        onChangeSlug?.(exact.slug);
      }
      return;
    }
    if (suggestions.length) {
      choose(suggestions[0]);
      return;
    }
    // no match; clear
    setSlug("");
    onChangeSlug?.("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[active]) choose(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  // close list if clicking outside
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!listRef.current || !inputRef.current) return;
      if (
        e.target instanceof Node &&
        !listRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      {/* Visible text input (for humans) */}
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={query}
        placeholder={placeholder}
        className="input mt-1"
        autoComplete="off"
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
      {/* Hidden field that the form will submit (for app) */}
      <input type="hidden" name={name} value={slug} />

      {open && suggestions.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg"
        >
          {suggestions.map((c, idx) => {
            const isActive = idx === active;
            return (
              <li
                key={c.slug}
                role="option"
                aria-selected={isActive}
                className={`cursor-pointer px-3 py-2 text-sm ${isActive ? "bg-slate-100" : "bg-white hover:bg-slate-50"}`}
                onMouseDown={(e) => { e.preventDefault(); choose(c); }}
                onMouseEnter={() => setActive(idx)}
              >
                <div className="font-medium text-slate-900">{c.name}, {c.state}</div>
                <div className="text-xs text-slate-500">{c.climate}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
