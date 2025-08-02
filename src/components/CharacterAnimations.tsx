import React, { useEffect, useState, useRef, Suspense } from 'react';
import { OnePieceCharacters } from '../constants';
import Character3D from './Character3D';

interface CharacterAnimationsProps {
  currentSection: string;
}

const CharacterAnimations: React.FC<CharacterAnimationsProps> = ({ currentSection }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPower, setShowPower] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const [use3D, setUse3D] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Trigger power animation when scrolling between sections
      const isScrollingFast = Math.abs(scrollPosition - (window as any).lastScrollPosition) > 50;
      if (isScrollingFast) {
        setIsTransitioning(true);
        setShowPower(true);
        setTimeout(() => {
          setIsTransitioning(false);
          setShowPower(false);
        }, 1500);
      }
      
      (window as any).lastScrollPosition = scrollPosition;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D CSS Transform Animation
  useEffect(() => {
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const character = getCurrentCharacter();
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          // Clear canvas
          ctx.clearRect(0, 0, 200, 200);
          
          // Draw 3D-like character with shadows and depth
          const centerX = 100;
          const centerY = 100;
          const time = elapsed * 0.001;
          
          // Add 3D rotation effect
          const rotationY = Math.sin(time) * 0.2;
          const rotationX = Math.cos(time * 0.7) * 0.1;
          
          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.beginPath();
          ctx.ellipse(centerX + 10, centerY + 60, 40, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Character sphere with 3D gradient
          const gradient = ctx.createRadialGradient(
            centerX - 20, centerY - 20, 10,
            centerX, centerY, 50
          );
          gradient.addColorStop(0, character.color);
          gradient.addColorStop(0.7, character.color + '80');
          gradient.addColorStop(1, character.color + '20');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
          ctx.fill();
          
          // Highlight for 3D effect
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(centerX - 15, centerY - 15, 15, 0, Math.PI * 2);
          ctx.fill();
          
          // Character emoji with 3D transformation
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.scale(1 + rotationY, 1 + rotationX);
          ctx.font = '32px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#000';
          ctx.fillText(character.emoji, 0, 0);
          ctx.restore();
          
          // Power effect rings
          if (showPower) {
            const ringRadius = 60 + Math.sin(time * 5) * 10;
            ctx.strokeStyle = character.color + '60';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.strokeStyle = character.color + '40';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, ringRadius + 15, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [currentSection, showPower]);

  const getCurrentCharacter = () => {
    return OnePieceCharacters[currentSection as keyof typeof OnePieceCharacters] || OnePieceCharacters.hero;
  };

  const character = getCurrentCharacter();

  const getCharacterAnimation = () => {
    const baseClasses = "transition-all duration-500";
    switch (currentSection) {
      case 'hero':
        return `${baseClasses} ${isTransitioning ? 'animate-rubber-stretch scale-110' : 'animate-float'}`;
      case 'about':
        return `${baseClasses} ${isTransitioning ? 'animate-weather-swirl scale-105' : 'animate-bounce'}`;
      case 'experience':
        return `${baseClasses} ${isTransitioning ? 'animate-sword-slash scale-110' : 'animate-pulse'}`;
      case 'skills':
        return `${baseClasses} ${isTransitioning ? 'animate-cooking-flip scale-105' : 'animate-wave'}`;
      case 'projects':
        return `${baseClasses} ${isTransitioning ? 'animate-sniper-aim scale-110' : 'animate-float'}`;
      case 'contact':
        return `${baseClasses} ${isTransitioning ? 'animate-transform-heal scale-105' : 'animate-bounce'}`;
      default:
        return `${baseClasses} animate-float`;
    }
  };

  const get3DPowerEffect = () => {
    if (!showPower) return null;
    
    switch (currentSection) {
      case 'hero':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Luffy's 3D stretching arms */}
            <div className="absolute top-1/2 left-0 w-full h-6 bg-gradient-to-r from-red-500 via-red-600 to-transparent animate-rubber-extend opacity-80 transform-gpu perspective-1000 rotateY-10"></div>
            <div className="absolute top-1/2 right-0 w-full h-6 bg-gradient-to-l from-red-500 via-red-600 to-transparent animate-rubber-extend opacity-80 transform-gpu perspective-1000 rotateY-10"></div>
            {/* 3D punch effects */}
            <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-red-400 rounded-full animate-ping opacity-60 transform-gpu scale-3d"></div>
            <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-red-500 rounded-full animate-pulse opacity-70 transform-gpu scale-3d"></div>
          </div>
        );
      case 'about':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Nami's 3D weather effects */}
            <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-blue-400 rounded-full animate-ping opacity-60 transform-gpu rotateX-45"></div>
            <div className="absolute top-3/4 right-1/4 w-16 h-16 bg-yellow-400 rounded-full animate-pulse opacity-60 transform-gpu rotateY-45"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl animate-spin opacity-70 transform-gpu rotateZ-360">🌪️</div>
            </div>
            {/* Lightning effects */}
            <div className="absolute top-1/6 right-1/3 w-1 h-20 bg-yellow-300 animate-pulse opacity-80 transform-gpu skew-x-12"></div>
          </div>
        );
      case 'experience':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Zoro's 3D sword slashes */}
            <div className="absolute top-1/4 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-slash-horizontal transform-gpu rotateZ-45"></div>
            <div className="absolute top-1/2 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-slash-horizontal animation-delay-200 transform-gpu rotateZ-0"></div>
            <div className="absolute top-3/4 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-slash-horizontal animation-delay-400 transform-gpu rotateZ--45"></div>
            {/* 3D sword glints */}
            <div className="absolute top-1/3 right-1/4 w-8 h-1 bg-white animate-pulse opacity-90 transform-gpu skew-y-12"></div>
          </div>
        );
      case 'skills':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Sanji's 3D cooking flames */}
            <div className="absolute bottom-1/4 left-1/4 text-4xl animate-bounce transform-gpu rotateY-20">🔥</div>
            <div className="absolute bottom-1/3 right-1/4 text-3xl animate-bounce animation-delay-200 transform-gpu rotateY--20">🔥</div>
            <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 text-5xl animate-pulse transform-gpu scale-3d">👨‍🍳</div>
            {/* Heat wave effects */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-orange-400 via-orange-200 to-transparent opacity-30 animate-wave transform-gpu"></div>
          </div>
        );
      case 'projects':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Usopp's 3D projectiles */}
            <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-projectile transform-gpu rotateZ-45"></div>
            <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-projectile animation-delay-300 transform-gpu rotateZ-90"></div>
            <div className="absolute top-2/3 left-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-projectile animation-delay-600 transform-gpu rotateZ-135"></div>
            {/* Target effects */}
            <div className="absolute top-1/4 right-1/4 w-12 h-12 border-4 border-yellow-400 rounded-full animate-ping opacity-60 transform-gpu"></div>
          </div>
        );
      case 'contact':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Chopper's 3D healing sparkles */}
            <div className="absolute top-1/4 left-1/4 text-2xl animate-ping transform-gpu rotateY-45">✨</div>
            <div className="absolute top-1/3 right-1/4 text-2xl animate-ping animation-delay-200 transform-gpu rotateX-45">💊</div>
            <div className="absolute bottom-1/3 left-1/3 text-2xl animate-ping animation-delay-400 transform-gpu rotateZ-45">🌟</div>
            <div className="absolute bottom-1/4 right-1/3 text-2xl animate-ping animation-delay-600 transform-gpu rotateY--45">💫</div>
            {/* Medical cross with 3D effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-4xl animate-pulse text-red-500 transform-gpu rotateX-30">✚</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-40 pointer-events-none">
      {/* 3D Character Avatar */}
      <div 
        className={`relative ${getCharacterAnimation()}`}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Try 3D first, fallback to canvas */}
        {use3D ? (
          <Suspense fallback={
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl animate-pulse">
              {character.emoji}
            </div>
          }>
            <div
              onError={() => setUse3D(false)}
              className="relative"
            >
              <Character3D character={currentSection} isActive={showPower} />
            </div>
          </Suspense>
        ) : (
          <>
            {/* Canvas for 2D character rendering */}
            <canvas 
              ref={canvasRef}
              width={200}
              height={200}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20"
              style={{
                filter: showPower ? `drop-shadow(0 0 20px ${character.color})` : 'none',
                transform: `rotateY(${isTransitioning ? '15deg' : '0deg'}) rotateX(${isTransitioning ? '5deg' : '0deg'})`,
                transition: 'transform 0.5s ease-in-out'
              }}
            />
          </>
        )}
        
        {/* Character Name Badge with 3D effect */}
        <div 
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg transition-all duration-500"
          style={{ 
            backgroundColor: character.color,
            transform: `translateZ(10px) rotateX(${isTransitioning ? '-10deg' : '0deg'})`,
            boxShadow: `0 4px 8px ${character.color}40`
          }}
        >
          {character.name}
        </div>

        {/* Power Effect Indicator with 3D positioning */}
        {showPower && (
          <div 
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            style={{ transform: 'translateZ(20px)' }}
          >
            <div 
              className="px-2 py-1 rounded text-xs font-bold text-white animate-pulse"
              style={{ 
                backgroundColor: character.color,
                boxShadow: `0 0 15px ${character.color}`
              }}
            >
              {character.power}!
            </div>
          </div>
        )}
      </div>

      {/* 3D Power Effects */}
      {get3DPowerEffect()}
    </div>
  );
};

export default CharacterAnimations;
