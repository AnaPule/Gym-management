/**
 * @file        FighterProfile.tsx
 * @description Step 4 — weight, height, gender, experience, optional
 *              photo. Live weight-class preview as the user types.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-21
 * @updated     2026-09-23
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-21  Adult-only step
 *   1.1.0  2026-09-22  Shared with minor flow via OnboardingForm
 */

import React from 'react';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import PaymentMethodForm from '@/components/ui/PaymentMethodForm';
import type { OnboardingForm } from '@/types/onboarding/types';

interface Props {
  form: OnboardingForm;
  setForm: React.Dispatch<React.SetStateAction<OnboardingForm>>;
  canContinue: boolean;
  onContinue: () => void;
  onBack: () => void;
}

const ADULT_PLANS = [
  { id: 'basic', name: 'Basic Combat', price: 'R 290', cadence: '/month',
    features: ['2 sessions per week', 'General mat access', 'Open gym hours'] },
  { id: 'pro', name: 'Pro Striker', price: 'R 490', cadence: '/month', tag: 'Most popular',
    features: ['Unlimited BJJ & striking', 'Doorway QR access', 'Member events'] },
  { id: 'elite', name: 'Elite Team', price: 'R 790', cadence: '/month',
    features: ['Full sparring clearance', 'Private locker', 'Gear shop discount', 'Fight team access'] },
];

const YOUTH_PLANS = [
  { id: 'youth-basic', name: 'Youth Basic', price: 'R 190', cadence: '/month',
    features: ['1 session per week', 'Age-grouped class', 'Safety-first curriculum'] },
  { id: 'youth-pro', name: 'Youth Pro', price: 'R 320', cadence: '/month', tag: 'Most popular',
    features: ['2 sessions per week', 'Structured sparring', 'Grading pathway'] },
  { id: 'youth-elite', name: 'Youth Elite', price: 'R 490', cadence: '/month',
    features: ['Unlimited youth classes', 'Competition team path', '1-on-1 coaching blocks'] },
];

const ChoosePlan: React.FC<Props> = ({ form, setForm, canContinue, onContinue, onBack }) => {
  const isMinor = form.mode === 'minor';
  const plans = isMinor ? YOUTH_PLANS : ADULT_PLANS;

  const payerName = isMinor
    ? `${form.guardian.firstName} ${form.guardian.lastName}`.trim()
    : `${form.subject.firstName} ${form.subject.lastName}`.trim();

  return (
    <div className="space-y-5 w-full max-w-3xl mx-auto max-h-[27rem] overflow-y-scroll">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {plans.map((plan) => {
          const selected = form.planId === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setForm((f) => ({ ...f, planId: plan.id }))}
              aria-pressed={selected}
              className={`
                relative text-left rounded-2xl border-2 transition-all duration-200
                flex flex-col p-0 overflow-hidden
                ${selected
                  ? 'border-crimson-600 bg-crimson-950/25 shadow-[0_0_0_3px_rgba(185,28,28,0.15)]'
                  : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-950/70'
                }
              `}
            >
              {plan.tag && (
                <span className={`
                  absolute top-3 right-3 px-2.5 py-1 rounded-full
                  text-[9px] uppercase tracking-widest font-bold
                  ${selected
                    ? 'bg-crimson-600 text-white'
                    : 'bg-crimson-950 border border-crimson-800 text-crimson-400'
                  }
                `}>{plan.tag}</span>
              )}

              <div className="px-6 pt-8 pb-7 flex-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-4">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1.5 mb-7">
                  <span className="font-display text-5xl text-white tracking-wide leading-none">
                    {plan.price}
                  </span>
                  <span className="text-[11px] text-zinc-500">{plan.cadence}</span>
                </div>
                <div className="h-px bg-zinc-800 mb-5" />
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="text-[12px] text-zinc-300 flex items-start gap-2 leading-relaxed">
                      <span className={`mt-0.5 shrink-0 ${selected ? 'text-crimson-400' : 'text-zinc-600'}`}>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>

      {form.planId && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 space-y-4">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              Payment details
            </p>
            <span className="text-[10px] text-zinc-600">
              {isMinor ? "You pay for the minor's membership" : 'Billed to you'}
            </span>
          </div>

          <PaymentMethodForm
            value={form.payment}
            onChange={(next) => setForm((f) => ({ ...f, payment: next }))}
            payerName={payerName}
          />
        </div>
      )}

      <Button type="button" variant="primary" size="lg" fullWidth
        disabled={!canContinue} onClick={onContinue}>
        Continue
      </Button>
      <div className="pt-1 text-center">
        <LinkButton tone="muted" onClick={onBack}>← Back</LinkButton>
      </div>
    </div>
  );
};

export default ChoosePlan;