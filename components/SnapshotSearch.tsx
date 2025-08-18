// components/SnapshotSearch.tsx
'use client';

import * as React from 'react';
import CityAutocomplete from '@/components/CityAutocomplete';

export default function SnapshotSearch({
  initialSalary = 100000,
  initialCitySlug = 'omaha',
}: {
  initialSalary?: number;
  initialCitySlug?: string;
}) {
  const [city, setCity] = React.useState(initialCitySlug);
  const [salary, setSalary] = React.useState(initialSalary);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (salary) params.set('salary', String(salary));
    location.href = `/snapshot?${params.toString()}`;
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="City snapshot form">
      <CityAutocomplete
        id="snapCity"
        name="city"
        label="City"
        defaultSlug={city}
        placeholder="e.g. Atlanta, GA"
        onChangeSlug={(slug) => setCity(slug)}
      />
      <div>
        <label className="block text-sm font-medium text-slate-700">Salary (USD)</label>
        <input
          type="number"
          min={0}
          step={1000}
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="input mt-1"
        />
      </div>
      <div className="flex items-end">
        <button type="submit" className="btn-primary w-full">View snapshot</button>
      </div>
      <div className="sm:col-span-3 text-xs text-slate-500">
        Tip: You can also compare two cities on the <a className="underline" href="/">Compare Cities</a> page.
      </div>
    </form>
  );
}
