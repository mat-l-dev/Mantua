# 🔧 Guía Técnica: Integración del Sistema Apple

> Paso a paso para implementar el rediseño Apple en Mantua Admin

---

## 📍 Ubicación de Archivos y Cambios

```
Mantua/
├── apps/
│   └── admin/
│       ├── src/
│       │   ├── app/
│       │   │   └── globals.css          ← YA TIENE tokens Apple ✅
│       │   └── components/
│       │       ├── ui/
│       │       │   ├── button.tsx        ← REDISEÑAR
│       │       │   ├── card.tsx          ← REDISEÑAR
│       │       │   ├── input.tsx         ← REDISEÑAR
│       │       │   ├── sidebar.tsx       ← REDISEÑAR
│       │       │   ├── dialog.tsx        ← REDISEÑAR
│       │       │   └── [otros].tsx       ← REDISEÑAR (TIER 2/3)
│       │       ├── dashboard/
│       │       │   ├── header.tsx        ← REDISEÑAR
│       │       │   └── sidebar.tsx       ← REDISEÑAR
│       │       ├── products/
│       │       └── settings/
│       ├── tailwind.config.ts            ← IMPORTAR tema
│       └── package.json
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── theme/                    ← CREAR
│       │   │   ├── colors.ts             ← NUEVO
│       │   │   ├── typography.ts         ← NUEVO
│       │   │   ├── spacing.ts            ← NUEVO
│       │   │   ├── shadows.ts            ← NUEVO
│       │   │   ├── animations.ts         ← NUEVO
│       │   │   ├── index.ts              ← NUEVO
│       │   │   └── theme.config.ts       ← NUEVO
│       │   ├── constants/
│       │   ├── types/
│       │   └── utils/
│       └── package.json
└── docs/
    ├── APPLE_DESIGN_SYSTEM.md            ← ✅ CREADO
    └── COMPONENT_REDESIGN.md             ← ✅ CREADO
```

---

## 🚀 FASE 1: CREAR SISTEMA DE TEMA EN PACKAGES/SHARED

### Paso 1.1: Crear estructura de directorios

```bash
cd Mantua/packages/shared/src

# Crear carpeta theme
mkdir -p theme
touch theme/colors.ts
touch theme/typography.ts
touch theme/spacing.ts
touch theme/shadows.ts
touch theme/animations.ts
touch theme/index.ts
touch theme/theme.config.ts
```

### Paso 1.2: Implementar `theme/colors.ts`

```typescript
// packages/shared/src/theme/colors.ts

/**
 * Paleta de colores Apple-inspired
 * Incluye light mode y dark mode
 * Valores en formato hex para máxima compatibilidad
 */

export const colors = {
  light: {
    // Backgrounds
    background: '#FFFFFF',
    foreground: '#000000',
    
    // Cards & Surfaces
    card: '#FFFFFF',
    cardForeground: '#000000',
    
    // Popovers
    popover: '#FFFFFF',
    popoverForeground: '#000000',
    
    // Primary (Blue Apple)
    primary: '#007AFF',
    primaryForeground: '#FFFFFF',
    
    // Secondary
    secondary: '#000000',
    secondaryForeground: '#FFFFFF',
    
    // Muted (Grays)
    muted: '#F0F0F0',
    mutedForeground: '#666666',
    
    // Accent
    accent: '#0D0D0D',
    accentForeground: '#FFFFFF',
    
    // Destructive
    destructive: '#FF3B30',
    destructiveForeground: '#FFFFFF',
    
    // Borders & Inputs
    border: '#E0E0E0',
    input: '#F5F5F5',
    
    // Focus Ring
    ring: '#007AFF',
  },
  
  dark: {
    // Backgrounds
    background: '#121212',
    foreground: '#FFFFFF',
    
    // Cards & Surfaces
    card: '#1A1A1A',
    cardForeground: '#FFFFFF',
    
    // Popovers
    popover: '#121212',
    popoverForeground: '#FFFFFF',
    
    // Primary (Blue Apple - sin cambios)
    primary: '#007AFF',
    primaryForeground: '#FFFFFF',
    
    // Secondary
    secondary: '#FFFFFF',
    secondaryForeground: '#121212',
    
    // Muted (Grays oscuros)
    muted: '#333333',
    mutedForeground: '#B3B3B3',
    
    // Accent
    accent: '#EEEEEE',
    accentForeground: '#121212',
    
    // Destructive
    destructive: '#FF453A',
    destructiveForeground: '#FFFFFF',
    
    // Borders & Inputs
    border: '#2D2D2D',
    input: '#262626',
    
    // Focus Ring
    ring: '#007AFF',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ColorKey = keyof typeof colors.light;
```

