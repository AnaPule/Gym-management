/**
 * @file        AiAssistant.tsx
 * @description AI assistant provider + hook. Wraps the app so any page
 *              can open the panel via `useAiAssistant()`.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-20
 * @version     1.0.0
 */

import React, { useState } from 'react';
import AiAssistantButton from './AiAssistantButton';
import AiAssistantPanel from './AiAssistantPanel';

interface AiAssistantContextValue {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const AiAssistantContext = React.createContext<AiAssistantContextValue | null>(null);

export const useAiAssistant = () => {
  const ctx = React.useContext(AiAssistantContext);
  if (!ctx) throw new Error('useAiAssistant must be used inside <AiAssistantProvider>');
  return ctx;
};

export const AiAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const value: AiAssistantContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((v) => !v),
  };

  return (
    <AiAssistantContext.Provider value={value}>
      {children}
      <AiAssistantButton onClick={value.toggle} open={isOpen} />
      <AiAssistantPanel open={isOpen} onClose={value.close} />
    </AiAssistantContext.Provider>
  );
};