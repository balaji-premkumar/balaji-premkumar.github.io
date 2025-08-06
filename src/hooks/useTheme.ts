import { useState, useEffect } from 'react';

interface UseThemeReturn {
  isDark: boolean;
  toggleTheme: () => void;
  resetToSystemTheme: () => void;
  isFollowingSystem: boolean;
}

export const useTheme = (): UseThemeReturn => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      // Default to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isFollowingSystem, setIsFollowingSystem] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === null;
    }
    return true;
  });

  // Handle system color scheme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const savedPreference = localStorage.getItem('darkMode');
      if (savedPreference === null) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Apply dark mode class on mount and when isDark changes
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Update following system status
    setIsFollowingSystem(localStorage.getItem('darkMode') === null);
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    // Save to localStorage (this will override system preference)
    localStorage.setItem('darkMode', JSON.stringify(newTheme));
    setIsFollowingSystem(false);
  };

  const resetToSystemTheme = () => {
    // Remove saved preference and use system theme
    localStorage.removeItem('darkMode');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(systemDark);
    setIsFollowingSystem(true);
  };

  return {
    isDark,
    toggleTheme,
    resetToSystemTheme,
    isFollowingSystem
  };
};
