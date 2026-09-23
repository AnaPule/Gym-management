/**
 * @file        validation.ts
 * @description Per-step completeness checks for the onboarding wizard.
 *              Single source of truth driving the Continue button and the
 *              stepper's done-marks.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-21
 * @updated     2026-09-22
 * @version     2.0.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-21  Adult-only validation
 *   2.0.0  2026-09-22  Unified; branches on form.mode
 */

import { ageFromDob, MINOR_AGE } from '@/lib/age';
import type { OnboardingForm } from './types';
import { STEP } from './steps';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailOk = (v: string) => EMAIL_RE.test(v.trim());
const nameOk = (v: string) => v.trim().length >= 2;
const phoneOk = (v: string) => v.replace(/\D/g, '').length >= 7;

function detailsComplete(f: OnboardingForm): boolean {
  if (f.mode === 'adult') {
    const age = ageFromDob(f.subject.dateOfBirth);
    return (
      nameOk(f.subject.firstName) && nameOk(f.subject.lastName) &&
      Number.isFinite(age) && age >= MINOR_AGE &&
      emailOk(f.subject.email) && phoneOk(f.subject.phoneNational)
    );
  }
  // minor: guardian complete + minor complete + guardian2 if enabled + school
  const gAge = ageFromDob(f.guardian.dateOfBirth);
  const mAge = ageFromDob(f.subject.dateOfBirth);
  const guardianOk =
    nameOk(f.guardian.firstName) && nameOk(f.guardian.lastName) &&
    Number.isFinite(gAge) && gAge >= MINOR_AGE &&
    emailOk(f.guardian.email) && phoneOk(f.guardian.phoneNational) &&
    f.guardian.relationship.trim().length > 0;

  const guardian2Ok = !f.guardian2.enabled || (
    nameOk(f.guardian2.firstName) && nameOk(f.guardian2.lastName) &&
    emailOk(f.guardian2.email) && phoneOk(f.guardian2.phoneNational) &&
    f.guardian2.relationship.trim().length > 0
  );

  const minorOk =
    nameOk(f.subject.firstName) && nameOk(f.subject.lastName) &&
    Number.isFinite(mAge) && mAge >= 0 && mAge < MINOR_AGE &&
    f.subject.gender.trim().length > 0 &&
    f.school.name.trim().length > 0 &&
    f.school.grade.trim().length > 0;

  return guardianOk && guardian2Ok && minorOk;
}

function emergencyComplete(f: OnboardingForm): boolean {
  const e = f.emergencyContact;
  const base = nameOk(e.name) && phoneOk(e.phoneNational) && e.relationship.trim().length > 0;
  if (f.mode === 'adult') return base;
  // minor: medical aid required
  const m = f.medicalAid;
  return base &&
    m.scheme.trim().length > 0 &&
    m.membershipNumber.trim().length > 0 &&
    nameOk(m.mainMemberName) &&
    m.mainMemberRelationship.trim().length > 0;
}

function fighterComplete(f: OnboardingForm): boolean {
  const { weightKg, heightCm } = f.fighterProfile;
  return typeof weightKg === 'number' && weightKg > 0
    && typeof heightCm === 'number' && heightCm > 0;
}

function planComplete(f: OnboardingForm): boolean {
  if (!f.planId) return false;
  if (f.payment.method === 'card') {
    const digits = f.payment.cardNumber.replace(/\D/g, '');
    return (
      digits.length >= 13 &&
      /^\d{2}\/\d{2}$/.test(f.payment.cardExpiry) &&
      f.payment.cardCvc.replace(/\D/g, '').length >= 3 &&
      nameOk(f.payment.cardHolder)
    );
  }
  if (f.payment.method === 'eft') return f.payment.eftAcknowledged;
  return false;
}

function consentsComplete(f: OnboardingForm): boolean {
  const c = f.consents;
  const standard = c.liability && c.medical && c.photoMedia && c.dataProcessing;
  if (f.mode === 'adult') return standard;
  // minor adds
  return standard &&
    c.guardianAuthority && c.emergencyTreatment && c.sparring && c.popiaSpecial;
}

export function computeCanNext(f: OnboardingForm, otpVerified: boolean): Record<number, boolean> {
  return {
    [STEP.details]: detailsComplete(f),
    [STEP.verify]: otpVerified,
    [STEP.emergency]: emergencyComplete(f),
    [STEP.fighter]: fighterComplete(f),
    [STEP.plan]: planComplete(f),
    [STEP.consents]: consentsComplete(f),
    [STEP.confirm]: true,
  };
}