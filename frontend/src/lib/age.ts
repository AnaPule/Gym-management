/**
 * @file        age.ts
 * @description Age calculation helpers used across the app for adult/minor
 *              gating and age-bracket assignment.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-19
 * @updated     2026-09-23
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-19  isAdult, ageFromDob, MINOR_AGE
 *   1.1.0  2026-09-23  Export ageBracketFor + brackets for youth classes
 */

export const MINOR_AGE = 18;

export function ageFromDob(dob: string | Date): number {
  const d = typeof dob === 'string' ? new Date(dob) : dob;
  if (Number.isNaN(d.getTime())) return NaN;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export function isAdult(dob: string | Date): boolean {
  const age = ageFromDob(dob);
  return Number.isFinite(age) && age >= MINOR_AGE;
}

export interface AgeBracket {
  name: string;
  minAge: number;
  maxAge: number;  // exclusive
}

export const AGE_BRACKETS: AgeBracket[] = [
  { name: 'u8',   minAge: 0,  maxAge: 8 },
  { name: 'u10',  minAge: 8,  maxAge: 10 },
  { name: 'u14',  minAge: 10, maxAge: 14 },
  { name: 'u18',  minAge: 14, maxAge: 18 },
];

export function ageBracketFor(age: number): AgeBracket | null {
  if (!Number.isFinite(age) || age < 0) return null;
  return AGE_BRACKETS.find((b) => age >= b.minAge && age < b.maxAge) ?? null;
}