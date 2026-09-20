import { apiFetch } from './client';
import type { AdultSignupForm } from '@/types/onboarding/types';

export interface RegisterAdultPayload extends AdultSignupForm {
  code: string;
  registrationToken: string | null;
  planId: string;
  consents: {
    liability: boolean;
    medical: boolean;
    photoMedia: boolean;
    dataProcessing: boolean;
  };
}

export async function registerAdult(
  payload: RegisterAdultPayload
): Promise<{ token: string; memberId: string }> {
  // TODO: POST /api/v1/signup/adult
  return apiFetch<{ token: string; memberId: string }>(
    '/signup/adult',
    { method: 'POST', body: JSON.stringify(payload) },
    { data: { token: 'stub-token', memberId: 'stub-member-id' }, delay: 900 }
  );
}