import React, { useState, useEffect } from 'react';
import { NavigationMenu } from '../constants';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Get all sections including hero
      const allSections = ['hero', ...Object.keys(NavigationMenu)];
      const scrollPosition = window.scrollY + 100; // Offset for better detection
      
      // Find which section is currently in view
      for (let i = allSections.length - 1; i >= 0; i--) {
        const section = document.getElementById(allSections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          // If it's hero section, set activeSection to empty to show no menu item as active
          // Otherwise, set the actual section
          setActiveSection(allSections[i] === 'hero' ? '' : allSections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      setActiveSection(sectionId); // Set active immediately on click
    }
  };

  const getSectionIcon = (sectionKey: string) => {
    const icons: { [key: string]: string } = {
      about: '👨‍💼',
      experience: '⚔️',
      skills: '🍎',
      projects: '💎',
      contact: '📧'
    };
    return icons[sectionKey] || '⚓';
  };

  const getButtonClasses = (sectionKey: string) => {
    const isActive = activeSection === sectionKey;
    return `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative ${
      isActive 
        ? 'text-one-piece-deep-blue bg-treasure-gradient font-bold shadow-lg transform scale-105' 
        : 'text-one-piece-gold hover:text-one-piece-treasure hover:bg-one-piece-gold/10'
    }`;
  };

  const getMobileButtonClasses = (sectionKey: string) => {
    const isActive = activeSection === sectionKey;
    return `block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 w-full text-left relative ${
      isActive 
        ? 'text-one-piece-deep-blue bg-treasure-gradient font-bold shadow-lg' 
        : 'text-one-piece-gold hover:text-one-piece-treasure hover:bg-one-piece-gold/10'
    }`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-one-piece-deep-blue/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-pirate font-bold text-one-piece-gold cursor-pointer"
                onClick={() => scrollToSection('hero')}>
              🏴‍☠️ Balaji
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {Object.entries(NavigationMenu).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className={getButtonClasses(key)}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{getSectionIcon(key)}</span>
                    <span>{label}</span>
                    {activeSection === key && (
                      <span className="absolute -top-1 -right-1 text-xs animate-bounce">⭐</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-one-piece-gold hover:text-one-piece-treasure p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-one-piece-deep-blue/95 backdrop-blur-sm rounded-lg mt-2">
              {Object.entries(NavigationMenu).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className={getMobileButtonClasses(key)}
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-xl">{getSectionIcon(key)}</span>
                    <span>{label}</span>
                    {activeSection === key && (
                      <span className="ml-auto text-sm animate-bounce">⭐</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
