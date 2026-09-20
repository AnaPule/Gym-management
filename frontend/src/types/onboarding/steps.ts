export interface OnboardingStep {
  key: string;
  label: string;
  description: string;
}

export const STEPS: OnboardingStep[] = [
  { key: 'details',   label: 'Your details',      description: 'Tell us who you are. This becomes your member account.' },
  { key: 'verify',    label: 'Verify email',      description: 'We need to confirm your email address before you continue.' },
  { key: 'emergency', label: 'Emergency contact', description: 'Who should we contact if something happens during training?' },
  { key: 'fighter',   label: 'Fighter profile',   description: 'So we can place you in the right weight class and training group.' },
  { key: 'consents',  label: 'Consents & waivers', description: 'Please read and accept each of the following before you join.' },
  { key: 'plan',      label: 'Choose a plan',     description: 'Pick the membership that fits your training.' },
  { key: 'confirm',   label: 'Confirm & finish',  description: 'Review your details one last time before we create your account.' },
];

export const STEP = STEPS.reduce(
  (acc, s, i) => ({ ...acc, [s.key]: i }),
  {} as Record<string, number>
);