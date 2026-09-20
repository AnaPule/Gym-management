import React from 'react';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import { composePhone } from '@/lib/countries';
import { weightClassFor } from '@/lib/WeightClass';
import type { AdultSignupForm } from '@/types/onboarding/types';

interface Props {
  form: AdultSignupForm;
  submitting: boolean;
  error: string | null;
  onConfirm: () => void;
  onBack: () => void;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-zinc-800 last:border-b-0">
    <span className="text-[11px] uppercase tracking-wider text-zinc-500 pt-0.5">{label}</span>
    <span className="text-sm text-white text-right">{value}</span>
  </div>
);

const StepConfirm: React.FC<Props> = ({ form, submitting, error, onConfirm, onBack }) => {
  const planName =
    form.planId === 'basic' ? 'Basic Combat'
    : form.planId === 'pro' ? 'Pro Striker'
    : form.planId === 'elite' ? 'Elite Team'
    : '—';

  const { fighterProfile: fp } = form;
  const wc = fp.weightKg ? weightClassFor(fp.weightKg) : null;

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">

      <p className="text-xs text-zinc-400 leading-relaxed">
        One last look before we create your account.
      </p>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-1">
        <Row label="Name" value={`${form.firstName} ${form.lastName}`} />
        <Row label="Email" value={form.email} />
        <Row label="Phone" value={composePhone(form.phoneCountry, form.phoneNational)} />
        <Row label="Date of birth" value={form.dateOfBirth} />
        <Row
          label="Fighter"
          value={
            <>
              {fp.weightKg} kg · {fp.heightCm} cm
              {fp.gender && <> · {fp.gender}</>}
              {wc && (
                <>
                  <br />
                  <span className="text-crimson-400 text-xs">{wc.name}</span>
                </>
              )}
            </>
          }
        />
        <Row
          label="Emergency"
          value={
            <>
              {form.emergencyContact.name}
              <br />
              <span className="text-zinc-400 text-xs">
                {composePhone(form.emergencyContact.phoneCountry, form.emergencyContact.phoneNational)}
                {' · '}
                {form.emergencyContact.relationship}
              </span>
            </>
          }
        />
        <Row label="Plan" value={planName} />
      </div>

      {error && (
        <p role="alert" className="text-xs text-crimson-400 text-center">
          {error}
        </p>
      )}

      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        loading={submitting}
        onClick={onConfirm}
      >
        Create my account
      </Button>

      <div className="pt-1 text-center">
        <LinkButton tone="muted" onClick={onBack} disabled={submitting}>
          ← Back
        </LinkButton>
      </div>
    </div>
  );
};

export default StepConfirm;