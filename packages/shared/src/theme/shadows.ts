/**
 * Apple Design System - Shadows
 * 
 * Sistema de sombras Apple-inspired
 * Sutiles pero efectivas para crear sensación de elevación
 * Glassmorphism para componentes especiales
 * 
 * @author Mantua Team
 * @version 1.0.0
 */

export const shadows = {
  none: 'none',

  // Micro shadows (1-2px elevation)
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',

  // Small shadows (4-6px elevation)
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',

  // Medium shadows (8px elevation)
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',

  // Large shadows (16px elevation)
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',

  // XL shadows (20px+ elevation)
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // Glassmorphism (para sidebars, headers, floating elements)
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
    },
    dark: {
      background: 'rgba(18, 18, 18, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
  },
} as const;
