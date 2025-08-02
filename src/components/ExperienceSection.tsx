import React from 'react';
import { WorkExperience, OnePieceQuotes } from '../constants';

const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-one-piece-deep-blue/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">
          {OnePieceQuotes.experience} 🗺️
        </h2>
        
        <div className="space-y-8">
          {WorkExperience.map((experience, index) => (
            <div key={experience.id} className="pirate-card p-8 relative">
              <div className="absolute top-4 right-4 text-4xl opacity-30">
                {index === 0 ? '🏴‍☠️' : index === 1 ? '⚓' : '🗺️'}
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-xl font-pirate font-bold text-one-piece-gold mb-2">
                    {experience.position}
                  </h3>
                  <h4 className="text-lg text-one-piece-treasure mb-2">
                    {experience.company}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">{experience.location}</p>
                  <p className="text-sm text-one-piece-straw-hat mb-4">{experience.duration}</p>
                  <p className="text-xs text-gray-400 italic">{experience.type}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h5 className="text-lg font-bold text-one-piece-gold mb-4">Adventures & Achievements:</h5>
                  <ul className="space-y-3">
                    {experience.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="text-one-piece-treasure mt-1">⚔️</span>
                        <span className="text-gray-300 text-sm leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6">
                    <h6 className="text-sm font-bold text-one-piece-treasure mb-3">Weapons Used:</h6>
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="bg-one-piece-gold/20 text-one-piece-gold px-3 py-1 rounded-full text-xs font-medium border border-one-piece-gold/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
