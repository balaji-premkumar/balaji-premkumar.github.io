// Main constants export file
export * from './personalInfo';
export * from './experience';
export * from './skills';
export * from './projects';

// Additional utility constants
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  very_slow: 1.0
} as const;

export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  large: '1280px'
} as const;

export const THEME_COLORS = {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  secondary: {
    500: '#8b5cf6',
    600: '#7c3aed',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
} as const;

export const EXTERNAL_LINKS = {
  resume: '/resume.pdf',
  linkedin: 'https://linkedin.com/in/balaji-premkumar',
  twitter: 'https://twitter.com/balaji00710',
  portfolio: 'https://balaji-premkumar.github.io/'
} as const;
