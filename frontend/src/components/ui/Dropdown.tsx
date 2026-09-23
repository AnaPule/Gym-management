/**
 * @file        Dropdown.tsx
 * @description Typeable combobox — pick from preset options or type a
 *              custom value. Used for relationship, medical scheme,
 *              school, grade, experience.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-23
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-20  Initial
 *   1.1.0  2026-09-23  Add `disabled` prop
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface ComboboxOption {
  value: string;
  label?: string;
}

interface ComboboxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | ComboboxOption)[];
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** Allow free text not present in options. Default: true */
  allowCustom?: boolean;
  /** Show the full list on focus even before typing. Default: true */
  openOnFocus?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

const normalizeOption = (o: string | ComboboxOption): ComboboxOption =>
  typeof o === 'string' ? { value: o, label: o } : o;

const Dropdown = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      label,
      value,
      onChange,
      options,
      placeholder,
      hint,
      error,
      required,
      disabled,
      allowCustom = true,
      openOnFocus = true,
      id,
      name,
      className = '',
    },
    ref
  ) => {
    const inputId = id || `combobox-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const listboxId = `${inputId}-listbox`;

    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const normalized = useMemo(() => options.map(normalizeOption), [options]);

    const filtered = useMemo(() => {
      const q = value.trim().toLowerCase();
      if (!q) return normalized;
      return normalized.filter(
        (o) =>
          o.value.toLowerCase().includes(q) ||
          (o.label ?? '').toLowerCase().includes(q)
      );
    }, [normalized, value]);

    // Close on outside click
    useEffect(() => {
      const onDocClick = (e: MouseEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    // Reset highlight when the filtered list changes
    useEffect(() => {
      setHighlighted(0);
    }, [filtered.length]);

    const commit = (val: string) => {
      onChange(val);
      setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        setOpen(true);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
      } else if (e.key === 'Enter') {
        if (open && filtered[highlighted]) {
          e.preventDefault();
          commit(filtered[highlighted].value);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'Tab') {
        setOpen(false);
      }
    };

    const showRequiredMark = required;

    return (
      <div ref={wrapperRef} className={`relative ${className}`}>
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-zinc-300 mb-1.5"
        >
          {label}
          {showRequiredMark && (
            <span className="text-crimson-500 ml-1" aria-hidden="true">*</span>
          )}
        </label>

        <div className="relative">
          <input
            id={inputId}
            name={name}
            ref={ref}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              open && filtered[highlighted] ? `${inputId}-opt-${highlighted}` : undefined
            }
            aria-invalid={error ? true : undefined}
            autoComplete="off"
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => {
              onChange(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => {
              if (openOnFocus) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className={`
              w-full bg-zinc-950 border rounded-xl p-3 pr-10 text-sm text-white
              placeholder:text-zinc-600 outline-none transition-colors
              ${error
                ? 'border-crimson-600 focus:border-crimson-500'
                : 'border-zinc-800 focus:border-crimson-500'
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          />

          {/* Chevron */}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => !disabled && setOpen((v) => !v)}
            aria-label={open ? 'Close options' : 'Open options'}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        {open && filtered.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className="
              absolute z-30 mt-1 w-full max-h-56 overflow-y-auto
              bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl
              py-1
            "
          >
            {filtered.map((o, i) => {
              const isHighlighted = i === highlighted;
              const isSelected = o.value === value;
              return (
                <li
                  key={o.value}
                  id={`${inputId}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    // prevent input blur before click lands
                    e.preventDefault();
                    commit(o.value);
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`
                    px-3 py-2 text-sm cursor-pointer transition-colors
                    ${isHighlighted ? 'bg-zinc-850 text-white' : 'text-zinc-300'}
                    ${isSelected ? 'font-semibold' : ''}
                  `}
                >
                  {o.label ?? o.value}
                </li>
              );
            })}
          </ul>
        )}

        {open && filtered.length === 0 && allowCustom && value.trim() && (
          <div
            className="
              absolute z-30 mt-1 w-full
              bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl
              px-3 py-2 text-xs text-zinc-500
            "
          >
            Press Enter or click away to use "{value}"
          </div>
        )}

        {error ? (
          <p className="mt-1.5 text-[11px] text-crimson-400">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-[11px] text-zinc-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;