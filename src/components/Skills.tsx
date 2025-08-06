import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Server, 
  Database, 
  Cloud, 
  Smartphone, 
  GitBranch,
  Calendar,
  Box,
  CheckCircle,
  Link,
  Zap,
  Globe,
  Layers,
  FileText,
  MousePointer,
  Palette,
  Brush,
  Layout,
  Package,
  Shield,
  PlayCircle,
  Radio,
  Wifi
} from 'lucide-react';
import { SKILLS_DATA } from '../constants';
import { STATS } from '../constants/personalInfo';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  code: Code,
  server: Server,
  globe: Globe,
  layers: Layers,
  box: Box,
  cpu: Code,
  zap: Zap,
  'file-text': FileText,
  'mouse-pointer': MousePointer,
  palette: Palette,
  brush: Brush,
  layout: Layout,
  database: Database,
  cloud: Cloud,
  package: Package,
  'git-branch': GitBranch,
  smartphone: Smartphone,
  'play-circle': PlayCircle,
  radio: Radio,
  wifi: Wifi,
  link: Link,
  shield: Shield,
  calendar: Calendar,
  'check-circle': CheckCircle
};

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('backend');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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

  const categories = Object.keys(SKILLS_DATA);

  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Static Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
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
              Skills & Expertise
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A comprehensive overview of my technical skills and proficiency levels across different technologies
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {STATS.map((stat, index) => {
              const IconComponent = iconMap[stat.icon] || Box;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-800/80 dark:to-gray-700/80 p-6 rounded-xl text-center border border-primary-100 dark:border-gray-600"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-300" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-200">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Category Tabs */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 border dark:border-gray-600'
                }`}
              >
                {SKILLS_DATA[category as keyof typeof SKILLS_DATA].title}
              </motion.button>
            ))}
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SKILLS_DATA[activeCategory as keyof typeof SKILLS_DATA].skills.map((skill, index) => {
              const IconComponent = iconMap[skill.icon] || Code;
              return (
                <motion.div
                  key={skill.name}
                  variants={{
                    hidden: { scale: 0 },
                    visible: { scale: 1 }
                  }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-white dark:bg-gray-800/90 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {skill.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {skill.years} years experience
                      </p>
                    </div>
                  </div>

                  {/* Skill Level Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Proficiency
                      </span>
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-300">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Additional Skills Summary */}
          <motion.div variants={itemVariants} className="mt-16 bg-gray-50 dark:bg-gray-800/90 p-8 rounded-xl border dark:border-gray-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
              Technical Philosophy
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-primary-600 dark:text-primary-300" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Clean Code
                </h4>
                <p className="text-gray-600 dark:text-gray-200 text-sm">
                  Writing maintainable, readable, and efficient code following best practices and design patterns.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary-600 dark:text-primary-300" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Performance
                </h4>
                <p className="text-gray-600 dark:text-gray-200 text-sm">
                  Optimizing applications for speed, scalability, and resource efficiency across all platforms.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="w-8 h-8 text-primary-600 dark:text-primary-300" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Continuous Learning
                </h4>
                <p className="text-gray-600 dark:text-gray-200 text-sm">
                  Staying updated with latest technologies, frameworks, and industry best practices.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
