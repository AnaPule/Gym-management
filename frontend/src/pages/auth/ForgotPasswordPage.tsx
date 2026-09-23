/**
 * @file        ForgotPasswordPage.tsx
 * @description Forgot-password fallback — requests a reset code by email.
 *              With OTP-only login this doubles as an "email not arriving"
 *              helper.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-20
 * @version     1.0.0
 */

import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';

// COMPONENTS
import AuthLayout from '@/components/layout/AuthLayout';
import { Form, FormField } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';

type Step = 'email' | 'sent';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate(); 

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      // TODO: await api.post('/auth/forgot-password', { email });
      console.log('Requesting password reset for:', email);
      setStep('sent');
    } catch (err: any) {
      setError(err?.message ?? 'Could not send reset link. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="Reset your access to A Team Stars"
      children={
        <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-925">
          <div className="relative z-10 p-6 sm:p-10 space-y-6">
            <div className="text-center">
              <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide uppercase">
                Forgot Password
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {step === 'email'
                  ? "We'll send you a code to reset your access."
                  : 'Check your inbox for the next step.'}
              </p>
            </div>

            <div className="flex justify-center w-full">
              {step === 'email' ? (
                <Form onSubmit={handleSubmit} error={error} loading={loading}>
                  <div className="text-xs text-crimson-400 uppercase tracking-widest border-b border-zinc-800 pb-2.5">
                    Reset Request
                  </div>

                  <FormField
                    label="Email Address"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    required
                    autoFocus
                    hint="Use the email address on your account."
                  />

                  <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={!canSubmit}>
                    Send Reset Code
                  </Button>

                  <div className="pt-2 text-center">
                    <LinkButton tone="muted" onClick={() => navigate('/login')}>
                      ← Back to sign in
                    </LinkButton>
                  </div>
                </Form>
              ) : (
                <Form onSubmit={(e) => e.preventDefault()}>
                  <div className="text-center space-y-4 py-4">
                    <div className="h-12 w-12 mx-auto rounded-full bg-crimson-950 border border-crimson-800 flex items-center justify-center">
                      <svg className="w-6 h-6 text-crimson-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <path d="M22 6l-10 7L2 6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Check your inbox</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      We sent reset instructions to <span className="text-white">{email}</span>.
                    </p>
                    <LinkButton tone="accent" onClick={() => setStep('email')}>
                      Didn't get it? Try another email
                    </LinkButton>
                  </div>
                </Form>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ForgotPasswordPage;