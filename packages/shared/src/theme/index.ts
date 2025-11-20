/**
 * Apple Design System - Main Exports
 * 
 * Exporta todos los tokens de diseño del sistema
 * Importable como: import { colors, typography, spacing, ... } from '@mantua/shared/theme'
 * 
 * @author Mantua Team
 * @version 1.0.0
 */

export { colors, getColor, hexToHsl } from './colors';
export type { ColorScheme, ColorKey } from './colors';

export { typography } from './typography';

export { spacing, spacingPresets } from './spacing';

export { shadows } from './shadows';

export { animations } from './animations';

export { themeConfig } from './theme.config';
export type { ThemeConfig } from './theme.config';
