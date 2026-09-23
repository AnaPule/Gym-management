/**
 * @file        Form.tsx
 * @description Form shell + FormField primitive. Form handles card shell,
 *              error banner, loading state. FormField handles labels,
 *              required asterisk, hint text, error, and OTP variant.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-21
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-20  Initial
 *   1.1.0  2026-09-21  Add otp variant, forwardRef, required asterisk
 */

import React from 'react';
import type { FormHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

/* ============================
   Form — wrapper
   ============================ */

interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  error?: string | null;
  loading?: boolean;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  error,
  loading = false,
  className = '',
  ...rest
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) onSubmit(e);
      }}
      className={`space-y-4 w-full max-w-md bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 backdrop-blur-md ${className}`}
      {...rest}
    >
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-crimson-800 bg-crimson-950/60 px-3 py-2 text-xs text-crimson-300"
        >
          {error}
        </div>
      )}
      <fieldset disabled={loading} className="space-y-4 border-0 p-0 m-0">
        {children}
      </fieldset>
    </form>
  );
};

/* ============================
   FormField — labeled input
   ============================ */

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  trailing?: ReactNode;
  otp?: boolean;
  disabled?: boolean;
  hideRequiredMark?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    { label, hint, error, trailing, otp = false, disabled = false, hideRequiredMark = false, className = '', id, required, ...rest },
    ref
  ) => {
    const inputId = id || `field-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const hasTrailing = Boolean(trailing);
    const showRequiredMark = required && !hideRequiredMark;

    return (
      <div>
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
            ref={ref}
            required={required}
            aria-required={required || undefined}
            className={`
              w-full bg-zinc-950 border rounded-xl text-white outline-none transition-colors
              placeholder:text-zinc-600
              ${otp
                ? 'py-3.5 px-5 text-center text-2xl font-bold tracking-[14px] [text-indent:14px] tabular-nums'
                : 'p-3 text-sm'
              }
              ${error
                ? 'border-crimson-600 focus:border-crimson-500'
                : 'border-zinc-800 focus:border-crimson-500'
              }
              ${hasTrailing && !otp ? 'pr-12' : ''}
              ${className}
            `}
            {...rest}
          />
          {trailing && !otp && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {trailing}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1.5 text-[11px] text-crimson-400">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-[11px] text-zinc-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = 'FormField';