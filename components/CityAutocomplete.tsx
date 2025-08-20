// components/CityAutocomplete.tsx
'use client';

import * as React from 'react';
import { CITIES } from '@/lib/data/cities';

type Props = {
  /** Hidden field name that will submit the selected city's slug (e.g., "a" or "b") */
  name: string;
  /** Label above the input */
  label?: string;
  /** Starting selection as a slug (e.g., "washington-dc") */
  defaultSlug?: string;
  /** Placeholder text for the visible input */
  placeholder?: string;
  /** Called whenever the selected slug changes */
  onChangeSlug?: (slug: string) => void;
  /** Optional id for label/input association */
  id?: string;
  /** Maximum number of suggestions shown (default 50) */
  maxResults?: number;
};

type CityItem = typeof CITIES[number];

function displayLabel(c: CityItem) {
  return `${c.name}, ${c.state}`;
}

function findBySlug(slug?: string | null): CityItem | undefined {
  if (!slug) return undefined;
  return CITIES.find((c) => c.slug === slug);
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return text;
  const before = text.slice(0, i);
  const match = text.slice(i, i + query.length);
  const after = text.slice(i + query.length);
  return (
    <>
      {before}
      <mark className="rounded-[2px] bg-amber-100 px-0.5 text-amber-900">{match}</mark>
      {after}
    </>
  );
}

export default function CityAutocomplete({
  name,
  label = 'City',
  defaultSlug,
  placeholder = 'Start typing a city…',
  onChangeSlug,
  id,
  maxResults = 50,
}: Props) {
  const inputId = id || `city-${name}`;

  // initialize from default slug (if provided)
  const initial = findBySlug(defaultSlug);
  const [text, setText] = React.useState<string>(initial ? displayLabel(initial) : '');
  const [slug, setSlug] = React.useState<string>(initial?.slug ?? '');
  const [open, setOpen] = React.useState<boolean>(false);
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const listRef = React.useRef<HTMLUListElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Compute filtered suggestions
  const suggestions = React.useMemo(() => {
    const q = text.trim().toLowerCase();

    const rank = (c: CityItem) => {
      const label = `${c.name} ${c.state}`.toLowerCase();
      const slug = c.slug.toLowerCase();
      if (!q) return 2; // default rank when idle
      if (label.startsWith(q) || slug.startsWith(q)) return 0;
      if (label.includes(q) || slug.includes(q)) return 1;
      return 3; // filtered out later
    };

    let list = CITIES.map((c) => ({ c, r: rank(c) }))
      .filter((x) => x.r < 3) // keep startsWith/includes when typing
      .sort(
        (a, b) =>
          a.r - b.r || // better rank first
          (b.c.pop ?? 0) - (a.c.pop ?? 0) || // larger pop first
          a.c.name.localeCompare(b.c.name)
      )
      .slice(0, maxResults)
      .map((x) => x.c);

    if (!q) {
      // When idle (no query), show top by population for discoverability
      list = CITIES.slice()
        .sort((a, b) => (b.pop ?? 0) - (a.pop ?? 0))
        .slice(0, maxResults);
    }
    return list;
  }, [text, maxResults]);

  // Choose a city explicitly
  function choose(city: CityItem) {
    setText(displayLabel(city));
    if (slug !== city.slug) {
      setSlug(city.slug);
      onChangeSlug?.(city.slug);
    }
    setOpen(false);
    setActiveIndex(0);
    // return focus to input for fast tabbing
    inputRef.current?.focus();
  }

  // Blur behavior: keep the last explicit choice unless text exactly equals a label.
  function onBlur() {
    const exact = CITIES.find(
      (c) => displayLabel(c).toLowerCase() === text.trim().toLowerCase()
    );
    if (exact && exact.slug !== slug) {
      setSlug(exact.slug);
      onChangeSlug?.(exact.slug);
    }
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(0, suggestions.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions[activeIndex]) choose(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const listboxId = `${inputId}-listbox`;
  const activeId =
    open && suggestions[activeIndex] ? `${inputId}-opt-${activeIndex}` : undefined;

  return (
    <div className="relative">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      {/* Visible input for humans */}
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        className="input mt-1"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={activeId}
      />

      {/* Hidden field for the form to submit */}
      <input type="hidden" name={name} value={slug} />

      {open && suggestions.length > 0 && (
        <ul
          id={listboxId}
          ref={listRef}
          role="listbox"
          className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border border-[color:var(--border)] bg-white shadow-lg"
        >
          {suggestions.map((c, idx) => {
            const isActive = idx === activeIndex;
            const labelText = displayLabel(c);
            return (
              <li
                id={`${inputId}-opt-${idx}`}
                key={c.slug}
                role="option"
                aria-selected={isActive}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  isActive ? 'bg-slate-100' : 'bg-white hover:bg-slate-50'
                }`}
                // Use onMouseDown so we select before the input blurs
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(c);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div className="font-medium text-slate-900">
                  {highlight(labelText, text)}
                </div>
                {c.climate ? (
                  <div className="text-xs text-slate-500">{c.climate}</div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
