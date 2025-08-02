import React from 'react';

const FloatingElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating pirate elements */}
      <div className="absolute top-20 left-10 text-4xl opacity-10 animate-float animation-delay-0">
        ⚓
      </div>
      <div className="absolute top-1/4 right-20 text-3xl opacity-10 animate-wave animation-delay-1000">
        🏴‍☠️
      </div>
      <div className="absolute top-1/2 left-1/4 text-5xl opacity-10 animate-float animation-delay-2000">
        🛥️
      </div>
      <div className="absolute bottom-1/4 right-1/3 text-4xl opacity-10 animate-wave animation-delay-3000">
        💎
      </div>
      <div className="absolute bottom-20 left-20 text-3xl opacity-10 animate-float animation-delay-4000">
        🗺️
      </div>
      <div className="absolute top-1/3 left-1/2 text-2xl opacity-10 animate-wave animation-delay-2500">
        ⭐
      </div>
      
      {/* Sailing ship animation */}
      <div className="absolute bottom-10 left-0 text-6xl opacity-5 animate-sail" style={{animationDuration: '30s', animationIterationCount: 'infinite'}}>
        🚢
      </div>
      
      {/* Floating compass */}
      <div className="absolute top-1/2 right-10 text-3xl opacity-10 animate-spin" style={{animationDuration: '20s'}}>
        🧭
      </div>
    </div>
  );
};

export default FloatingElements;