### Paso 1.3: Implementar `theme/typography.ts`

```typescript
// packages/shared/src/theme/typography.ts

/**
 * Escala tipográfica Apple-inspired
 * Basada en escala modular (1.125x factor)
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
  
  // Base size
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1.33' }],    // 12px
    sm: ['0.875rem', { lineHeight: '1.43' }],   // 14px
    base: ['1rem', { lineHeight: '1.5' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.56' }],   // 18px
    xl: ['1.5rem', { lineHeight: '1.33' }],     // 24px
    '2xl': ['1.875rem', { lineHeight: '1.2' }], // 30px
    '3xl': ['2.25rem', { lineHeight: '1.11' }], // 36px
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
  
  // Predefined text styles para UI (helper)
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
```

### Paso 1.4: Implementar `theme/spacing.ts`

```typescript
// packages/shared/src/theme/spacing.ts

/**
 * Escala de espaciado basada en 8px grid (Apple design standard)
 * Valores en rem (base 16px)
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

// Presets comunes para componentes
export const spacingPresets = {
  button: {
    xs: { px: spacing['2'], py: spacing['1'] },     // 8px 4px
    sm: { px: spacing['3'], py: spacing['1.5'] },   // 12px 6px
    md: { px: spacing['4'], py: spacing['2'] },     // 16px 8px (default)
    lg: { px: spacing['6'], py: spacing['3'] },     // 24px 12px
  },
  
  card: {
    padding: spacing['6'],                           // 24px
  },
  
  input: {
    px: spacing['3'],                               // 12px
    py: spacing['2'],                               // 8px
  },
  
  section: {
    gap: spacing['6'],                              // 24px
  },
} as const;
```

### Paso 1.5: Implementar `theme/shadows.ts`

```typescript
// packages/shared/src/theme/shadows.ts

/**
 * Sistema de sombras Apple-inspired
 * Sutiles pero efectivas para elevación
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
  
  // Glassmorphism (para sidebars, headers)
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
```

### Paso 1.6: Implementar `theme/animations.ts`

```typescript
// packages/shared/src/theme/animations.ts

/**
 * Curvas de animación y keyframes Apple
 * Basadas en Material Design + Apple timing
 */

export const animations = {
  // Curvas de easing (cubic-bezier)
  easing: {
    // Standard: para la mayoría de transiciones
    standard: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    
    // Quick: para interacciones rápidas (hover, focus)
    quick: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Enter: para page transitions
    enter: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    
    // Spring: para Framer Motion
    spring: { type: 'spring', stiffness: 300, damping: 20 },
  },
  
  // Duraciones (ms)
  duration: {
    xs: 100,     // Micro-interacciones
    sm: 150,     // Quick actions
    md: 200,     // Standard
    lg: 300,     // Page transitions
    xl: 500,     // Complex animations
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
  
  // Presets de animación (para CSS)
  presets: {
    fadeIn: 'fade-in 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
    slideUp: 'slide-up 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
    scaleIn: 'scale-in 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
  },
} as const;
```

### Paso 1.7: Implementar `theme/index.ts`

```typescript
// packages/shared/src/theme/index.ts

export { colors } from './colors'
export type { ColorScheme, ColorKey } from './colors'

export { typography } from './typography'

export { spacing, spacingPresets } from './spacing'

export { shadows } from './shadows'

export { animations } from './animations'

export { themeConfig } from './theme.config'
export type { ThemeConfig } from './theme.config'
```

### Paso 1.8: Implementar `theme/theme.config.ts` (Objeto completo)

