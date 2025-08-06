// Personal Information Constants
export const PERSONAL_INFO = {
  name: 'Balaji Premkumar',
  title: 'Full Stack Engineer',
  subtitle: 'Self-taught Full Stack Engineer',
  location: 'Bangalore, India',
  email: 'balaji00710@gmail.com', // Update this to your real email
  githubUsername: 'balaji-premkumar',
  yearsOfExperience: '10+',
  description: 'With 10+ years of experience building scalable web applications, enterprise systems, and mobile solutions. Passionate about clean code, innovative solutions, and continuous learning.',
  status: 'Available for work',
  statusMessage: 'Open to new opportunities and interesting projects'
} as const;

// Derived URLs from username (GitHub profile picture is fetched dynamically via API)
export const SOCIAL_URLS = {
  github: `https://github.com/${PERSONAL_INFO.githubUsername}`,
  githubApi: `https://api.github.com/users/${PERSONAL_INFO.githubUsername}`,
  emailLink: `mailto:${PERSONAL_INFO.email}`
} as const;

// Navigation Items
export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
] as const;

// Hero Section Roles for Typing Animation
export const HERO_ROLES = [
  'Full Stack Engineer',
  '.NET Core Developer',
  'React.js Developer',
  'Backend Architect',
  'Mobile Developer'
] as const;

// Statistics for Hero and About sections
export const STATS = [
  { number: '10+', label: 'Years Experience', icon: 'calendar' },
  { number: '20+', label: 'Modules Developed', icon: 'box' },
  { number: '50+', label: 'Projects Completed', icon: 'check-circle' },
  { number: '100+', label: 'APIs Created', icon: 'link' }
] as const;

// Social Links
export const SOCIAL_LINKS = [
  {
    platform: 'GitHub',
    url: SOCIAL_URLS.github,
    icon: 'github',
    label: 'GitHub Profile'
  },
  {
    platform: 'Email',
    url: SOCIAL_URLS.emailLink,
    icon: 'mail',
    label: 'Send Email'
  }
] as const;

// Contact Information
export const CONTACT_INFO = [
  {
    icon: 'mail',
    label: 'Email',
    value: PERSONAL_INFO.email,
    href: SOCIAL_URLS.emailLink
  },
  {
    icon: 'github',
    label: 'GitHub',
    value: `github.com/${PERSONAL_INFO.githubUsername}`,
    href: SOCIAL_URLS.github
  },
  {
    icon: 'map-pin',
    label: 'Location',
    value: PERSONAL_INFO.location,
    href: null
  },
  {
    icon: 'calendar',
    label: 'Available',
    value: PERSONAL_INFO.status,
    href: null
  }
] as const;
