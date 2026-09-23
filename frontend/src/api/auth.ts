/**
 * @file        auth.ts
 * @description Auth API calls — sendOtp, verifyOtp. Used by the login
 *              page and the onboarding verify step (shared by adult and
 *              minor flows).
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-20
 * @version     1.0.0
 */

import { apiFetch } from './client';

type SendOtpArgs = { email: string; purpose: 'login' | 'register' };
type VerifyOtpArgs = { email: string; code: string; purpose: 'login' | 'register' };

export async function sendOtp({ email, purpose }: SendOtpArgs): Promise<void> {
  // TODO: POST /api/v1/auth/otp/request
  return apiFetch<void>(
    '/auth/otp/request',
    { method: 'POST', body: JSON.stringify({ email, purpose }) },
    { data: undefined, delay: 600 }
  );
}

export async function verifyOtp({
  email,
  code,
  purpose,
}: VerifyOtpArgs): Promise<{ registrationToken?: string; token?: string }> {
  // TODO: POST /api/v1/auth/otp/verify
  return apiFetch<{ registrationToken?: string; token?: string }>(
    '/auth/otp/verify',
    { method: 'POST', body: JSON.stringify({ email, code, purpose }) },
    { data: { registrationToken: 'stub-registration-token' }, delay: 700 }
  );
}