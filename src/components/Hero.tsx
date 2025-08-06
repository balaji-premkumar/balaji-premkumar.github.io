import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Github, Mail, MapPin, Download } from 'lucide-react';
import { PERSONAL_INFO, HERO_ROLES, STATS, SOCIAL_LINKS } from '../constants';
import GitHubAvatar from './GitHubAvatar';

const Hero: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {    
    const currentRole = HERO_ROLES[currentRoleIndex];
    let currentIndex = 0;

    const typeText = () => {
      if (currentIndex < currentRole.length) {
        setDisplayText(currentRole.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, 100);
      } else {
        setTimeout(() => {
          setIsTyping(false);
          setTimeout(() => {
            setDisplayText('');
            setCurrentRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
            setIsTyping(true);
          }, 1000);
        }, 2000);
      }
    };

    if (isTyping) {
      typeText();
    }
  }, [currentRoleIndex, isTyping]);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      {/* Static background elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        {/* Simple static gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10" />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Greeting */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
              <MapPin size={16} className="mr-2" />
              {PERSONAL_INFO.location}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              {PERSONAL_INFO.name}
            </span>
          </motion.h1>

          {/* Profile Picture */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <GitHubAvatar size={200} className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-purple-500/20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Dynamic role text */}
          <motion.div variants={itemVariants} className="h-20 mb-8">
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300">
              Self-taught{' '}
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-8 bg-primary-600 ml-1"
                />
              </span>
            </p>
          </motion.div>

          {/* Description */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            With <span className="font-semibold text-primary-600 dark:text-primary-400">10+ years</span> of experience building scalable web applications, 
            enterprise systems, and mobile solutions. Passionate about clean code, innovative solutions, and continuous learning.
          </motion.p>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-2xl mx-auto">
            {STATS.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToAbout}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Explore My Work
              <ChevronDown size={20} />
            </motion.button>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/resume.pdf"
              download
              className="px-8 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Download size={20} />
              Download Resume
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex justify-center space-x-6">
            {SOCIAL_LINKS.map((social, index) => (
              <motion.a
                key={social.platform}
                whileHover={{ scale: 1.2, rotate: index % 2 === 0 ? 5 : -5 }}
                whileTap={{ scale: 0.9 }}
                href={social.url}
                target={social.platform === 'Email' ? undefined : "_blank"}
                rel={social.platform === 'Email' ? undefined : "noopener noreferrer"}
                className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                title={social.label}
              >
                {social.icon === 'github' ? <Github size={24} /> : <Mail size={24} />}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
