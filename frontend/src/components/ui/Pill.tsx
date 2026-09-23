/**
 * @file        Pill.tsx
 * @description Reusable pill toggle. Currently unused in the signup flow
 *              but kept for filter chips and future selectors.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-20
 * @version     1.0.0
 */

interface PillProps {
  title: string;
  className?: string;
  onClick?: () => void;
}


export const Pill = ({ title, className = '', onClick }: PillProps) => {
  return (
    <span
      className={`h-full rounded-md capitalize transition-all font-semibold flex items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      {title}
    </span>
  );
};
