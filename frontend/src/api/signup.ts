/**
 * @file        signup.ts
 * @description Single registerMember endpoint for both adult and minor
 *              signups. Branches on `mode` server-side. Payment details
 *              are mocked until the gateway is wired.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-23
 * @version     2.0.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-20  registerAdult (single flow)
 *   2.0.0  2026-09-23  Unified registerMember; mode-aware
 *
 * TODO: replace mocked card data with a gateway token before POST.
 */

import { apiFetch } from './client';
import type { OnboardingForm } from '@/types/onboarding/types';

export interface RegisterMemberResponse {
  token: string;
  memberId: string;
}

export interface RegisterMemberPayload extends OnboardingForm {
  registrationToken: string | null;
}

/**
 * Register an adult or minor member.
 *
 * One endpoint, `/signup`, branches on `mode` server-side:
 *   - `mode: 'adult'` → creates Person + Membership, guardian fields ignored
 *   - `mode: 'minor'` → creates Person (minor) + GuardianLink + Membership,
 *                       guardian fields required
 *
 * Payment:
 *   Card details are mocked for now. Before sending, the gateway must
 *   tokenise them and the token is what goes on the wire, never the raw PAN.
 *
 * TODO: replace mocked card data with a token from Stripe Elements
 *       (or PayFast hosted fields) before this call fires.
 */
export async function registerMember(
  form: OnboardingForm,
  registrationToken: string | null
): Promise<RegisterMemberResponse> {
  const payload: RegisterMemberPayload = {
    ...form,
    registrationToken,
  };

  // TODO: POST /api/v1/signup
  return apiFetch<RegisterMemberResponse>(
    '/signup',
    { method: 'POST', body: JSON.stringify(payload) },
    { data: { token: 'stub-token', memberId: 'stub-member-id' }, delay: 900 }
  );
}