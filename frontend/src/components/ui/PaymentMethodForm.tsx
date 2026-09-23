/**
 * @file        PaymentMethodForm.tsx
 * @description Reusable card / EFT toggle. Used inline on the Choose Plan
 *              step for both adult and minor signups. Fields are mocked
 *              until the payment gateway is wired.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-22
 * @updated     2026-09-23
 * @version     1.0.0
 *
 * TODO: Replace mock card fields with a hosted payment element (Stripe
 *       Elements or PayFast hosted fields). Raw PAN must never be stored
 *       on our servers — see docs TODO list.
 */

import React from 'react';
import { FormField } from '@/components/ui/Form';

export type PaymentMethod = 'card' | 'eft' | '';

export interface PaymentMethodValue {
  method: PaymentMethod;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardHolder: string;
  eftAcknowledged: boolean;
}

interface Props {
  value: PaymentMethodValue;
  onChange: (next: PaymentMethodValue) => void;
  /** Payer's full name — used as default for cardholder */
  payerName: string;
  disabled?: boolean;
}

// TODO: replace mock card fields with a hosted payment element
// (Stripe Elements `<CardElement>` or PayFast hosted fields).
// Raw PAN must NEVER be stored on our servers — the gateway
// returns a token that we persist instead. See docs TODO list.

const PaymentMethodForm: React.FC<Props> = ({
  value,
  onChange,
  payerName,
  disabled,
}) => {
  const set = <K extends keyof PaymentMethodValue>(key: K, v: PaymentMethodValue[K]) =>
    onChange({ ...value, [key]: v });

  const formatCardNumber = (raw: string) =>
    raw.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (raw: string) => {
    const d = raw.replace(/\D/g, '').slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  return (
    <div className="space-y-4">
      {/* Method toggle */}
      <div className="grid grid-cols-2 gap-2">
        {(['card', 'eft'] as const).map((m) => {
          const on = value.method === m;
          return (
            <button
              key={m}
              type="button"
              disabled={disabled}
              onClick={() => set('method', m)}
              className={`
                h-11 rounded-xl border text-xs font-semibold uppercase tracking-wider
                transition-all
                ${on
                  ? 'border-crimson-600 bg-crimson-950/25 text-white shadow-[0_0_0_3px_rgba(185,28,28,0.15)]'
                  : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                }
              `}
            >
              {m === 'card' ? 'Card' : 'EFT'}
            </button>
          );
        })}
      </div>

      {/* Card */}
      {value.method === 'card' && (
        <div className="space-y-3">
          <FormField
            label="Card number"
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            value={value.cardNumber}
            onChange={(e) => set('cardNumber', formatCardNumber(e.target.value))}
            required
            disabled={disabled}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Expiry"
              inputMode="numeric"
              placeholder="MM/YY"
              maxLength={5}
              value={value.cardExpiry}
              onChange={(e) => set('cardExpiry', formatExpiry(e.target.value))}
              required
              disabled={disabled}
            />
            <FormField
              label="CVC"
              inputMode="numeric"
              placeholder="123"
              maxLength={4}
              value={value.cardCvc}
              onChange={(e) => set('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
              required
              disabled={disabled}
            />
          </div>
          <FormField
            label="Cardholder name"
            placeholder={payerName || 'As shown on card'}
            value={value.cardHolder}
            onChange={(e) => set('cardHolder', e.target.value)}
            required
            disabled={disabled}
          />
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Cards are tokenised by our payment provider. We never see or store
            your card number.
          </p>
        </div>
      )}

      {/* EFT */}
      {value.method === 'eft' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 space-y-3">
          <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
            Bank transfer
          </p>
          <div className="text-xs text-zinc-300 space-y-1.5">
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Bank</span>
              <span className="font-medium">— (populated by backend) —</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Account name</span>
              <span className="font-medium">Team Stars MMA</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Reference</span>
              <span className="font-mono">Your email address</span>
            </div>
          </div>
          <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-zinc-800">
            <input
              type="checkbox"
              checked={value.eftAcknowledged}
              onChange={(e) => set('eftAcknowledged', e.target.checked)}
              disabled={disabled}
              className="mt-0.5 h-4 w-4 accent-crimson-600"
            />
            <span className="text-[11px] text-zinc-400 leading-relaxed">
              I understand my membership activates once payment reflects.
              I'll use my email as the payment reference.
            </span>
          </label>
        </div>
      )}

      {!value.method && (
        <p className="text-[11px] text-zinc-500 text-center py-2">
          Choose a payment method to continue.
        </p>
      )}
    </div>
  );
};

export default PaymentMethodForm;