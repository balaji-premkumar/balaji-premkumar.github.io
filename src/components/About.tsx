import React from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Database, Cloud, Smartphone, Award } from 'lucide-react';
import { PERSONAL_INFO, STATS } from '../constants';
import GitHubAvatar from './GitHubAvatar';

const About: React.FC = () => {
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

  const highlights = [
    {
      icon: Code,
      title: 'Frontend Excellence',
      description: 'Expert in React.js, Next.js, and modern CSS frameworks like Tailwind CSS'
    },
    {
      icon: Server,
      title: 'Backend Mastery',
      description: 'Proficient in .NET Core, Node.js, and PHP with scalable architecture design'
    },
    {
      icon: Database,
      title: 'Database Design',
      description: 'Experience with MSSQL, MySQL, MongoDB, and Redis for optimal data solutions'
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      description: 'AWS and Azure deployment with CI/CD pipelines and containerization'
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Android app development and optimization for better performance'
    },
    {
      icon: Award,
      title: 'Quality Focus',
      description: 'Committed to clean code, best practices, and continuous improvement'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Static Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-primary-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              About Me
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {PERSONAL_INFO.subtitle} with {PERSONAL_INFO.yearsOfExperience} years of experience building innovative solutions
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image and stats */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Profile image */}
              <div className="relative">
                <GitHubAvatar 
                  size={320}
                  className="mx-auto shadow-xl bg-gradient-to-br from-primary-500 to-purple-600 p-1 rounded-2xl"
                  showGitHubIcon={true}
                  animate={true}
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  ⚡
                </motion.div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4">
                {STATS.slice(0, 2).map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center"
                  >
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

            {/* Right side - Content */}
            <motion.div variants={itemVariants} className="space-y-6">
            <div className="prose prose-lg dark:prose-invert">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I'm a <span className="font-semibold text-primary-600 dark:text-primary-400">{PERSONAL_INFO.subtitle}</span> {PERSONAL_INFO.description}
              </p>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Currently working as a <span className="font-semibold">Senior Software Engineer at Canarys Automation</span>, 
                I specialize in developing enterprise-level applications with .NET Core, building responsive frontends with React.js, 
                and architecting robust backend systems that serve thousands of users.
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                What sets me apart is my <span className="font-semibold text-primary-600 dark:text-primary-400">self-driven learning approach</span> and 
                ability to adapt to new technologies quickly. I believe in writing clean, maintainable code and following best practices 
                to deliver high-quality solutions that make a real impact.
              </p>
            </div>

            {/* Key strengths */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Strengths
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  Enterprise-level .NET Core development with 20+ modules
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  Full-stack development with modern frameworks
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  Real-time communication with SignalR and WebSockets
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  Mobile app optimization and performance tuning
                </li>
              </ul>
            </div>
          </motion.div>
          </div>

          {/* Expertise areas */}
          <motion.div variants={itemVariants} className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Areas of Expertise
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                    <highlight.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {highlight.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {highlight.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
