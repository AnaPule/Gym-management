import React from 'react';

export type LinkButtonTone = 'default' | 'accent' | 'muted';

export interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: LinkButtonTone;
  underline?: boolean;
  children: React.ReactNode;
}

const toneClasses: Record<LinkButtonTone, string> = {
  default: 'text-zinc-300 hover:text-white',
  accent: 'text-crimson-400 hover:text-crimson-300',
  muted: 'text-zinc-500 hover:text-zinc-300',
};

const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
  (
    {
      tone = 'accent',
      underline = false,
      children,
      className = '',
      type = 'button',
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`
          inline-flex items-center gap-1
          bg-transparent border-0 p-0
          text-xs font-medium
          transition-colors duration-150
          focus-visible:outline-none focus-visible:underline
          disabled:opacity-40 disabled:cursor-not-allowed
          ${underline ? 'underline underline-offset-4' : 'hover:underline underline-offset-4'}
          ${toneClasses[tone]}
          ${className}
        `}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

LinkButton.displayName = 'LinkButton';

export default LinkButton;