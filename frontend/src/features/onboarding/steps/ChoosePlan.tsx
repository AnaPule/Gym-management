import React from 'react';
import { IonCard, IonRippleEffect } from '@ionic/react';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import type { AdultSignupForm } from '@/types/onboarding/types';

interface Props {
  form: AdultSignupForm;
  setForm: React.Dispatch<React.SetStateAction<AdultSignupForm>>;
  canContinue: boolean;
  onContinue: () => void;
  onBack: () => void;
}

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Combat',
    price: 'R 290',
    cadence: '/month',
    features: ['2 sessions per week', 'General mat access', 'Open gym hours'],
  },
  {
    id: 'pro',
    name: 'Pro Striker',
    price: 'R 490',
    cadence: '/month',
    features: ['Unlimited BJJ & striking', 'Doorway QR access', 'Member events'],
  },
  {
    id: 'elite',
    name: 'Elite Team',
    price: 'R 790',
    cadence: '/month',
    features: [
      'Full sparring clearance',
      'Private locker',
      'Gear shop discount',
      'Fight team access',
    ],
  },
];

const StepChoosePlan: React.FC<Props> = ({ form, setForm, canContinue, onContinue, onBack }) => {
  return (
    <div className="space-y-5 w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const selected = form.planId === plan.id;
          return (
            <IonCard
              key={plan.id}
              onClick={() => setForm((f) => ({ ...f, planId: plan.id }))}
              aria-pressed={selected}
              className={`
                ion-activatable relative overflow-hidden m-0 cursor-pointer
                rounded-2xl border-2 transition-all duration-200
                flex flex-col p-0
                ${selected
                  ? 'border-crimson-600 bg-crimson-950/25 shadow-[0_0_0_3px_rgba(185,28,28,0.15)]'
                  : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-950/70'
                }
              `}
              style={{ boxShadow: 'none' }}
            >
              <IonRippleEffect />

              {/* Content — generous padding, more vertical rhythm */}
              <div className="relative z-10 flex flex-col flex-1 px-6 pt-8 pb-7">
                {/* Plan name — eyebrow style */}
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-4">
                  {plan.name}
                </p>

                {/* Price block — big display font */}
                <div className="flex items-baseline gap-1.5 mb-7">
                  <span className="font-display text-5xl text-white tracking-wide leading-none">
                    {plan.price}
                  </span>
                  <span className="text-[11px] text-zinc-500">{plan.cadence}</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-zinc-800 mb-5" />

                {/* Features */}
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="text-[12px] text-zinc-300 flex items-start gap-2 leading-relaxed"
                    >
                      <span className={`mt-0.5 shrink-0 ${selected ? 'text-crimson-400' : 'text-zinc-600'}`}>
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </IonCard>
          );
        })}
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!canContinue}
        onClick={onContinue}
      >
        Continue
      </Button>

      <div className="pt-1 text-center">
        <LinkButton tone="muted" onClick={onBack}>← Back</LinkButton>
      </div>
    </div>
  );
};

export default StepChoosePlan;