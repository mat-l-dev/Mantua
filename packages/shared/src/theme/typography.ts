/**
 * Apple Design System - Typography
 * 
 * Escala tipográfica Apple-inspired
 * Basada en escala modular 1.125x y sistema nativo de cada OS
 * 
 * @author Mantua Team
 * @version 1.0.0
 */

export const typography = {
  // Font stack (sistema nativo de cada OS)
  fontFamily: {
    sans: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(', '),
  },

  // Font sizes con line-height
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1.33' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.43' }],     // 14px
    base: ['1rem', { lineHeight: '1.5' }],        // 16px
    lg: ['1.125rem', { lineHeight: '1.56' }],     // 18px
    xl: ['1.5rem', { lineHeight: '1.33' }],       // 24px
    '2xl': ['1.875rem', { lineHeight: '1.2' }],   // 30px
    '3xl': ['2.25rem', { lineHeight: '1.11' }],   // 36px
  },

  // Font weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Letter spacing (Apple usa negativo sutilmente)
  letterSpacing: {
    tight: '-0.01em',
    normal: '0em',
    wide: '0.01em',
  },

  // Predefined text styles para UI (helpers)
  styles: {
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: '1.11',
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: '1.33',
      letterSpacing: '-0.01em',
    },
    body: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: '-0.01em',
    },
    bodySmall: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.43',
      letterSpacing: '-0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: '1.33',
      letterSpacing: '-0.01em',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.43',
      letterSpacing: '-0.01em',
    },
  },
} as const;
