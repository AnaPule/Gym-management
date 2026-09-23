/**
 * @file        MinorMember.tsx
 * @description Named wrapper — renders OnboardingShell with mode="minor".
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-23
 * @updated     2026-09-23
 * @version     1.0.0
 */

import React from 'react';
import OnboardingShell from './OnboardingShell';

interface Props {
  onComplete?: (r: { token: string; memberId: string }) => void;
  onCancel?: () => void;
}

const MinorMember: React.FC<Props> = (props) => (
  <OnboardingShell mode="minor" {...props} />
);

export default MinorMember;