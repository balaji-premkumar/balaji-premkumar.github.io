import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { EXPERIENCES } from '../constants';

const Experience: React.FC = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(0);

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

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Experience
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A journey of continuous growth and innovation in software development
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-primary-200 dark:bg-primary-800"></div>

            {/* Experience items */}
            <div className="space-y-12">
              {EXPERIENCES.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  variants={itemVariants}
                  className={`relative flex items-start ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-4 h-4 rounded-full border-4 ${
                        experience.type === 'current'
                          ? 'bg-primary-500 border-primary-200 dark:border-primary-800'
                          : 'bg-white dark:bg-gray-700 border-primary-200 dark:border-primary-800'
                      }`}
                    />
                  </div>

                  {/* Content card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`ml-16 md:ml-0 ${
                      index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                    } md:w-1/2`}
                  >
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {experience.position}
                          </h3>
                          <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                            {experience.company}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              {experience.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              {experience.location}
                            </div>
                          </div>
                        </div>
                        {experience.type === 'current' && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {experience.description}
                      </p>

                      {/* Technologies */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Expand/Collapse button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleExpand(experience.id)}
                        className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
                      >
                        {expandedItem === experience.id ? (
                          <>
                            <ChevronUp size={16} />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            Key Achievements
                          </>
                        )}
                      </motion.button>

                      {/* Achievements - Expandable */}
                      <AnimatePresence>
                        {expandedItem === experience.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                                Key Achievements:
                              </h5>
                              <ul className="space-y-2">
                                {experience.achievements.map((achievement, achievementIndex) => (
                                  <motion.li
                                    key={achievementIndex}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: achievementIndex * 0.1 }}
                                    className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
                                  >
                                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="text-sm leading-relaxed">{achievement}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              <ExternalLink size={20} />
              View Full Resume
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
