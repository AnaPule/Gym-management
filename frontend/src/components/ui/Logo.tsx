import React from 'react';

interface LogoProps {
  styles?: string;
  position?: 'left' | 'center' | 'right';
}

const positionClasses = {
  left:   'justify-start',
  center: 'justify-center',
  right:  'justify-end',
} as const;

const Logo: React.FC<LogoProps> = ({ styles = '', position = 'center' }) => {
  return (
    <div
      className={`
        w-12 h-12
        rounded-2xl
        bg-crimson-800
        flex items-center ${positionClasses[position]}
        font-display text-3xl text-white tracking-wider
        mb-3
        shadow-xl shadow-crimson-600/30
        ${styles}
      `}
    >
      <img
        src="/gym/Logo.jpg"
        alt="Team Stars Logo"
        className="w-full h-full object-contain mix-blend-screen rounded-2xl"
      />
    </div>
  );
};

export default Logo;