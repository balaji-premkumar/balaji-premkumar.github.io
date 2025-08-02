/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'one-piece': {
          'ocean': '#003366',
          'deep-blue': '#001a33',
          'gold': '#FFD700',
          'sunset': '#FF6B35',
          'straw-hat': '#F4A460',
          'treasure': '#DAA520',
          'navy': '#1e3a8a',
          'pirate-red': '#DC2626',
          'ship-brown': '#8B4513'
        }
      },
      fontFamily: {
        'pirate': ['Cinzel', 'serif'],
        'adventure': ['Fredoka One', 'cursive'],
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #003366 0%, #001a33 100%)',
        'treasure-gradient': 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #FF6B35 0%, #DC2626 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'treasure-glow': 'treasureGlow 2s ease-in-out infinite alternate',
        'map-float': 'mapFloat 4s ease-in-out infinite',
        'wave-motion': 'waveMotion 3s ease-in-out infinite',
        'compass-spin': 'compassSpin 20s linear infinite',
        'sail': 'sail 30s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'rubber-stretch': 'rubberStretch 1s ease-in-out',
        'rubber-extend': 'rubberExtend 1.5s ease-out',
        'weather-swirl': 'weatherSwirl 2s ease-in-out',
        'sword-slash': 'swordSlash 0.8s ease-out',
        'slash-horizontal': 'slashHorizontal 1s ease-out',
        'cooking-flip': 'cookingFlip 1.2s ease-in-out',
        'sniper-aim': 'sniperAim 1s ease-in-out',
        'projectile': 'projectile 2s ease-out forwards',
        'transform-heal': 'transformHeal 1.5s ease-in-out',
        'compass-spin': 'compassSpin 20s linear infinite',
        'scale-3d': 'scale3d 2s ease-in-out infinite',
        'rotate-y-360': 'rotateY360 1s ease-in-out',
        'rotate-x-360': 'rotateX360 1s ease-in-out',
        'rotate-z-360': 'rotateZ360 1s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        treasureGlow: {
          '0%': { boxShadow: '0 0 5px #FFD700' },
          '100%': { boxShadow: '0 0 20px #FFD700, 0 0 30px #FFD700' },
        },
        mapFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-5px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        waveMotion: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(2px) translateY(-2px)' },
          '50%': { transform: 'translateX(0px) translateY(-4px)' },
          '75%': { transform: 'translateX(-2px) translateY(-2px)' },
        },
        sail: {
          '0%': { transform: 'translateX(-100vw)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        rubberStretch: {
          '0%': { transform: 'scaleX(1) scaleY(1)' },
          '50%': { transform: 'scaleX(1.5) scaleY(0.7)' },
          '100%': { transform: 'scaleX(1) scaleY(1)' },
        },
        rubberExtend: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { transform: 'translateX(0%)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        weatherSwirl: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.2)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        swordSlash: {
          '0%': { transform: 'rotate(-45deg) translateX(-50px)', opacity: '0' },
          '50%': { transform: 'rotate(0deg) translateX(0px)', opacity: '1' },
          '100%': { transform: 'rotate(45deg) translateX(50px)', opacity: '0' },
        },
        slashHorizontal: {
          '0%': { transform: 'translateX(-100%) scaleX(0)', opacity: '0' },
          '50%': { transform: 'translateX(0%) scaleX(1)', opacity: '1' },
          '100%': { transform: 'translateX(100%) scaleX(0)', opacity: '0' },
        },
        cookingFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg) scale(1.1)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        sniperAim: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(-5deg) scale(1.1)' },
          '50%': { transform: 'rotate(5deg) scale(1.2)' },
          '75%': { transform: 'rotate(-2deg) scale(1.1)' },
          '100%': { transform: 'rotate(0deg) scale(1)' },
        },
        projectile: {
          '0%': { transform: 'translateX(0px) translateY(0px) scale(1)', opacity: '1' },
          '50%': { transform: 'translateX(200px) translateY(-50px) scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'translateX(400px) translateY(-100px) scale(0.5)', opacity: '0' },
        },
        transformHeal: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.2) rotate(90deg)' },
          '50%': { transform: 'scale(0.8) rotate(180deg)' },
          '75%': { transform: 'scale(1.1) rotate(270deg)' },
          '100%': { transform: 'scale(1) rotate(360deg)' },
        },
        compassSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scale3d: {
          '0%, 100%': { transform: 'scale3d(1, 1, 1) rotateY(0deg)' },
          '50%': { transform: 'scale3d(1.1, 1.1, 1.1) rotateY(180deg)' },
        },
        rotateY360: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        rotateX360: {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(360deg)' },
        },
        rotateZ360: {
          '0%': { transform: 'rotateZ(0deg)' },
          '100%': { transform: 'rotateZ(360deg)' },
        },
      }
    },
  },
  plugins: [],
}
