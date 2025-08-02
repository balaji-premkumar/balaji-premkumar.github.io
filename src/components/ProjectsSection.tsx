import React from 'react';
import { Projects, OnePieceQuotes } from '../constants';

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-one-piece-deep-blue/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">
          {OnePieceQuotes.projects} 💎
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Projects.map((project, index) => (
            <div key={project.id} className="pirate-card p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute top-4 right-4 text-3xl opacity-20">
                {index === 0 ? '🏴‍☠️' : index === 1 ? '⚓' : '🗺️'}
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-pirate font-bold text-one-piece-gold mb-3">
                  {project.title}
                </h3>
                
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-one-piece-treasure mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-one-piece-gold mt-1 text-xs">⚔️</span>
                        <span className="text-xs text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-one-piece-treasure mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="bg-one-piece-gold/20 text-one-piece-gold px-2 py-1 rounded-full text-xs font-medium border border-one-piece-gold/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    project.status === 'Production' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-400">{project.type}</span>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-one-piece-treasure/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="pirate-card p-8 bg-gradient-to-r from-one-piece-sunset/20 to-one-piece-pirate-red/20">
            <h3 className="text-2xl font-pirate font-bold text-one-piece-gold mb-4">
              More Treasures Coming Soon! 🏴‍☠️
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              The adventure continues! I'm always working on new projects and exploring uncharted territories in the world of technology. 
              Stay tuned for more exciting discoveries and innovations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
