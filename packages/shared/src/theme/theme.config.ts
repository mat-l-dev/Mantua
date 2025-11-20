/**
 * Apple Design System - Theme Config
 * 
 * Objeto unificado de tema para uso en Tailwind, JS, etc.
 * Centraliza todos los tokens de diseño
 * 
 * @author Mantua Team
 * @version 1.0.0
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { animations } from './animations';

export const themeConfig = {
  colors,
  typography,
  spacing,
  shadows,
  animations,

  // Metadata
  metadata: {
    name: 'Mantua Apple Design System',
    version: '1.0.0',
    description: 'Apple-inspired design system para Mantua Admin',
    author: 'Mantua Team',
    lastUpdated: '2025-11-20',
  },
} as const;

export type ThemeConfig = typeof themeConfig;
