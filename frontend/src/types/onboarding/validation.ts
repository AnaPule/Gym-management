import { isAdult } from '@/lib/age';
import type { AdultSignupForm } from './types';
import { STEP } from './steps';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (v: string) => EMAIL_RE.test(v.trim());

const isPhone = (v: string) => v.trim().replace(/\D/g, '').length >= 7;

const nameOk = (v: string) => v.trim().length >= 2;

export function isYourDetailsComplete(f: AdultSignupForm): boolean {
  return (
    nameOk(f.firstName) &&
    nameOk(f.lastName) &&
    isAdult(f.dateOfBirth) &&
    isValidEmail(f.email) &&
    isPhone(f.phoneNational)
  );
}

export function isEmergencyComplete(f: AdultSignupForm): boolean {
  return (
    nameOk(f.emergencyContact.name) &&
    isPhone(f.emergencyContact.phoneNational) &&
    f.emergencyContact.relationship.trim().length > 0
  );
}

export function isFighterProfileComplete(f: AdultSignupForm): boolean {
  const { weightKg, heightCm, gender } = f.fighterProfile;
  return (
    typeof weightKg === 'number' && weightKg > 0 &&
    typeof heightCm === 'number' && heightCm > 0 &&
    gender.trim().length > 0
  );
}

export function areAllConsentsAccepted(f: AdultSignupForm): boolean {
  const c = f.consents;
  return c.liability && c.medical && c.photoMedia && c.dataProcessing;
}

export function isPlanChosen(f: AdultSignupForm): boolean {
  return Boolean(f.planId);
}

export function computeCanNext(f: AdultSignupForm, otpVerified: boolean): Record<number, boolean> {
  return {
    [STEP.details]: isYourDetailsComplete(f),
    [STEP.verify]: otpVerified,
    [STEP.emergency]: isEmergencyComplete(f),
    [STEP.fighter]: isFighterProfileComplete(f),
    [STEP.consents]: areAllConsentsAccepted(f),
    [STEP.plan]: isPlanChosen(f),
    [STEP.confirm]: true,
  };
}