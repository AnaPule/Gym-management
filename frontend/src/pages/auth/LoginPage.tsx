

import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from "react";

// COMPONENTS
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";
import { Form, FormField } from "@/components/ui/Form";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAiAssistant } from '@/components/ui/support/AiAssistant';

type Step = 'email' | 'code';

const LoginPage: React.FC = () => {

  const navigate = useNavigate();
  const { open: openAi } = useAiAssistant();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [codeRejected, setCodeRejected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'code') codeRef.current?.focus();
  }, [step]);

  const canSendEmail = email.trim().length > 0 && !loading;
  const canVerify = code.length === 6 && !loading;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSendEmail) return;
    setLoading(true);
    setError(null);
    setResent(false);
    try {
      console.log('Requesting code for:', email);
      setStep('code');
    } catch {
      setError('Could not send code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canVerify) return;
    setLoading(true);
    setError(null);
    setCodeRejected(false);
    try {
      console.log('Verifying:', { email, code });
    } catch (err: any) {
      const rejected = err?.status === 400 || err?.status === 401;
      setCodeRejected(rejected);
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (loading) return;
    setLoading(true);
    setCode('');
    setCodeRejected(false);
    setResent(false);
    setError(null);
    try {
      console.log('Resending code to:', email);
      setResent(true);
      codeRef.current?.focus();
    } catch {
      setError('Could not resend. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDifferentEmail = () => {
    setStep('email');
    setCode('');
    setCodeRejected(false);
    setResent(false);
    setError(null);
  };

  return (
    <AuthLayout
      headline="Welcome back to A Team Stars"
      children={
        <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-925">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-925 via-zinc-925/90 to-transparent" />

          <div className="relative z-10 p-6 sm:p-10 space-y-6">
            <div className="flex flex-col items-center justify-center">
              <Logo position="center" />
              <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide uppercase">
                a-team star mma gym
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 tracking-wide">
                Forged in sweat. Proven in the ring.
              </p>
            </div>

            <div className="flex justify-center w-full">
              {step === 'email' ? (
                <Form onSubmit={handleSendCode} error={error} loading={loading}>

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
                    hint="We'll email you a 6-digit code. No password needed."
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={!canSendEmail}
                  >
                    Send Code
                  </Button>

                  {/* Feature links */}
                  <div className="pt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
                    <LinkButton tone="accent" onClick={() => navigate('/signup')}>
                      Create an account
                    </LinkButton>
                    <span className="text-zinc-700">·</span>
                    <LinkButton tone="muted" onClick={() => navigate('/forgot-password')}>
                      Forgot password?
                    </LinkButton>
                    <span className="text-zinc-700">·</span>
                    <LinkButton tone="muted" onClick={() => navigate('/contact')}>
                      Contact us
                    </LinkButton>
                  </div>
                </Form>
              ) : (
                <Form onSubmit={handleVerify} error={error} loading={loading}>

                  <p role="status" className="text-xs text-zinc-400 text-center leading-relaxed">
                    {resent ? 'We sent a new code to ' : 'We sent a code to '}
                    <strong className="text-white">{email}</strong>. It expires in 5 minutes.
                  </p>

                  <FormField
                    ref={codeRef}
                    label="Verification Code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{6}"
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setCodeRejected(false);
                      setError(null);
                    }}
                    error={codeRejected ? ' ' : undefined}
                    otp
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={!canVerify}
                  >
                    Verify & Enter
                  </Button>

                  <div className="flex justify-between items-center pt-1">
                    <LinkButton tone="muted" onClick={openAi}>
                      Need help? Ask the AI assistant →
                    </LinkButton>
                    <LinkButton tone="accent" onClick={handleResend} disabled={loading}>
                      {resent ? 'Code resent' : 'Resend code'}
                    </LinkButton>
                  </div>
                </Form>
              )}
            </div>

            {/* AI assistant link — bottom corner */}
            <div className="flex justify-center pt-2">
              <LinkButton tone="muted" onClick={() => console.log('open AI assistant')}>
                Need help? Ask Sage →
              </LinkButton>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default LoginPage;