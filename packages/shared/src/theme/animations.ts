/**
 * Apple Design System - Animations
 * 
 * Curvas de animación y keyframes Apple-inspired
 * Basadas en Material Design + Apple timing conventions
 * 
 * @author Mantua Team
 * @version 1.0.0
 */

export const animations = {
  // Curvas de easing (cubic-bezier)
  easing: {
    // Standard: para la mayoría de transiciones (300ms)
    standard: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

    // Quick: para interacciones rápidas (150ms)
    quick: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Enter: para page transitions
    enter: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

    // Spring: para Framer Motion
    spring: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },

  // Duraciones (ms)
  duration: {
    xs: 100,     // Micro-interacciones (opacity changes)
    sm: 150,     // Quick actions (clicks)
    md: 200,     // Standard (slide, scale)
    lg: 300,     // Page transitions
    xl: 500,     // Complex animations (multi-step)
  },

  // Keyframes CSS
  keyframes: {
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },

    fadeOut: {
      from: { opacity: '1' },
      to: { opacity: '0' },
    },

    slideInUp: {
      from: {
        opacity: '0',
        transform: 'translateY(8px)',
      },
      to: {
        opacity: '1',
        transform: 'translateY(0)',
      },
    },

    slideOutDown: {
      from: {
        opacity: '1',
        transform: 'translateY(0)',
      },
      to: {
        opacity: '0',
        transform: 'translateY(8px)',
      },
    },

    slideInLeft: {
      from: {
        opacity: '0',
        transform: 'translateX(-10px)',
      },
      to: {
        opacity: '1',
        transform: 'translateX(0)',
      },
    },

    slideInRight: {
      from: {
        opacity: '0',
        transform: 'translateX(10px)',
      },
      to: {
        opacity: '1',
        transform: 'translateX(0)',
      },
    },

    scaleIn: {
      from: {
        opacity: '0',
        transform: 'scale(0.98)',
      },
      to: {
        opacity: '1',
        transform: 'scale(1)',
      },
    },

    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },

    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  },

  // Presets de animación (strings para CSS)
  presets: {
    fadeIn: 'fade-in 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
    slideUp: 'slide-up 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
    scaleIn: 'scale-in 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
  },
} as const;
