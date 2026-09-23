/**
 * @file        Confirm.tsx
 * @description Final step of the onboarding wizard. Groups everything the
 *              member entered into labelled sections for review, and shows
 *              masked payment details when card was selected.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-22
 * @updated     2026-09-23
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-22  Initial combined review
 *   1.1.0  2026-09-23  Category sections + masked card display + edit links
 */

import React from 'react';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import { composePhone } from '@/lib/countries';
import { weightClassFor } from '@/lib/WeightClass';
import { ageFromDob } from '@/lib/age';
import { ageBracketFor } from '@/lib/age';
import { STEP } from '@/types/onboarding/steps';
import type { OnboardingForm } from '@/types/onboarding/types';

interface Props {
  form: OnboardingForm;
  submitting: boolean;
  error: string | null;
  onConfirm: () => void;
  onBack: () => void;
  /** Jump to a specific step to edit. */
  onEdit?: (stepIndex: number) => void;
}

/* ────────────────────────────────────────────────────────────
   Small presentational helpers
   ──────────────────────────────────────────────────────────── */

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-1.5">
    <span className="text-[11px] uppercase tracking-wider text-zinc-500 pt-0.5">
      {label}
    </span>
    <span className="text-sm text-white text-right">{value}</span>
  </div>
);

const Section: React.FC<{
  title: string;
  stepIndex?: number;
  onEdit?: (i: number) => void;
  children: React.ReactNode;
}> = ({ title, stepIndex, onEdit, children }) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
    <div className="flex items-center justify-between mb-1">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
        {title}
      </p>
      {onEdit && stepIndex !== undefined && (
        <button
          type="button"
          onClick={() => onEdit(stepIndex)}
          className="text-[10px] uppercase tracking-widest text-crimson-400 hover:text-crimson-300"
        >
          Edit
        </button>
      )}
    </div>
    <div className="divide-y divide-zinc-800/60">
      {children}
    </div>
  </div>
);

/** Masks a card number: keeps only the last 4 digits. */
function maskCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 4) return '••••';
  return `•••• •••• •••• ${digits.slice(-4)}`;
}

/** Formats ISO date (yyyy-mm-dd) as DD Mon YYYY for readability. */
function formatDate(iso: string): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

/* ────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────── */

