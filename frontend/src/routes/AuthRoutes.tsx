import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '@/pages/auth/LoginPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ContactPage from '@/pages/support/ContactPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import AdultOnboardingPage from '@/features/onboarding/AdultMember';

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signup/adult" element={<AdultOnboardingPage onComplete={(r) => console.log('done', r)} onCancel={() => window.history.back()} />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Support */}
      <Route path="/contact" element={<ContactPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
