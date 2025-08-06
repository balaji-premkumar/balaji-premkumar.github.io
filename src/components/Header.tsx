import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Mail, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS, PERSONAL_INFO, SOCIAL_URLS } from '../constants';
import { useTheme } from '../hooks/useTheme';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme, isFollowingSystem } = useTheme();

  const navItems = NAV_ITEMS;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Close menu first for immediate feedback
      setIsMenuOpen(false);
      
      // Small delay to ensure menu closes before scrolling
      setTimeout(() => {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 shadow-xl shadow-black/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            whileHover={{ 
              scale: 1.05,
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
            className="relative px-4 py-2 text-2xl font-bold cursor-pointer rounded-full backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 text-gray-900 dark:text-white transition-all duration-300 hover:border-white/20"
            onClick={() => scrollToSection('home')}
          >
            <span className="relative z-10">
              {PERSONAL_INFO.name.split(' ')[0]}
            </span>
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
              layoutId="logo-bg"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full backdrop-blur-md border transform-gpu ${
                  activeSection === item.id
                    ? 'bg-white/20 dark:bg-white/15 border-white/30 dark:border-white/25 text-primary-600 dark:text-white shadow-lg shadow-primary-500/20 ring-1 ring-primary-500/20 dark:ring-white/20'
                    : 'bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/40 dark:hover:border-white/30 hover:text-primary-600 dark:hover:text-white hover:shadow-lg hover:shadow-primary-500/10 hover:ring-1 hover:ring-primary-500/10'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-full"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35
                    }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ 
                scale: 1.1,
                rotate: 180
              }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode${isFollowingSystem ? ' (Following system)' : ''}`}
              className="p-3 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 shadow-lg relative"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {/* System preference indicator */}
              {isFollowingSystem && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse" title="Following system preference" />
              )}
            </motion.button>

            {/* Social links */}
            <div className="hidden md:flex items-center space-x-2">
              <motion.a
                whileHover={{ 
                  scale: 1.1,
                  y: -2
                }}
                whileTap={{ scale: 0.9 }}
                href={SOCIAL_URLS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 shadow-lg"
              >
                <Github size={18} />
              </motion.a>
              <motion.a
                whileHover={{ 
                  scale: 1.1,
                  y: -2
                }}
                whileTap={{ scale: 0.9 }}
                href={SOCIAL_URLS.emailLink}
                className="p-3 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 shadow-lg"
              >
                <Mail size={18} />
              </motion.a>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ 
                scale: 1.1,
                rotate: 90
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              className="md:hidden p-3 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 shadow-lg touch-manipulation"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-white/20 dark:border-gray-700/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ 
                    x: 8,
                    scale: 1.02
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative block w-full text-left px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border touch-manipulation ${
                    activeSection === item.id
                      ? 'bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-primary-600 dark:text-primary-400 shadow-lg shadow-primary-500/20'
                      : 'bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/40 dark:hover:border-white/30 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-lg hover:shadow-primary-500/10'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeMobileNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35
                      }}
                    />
                  )}
                </motion.button>
              ))}
              
              {/* Mobile social links */}
              <div className="flex items-center space-x-2 pt-4 border-t border-white/20 dark:border-gray-700/20">
                <motion.a
                  whileHover={{ 
                    scale: 1.1,
                    y: -2
                  }}
                  href={SOCIAL_URLS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 shadow-lg"
                >
                  <Github size={18} />
                </motion.a>
                <motion.a
                  whileHover={{ 
                    scale: 1.1,
                    y: -2
                  }}
                  href={SOCIAL_URLS.emailLink}
                  className="p-3 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 shadow-lg"
                >
                  <Mail size={18} />
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