const Confirm: React.FC<Props> = ({ form, submitting, error, onConfirm, onBack, onEdit }) => {
  const isMinor = form.mode === 'minor';
  const fp = form.fighterProfile;
  const wc = fp.weightKg ? weightClassFor(fp.weightKg) : null;
  const age = ageFromDob(form.subject.dateOfBirth);
  const bracket = isMinor && Number.isFinite(age) ? ageBracketFor(age) : null;

  const planName = form.planId
    ? form.planId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '—';

  return (
    <div className="space-y-4 w-full max-w-lg mx-auto max-h-[27rem] overflow-y-scroll pr-1">

      {/* ── Guardian(s) — minors only ── */}
      {isMinor && (
        <Section title="Guardian" stepIndex={STEP.details} onEdit={onEdit}>
          <Row label="Primary"
            value={`${form.guardian.firstName} ${form.guardian.lastName}`} />
          <Row label="Relationship" value={form.guardian.relationship || '—'} />
          <Row label="Email" value={form.guardian.email} />
          <Row label="Phone"
            value={composePhone(form.guardian.phoneCountry, form.guardian.phoneNational)} />
          {form.guardian2.enabled && (
            <Row label="Second guardian"
              value={`${form.guardian2.firstName} ${form.guardian2.lastName}`} />
          )}
        </Section>
      )}

      {/* ── Member ── */}
      <Section
        title={isMinor ? 'Minor' : 'Member'}
        stepIndex={STEP.details}
        onEdit={onEdit}
      >
        <Row label="Name" value={`${form.subject.firstName} ${form.subject.lastName}`} />
        <Row label="Date of birth"
          value={`${formatDate(form.subject.dateOfBirth)}${bracket ? ` · ${bracket.name.toUpperCase()}` : ''}`} />
        {!isMinor && (
          <>
            <Row label="Email" value={form.subject.email} />
            <Row label="Phone"
              value={composePhone(form.subject.phoneCountry, form.subject.phoneNational)} />
          </>
        )}
        {isMinor && form.school.name && (
          <Row label="School" value={`${form.school.name} · ${form.school.grade}`} />
        )}
      </Section>

      {/* ── Fighter profile ── */}
      <Section title="Fighter profile" stepIndex={STEP.fighter} onEdit={onEdit}>
        <Row
          label="Body"
          value={
            <>
              {fp.weightKg} kg · {fp.heightCm} cm
            </>
          }
        />
        {wc && <Row label="Weight class" value={wc.name} />}
        {fp.gender && <Row label="Gender" value={fp.gender} />}
        {fp.experience && <Row label="Experience" value={fp.experience} />}
        <Row label="Photo" value={fp.photoDataUrl ? 'Uploaded' : 'Not provided'} />
      </Section>

      {/* ── Emergency & medical ── */}
      <Section title="Emergency & medical" stepIndex={STEP.emergency} onEdit={onEdit}>
        <Row
          label="Emergency contact"
          value={
            <>
              {form.emergencyContact.name}
              {isMinor && form.emergencyContact.sameAsPrimary && (
                <span className="block text-[10px] text-zinc-500">
                  (same as primary guardian)
                </span>
              )}
            </>
          }
        />
        <Row label="Emergency phone"
          value={composePhone(form.emergencyContact.phoneCountry, form.emergencyContact.phoneNational)} />
        <Row label="Relationship" value={form.emergencyContact.relationship || '—'} />

        {form.medicalAid.scheme && form.medicalAid.scheme !== 'No medical aid' && (
          <>
            <Row label="Medical scheme" value={form.medicalAid.scheme} />
            <Row label="Membership no." value={form.medicalAid.membershipNumber || '—'} />
            <Row label="Main member"
              value={`${form.medicalAid.mainMemberName || '—'}${form.medicalAid.mainMemberRelationship ? ` (${form.medicalAid.mainMemberRelationship})` : ''}`} />
          </>
        )}
        {(!form.medicalAid.scheme || form.medicalAid.scheme === 'No medical aid') && (
          <Row label="Medical aid" value="None on file" />
        )}
      </Section>

      {/* ── Plan & payment ── */}
      <Section title="Plan & payment" stepIndex={STEP.plan} onEdit={onEdit}>
        <Row label="Plan" value={planName} />

        {form.payment.method === 'card' && (
          <>
            <Row label="Method" value="Card" />
            <Row label="Card" value={maskCardNumber(form.payment.cardNumber)} />
            <Row label="Cardholder" value={form.payment.cardHolder || '—'} />
            <Row label="Expires" value={form.payment.cardExpiry || '—'} />
          </>
        )}

        {form.payment.method === 'eft' && (
          <>
            <Row label="Method" value="EFT" />
            <Row label="Status" value="Awaiting transfer" />
          </>
        )}

        {!form.payment.method && (
          <Row label="Payment" value="—" />
        )}
      </Section>

      {/* ── Consents ── */}
      <Section title="Consents" stepIndex={STEP.consents} onEdit={onEdit}>
        <Row label="Standard waivers" value="4 accepted" />
        {isMinor && <Row label="Minor-specific" value="4 accepted" />}
        {isMinor && form.authorisedCollectors.length > 0 && (
          <Row
            label="Authorised collectors"
            value={`${form.authorisedCollectors.length} person${form.authorisedCollectors.length === 1 ? '' : 's'}`}
          />
        )}
      </Section>

      {/* Reassurance line for card payments */}
      {form.payment.method === 'card' && (
        <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
          Card details are held by our payment provider. Nothing is charged
          until your first billing date.
        </p>
      )}

      {error && (
        <p role="alert" className="text-xs text-crimson-400 text-center">{error}</p>
      )}

      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        loading={submitting}
        onClick={onConfirm}
      >
        Create the account
      </Button>

      <div className="pt-1 text-center">
        <LinkButton tone="muted" onClick={onBack} disabled={submitting}>← Back</LinkButton>
      </div>
    </div>
  );
};

export default Confirm;