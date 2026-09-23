/**
 * @file        Consents.tsx
 * @description Step 6 — standard waivers + (minor only) minor-specific
 *              declarations + collection authorisation list.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-21
 * @updated     2026-09-23
 * @version     2.0.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-21  Adult consents
 *   2.0.0  2026-09-22  Unified; minor block + collectors conditional
 */

import React from 'react';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import ConsentCard from '@/components/onboarding/ConsentCard';
import PhoneInput from '@/components/ui/Phone';
import Dropdown from '@/components/ui/Dropdown';
import { FormField } from '@/components/ui/Form';
import type { OnboardingForm, AuthorisedCollector } from '@/types/onboarding/types';

interface Props {
  form: OnboardingForm;
  setForm: React.Dispatch<React.SetStateAction<OnboardingForm>>;
  canContinue: boolean;
  onContinue: () => void;
  onBack: () => void;
}

const STANDARD = [
  { key: 'liability', title: 'Liability waiver',
    body: 'I understand that mixed martial arts, grappling, striking, and conditioning training involve inherent physical risk including injury. I participate voluntarily and accept responsibility for my own safety within the rules and guidance of the gym.' },
  { key: 'medical', title: 'Medical declaration',
    body: 'I confirm that there are no known medical conditions that would prevent safe participation in training. I will inform the gym of any changes to health that could affect the ability to train safely.' },
  { key: 'photoMedia', title: 'Photo & media (general)',
    body: 'General permission for internal gym use — ID cards, attendance records, training logs. Specific promotional use is asked separately below (for minors).' },
  { key: 'dataProcessing', title: 'Data processing',
    body: 'I consent to Team Stars collecting, storing, and processing personal information for the purposes of managing membership, communicating about the club, and ensuring safety during training. Rights under POPIA are respected.' },
] as const;

const MINOR_ONLY = [
  { key: 'guardianAuthority', title: 'Guardian authority declaration',
    body: 'I declare that I am the legal guardian of this minor and have the authority to enrol them at Team Stars MMA. I confirm I have the legal capacity to provide these consents on their behalf.' },
  { key: 'emergencyTreatment', title: 'Emergency medical treatment',
    body: 'I authorise Team Stars staff to seek emergency medical treatment for the minor if I cannot be reached in time, and to share medical information with emergency responders as needed.' },
  { key: 'sparring', title: 'Contact sparring consent',
    body: 'I consent to the minor participating in controlled contact sparring within their age bracket, under the supervision of a qualified coach, as part of their progression in MMA.' },
  { key: 'popiaSpecial', title: 'POPIA — special personal information',
    body: "Under POPIA, children's personal information is classified as special personal information. I explicitly consent to Team Stars processing this data for the purpose of the minor's membership, in line with the gym's privacy policy." },
  { key: 'photoMediaInternal', title: 'Photo & media — internal use',
    body: 'Photographs and video may be used internally for training records, progress tracking, and member identification.' },
  { key: 'photoMediaPromotional', title: 'Photo & media — promotional use',
    body: 'Photographs and video may be used on Team Stars social media, website, and marketing materials. Voluntary — you may decline without affecting membership.' },
] as const;

const Consents: React.FC<Props> = ({ form, setForm, canContinue, onContinue, onBack }) => {
  const isMinor = form.mode === 'minor';

  const toggle = (key: keyof OnboardingForm['consents'], checked: boolean) =>
    setForm((f) => ({ ...f, consents: { ...f.consents, [key]: checked } }));

  const addCollector = () =>
    setForm((f) => ({
      ...f,
      authorisedCollectors: [
        ...f.authorisedCollectors,
        { name: '', phoneCountry: 'ZA', phoneNational: '', relationship: '' },
      ],
    }));

  const updateCollector = (i: number, patch: Partial<AuthorisedCollector>) =>
    setForm((f) => ({
      ...f,
      authorisedCollectors: f.authorisedCollectors.map((c, idx) =>
        idx === i ? { ...c, ...patch } : c
      ),
    }));

  const removeCollector = (i: number) =>
    setForm((f) => ({
      ...f,
      authorisedCollectors: f.authorisedCollectors.filter((_, idx) => idx !== i),
    }));

  return (
    <div className="space-y-5 w-full max-w-lg mx-auto max-h-[27rem] overflow-y-scroll">

      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          Standard waivers
        </p>
        <div className="space-y-2.5">
          {STANDARD.map((c) => (
            <ConsentCard key={c.key} title={c.title} body={c.body}
              checked={form.consents[c.key]}
              onChange={(v) => toggle(c.key, v)} />
          ))}
        </div>
      </div>

      {isMinor && (
        <>
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-crimson-400 font-bold">
              Minor-specific declarations
            </p>
            <div className="space-y-2.5">
              {MINOR_ONLY.map((c) => (
                <ConsentCard key={c.key} title={c.title} body={c.body}
                  checked={form.consents[c.key]}
                  onChange={(v) => toggle(c.key, v)} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                Authorised collectors
              </p>
              <button type="button" onClick={addCollector}
                className="text-[11px] text-crimson-400 hover:text-crimson-300 font-medium">
                + Add person
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed -mt-1">
              Only these people may collect the minor after training. You (the guardian) are always authorised.
            </p>

            {form.authorisedCollectors.length === 0 && (
              <p className="text-[11px] text-zinc-600 italic text-center py-2">
                No additional collectors added.
              </p>
            )}

            {form.authorisedCollectors.map((c, i) => (
              <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-3 relative">
                <button type="button" onClick={() => removeCollector(i)}
                  className="absolute top-3 right-3 text-zinc-500 hover:text-crimson-400 text-[11px]">
                  Remove
                </button>
                <FormField label="Full name" value={c.name}
                  onChange={(e) => updateCollector(i, { name: e.target.value })}
                  placeholder="Jane Vance" />
                <PhoneInput label="Phone number"
                  country={c.phoneCountry} value={c.phoneNational}
                  onChange={(country, national) => updateCollector(i, { phoneCountry: country, phoneNational: national })} />
                <Dropdown label="Relationship to minor" value={c.relationship}
                  onChange={(v) => updateCollector(i, { relationship: v })}
                  options={['Grandparent', 'Aunt', 'Uncle', 'Sibling', 'Family friend', 'Coach', 'Other']}
                  placeholder="Select…" />
              </div>
            ))}
          </div>
        </>
      )}

      <Button type="button" variant="primary" size="lg" fullWidth
        disabled={!canContinue} onClick={onContinue}>
        Continue
      </Button>
      <div className="pt-1 text-center">
        <LinkButton tone="muted" onClick={onBack}>← Back</LinkButton>
      </div>
    </div>
  );
};

export default Consents;