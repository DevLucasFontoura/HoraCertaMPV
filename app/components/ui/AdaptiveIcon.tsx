import { useTheme } from '../../hooks/useTheme';

interface AdaptiveIconProps {
  icon: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const AdaptiveIcon = ({ icon, size = 24, className = '', alt = 'Icon' }: AdaptiveIconProps) => {
  const { isDark } = useTheme();

  return (
    <img 
      src={icon} 
      alt={alt}
      width={size} 
      height={size}
      className={className}
      style={{
        filter: isDark ? 'invert(1)' : 'none',
        opacity: 0.8
      }}
    />
  );
}; 