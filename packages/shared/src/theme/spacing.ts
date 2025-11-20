/**
 * Apple Design System - Spacing
 * 
 * Escala de espaciado basada en 8pt grid (Apple design standard)
 * Valores en rem (base 16px = 1rem)
 * 
 * @author Mantua Team
 * @version 1.0.0
 */

export const spacing = {
  // 8pt grid
  '0': '0px',
  '0.5': '0.125rem',   // 2px
  '1': '0.25rem',      // 4px
  '2': '0.5rem',       // 8px
  '3': '0.75rem',      // 12px
  '4': '1rem',         // 16px
  '5': '1.25rem',      // 20px
  '6': '1.5rem',       // 24px
  '7': '1.75rem',      // 28px
  '8': '2rem',         // 32px
  '10': '2.5rem',      // 40px
  '12': '3rem',        // 48px
  '16': '4rem',        // 64px
  '20': '5rem',        // 80px
  '24': '6rem',        // 96px
  '32': '8rem',        // 128px
} as const;

/**
 * Presets comunes para componentes
 * Facilita mantener consistencia en espaciado
 */
export const spacingPresets = {
  button: {
    xs: { px: spacing['2'], py: spacing['1'] },       // 8px 4px
    sm: { px: spacing['3'], py: spacing['2'] },       // 12px 8px
    md: { px: spacing['4'], py: spacing['2'] },       // 16px 8px (default)
    lg: { px: spacing['6'], py: spacing['3'] },       // 24px 12px
  },

  card: {
    padding: spacing['6'],                             // 24px
  },

  input: {
    px: spacing['3'],                                  // 12px
    py: spacing['2'],                                  // 8px
  },

  section: {
    gap: spacing['6'],                                 // 24px
  },
} as const;
