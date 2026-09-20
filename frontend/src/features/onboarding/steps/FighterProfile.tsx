import React, { useMemo, useRef } from 'react';
import { Form, FormField } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import Dropdown from '@/components/ui/Dropdown';
import { weightClassFor } from '@/lib/WeightClass';
import type { AdultSignupForm } from '@/types/onboarding/types';

interface Props {
    form: AdultSignupForm;
    setForm: React.Dispatch<React.SetStateAction<AdultSignupForm>>;
    canContinue: boolean;
    onContinue: () => void;
    onBack: () => void;
}

const EXPERIENCE_OPTIONS = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Competitive',
    'Professional',
];

const MAX_PHOTO_MB = 5;

const FighterProfile: React.FC<Props> = ({ form, setForm, canContinue, onContinue, onBack }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const { fighterProfile: fp } = form;

    const update = <K extends keyof AdultSignupForm['fighterProfile']>(
        key: K,
        value: AdultSignupForm['fighterProfile'][K]
    ) =>
        setForm((f) => ({
            ...f,
            fighterProfile: { ...f.fighterProfile, [key]: value },
        }));

    const predictedClass = useMemo(
        () => (fp.weightKg ? weightClassFor(fp.weightKg) : null),
        [fp.weightKg]
    );

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
            alert(`Photo must be under ${MAX_PHOTO_MB} MB.`);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => update('photoDataUrl', reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <Form className='overflow-y-scroll max-h-[30rem]' onSubmit={(e) => { e.preventDefault(); if (canContinue) onContinue(); }}>

            <p className="text-xs text-zinc-400 leading-relaxed">
                We use this to place you in the right weight class and training group.
                You can update it any time.
            </p>

            {/* Photo */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className={`
            h-20 w-20 shrink-0 rounded-2xl border-2 border-dashed
            flex items-center justify-center overflow-hidden
            transition-colors
            ${fp.photoDataUrl
                            ? 'border-crimson-700/60'
                            : 'border-zinc-700 hover:border-zinc-600'
                        }
          `}
                    aria-label="Upload profile photo"
                >
                    {fp.photoDataUrl ? (
                        <img src={fp.photoDataUrl} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-6 h-6 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <path d="M17 8l-5-5-5 5" />
                            <path d="M12 3v12" />
                        </svg>
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-300">Profile photo</p>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                        Optional. A clear headshot helps coaches recognise you. Max {MAX_PHOTO_MB} MB.
                    </p>
                    {fp.photoDataUrl && (
                        <button
                            type="button"
                            onClick={() => update('photoDataUrl', null)}
                            className="mt-1 text-[11px] text-crimson-400 hover:underline"
                        >
                            Remove photo
                        </button>
                    )}
                </div>

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className="hidden"
                />
            </div>

            {/* Weight + height */}
            <div className="grid grid-cols-2 gap-3">
                <FormField
                    label="Weight (kg)"
                    type="number"
                    inputMode="decimal"
                    min={20}
                    max={250}
                    step="0.1"
                    value={fp.weightKg ?? ''}
                    onChange={(e) => {
                        const v = e.target.value;
                        update('weightKg', v === '' ? null : Number(v));
                    }}
                    placeholder="72.5"
                    required
                />
                <FormField
                    label="Height (cm)"
                    type="number"
                    inputMode="numeric"
                    min={100}
                    max={250}
                    step="1"
                    value={fp.heightCm ?? ''}
                    onChange={(e) => {
                        const v = e.target.value;
                        update('heightCm', v === '' ? null : Number(v));
                    }}
                    placeholder="178"
                    required
                />
            </div>

            {/* Live weight class preview */}
            {predictedClass && (
                <div className="rounded-xl border border-crimson-800/60 bg-crimson-950/20 px-4 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-crimson-400 font-bold">
                            Weight class
                        </p>
                        <p className="text-sm font-semibold text-white mt-0.5">
                            {predictedClass.name}
                        </p>
                    </div>
                    <span className="text-[10px] text-zinc-500 text-right leading-tight">
                        {predictedClass.minKg.toFixed(1)}–{predictedClass.maxKg.toFixed(1)} kg
                    </span>
                </div>
            )}

            {fp.weightKg !== null && !predictedClass && (
                <p className="text-[11px] text-amber-400 text-center">
                    That weight is outside our standard classes. A coach will review it with you.
                </p>
            )}

            <Dropdown
                label="Gender"
                value={fp.gender}
                onChange={(v) => update('gender', v)}
                options={['Male', 'Female', 'Other', 'Prefer not to say']}
                placeholder="Select…"
                required
            />

            {/* Experience */}
            <Dropdown
                label="Training experience"
                value={fp.experience}
                onChange={(v) => update('experience', v)}
                options={EXPERIENCE_OPTIONS}
                placeholder="Select or type your own…"
                hint="Optional. Helps us match you to the right group."
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

export default FighterProfile;