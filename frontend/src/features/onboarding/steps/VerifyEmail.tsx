/**
 * @file        VerifyEmail.tsx
 * @description Step 2 — single-input 6-digit OTP. Shared verbatim by
 *              adult and minor flows; the caller supplies the email.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-23
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-20  OTP for login
 *   1.1.0  2026-09-22  Extract into shared step for onboarding
 */

import React, { useEffect, useRef, useState } from 'react';
import { Form, FormField } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import { sendOtp, verifyOtp } from '@/api/auth';

interface Props {
  email: string;
  onVerified: (registrationToken: string | null) => void;
  onBack: () => void;
}

const StepVerifyEmail: React.FC<Props> = ({ email, onVerified, onBack }) => {
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  // Send once on mount
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    setSending(true);
    sendOtp({ email, purpose: 'register' })
      .then(() => setSent(true))
      .catch(() => setError("We couldn't send your code. Try resending below."))
      .finally(() => setSending(false));
  }, [email]);

  useEffect(() => {
    if (sent) codeRef.current?.focus();
  }, [sent]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || verifying) return;
    setVerifying(true);
    setError(null);
    try {
      const res = await verifyOtp({ email, code, purpose: 'register' });
      onVerified(res.registrationToken ?? null);
    } catch (err: any) {
      setError(err?.message ?? 'Incorrect or expired code.');
      setCode('');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (sending) return;
    setSending(true);
    setCode('');
    setError(null);
    setResent(false);
    try {
      await sendOtp({ email, purpose: 'register' });
      setResent(true);
      codeRef.current?.focus();
    } catch {
      setError('Could not resend. Try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Form onSubmit={handleVerify} error={error} loading={verifying}>

      <p className="text-xs text-zinc-400 text-center leading-relaxed">
        {sending && !sent ? 'Sending code…'
          : resent ? <>We sent a new code to <strong className="text-white">{email}</strong>.</>
          : <>We sent a 6-digit code to <strong className="text-white">{email}</strong>. It expires in 5 minutes.</>}
      </p>

      <FormField
        ref={codeRef}
        label="Verification code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        placeholder="000000"
        value={code}
        onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(null); }}
        otp
      />

      <Button type="submit" variant="primary" size="lg" fullWidth loading={verifying} disabled={code.length !== 6}>
        Verify & continue
      </Button>

      <div className="flex justify-between items-center pt-1">
        <LinkButton tone="muted" onClick={onBack}>← Back</LinkButton>
        <LinkButton tone="accent" onClick={handleResend} disabled={sending}>
          {resent ? 'Code resent' : 'Resend code'}
        </LinkButton>
      </div>
    </Form>
  );
};

export default StepVerifyEmail;