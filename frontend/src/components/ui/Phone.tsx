import React, { useEffect, useRef, useState } from 'react';
import { COUNTRIES, countryByIso, digitsOnly } from '@/lib/countries';

interface PhoneInputProps {
  label: string;
  country: string;
  value: string;
  onChange: (country: string, national: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  maxDigits?: number;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  country,
  value,
  onChange,
  required,
  error,
  hint,
  maxDigits = 9,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = countryByIso(country);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
        {label}
        {required && <span className="text-crimson-500 ml-1">*</span>}
      </label>

      <div
        className={`px-3 flex items-stretch bg-zinc-950 border rounded-xl transition-colors ${
          error ? 'border-crimson-600' : 'border-zinc-800 focus-within:border-crimson-500'
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 px-3 border-r border-zinc-800 rounded-l-xl text-sm text-white hover:bg-zinc-900"
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="text-xs text-zinc-300">{selected.dial}</span>
          <svg className="w-3 h-3 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <input
          type="tel"
          inputMode="tel"
          value={value}
          onChange={(e) => onChange(country, digitsOnly(e.target.value).slice(0, maxDigits))}
          placeholder="82 123 4567"
          className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none rounded-r-xl"
        />
      </div>

      {open && (
        <ul className="absolute z-30 mt-1 left-0 w-64 max-h-64 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl py-1">
          {COUNTRIES.map((c) => (
            <li
              key={c.iso}
              onMouseDown={(e) => { e.preventDefault(); onChange(c.iso, value); setOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2 text-xs cursor-pointer hover:bg-zinc-850 ${
                c.iso === country ? 'text-white font-semibold' : 'text-zinc-300'
              }`}
            >
              <span className="text-base leading-none">{c.flag}</span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className="text-zinc-500">{c.dial}</span>
            </li>
          ))}
        </ul>
      )}

      {error ? (
        <p className="mt-1.5 text-[11px] text-crimson-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[11px] text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
};

export default PhoneInput;