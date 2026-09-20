import React from 'react';

interface AiAssistantButtonProps {
  onClick: () => void;
  open?: boolean;
}

const AiAssistantButton: React.FC<AiAssistantButtonProps> = ({ onClick, open = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
      className={`
        fixed bottom-6 right-6 z-40
        h-10 w-10
        flex items-center justify-center
        bg-crimson-700 text-white
        border border-crimson-600
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_6px_20px_0_rgba(185,28,28,0.45)]
        transition-all duration-200
        hover:bg-crimson-600 hover:scale-105
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
      `}
    >
      {open ? (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </button>
  );
};

export default AiAssistantButton;