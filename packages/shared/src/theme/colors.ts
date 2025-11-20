/**
 * Apple Design System - Color Palette
 * 
 * Paleta de colores Apple-inspired para Mantua Admin
 * Incluye light mode y dark mode completos
 * 
 * @author Mantua Team
 * @version 1.0.0
 */

export const colors = {
  light: {
    // Backgrounds
    background: '#FAFAFA',        // Subtle light gray - separates from cards
    foreground: '#000000',

    // Cards & Surfaces
    card: '#FFFFFF',              // Pure white - stands out
    cardForeground: '#000000',

    // Popovers
    popover: '#FFFFFF',
    popoverForeground: '#000000',

    // Primary (Apple Blue - main accent)
    primary: '#007AFF',
    primaryForeground: '#FFFFFF',

    // Secondary
    secondary: '#666666',         // Medium gray (better than pure black)
    secondaryForeground: '#FFFFFF',

    // Muted (Grays)
    muted: '#F0F0F0',
    mutedForeground: '#666666',   // Better contrast

    // Accent (for hover states)
    accent: '#141414',            // Darker but not pure black
    accentForeground: '#FFFFFF',

    // Destructive (Red)
    destructive: '#FF3B30',
    destructiveForeground: '#FFFFFF',

    // Borders & Inputs
    border: '#E0E0E0',            // Visible on white
    input: '#F5F5F5',

    // Focus Ring
    ring: '#007AFF',
  },

  dark: {
    // Backgrounds - CORRECTED for better contrast
    background: '#0F0F0F',        // Much darker but not pure black
    foreground: '#FFFFFF',

    // Cards & Surfaces - better separation from bg
    card: '#1A1A1A',
    cardForeground: '#FFFFFF',

    // Popovers
    popover: '#0F0F0F',
    popoverForeground: '#FFFFFF',

    // Primary (Apple Blue - unchanged in dark mode)
    primary: '#007AFF',
    primaryForeground: '#FFFFFF',

    // Secondary
    secondary: '#FFFFFF',
    secondaryForeground: '#0F0F0F',

    // Muted (Dark grays) - CORRECTED to #404040 for better contrast
    muted: '#404040',
    mutedForeground: '#B3B3B3',   // Light gray - better contrast

    // Accent
    accent: '#EEEEEE',
    accentForeground: '#0F0F0F',

    // Destructive (Red - darker for dark mode)
    destructive: '#FF453A',
    destructiveForeground: '#FFFFFF',

    // Borders & Inputs - CRITICAL: borders UP from #2D2D2D to #404040!
    border: '#404040',            // MUCH more visible on dark bg
    input: '#262626',

    // Focus Ring
    ring: '#007AFF',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ColorKey = keyof typeof colors.light;

/**
 * Helper: Get color value for a given scheme and key
 * @example getColor('light', 'primary') => '#007AFF'
 */
export function getColor(scheme: ColorScheme, key: ColorKey): string {
  return colors[scheme][key];
}

/**
 * Helper: Convert hex to HSL (for CSS variables)
 * @example hexToHsl('#007AFF') => '211 100% 50%'
 */
export function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 0%';

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  h = +(h * 360).toFixed(0);

  return `${h} ${s}% ${l}%`;
}
