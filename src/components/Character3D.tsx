import React, { useState, useEffect } from 'react';
import { OnePieceCharacters } from '../constants';

interface Character3DProps {
  character: string;
  isActive: boolean;
}

// For now, let's create an enhanced 2D version that looks 3D
// We can upgrade to full Three.js later once the types are properly configured
const Character3D: React.FC<Character3DProps> = ({ character, isActive }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  
  const characterData = OnePieceCharacters[character as keyof typeof OnePieceCharacters] || OnePieceCharacters.hero;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const getCharacterSpecificElements = () => {
    switch (character) {
      case 'hero': // Luffy
        return (
          <>
            {/* Rubber stretching effect */}
            <div 
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"
              style={{
                transform: `translate(-50%, -50%) scale(${1 + Math.sin(animationPhase * 0.1) * 0.5})`,
                opacity: isActive ? 0.8 : 0.3
              }}
            />
            {/* Straw hat */}
            <div 
              className="absolute top-2 left-1/2 w-8 h-3 bg-yellow-600 rounded-full transform -translate-x-1/2"
              style={{
                transform: `translate(-50%, 0) rotateX(${Math.sin(animationPhase * 0.05) * 10}deg)`
              }}
            />
          </>
        );
      case 'about': // Nami
        return (
          <>
            {/* Weather clouds */}
            <div 
              className="absolute -top-2 left-1/2 transform -translate-x-1/2"
              style={{
                transform: `translate(-50%, 0) scale(${0.8 + Math.sin(animationPhase * 0.08) * 0.2})`
              }}
            >
              ☁️
            </div>
            {isActive && (
              <div className="absolute top-0 left-1/2 text-yellow-400 animate-pulse">⚡</div>
            )}
          </>
        );
      case 'experience': // Zoro
        return (
          <>
            {/* Three swords */}
            <div 
              className="absolute top-1/2 left-0 w-1 h-8 bg-gray-300 transform origin-bottom"
              style={{
                transform: `rotate(${45 + Math.sin(animationPhase * 0.1) * 15}deg)`,
                boxShadow: isActive ? '0 0 5px #10B981' : 'none'
              }}
            />
            <div 
              className="absolute top-1/2 right-0 w-1 h-8 bg-gray-300 transform origin-bottom"
              style={{
                transform: `rotate(${-45 - Math.sin(animationPhase * 0.1) * 15}deg)`,
                boxShadow: isActive ? '0 0 5px #10B981' : 'none'
              }}
            />
          </>
        );
      case 'skills': // Sanji
        return (
          <>
            {/* Chef hat */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-white">👨‍🍳</div>
            {/* Cooking fire */}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                transform: `scale(${0.8 + Math.sin(animationPhase * 0.15) * 0.3})`,
                opacity: isActive ? 1 : 0.5
              }}
            >
              🔥
            </div>
          </>
        );
      case 'projects': // Usopp
        return (
          <>
            {/* Slingshot */}
            <div className="absolute top-1/2 left-0 w-6 h-1 bg-brown-600 transform -translate-y-1/2" />
            {/* Projectiles */}
            {isActive && (
              <>
                <div 
                  className="absolute top-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                  style={{
                    left: `${50 + Math.sin(animationPhase * 0.2) * 30}%`
                  }}
                />
                <div 
                  className="absolute top-2/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                  style={{
                    left: `${50 + Math.cos(animationPhase * 0.15) * 25}%`,
                    animationDelay: '0.3s'
                  }}
                />
              </>
            )}
          </>
        );
      case 'contact': // Chopper
        return (
          <>
            {/* Medical cross */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-red-500 text-xs">✚</div>
            {/* Healing sparkles */}
            {isActive && (
              <>
                <div className="absolute top-1/4 left-1/4 text-pink-400 animate-ping">✨</div>
                <div className="absolute top-3/4 right-1/4 text-pink-400 animate-ping" style={{ animationDelay: '0.2s' }}>💫</div>
                <div className="absolute bottom-1/4 left-3/4 text-pink-400 animate-ping" style={{ animationDelay: '0.4s' }}>🌟</div>
              </>
            )}
            {/* Antlers */}
            <div className="absolute -top-1 left-2 w-1 h-4 bg-brown-600 transform rotate-12" />
            <div className="absolute -top-1 right-2 w-1 h-4 bg-brown-600 transform -rotate-12" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Main character sphere with enhanced 3D effect */}
      <div 
        className="relative w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-2xl transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${characterData.color}dd, ${characterData.color}88, ${characterData.color}44)`,
          border: `3px solid ${characterData.color}`,
          transform: `
            perspective(200px) 
            rotateY(${Math.sin(animationPhase * 0.05) * 15}deg) 
            rotateX(${Math.cos(animationPhase * 0.03) * 8}deg)
            translateZ(${isActive ? '10px' : '0px'})
            scale(${1 + Math.sin(animationPhase * 0.08) * 0.1})
          `,
          boxShadow: `
            0 ${8 + Math.sin(animationPhase * 0.1) * 4}px ${16 + Math.sin(animationPhase * 0.1) * 8}px ${characterData.color}40,
            inset -5px -5px 10px ${characterData.color}60,
            inset 5px 5px 10px rgba(255,255,255,0.3)
          `,
          filter: isActive ? `drop-shadow(0 0 20px ${characterData.color}) saturate(1.3)` : 'none'
        }}
      >
        {/* Character emoji with 3D rotation */}
        <span 
          style={{
            transform: `
              rotateY(${Math.sin(animationPhase * 0.06) * 10}deg) 
              rotateX(${Math.cos(animationPhase * 0.04) * 5}deg)
              scale(${1 + Math.sin(animationPhase * 0.12) * 0.05})
            `,
            textShadow: `2px 2px 4px rgba(0,0,0,0.3)`
          }}
        >
          {characterData.emoji}
        </span>
        
        {/* Highlight for 3D effect */}
        <div 
          className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full opacity-30"
          style={{
            transform: `scale(${0.8 + Math.sin(animationPhase * 0.1) * 0.2})`
          }}
        />
      </div>
      
      {/* Character-specific 3D elements */}
      {getCharacterSpecificElements()}
      
      {/* Power aura when active */}
      {isActive && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, transparent 60%, ${characterData.color}20 70%, transparent 80%)`,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      )}
      
      {/* Floating particles */}
      {isActive && (
        <>
          <div 
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              top: `${30 + Math.sin(animationPhase * 0.1) * 20}%`,
              left: `${20 + Math.cos(animationPhase * 0.08) * 15}%`,
              transform: `scale(${0.5 + Math.sin(animationPhase * 0.2) * 0.5})`
            }}
          />
          <div 
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              top: `${60 + Math.cos(animationPhase * 0.12) * 25}%`,
              right: `${15 + Math.sin(animationPhase * 0.09) * 20}%`,
              transform: `scale(${0.3 + Math.cos(animationPhase * 0.18) * 0.4})`
            }}
          />
          <div 
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              bottom: `${25 + Math.sin(animationPhase * 0.14) * 15}%`,
              left: `${70 + Math.cos(animationPhase * 0.11) * 10}%`,
              transform: `scale(${0.4 + Math.sin(animationPhase * 0.16) * 0.3})`
            }}
          />
        </>
      )}
    </div>
  );
};

export default Character3D;