```typescript
// packages/shared/src/theme/theme.config.ts

import { colors } from './colors'
import { typography } from './typography'
import { spacing } from './spacing'
import { shadows } from './shadows'
import { animations } from './animations'

/**
 * Objeto unificado de tema para uso en Tailwind, JS, etc.
 */
export const themeConfig = {
  colors,
  typography,
  spacing,
  shadows,
  animations,
  
  // Información de tema
  metadata: {
    name: 'Mantua Apple Design System',
    version: '1.0.0',
    description: 'Apple-inspired design system para Mantua Admin',
    lastUpdated: '2025-11-20',
  },
} as const;

export type ThemeConfig = typeof themeConfig;
```

### Paso 1.9: Actualizar `packages/shared/src/index.ts`

```typescript
// packages/shared/src/index.ts

export * from './utils/format'
export * from './constants'

// 🆕 NUEVO: Exportar theme
export * from './theme'

// Tipos
export type { Database } from './types/database.types'
```

### Paso 1.10: Validar en Turborepo

```bash
cd Mantua

# Asegurar que shared se regenera
pnpm install

# Build shared
pnpm --filter @mantua/shared build

# Verificar que compila sin errores
echo "✅ Theme package creado exitosamente"
```

---

## 🎨 FASE 2: INTEGRAR TEMA EN ADMIN

### Paso 2.1: Actualizar `apps/admin/tailwind.config.ts`

```typescript
// apps/admin/tailwind.config.ts

import type { Config } from 'tailwindcss'
import { themeConfig } from '@mantua/shared/theme'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      colors: {
        // Ya mapea CSS variables, pero ahora referencia el tema compartido
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      
      fontFamily: {
        sans: themeConfig.typography.fontFamily.sans,
      },
      
      spacing: themeConfig.spacing,
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      boxShadow: {
        xs: themeConfig.shadows.xs,
        sm: themeConfig.shadows.sm,
        md: themeConfig.shadows.md,
        lg: themeConfig.shadows.lg,
        xl: themeConfig.shadows.xl,
      },
      
      animation: {
        'fade-in': 'fade-in 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-up': 'slide-up 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'scale-in': 'scale-in 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      
      keyframes: {
        'fade-in': themeConfig.animations.keyframes.fadeIn,
        'slide-up': themeConfig.animations.keyframes.slideInUp,
        'scale-in': themeConfig.animations.keyframes.scaleIn,
      },
    },
  },
  
  plugins: [],
}

export default config
```

### Paso 2.2: Verificar que Tailwind compila

```bash
cd apps/admin

# Rebuild Tailwind
pnpm dev

# Abrir http://localhost:3000 y validar que estilos cargan
```

---

## ✅ TESTING Y VALIDACIÓN

### Checklist de Validación - Fase 1 Complete

- [ ] `packages/shared/src/theme/` creado con todos los archivos
- [ ] `packages/shared/src/index.ts` exporta theme
- [ ] `pnpm --filter @mantua/shared build` sin errores
- [ ] `apps/admin/tailwind.config.ts` importa `themeConfig`
- [ ] Admin levanta sin errores de CSS
- [ ] Colores en `globals.css` coinciden con `theme/colors.ts`

### Próximos Pasos

1. **Crear Rama Git:**
   ```bash
   git checkout -b feat/apple-design-system-phase-1
   git add packages/shared/src/theme/
   git commit -m "feat: create apple design system theme base in shared package"
   ```

2. **Comenzar Fase 2:** Rediseñar componentes usando el nuevo tema
   - Button.tsx
   - Card.tsx
   - Input.tsx
   - etc.

3. **Luego Fase 3:** Agregar animaciones con Framer Motion

---

## 📞 Troubleshooting

### Error: "Cannot find module '@mantua/shared'"
```bash
# Solución: Regenerar node_modules
pnpm install
pnpm --filter @mantua/shared build
```

### Estilos no aplican
```bash
# Solución: Limpiar cache de Tailwind
rm -rf .next
pnpm dev
```

### CSS variables no funcionan
```bash
# Verificar que globals.css está importado en layout.tsx
import '@/app/globals.css'  // ← Esto debe estar
```

