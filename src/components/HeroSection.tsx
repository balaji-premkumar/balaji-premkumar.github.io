import React, { useState, useEffect } from 'react';
import { PersonalInfo, OnePieceQuotes, OnePieceCharacters } from '../constants';

const HeroSection: React.FC = () => {
  const [showLuffyPower, setShowLuffyPower] = useState(false);

  useEffect(() => {
    // Show Luffy's power effect periodically
    const interval = setInterval(() => {
      setShowLuffyPower(true);
      setTimeout(() => setShowLuffyPower(false), 2000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const luffy = OnePieceCharacters.hero;

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Luffy's Power Effects */}
      {showLuffyPower && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Rubber stretching arms effect */}
          <div className="absolute top-1/2 left-0 w-1/3 h-4 bg-gradient-to-r from-red-500 via-red-400 to-transparent animate-rubber-extend opacity-70"></div>
          <div className="absolute top-1/2 right-0 w-1/3 h-4 bg-gradient-to-l from-red-500 via-red-400 to-transparent animate-rubber-extend opacity-70"></div>
          <div className="absolute top-1/3 left-1/4 w-1/2 h-2 bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-rubber-extend animation-delay-500 opacity-60"></div>
        </div>
      )}

      {/* Luffy Character Display */}
      <div className="absolute top-8 right-8 z-30">
        <div className={`relative ${showLuffyPower ? 'animate-rubber-stretch' : 'animate-float'}`}>
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-xl border-4 transition-all duration-500"
            style={{ 
              backgroundColor: luffy.color + '20',
              borderColor: luffy.color,
              boxShadow: `0 0 15px ${luffy.color}40`
            }}
          >
            {luffy.emoji}
          </div>
          
          {/* Power indicator */}
          {showLuffyPower && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div 
                className="px-2 py-1 rounded text-xs font-bold text-white animate-pulse"
                style={{ backgroundColor: luffy.color }}
              >
                {luffy.power}!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 text-6xl animate-float">⚓</div>
        <div className="absolute top-1/3 right-1/4 text-5xl animate-wave">🏴‍☠️</div>
        <div className="absolute bottom-1/4 left-1/3 text-4xl animate-float">💎</div>
        <div className="absolute bottom-1/3 right-1/3 text-5xl animate-wave">🛥️</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Profile Image */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto rounded-full border-4 border-one-piece-gold overflow-hidden shadow-2xl animate-float">
            <img 
              src={PersonalInfo.profileImage} 
              alt={PersonalInfo.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '';
              }}
            />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-pirate font-bold text-one-piece-gold mb-4 animate-fadeInUp">
          {PersonalInfo.name}
        </h1>

        {/* Subtitle */}
        <h2 className="text-2xl md:text-3xl font-adventure text-one-piece-straw-hat mb-4 animate-fadeInUp animation-delay-200">
          {PersonalInfo.subtitle}
        </h2>

        {/* Title */}
        <h3 className="text-xl md:text-2xl text-one-piece-treasure mb-8 animate-fadeInUp animation-delay-400">
          {PersonalInfo.title}
        </h3>

        {/* Quote */}
        <blockquote className="text-lg md:text-xl text-one-piece-gold/80 italic mb-8 max-w-2xl mx-auto animate-fadeInUp animation-delay-600">
          "{OnePieceQuotes.hero}"
        </blockquote>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fadeInUp animation-delay-800">
          {PersonalInfo.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-1000">
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="treasure-button text-lg px-8 py-4"
          >
            Join My Crew! ⚓
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-transparent border-2 border-one-piece-gold text-one-piece-gold font-bold py-4 px-8 rounded-full hover:bg-one-piece-gold hover:text-one-piece-deep-blue transition-all duration-300 transform hover:scale-105"
          >
            Send a Message 📮
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-one-piece-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-one-piece-gold rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
