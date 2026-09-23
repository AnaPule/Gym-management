/**
 * @file        steps.ts
 * @description Shared step config for the onboarding wizard. Same seven
 *              steps for adult and minor — only the label and description
 *              differ, chosen at render time by `mode`.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-21
 * @updated     2026-09-23
 * @version     2.0.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-21  Adult-only step list
 *   2.0.0  2026-09-22  Unified adult + minor step config
 */

export interface OnboardingStep {
  key: string;
  label?: string;
  adultLabel: string;
  adultDescription: string;
  minorLabel: string;
  minorDescription: string;
}

export const STEPS: OnboardingStep[] = [
  {
    key: 'details',
    adultLabel: 'Your details',
    minorLabel: 'Guardian & minor',
    adultDescription: 'Tell us who you are. This becomes your member account.',
    minorDescription: 'You are the guardian. Tell us about you and the minor.',
  },
  {
    key: 'verify',
    adultLabel: 'Verify email',
    minorLabel: 'Verify email',
    adultDescription: 'Confirm your email address before you continue.',
    minorDescription: 'Confirm your email address before we go further.',
  },
  {
    key: 'emergency',
    adultLabel: 'Emergency & medical',
    minorLabel: 'Emergency & medical',
    adultDescription: 'Who we contact, and any medical cover we should know about.',
    minorDescription: 'Who we contact, and how medical cover works for the minor.',
  },
  {
    key: 'fighter',
    adultLabel: 'Fighter profile',
    minorLabel: 'Fighter profile',
    adultDescription: 'So we can place you in the right weight class and training group.',
    minorDescription: 'So we can place them in the right class and weight group.',
  },
  {
    key: 'plan',
    adultLabel: 'Plan & payment',
    minorLabel: 'Plan & payment',
    adultDescription: 'Pick a membership and how you want to pay.',
    minorDescription: "Pick a youth plan and how you'll pay for it.",
  },
  {
    key: 'consents',
    adultLabel: 'Consents',
    minorLabel: 'Consents',
    adultDescription: 'Please read and accept each of the following before you join.',
    minorDescription: 'Standard waivers, guardian authority, and who may collect.',
  },
  {
    key: 'confirm',
    adultLabel: 'Confirm & finish',
    minorLabel: 'Confirm & finish',
    adultDescription: 'One last look before we create your account.',
    minorDescription: 'One last look before we create the account.',
  },
];

export const STEP = STEPS.reduce(
  (acc, s, i) => ({ ...acc, [s.key]: i }),
  {} as Record<string, number>
);

export function stepLabel(step: OnboardingStep, mode: 'adult' | 'minor') {
  return mode === 'adult' ? step.adultLabel : step.minorLabel;
}
export function stepDescription(step: OnboardingStep, mode: 'adult' | 'minor') {
  return mode === 'adult' ? step.adultDescription : step.minorDescription;
}