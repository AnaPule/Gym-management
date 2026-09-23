/**
 * @file        OnboardingShell.tsx
 * @description Shared multi-step signup wizard for both adult and minor
 *              members. Owns all wizard state and swaps step components
 *              based on `mode` ('adult' | 'minor').
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-22
 * @updated     2026-09-23
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-22  Initial unified shell for adult + minor
 *   1.1.0  2026-09-23  Pass onEdit to Confirm for jump-to-step editing
 */

import React, { useMemo, useState } from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import { STEPS, STEP, stepLabel, stepDescription } from '@/types/onboarding/steps';
import { emptyForm, type OnboardingForm, type Mode } from '@/types/onboarding/types';
import { computeCanNext } from '@/types/onboarding/validation';
import { registerMember } from '@/api/signup';

import Details from './steps/Details';
import VerifyEmail from './steps/VerifyEmail';
import EmergencyMedical from './steps/EmergencyMedical';
import FighterProfile from './steps/FighterProfile';
import ChoosePlan from './steps/ChoosePlan';
import Consents from './steps/Consents';
import Confirm from './steps/Confirm';

interface OnboardingShellProps {
  mode: Mode;
  onComplete?: (r: { token: string; memberId: string }) => void;
  onCancel?: () => void;
}

const OnboardingShell: React.FC<OnboardingShellProps> = ({
  mode,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState(STEP.details);
  const [maxStep, setMaxStep] = useState(STEP.details);
  const [form, setForm] = useState<OnboardingForm>(() => emptyForm(mode));
  const [otpVerified, setOtpVerified] = useState(false);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canNext = useMemo(
    () => computeCanNext(form, otpVerified),
    [form, otpVerified]
  );

  const goTo = (n: number) => {
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
  };
  const next = () => goTo(step + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleVerifyDone = (token: string | null) => {
    setRegistrationToken(token);
    setOtpVerified(true);
    next();
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await registerMember(form, registrationToken);
      onComplete?.(result);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const current = STEPS[step];

  // Email to verify differs by mode:
  //   adult  → the member's own email
  //   minor  → the guardian's email
  const verificationEmail =
    mode === 'adult' ? form.subject.email : form.guardian.email;

  const headline =
    mode === 'adult' ? 'Join A Team Stars' : 'Register a young fighter';

  const subtext =
    mode === 'adult' ? 'Adult membership signup' : 'Guardian-led signup';

  return (
    <AuthLayout headline={headline} subtext={subtext}>
      <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-925">
        <div className="relative z-10 p-6 sm:p-8 space-y-6">

          <OnboardingStepper
            currentStep={step}
            maxStep={maxStep}
            canNext={canNext}
            onJump={setStep}
          />

          <div className="text-center space-y-1">
            <h2 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide">
              {stepLabel(current, mode)}
            </h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              {stepDescription(current, mode)}
            </p>
          </div>

          <div className="flex justify-center w-full">
            {step === STEP.details && (
              <Details
                form={form}
                setForm={setForm}
                canContinue={canNext[STEP.details]}
                onContinue={next}
                onCancel={onCancel}
              />
            )}

            {step === STEP.verify && (
              <VerifyEmail
                email={verificationEmail}
                onVerified={handleVerifyDone}
                onBack={back}
              />
            )}

            {step === STEP.emergency && (
              <EmergencyMedical
                form={form}
                setForm={setForm}
                canContinue={canNext[STEP.emergency]}
                onContinue={next}
                onBack={back}
              />
            )}

            {step === STEP.fighter && (
              <FighterProfile
                form={form}
                setForm={setForm}
                canContinue={canNext[STEP.fighter]}
                onContinue={next}
                onBack={back}
              />
            )}

            {step === STEP.plan && (
              <ChoosePlan
                form={form}
                setForm={setForm}
                canContinue={canNext[STEP.plan]}
                onContinue={next}
                onBack={back}
              />
            )}

            {step === STEP.consents && (
              <Consents
                form={form}
                setForm={setForm}
                canContinue={canNext[STEP.consents]}
                onContinue={next}
                onBack={back}
              />
            )}

            {step === STEP.confirm && (
              <Confirm
                form={form}
                submitting={submitting}
                error={error}
                onConfirm={handleConfirm}
                onBack={back}
                onEdit={(i) => setStep(i)}
              />
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default OnboardingShell;