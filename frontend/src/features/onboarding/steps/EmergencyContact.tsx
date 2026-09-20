import React from 'react';
import { Form, FormField } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import Dropdown from '@/components/ui/Dropdown';
import PhoneInput from '@/components/ui/Phone';
import type { AdultSignupForm } from '@/types/onboarding/types';

interface Props {
  form: AdultSignupForm;
  setForm: React.Dispatch<React.SetStateAction<AdultSignupForm>>;
  canContinue: boolean;
  onContinue: () => void;
  onBack: () => void;
}

const StepEmergencyContact: React.FC<Props> = ({ form, setForm, canContinue, onContinue, onBack }) => {
  const set = (key: 'name' | 'relationship', value: string) =>
    setForm((f) => ({ ...f, emergencyContact: { ...f.emergencyContact, [key]: value } }));

  return (
    <Form onSubmit={(e) => { e.preventDefault(); if (canContinue) onContinue(); }}>

      <p className="text-xs text-zinc-400 leading-relaxed">
        We'll only use this if something happens during training. Choose someone we can reach quickly.
      </p>

      <FormField
        label="Full name"
        value={form.emergencyContact.name}
        onChange={(e) => set('name', e.target.value)}
        placeholder="Jane Vance"
        autoFocus
        required
      />

      <PhoneInput
        label="Phone number"
        country={form.emergencyContact.phoneCountry}
        value={form.emergencyContact.phoneNational}
        onChange={(country, national) =>
          setForm((f) => ({
            ...f,
            emergencyContact: {
              ...f.emergencyContact,
              phoneCountry: country,
              phoneNational: national,
            },
          }))
        }
        required
      />

      <Dropdown
        label="Relationship"
        value={form.emergencyContact.relationship}
        onChange={(value) => set('relationship', value)}
        options={['Mother', 'Father', 'Brother', 'Sister', 'Friend', 'Guardian', 'Ward', 'Spouse', 'Daughter', 'Son', 'Grandfather', 'Grandmother', 'Aunt', 'Uncle', 'Cousin', 'Other']}
        placeholder="Partner, parent, sibling…"
        required
        hint="Type to search or enter your own."
      />

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={!canContinue}>
        Continue
      </Button>

      <div className="pt-1 text-center">
        <LinkButton tone="muted" onClick={onBack}>← Back</LinkButton>
      </div>
    </Form>
  );
};

export default StepEmergencyContact;