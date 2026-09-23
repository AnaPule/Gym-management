/**
 * @file        Details.tsx
 * @description Step 1 of the onboarding wizard. For adults it collects the
 *              member's own details. For minors it collects the guardian's
 *              details (with optional second guardian) plus the minor's
 *              own name, DOB, gender, and school info.
 * @author      AnaPule
 * @created     2026-09-22
 * @updated     2026-09-23
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-22  Initial mode-aware step
 *   1.1.0  2026-09-23  Age-aware grade suggestions for minors
 */

import React, { useMemo } from 'react';
import { Form, FormField } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import PhoneInput from '@/components/ui/Phone';
import Dropdown from '@/components/ui/Dropdown';
import { ageFromDob } from '@/lib/age';
import { suggestGrades, allGrades } from '@/lib/grade';
import type { OnboardingForm } from '@/types/onboarding/types';

interface Props {
  form: OnboardingForm;
  setForm: React.Dispatch<React.SetStateAction<OnboardingForm>>;
  canContinue: boolean;
  onContinue: () => void;
  onCancel?: () => void;
}

const RELATIONSHIPS = ['Mother', 'Father', 'Legal Guardian', 'Step-parent', 'Grandparent', 'Other'];

const Details: React.FC<Props> = ({ form, setForm, canContinue, onContinue, onCancel }) => {
  const isMinor = form.mode === 'minor';

  // Show-all-grades escape hatch for guardians whose child is outside
  // the typical grade range (repeated a year, skipped a year, etc.).
  const [showAllGrades, setShowAllGrades] = React.useState(false);

  const minorAge = useMemo(
    () => ageFromDob(form.subject.dateOfBirth),
    [form.subject.dateOfBirth]
  );

  const gradeOptions = useMemo(() => {
    if (showAllGrades || !Number.isFinite(minorAge)) return allGrades();
    return suggestGrades(minorAge);
  }, [showAllGrades, minorAge]);

  const setSubject = <K extends keyof typeof form.subject>(k: K, v: (typeof form.subject)[K]) =>
    setForm((f) => ({ ...f, subject: { ...f.subject, [k]: v } }));

  const setGuardian = <K extends keyof typeof form.guardian>(k: K, v: (typeof form.guardian)[K]) =>
    setForm((f) => ({ ...f, guardian: { ...f.guardian, [k]: v } }));

  const setGuardian2 = <K extends keyof typeof form.guardian2>(k: K, v: (typeof form.guardian2)[K]) =>
    setForm((f) => ({ ...f, guardian2: { ...f.guardian2, [k]: v } }));

  const setSchool = <K extends keyof typeof form.school>(k: K, v: (typeof form.school)[K]) =>
    setForm((f) => ({ ...f, school: { ...f.school, [k]: v } }));

  return (
    <Form
      className="max-h-[20rem] overflow-y-scroll"
      onSubmit={(e) => { e.preventDefault(); if (canContinue) onContinue(); }}
    >
      {/* ── MINOR: Guardian block first ── */}
      {isMinor && (
        <>
          <p className="text-xs text-zinc-400 leading-relaxed">
            You are the guardian. You'll be the primary contact and payer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Your first name" value={form.guardian.firstName}
              onChange={(e) => setGuardian('firstName', e.target.value)} autoFocus required />
            <FormField label="Your last name" value={form.guardian.lastName}
              onChange={(e) => setGuardian('lastName', e.target.value)} required />
          </div>

          <FormField label="Your date of birth" type="date" value={form.guardian.dateOfBirth}
            onChange={(e) => setGuardian('dateOfBirth', e.target.value)}
            hint="Guardians must be 18 or older." required />

          <FormField label="Your email address" type="email" inputMode="email"
            value={form.guardian.email}
            onChange={(e) => setGuardian('email', e.target.value)}
            placeholder="you@example.com" required />

          <PhoneInput label="Your phone number"
            country={form.guardian.phoneCountry} value={form.guardian.phoneNational}
            onChange={(c, n) => setForm((f) => ({ ...f, guardian: { ...f.guardian, phoneCountry: c, phoneNational: n } }))}
            required />

          <Dropdown label="Relationship to the minor" value={form.guardian.relationship}
            onChange={(v) => setGuardian('relationship', v)}
            options={RELATIONSHIPS} placeholder="Select…" required />

          {/* Optional second guardian */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40">
            <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
              <input type="checkbox" checked={form.guardian2.enabled}
                onChange={(e) => setGuardian2('enabled', e.target.checked)}
                className="h-4 w-4 accent-crimson-600" />
              <span className="text-xs font-semibold text-white">Add a second guardian</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 ml-auto">Optional</span>
            </label>

            {form.guardian2.enabled && (
              <div className="px-4 pb-4 pt-1 space-y-3 border-t border-zinc-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="First name" value={form.guardian2.firstName}
                    onChange={(e) => setGuardian2('firstName', e.target.value)} />
                  <FormField label="Last name" value={form.guardian2.lastName}
                    onChange={(e) => setGuardian2('lastName', e.target.value)} />
                </div>
                <FormField label="Email address" type="email" inputMode="email"
                  value={form.guardian2.email}
                  onChange={(e) => setGuardian2('email', e.target.value)} />
                <PhoneInput label="Phone number"
                  country={form.guardian2.phoneCountry} value={form.guardian2.phoneNational}
                  onChange={(c, n) => setForm((f) => ({ ...f, guardian2: { ...f.guardian2, phoneCountry: c, phoneNational: n } }))} />
                <Dropdown label="Relationship to the minor" value={form.guardian2.relationship}
                  onChange={(v) => setGuardian2('relationship', v)}
                  options={RELATIONSHIPS} placeholder="Select…" />
              </div>
            )}
          </div>

          <div className="h-px bg-zinc-800 my-2" />
          <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
            The minor
          </p>
        </>
      )}

      {/* ── Subject (adult self / minor) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="First name" value={form.subject.firstName}
          onChange={(e) => setSubject('firstName', e.target.value)}
          placeholder={isMinor ? 'Leo' : 'Alex'}
          autoFocus={!isMinor} required />
        <FormField label="Last name" value={form.subject.lastName}
          onChange={(e) => setSubject('lastName', e.target.value)}
          placeholder={isMinor ? 'Vance' : 'Volkov'} required />
      </div>

      <FormField label="Date of birth" type="date" value={form.subject.dateOfBirth}
        onChange={(e) => setSubject('dateOfBirth', e.target.value)}
        hint={isMinor ? 'Must be under 18.' : 'Must be 18 or older.'} required />

      {/* Adult email + phone — minor's email/phone is optional and handled elsewhere */}
      {!isMinor && (
        <>
          <FormField label="Email address" type="email" inputMode="email"
            value={form.subject.email}
            onChange={(e) => setSubject('email', e.target.value)}
            placeholder="you@example.com" required />
          <PhoneInput label="Phone number"
            country={form.subject.phoneCountry} value={form.subject.phoneNational}
            onChange={(c, n) => setForm((f) => ({ ...f, subject: { ...f.subject, phoneCountry: c, phoneNational: n } }))}
            required />
        </>
      )}

      {/* Minor: gender + school */}
      {isMinor && (
        <>
          <Dropdown label="Gender" value={form.subject.gender}
            onChange={(v) => setSubject('gender', v)}
            options={['Male', 'Female', 'Other', 'Prefer not to say']}
            placeholder="Select…" required />

          <Dropdown label="School" value={form.school.name}
            onChange={(v) => setSchool('name', v)}
            options={['Cape Town High', 'Rondebosch Boys', 'Westerford High',
              'Herzlia High', 'SACS', 'Bishops', 'Other']}
            placeholder="Start typing…"
            hint="Type the school name if it's not listed." required />

          <div>
            <Dropdown label="Grade / year" value={form.school.grade}
              onChange={(v) => setSchool('grade', v)}
              options={gradeOptions}
              placeholder="Select…"
              hint={
                !showAllGrades && Number.isFinite(minorAge)
                  ? `Suggested for age ${minorAge}`
                  : undefined
              }
              required />

            {/* Escape hatch: reveal every grade if the suggestion is wrong */}
            {!showAllGrades && Number.isFinite(minorAge) && (
              <button
                type="button"
                onClick={() => setShowAllGrades(true)}
                className="mt-1.5 text-[11px] text-crimson-400 hover:text-crimson-300 font-medium"
              >
                Show all grades
              </button>
            )}
            {showAllGrades && (
              <button
                type="button"
                onClick={() => setShowAllGrades(false)}
                className="mt-1.5 text-[11px] text-zinc-500 hover:text-zinc-400"
              >
                ← Back to suggested grades
              </button>
            )}
          </div>

          <PhoneInput label="School phone (optional)"
            country={form.school.phoneCountry} value={form.school.phoneNational}
            onChange={(c, n) => setForm((f) => ({ ...f, school: { ...f.school, phoneCountry: c, phoneNational: n } }))} />
        </>
      )}

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={!canContinue}>
        Continue
      </Button>

      {onCancel && (
        <div className="pt-1 text-center">
          <LinkButton tone="muted" onClick={onCancel}>Cancel signup</LinkButton>
        </div>
      )}
    </Form>
  );
};

export default Details;