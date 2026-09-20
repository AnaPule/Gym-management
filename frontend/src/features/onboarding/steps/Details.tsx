import React from 'react';
import { Form, FormField } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import PhoneInput from '@/components/ui/Phone';
import LinkButton from '@/components/ui/LinkButton';
import type { AdultSignupForm } from '@/types/onboarding/types';

interface Props {
  form: AdultSignupForm;
  setForm: React.Dispatch<React.SetStateAction<AdultSignupForm>>;
  canContinue: boolean;
  onContinue: () => void;
  onCancel?: () => void;
}

const StepYourDetails: React.FC<Props> = ({ form, setForm, canContinue, onContinue, onCancel }) => {
  const set = <K extends keyof AdultSignupForm>(key: K, value: AdultSignupForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <Form
      onSubmit={(e) => { e.preventDefault(); if (canContinue) onContinue(); }}
    >

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField
          label="First name"
          value={form.firstName}
          onChange={(e) => set('firstName', e.target.value)}
          placeholder="Alex"
          autoFocus
          required
        />
        <FormField
          label="Last name"
          value={form.lastName}
          onChange={(e) => set('lastName', e.target.value)}
          placeholder="Vance"
          required
        />
      </div>

      <FormField
        label="Date of birth"
        type="date"
        value={form.dateOfBirth}
        onChange={(e) => set('dateOfBirth', e.target.value)}
        required
        hint="You must be 18 or older to join as an adult member."
      />

      <FormField
        label="Email address"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={form.email}
        onChange={(e) => set('email', e.target.value)}
        placeholder="you@example.com"
        required
      />

      <PhoneInput
        label="Phone number"
        country={form.phoneCountry}
        value={form.phoneNational}
        onChange={(country, national) =>
          setForm((f) => ({ ...f, phoneCountry: country, phoneNational: national }))
        }
        required
      />

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={!canContinue}>
        Continue
      </Button>

      {onCancel && (
        <div className="pt-1 text-center">
          <LinkButton tone="muted" onClick={onCancel}>Cancel signup</LinkButton>
        </div>
      )}
    </Form>
  );
};

export default StepYourDetails;