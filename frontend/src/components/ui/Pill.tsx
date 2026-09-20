
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
