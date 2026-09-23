/**
 * @file        EmergencyMedical.tsx
 * @description Step 3 of the onboarding wizard. Collects emergency
 *              contact details plus medical aid and health declarations.
 *              For minors, includes a "same as primary guardian"
 *              checkbox that auto-fills and locks the emergency fields.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-22
 * @updated     2026-09-23
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-22  Initial mode-aware step
 *   1.1.0  2026-09-23  Add "same as primary guardian" toggle for minors
 */

import React from 'react';
import { Form, FormField } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import PhoneInput from '@/components/ui/Phone';
import Dropdown from '@/components/ui/Dropdown';
import type { OnboardingForm } from '@/types/onboarding/types';

interface Props {
  form: OnboardingForm;
  setForm: React.Dispatch<React.SetStateAction<OnboardingForm>>;
  canContinue: boolean;
  onContinue: () => void;
  onBack: () => void;
}

const SCHEMES = [
  'Discovery Health', 'Momentum Health', 'Bonitas', 'Medihelp',
  'Fedhealth', 'Bestmed', 'Selfmed', 'GEMS', 'No medical aid', 'Other',
];

const EmergencyMedical: React.FC<Props> = ({ form, setForm, canContinue, onContinue, onBack }) => {
  const isMinor = form.mode === 'minor';
  const e = form.emergencyContact;
  const m = form.medicalAid;

  const setE = <K extends keyof typeof e>(k: K, v: (typeof e)[K]) =>
    setForm((f) => ({ ...f, emergencyContact: { ...f.emergencyContact, [k]: v } }));

  const setM = <K extends keyof typeof m>(k: K, v: (typeof m)[K]) =>
    setForm((f) => ({ ...f, medicalAid: { ...f.medicalAid, [k]: v } }));

  /**
   * Toggle "same as primary guardian". When enabled, copies the primary
   * guardian's name + phone into the emergency contact fields and marks
   * them locked. When disabled, clears the borrowed values (unless the
   * guardian had typed their own — but since we lock the inputs while
   * the flag is on, there's no user input to lose).
   */
  const toggleSameAsPrimary = (checked: boolean) => {
    if (checked) {
      setForm((f) => ({
        ...f,
        emergencyContact: {
          ...f.emergencyContact,
          sameAsPrimary: true,
          name: `${f.guardian.firstName} ${f.guardian.lastName}`.trim(),
          phoneCountry: f.guardian.phoneCountry,
          phoneNational: f.guardian.phoneNational,
          relationship: f.guardian.relationship || 'Guardian',
        },
      }));
    } else {
      setForm((f) => ({
        ...f,
        emergencyContact: {
          ...f.emergencyContact,
          sameAsPrimary: false,
          name: '',
          phoneCountry: 'ZA',
          phoneNational: '',
          relationship: '',
        },
      }));
    }
  };

  const locked = isMinor && e.sameAsPrimary;

  return (
    <Form
      className="max-h-[20rem] overflow-y-scroll"
      onSubmit={(ev) => { ev.preventDefault(); if (canContinue) onContinue(); }}
    >
      <p className="text-xs text-zinc-400 leading-relaxed">
        {isMinor
          ? 'Who we contact in an emergency, and how medical cover works for the minor.'
          : 'Who we contact, and any medical cover we should know about.'}
      </p>

      {/* Emergency contact — always */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-3">
        <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
          Emergency contact
        </p>

        {/* Minor-only shortcut: reuse the primary guardian's details */}
        {isMinor && (
          <label className="flex items-start gap-3 cursor-pointer pb-1 border-b border-zinc-800 mb-2">
            <input
              type="checkbox"
              checked={e.sameAsPrimary}
              onChange={(ev) => toggleSameAsPrimary(ev.target.checked)}
              className="mt-0.5 h-4 w-4 accent-crimson-600"
            />
            <span className="text-[11px] text-zinc-300 leading-relaxed">
              Same as primary guardian
              <span className="block text-zinc-500 mt-0.5">
                We'll use {form.guardian.firstName || 'the primary guardian'}'s
                details and lock these fields.
              </span>
            </span>
          </label>
        )}

        {isMinor && !e.sameAsPrimary && (
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Someone other than the primary guardian, in case we can't reach you.
          </p>
        )}

        <FormField
          label="Full name"
          value={e.name}
          onChange={(ev) => setE('name', ev.target.value)}
          placeholder={isMinor ? 'Elena Volkov' : 'Jane Vance'}
          required
          disabled={locked}
        />

        <PhoneInput
          label="Phone number"
          country={e.phoneCountry}
          value={e.phoneNational}
          onChange={(c, n) =>
            setForm((f) => ({
              ...f,
              emergencyContact: { ...f.emergencyContact, phoneCountry: c, phoneNational: n },
            }))
          }
          required
          disabled={locked}
        />

        <Dropdown
          label="Relationship"
          value={e.relationship}
          onChange={(v) => setE('relationship', v)}
          options={['Partner', 'Spouse', 'Parent', 'Sibling', 'Friend',
            'Grandparent', 'Aunt', 'Uncle', 'Coach', 'Other']}
          placeholder="Select…"
          required
          disabled={locked}
        />
      </div>

      {/* Medical aid — required for minor, optional for adult */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-3">
        <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
          Medical aid
        </p>
        <p className="text-[11px] text-zinc-500 leading-relaxed -mt-1">
          {isMinor
            ? "Required for minors. If the minor is on your medical aid, enter your details as main member."
            : 'Optional. Add it if you want us to have it on file for emergencies.'}
        </p>

        <Dropdown
          label="Medical scheme"
          value={m.scheme}
          onChange={(v) => setM('scheme', v)}
          options={SCHEMES}
          placeholder="Select or type…"
          required={isMinor}
        />

        {m.scheme && m.scheme !== 'No medical aid' && (
          <>
            <FormField
              label="Membership number"
              value={m.membershipNumber}
              onChange={(ev) => setM('membershipNumber', ev.target.value)}
              placeholder="e.g. 123456789"
              required={isMinor}
            />

            <FormField
              label="Main member name"
              value={m.mainMemberName}
              onChange={(ev) => setM('mainMemberName', ev.target.value)}
              placeholder="Whose name is on the policy"
              required={isMinor}
            />

            <Dropdown
              label="Main member relationship"
              value={m.mainMemberRelationship}
              onChange={(v) => setM('mainMemberRelationship', v)}
              options={['Self', 'Mother', 'Father', 'Legal Guardian', 'Step-parent', 'Grandparent', 'Other']}
              placeholder="Select…"
              required={isMinor}
            />
          </>
        )}
      </div>

      {/* Health declarations — optional both */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-3">
        <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
          Health declarations
        </p>
        <p className="text-[11px] text-zinc-500 leading-relaxed -mt-1">
          Optional — helps coaches keep {isMinor ? 'the minor' : 'you'} safe during training.
        </p>

        <FormField
          label="Medical conditions"
          value={m.conditions}
          onChange={(ev) => setM('conditions', ev.target.value)}
          placeholder="e.g. asthma, diabetes — or leave blank"
        />
        <FormField
          label="Allergies"
          value={m.allergies}
          onChange={(ev) => setM('allergies', ev.target.value)}
          placeholder="e.g. peanuts, latex — or leave blank"
        />
        <FormField
          label="Current medications"
          value={m.medications}
          onChange={(ev) => setM('medications', ev.target.value)}
          placeholder="e.g. Ventolin inhaler — or leave blank"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={!canContinue}>
        Continue
      </Button>
      <div className="pt-1 text-center">
        <LinkButton tone="muted" onClick={onBack}>← Back</LinkButton>
      </div>
    </Form>
  );
};

export default EmergencyMedical;