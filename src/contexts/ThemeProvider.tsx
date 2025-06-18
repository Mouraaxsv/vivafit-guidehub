
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    // Only apply theme logic if not loading and we have user data
    if (isLoading) return;
    
    // Add tailwind dark class based on system preference initially
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDarkMode);

    // Listen for changes in system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!user || user.theme === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [user, isLoading]);

  // Update the CSS high contrast class
  useEffect(() => {
    if (isLoading) return;
    
    if (user?.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [user?.highContrast, isLoading]);

  // Update the CSS font size classes
  useEffect(() => {
    if (isLoading) return;
    
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    
    if (user?.fontSize === 'small') {
      document.documentElement.classList.add('text-sm');
    } else if (user?.fontSize === 'large') {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.add('text-base'); // Default or medium
    }
  }, [user?.fontSize, isLoading]);

  return <>{children}</>;
};

export default ThemeProvider;
