import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const baseClasses = `
  relative inline-flex items-center justify-center
  font-semibold tracking-wide
  select-none whitespace-nowrap
  transition-[background-color,border-color,color,box-shadow,transform]
  duration-150 ease-out
  active:translate-y-[0.5px]
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
  disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0
`;

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-crimson-700 text-white
    border border-crimson-600
    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_1px_2px_0_rgba(0,0,0,0.4)]
    hover:bg-crimson-600 hover:border-crimson-500
    hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_2px_6px_0_rgba(220,38,38,0.25)]
    active:bg-crimson-800 active:border-crimson-700
    disabled:hover:bg-crimson-700 disabled:hover:border-crimson-600
  `,
  secondary: `
    bg-zinc-900 text-zinc-100
    border border-zinc-800
    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]
    hover:bg-zinc-850 hover:border-zinc-700 hover:text-white
    active:bg-zinc-950
  `,
  outline: `
    bg-transparent text-crimson-400
    border border-crimson-800
    hover:bg-crimson-950/40 hover:border-crimson-600 hover:text-crimson-300
    active:bg-crimson-950/60
  `,
  ghost: `
    bg-transparent text-zinc-400 border border-transparent
    hover:bg-zinc-850/60 hover:text-white
    active:bg-zinc-850
  `,
  danger: `
    bg-red-900 text-white
    border border-red-800
    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10),0_1px_2px_0_rgba(0,0,0,0.4)]
    hover:bg-red-800 hover:border-red-700
    active:bg-red-950
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-[11px] rounded-sm gap-1.5',
  md: 'h-10 px-5 text-xs rounded-md gap-2',
  lg: 'h-11 px-6 text-[13px] rounded-lg gap-2',
};

const spinnerSize: Record<ButtonSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...rest}
      >
        {loading ? (
          <Spinner size={size} />
        ) : (
          leftIcon && <span className="shrink-0 -ml-0.5">{leftIcon}</span>
        )}

        {children && <span className="truncate">{children}</span>}

        {!loading && rightIcon && (
          <span className="shrink-0 -mr-0.5">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

const Spinner: React.FC<{ size: ButtonSize }> = ({ size }) => (
  <svg
    className={`animate-spin ${spinnerSize[size]}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

export default Button;