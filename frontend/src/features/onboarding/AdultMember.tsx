import React, { useMemo, useState } from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import { STEPS, STEP } from '@/types/onboarding/steps';
import { emptyAdultSignupForm, type AdultSignupForm } from '@/types/onboarding/types';
import { computeCanNext } from '@/types/onboarding/validation';
import { registerAdult } from '@/api/signup';

import StepYourDetails from '@/features/onboarding/steps/Details';
import StepVerifyEmail from '@/features/onboarding/steps/VerifyEmail';
import StepEmergencyContact from '@/features/onboarding/steps/EmergencyContact';
import StepConsents from '@/features/onboarding/steps/Consents';
import StepChoosePlan from '@/features/onboarding/steps/ChoosePlan';
import StepConfirm from '@/features/onboarding/steps/Confirm';

import Logo from '@/components/ui/Logo';
import FighterProfile from '@/features/onboarding/steps/FighterProfile';

interface AdultOnboardingPageProps {
  onComplete?: (result: { token: string; memberId: string }) => void;
  onCancel?: () => void;
}

const AdultOnboardingPage: React.FC<AdultOnboardingPageProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(STEP.details);
  const [maxStep, setMaxStep] = useState(STEP.details);
  const [form, setForm] = useState<AdultSignupForm>(emptyAdultSignupForm);
  const [otpVerified, setOtpVerified] = useState(false);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canNext = useMemo(
    () => computeCanNext(form, otpVerified),
    [form, otpVerified]
  );

  const goTo = (next: number) => {
    setStep(next);
    setMaxStep((m) => Math.max(m, next));
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
      const result = await registerAdult({
        ...form,
        code: '', // TODO: capture the actual code from StepVerifyEmail if backend requires it
        registrationToken,
        planId: form.planId ?? '',
        consents: form.consents,
      });
      onComplete?.(result);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentStep = STEPS[step];

  return (
    <AuthLayout headline="Join A Team Stars" subtext="Adult membership signup">
      <div className="relative w-full rounded-2xl overflow-scroll">

        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          {/* Stepper */}
          <OnboardingStepper
            currentStep={step}
            maxStep={maxStep}
            canNext={canNext}
            onJump={(i) => setStep(i)}
          />

          {/* Step heading */}
          <div className="text-center">
            {/*<h2 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide">
              {currentStep.label}
            </h2>*/}
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed rounded-full">
              {currentStep.description}
            </p>
          </div>

          {/* Step body */}
          <div className="flex justify-center w-full">
            {step === STEP.details && (
              <StepYourDetails
                form={form}
                setForm={setForm}
                canContinue={canNext[STEP.details]}
                onContinue={next}
                onCancel={onCancel}
              />
            )}

            {step === STEP.verify && (
              <StepVerifyEmail
                email={form.email}
                onVerified={handleVerifyDone}
                onBack={back}
              />
            )}

            {step === STEP.emergency && (
              <StepEmergencyContact
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

            {step === STEP.consents && (
              <StepConsents
                form={form}
                setForm={setForm}
                canContinue={canNext[STEP.consents]}
                onContinue={next}
                onBack={back}
              />
            )}

            {step === STEP.plan && (
              <StepChoosePlan
                form={form}
                setForm={setForm}
                canContinue={canNext[STEP.plan]}
                onContinue={next}
                onBack={back}
              />
            )}

            {step === STEP.confirm && (
              <StepConfirm
                form={form}
                submitting={submitting}
                error={error}
                onConfirm={handleConfirm}
                onBack={back}
              />
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AdultOnboardingPage;