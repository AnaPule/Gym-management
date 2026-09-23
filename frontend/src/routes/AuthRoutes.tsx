/**
 * @file        AuthRoutes.tsx
 * @description All client-side routes — auth, signup (adult + minor),
 *              support, dashboard.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-23
 * @version     1.1.0
 *
 * CHANGELOG:
 *   1.0.0  2026-09-20  Initial routes
 *   1.1.0  2026-09-23  Add /signup/minor
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '@/pages/auth/LoginPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ContactPage from '@/pages/support/ContactPage';
import AdultOnboardingPage from '@/features/onboarding/AdultMember';
import MinorOnboardingPage from '@/features/onboarding/MinorMember';

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signup/adult" element={<AdultOnboardingPage onComplete={(r) => console.log('done', r)} onCancel={() => window.history.back()} />} />
      <Route path='/signup/minor' element={<MinorOnboardingPage onComplete={(r) => console.log('done', r)} onCancel={() => window.history.back}/>} />

      {/* Support */}
      <Route path="/contact" element={<ContactPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
