interface ThemeAwareIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export const ThemeAwareIcon = ({ icon, size = 24, className = '' }: ThemeAwareIconProps) => {
  return (
    <svg 
      width={size} 
      height={size}
      className={`theme-aware-icon ${className}`}
      style={{
        // Usar CSS custom properties para adaptação automática
        filter: 'var(--icon-filter, none)',
        opacity: 'var(--icon-opacity, 0.8)'
      }}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <use href={icon} />
    </svg>
  );
}; 