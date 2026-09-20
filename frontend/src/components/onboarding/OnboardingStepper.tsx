import React from 'react';
import { STEPS } from '@/types/onboarding/steps';
import Logo from '@/components/ui/Logo';
interface OnboardingStepperProps {
  currentStep: number;
  maxStep: number;
  canNext: Record<number, boolean>;
  onJump?: (index: number) => void;
}

const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  currentStep,
  maxStep,
  canNext,
  onJump,
}) => {
  return (
    <div className="w-full">
      <div
        className="grid items-center"
        style={{ gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))` }}
      >
        {STEPS.map((step, i) => {
          const active = i === currentStep;
          const visited = i <= maxStep;
          const done = !active && visited && Boolean(canNext[i]);
          const canJump = !active && visited && onJump;

          return (
            <div key={step.key} className="flex items-center">
              {/* left stub */}
              <span
                aria-hidden
                className={`flex-1 h-px transition-colors ${i === 0 ? 'bg-transparent' : visited ? 'bg-crimson-600' : 'bg-zinc-800'
                  }`}
              />

              <button
                type="button"
                onClick={canJump ? () => onJump?.(i) : undefined}
                disabled={!canJump}
                aria-label={`Step ${i + 1}: ${step.label}`}
                aria-current={active ? 'step' : undefined}
                className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all
                  ${active
                    ? 'bg-crimson-700 text-white ring-4 ring-crimson-700/25'
                    : done
                      ? 'bg-crimson-700 text-white'
                      : visited
                        ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }
                  ${canJump ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {done ? (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </button>

              {/* right stub */}
              <span
                aria-hidden
                className={`flex-1 h-px transition-colors ${i === STEPS.length - 1
                  ? 'bg-transparent'
                  : i < maxStep
                    ? 'bg-crimson-600'
                    : 'bg-zinc-800'
                  }`}
              />


            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center justify-center mt-8 space-y-1">
        <Logo position="center" />
      </div>


      {/* Current step caption */}
      <div className="mt-3 text-center">
        <p className="text-[11px] uppercase tracking-widest text-zinc-500">
          Step {currentStep + 1} of {STEPS.length}
        </p>
        <p className="font-display text-lg sm:text-2xl text-white uppercase tracking-wide">
          {STEPS[currentStep].label}
        </p>
      </div>
    </div>
  );
};

export default OnboardingStepper;