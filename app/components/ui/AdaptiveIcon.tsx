import { useTheme } from '../../hooks/useTheme';

interface AdaptiveIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export const AdaptiveIcon = ({ icon, size = 24, className = '' }: AdaptiveIconProps) => {
  const { isDark } = useTheme();

  return (
    <svg 
      width={size} 
      height={size}
      className={className}
      style={{
        filter: isDark ? 'invert(1)' : 'none',
        opacity: 0.8
      }}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <use href={icon} />
    </svg>
  );
}; 