interface ThemeAwareIconProps {
  icon: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const ThemeAwareIcon = ({ icon, size = 24, className = '', alt = 'Icon' }: ThemeAwareIconProps) => {
  return (
    <img 
      src={icon} 
      alt={alt}
      width={size} 
      height={size}
      className={`theme-aware-icon ${className}`}
      style={{
        // Usar CSS custom properties para adaptação automática
        filter: 'var(--icon-filter, none)',
        opacity: 'var(--icon-opacity, 0.8)'
      }}
    />
  );
}; 