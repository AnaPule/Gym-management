import React, { useMemo } from 'react';
import type { ReactNode } from 'react';

// COMPONENTS
import Logo from '@/components/ui/Logo';

interface AuthLayoutProps {
  headline: string;
  subtext?: string;
  children: ReactNode;
}

export default function AuthLayout({ headline, subtext = '', children }: AuthLayoutProps) {
  const quotes = [
    `“It's not whether you get knocked down, it's whether you get up.” — Vince Lombardi`,
    `“The more you sweat in training, the less you bleed in battle.”`,
    `“Discipline is choosing between what you want now and what you want most.”`,
    `“Champions are made when nobody is watching.”`,
    `“The mat doesn't care who you were yesterday. Only who you show up as today.”`,
  ];

  const quote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    []
  );

  return (
    <div className="flex min-h-screen bg-zinc-925">
      {/* Left Sidebar - Hidden on mobile, visible on lg */}
      <div className="relative hidden w-full lg:flex lg:w-[40%] flex-col justify-between overflow-hidden bg-black p-8 xl:p-12">
        {/* Background gradients */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 65% 45%, #201013 0%, #0b0708 45%, #000 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 62% 48%, rgba(0,0,0,0.43,0.28), transparent 42%)',
          }}
        />
        <img
          src="/gym/portrait(2).png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
        />

        {/* Logo */}
        <div className="relative z-10 text-left">
          <Logo position="left" />
        </div>

        {/* Text Content */}
        <div className="relative z-10">
          <h1 className="text-3xl xl:text-4xl font-semibold leading-tight text-white">
            {headline}
          </h1>
          <p className="mt-4 text-sm font-light leading-relaxed text-zinc-400 max-w-xs">
            Forged in sweat. Proven in the ring. {quote}
          </p>
        </div>
      </div>

      {/* Right Content Area - Form */}
      <div className="flex w-full lg:w-[60%] flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-2xl flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}