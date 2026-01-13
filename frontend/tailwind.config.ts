import type { Config } from 'tailwindcss';

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'levitate': 'levitate 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'gradient-text': 'gradientText 3s ease infinite',
        'shake': 'shake 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'typing': 'typing 1.5s steps(40) infinite',
        'blink': 'blink 1s step-end infinite',
        'morph-slow': 'morphSlow 8s ease-in-out infinite',
        'breathe': 'breathe 6s ease-in-out infinite',
        'spin-very-slow': 'spin 20s linear infinite',
        'float-enhanced': 'floatEnhanced 6s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'grid-pulse': 'gridPulse 4s ease-in-out infinite',
        'streak': 'streak 8s linear infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'task-enter': 'taskEnter 0.6s ease-out',
        'grid-move': 'gridMove 20s linear infinite',
        'gradient-x': 'gradientX 6s ease infinite',
        'text-shimmer': 'textShimmer 3s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(-10px) translateX(-10px)' },
        },
        levitate: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientText: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        morphSlow: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', transform: 'scale(1)' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', transform: 'scale(1.05)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.05' },
          '50%': { transform: 'scale(1.1)', opacity: '0.08' },
        },
        floatEnhanced: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-25px) translateX(15px) rotate(5deg)' },
          '66%': { transform: 'translateY(-15px) translateX(-15px) rotate(-5deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.5)' },
        },
        gridPulse: {
          '0%, 100%': { opacity: '0.03' },
          '50%': { opacity: '0.06' },
        },
        streak: {
          '0%': { transform: 'translateX(-100%) translateY(-100%)' },
          '100%': { transform: 'translateX(100%) translateY(100%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-30px) translateX(20px)' },
        },
        taskEnter: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        gridMove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '50px 50px' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        textShimmer: {
          '0%': { transform: 'skewX(-12deg) translateX(-100%)' },
          '100%': { transform: 'skewX(-12deg) translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;