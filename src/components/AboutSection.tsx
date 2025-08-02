import React from 'react';
import { PersonalInfo, OnePieceQuotes } from '../constants';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">
          {OnePieceQuotes.about} ⚓
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="pirate-card p-8">
            <h3 className="text-2xl font-pirate font-bold text-one-piece-gold mb-4">
              About This Pirate
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              {PersonalInfo.description}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-one-piece-gold">📧</span>
                <span className="text-gray-300">{PersonalInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-one-piece-gold">📱</span>
                <span className="text-gray-300">{PersonalInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-one-piece-gold">📍</span>
                <span className="text-gray-300">{PersonalInfo.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-one-piece-gold">🐙</span>
                <a href={`https://${PersonalInfo.github}`} className="text-one-piece-treasure hover:text-one-piece-gold transition-colors">
                  {PersonalInfo.github}
                </a>
              </div>
            </div>
          </div>
          
          <div className="pirate-card p-8 bg-gradient-to-br from-one-piece-sunset/20 to-one-piece-pirate-red/20">
            <h3 className="text-2xl font-pirate font-bold text-one-piece-gold mb-6">
              Pirate's Journey
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🏴‍☠️</span>
                <div>
                  <h4 className="font-bold text-one-piece-treasure">Code Pirate</h4>
                  <p className="text-gray-300 text-sm">Sailing the digital seas for 10+ years</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚔️</span>
                <div>
                  <h4 className="font-bold text-one-piece-treasure">Full Stack Warrior</h4>
                  <p className="text-gray-300 text-sm">Master of both frontend and backend technologies</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h4 className="font-bold text-one-piece-treasure">Adventure Seeker</h4>
                  <p className="text-gray-300 text-sm">Always exploring new technologies and frameworks</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💎</span>
                <div>
                  <h4 className="font-bold text-one-piece-treasure">Treasure Hunter</h4>
                  <p className="text-gray-300 text-sm">Finding elegant solutions to complex problems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
