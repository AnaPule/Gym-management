/**
 * @file        countries.ts
 * @description Country + dialling code data used by the phone input and
 *              phone composition helpers.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-20
 * @version     1.0.0
 */

export interface Country {
  iso: string;
  name: string;
  dial: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { iso: 'ZA', name: 'South Africa',   dial: '+27',  flag: '🇿🇦' },
  { iso: 'NG', name: 'Nigeria',        dial: '+234', flag: '🇳🇬' },
  { iso: 'KE', name: 'Kenya',          dial: '+254', flag: '🇰🇪' },
  { iso: 'GB', name: 'United Kingdom', dial: '+44',  flag: '🇬🇧' },
  { iso: 'US', name: 'United States',  dial: '+1',   flag: '🇺🇸' },
  { iso: 'AU', name: 'Australia',      dial: '+61',  flag: '🇦🇺' },
  { iso: 'IN', name: 'India',          dial: '+91',  flag: '🇮🇳' },
  { iso: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
];

export const digitsOnly = (v: string) => v.replace(/\D/g, '');
export const countryByIso = (iso: string) =>
  COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0];
export const composePhone = (iso: string, national: string) =>
  `${countryByIso(iso).dial}${digitsOnly(national)}`;