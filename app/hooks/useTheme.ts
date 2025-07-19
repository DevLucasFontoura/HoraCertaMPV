import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Função para detectar o tema
    const detectTheme = () => {
      // Verificar se o usuário tem preferência salva
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
        return;
      }

      // Verificar preferência do sistema
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);

      // Listener para mudanças na preferência do sistema
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    };

    detectTheme();
  }, []);

  const setTheme = (theme: 'light' | 'dark') => {
    setIsDark(theme === 'dark');
    localStorage.setItem('theme', theme);
  };

  return {
    isDark,
    setTheme,
    theme: isDark ? 'dark' : 'light'
  };
}; 