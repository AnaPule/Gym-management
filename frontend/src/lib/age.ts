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