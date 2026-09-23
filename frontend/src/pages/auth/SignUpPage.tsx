/**
 * @file        SignUpPage.tsx
 * @description Signup chooser — adult self-signup or guardian-led minor
 *              signup.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-22
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-20  Placeholder
 *   1.1.0  2026-09-22  Wire routes to /signup/adult and /signup/minor
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

// COMPONENTS
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import AuthLayout from '@/components/layout/AuthLayout';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout headline="Join A Team Stars">
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

        <div className="text-center space-y-1 pt-2">
          <h2 className="font-display text-2xl text-white uppercase tracking-wide">
            Create your account
          </h2>
          <p className="text-xs text-zinc-400">
            Choose the path that fits you.
          </p>
        </div>

        <div className="space-y-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/signup/adult')}
          >
            Continue as a New Member
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate('/signup/minor')}
          >
            Register a Youth Member
          </Button>
        </div>

        <div className="pt-2 text-center">
          <LinkButton tone="muted" onClick={() => navigate('/login')}>
            ← Already have an account? Sign in
          </LinkButton>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;