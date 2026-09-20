import React from 'react';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import ConsentCard from '@/components/onboarding/ConsentCard';
import type { AdultSignupForm } from '@/types/onboarding/types';

interface Props {
  form: AdultSignupForm;
  setForm: React.Dispatch<React.SetStateAction<AdultSignupForm>>;
  canContinue: boolean;
  onContinue: () => void;
  onBack: () => void;
}

const CONSENTS: Array<{ key: keyof AdultSignupForm['consents']; title: string; body: string }> = [
  {
    key: 'liability',
    title: 'Liability waiver',
    body:
      'I understand that mixed martial arts, grappling, striking, and conditioning training involve inherent physical risk including injury. I participate voluntarily and accept responsibility for my own safety within the rules and guidance of the gym. I confirm I am physically fit to take part and have not been advised otherwise by a medical professional.',
  },
  {
    key: 'medical',
    title: 'Medical declaration',
    body:
      'I confirm that I have no known medical conditions that would prevent me from safely participating in training. I will inform the gym of any changes to my health that could affect my ability to train safely, including injuries, medications, or diagnoses that could impact my performance or safety.',
  },
  {
    key: 'photoMedia',
    title: 'Photo & media consent',
    body:
      'I give Team Stars permission to use photographs, video, or other media captured during training, events, or competitions in which I appear, for the purpose of promoting the gym and its activities. I understand this consent is voluntary and can be withdrawn at any time by writing to the gym.',
  },
  {
    key: 'dataProcessing',
    title: 'Data processing consent',
    body:
      'I consent to Team Stars collecting, storing, and processing my personal information (including my name, contact details, date of birth, and medical declarations) for the purposes of managing my membership, communicating with me, and ensuring my safety during training. I understand I have the right to access, correct, or request deletion of my information under POPIA.',
  },
];

const StepConsents: React.FC<Props> = ({ form, setForm, canContinue, onContinue, onBack }) => {
  const toggle = (key: keyof AdultSignupForm['consents'], checked: boolean) =>
    setForm((f) => ({ ...f, consents: { ...f.consents, [key]: checked } }));

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">

      <p className="text-xs text-zinc-400 leading-relaxed">
        Please read each one carefully. You must accept all four to join.
      </p>

      <div className="space-y-3 overflow-y-auto max-h-[40vh]">
        {CONSENTS.map((c) => (
          <ConsentCard
            key={c.key}
            title={c.title}
            body={c.body}
            checked={form.consents[c.key]}
            onChange={(checked) => toggle(c.key, checked)}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!canContinue}
        onClick={onContinue}
      >
        Continue
      </Button>

      <div className="pt-1 text-center">
        <LinkButton tone="muted" onClick={onBack}>← Back</LinkButton>
      </div>
    </div>
  );
};

export default StepConsents;