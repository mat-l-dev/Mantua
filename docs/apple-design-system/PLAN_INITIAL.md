# 🍎 Apple Design System - Mantua Admin

**Versión:** 1.0  
**Fecha:** 20 de Noviembre, 2025  
**Objetivo:** Rediseño completo del panel admin con estilo Apple: minimalista, limpio, accesible.

---

## 📋 TABLA DE CONTENIDOS

1. [Análisis del Estado Actual](#análisis-del-estado-actual)
2. [Roadmap de Implementación](#roadmap-de-implementación)
3. [Propuesta de Diseño (Paleta, Tipografía, Tokens)](#propuesta-de-diseño)
4. [Especificación de Componentes](#especificación-de-componentes)
5. [Integración Técnica](#integración-técnica)
6. [Documentación y Mantenimiento](#documentación-y-mantenimiento)

---

## 🔍 Análisis del Estado Actual

### ✅ Fortalezas

1. **Arquitectura modular bien establecida**
   - Componentes organizados por feature (`/auth`, `/dashboard`, `/products`, `/settings`, `/orders`, `/customers`, `/staff`)
   - Sistema de componentes base (`/ui`) usando Shadcn/Radix UI
   - Buena separación de concerns

2. **Tooling actual**
   - **Tailwind CSS v4** → Excelente para tokens de diseño (CSS variables)
   - **CVA (Class Variance Authority)** → Componentes con variantes semánticas
   - **Next.js 15 con App Router** → Moderno y optimizado
   - **Turborepo** → Monorepo bien estructurado
   - **TypeScript strict** → Type-safe

3. **Base de tema ya implementada**
   - CSS variables en `globals.css` ya definen paleta Apple-inspired
   - Sistema de colores con HSL (hsl(var(--background)), etc.)
   - Soporte para modo oscuro (.dark class)
   - Animaciones básicas definidas (@keyframes fade-in, slide-up)

4. **Componentes Shadcn/Radix listos**
   - Button, Card, Input, Select, Tabs, Checkbox, Switch (NUEVO), Dialog, etc.
   - Fáciles de customizar con Tailwind

### ⚠️ Oportunidades de Mejora

1. **Sistema de tema no centralizado**
   - Tokens de diseño viven en `apps/admin/globals.css`
   - No existe `packages/shared/theme` para reutilizar en storefront
   - **Recomendación:** Crear `packages/shared/src/theme/` con objeto TypeScript de tokens

2. **Animaciones limitadas**
   - Solo fade-in y slide-up definidas
   - Falta: scale, rotate, blur, stagger, spring animations
   - **Recomendación:** Considerar Framer Motion para animaciones complejas

3. **Documentación de componentes**
   - No existe Storybook ni guía visual
   - Pocas comments explicativas en componentes
   - **Recomendación:** Crear Storybook al final (Fase 5)

4. **Modo oscuro en construcción**
   - Ya tiene .dark mode pero no está testeado en todos los componentes
   - **Recomendación:** Validar en Fase 4

5. **Shared package limitado**
   - Solo exporta utils y types
   - No tiene componentes reutilizables ni tema
   - **Recomendación:** Expandir para incluir sistema de tema

---

## 🗺️ Roadmap de Implementación

### Timeline Estimado: **4-5 semanas** (equipo de 1 developer senior)

```
FASE 1 (3-4 días): Tema Base
    ├─ Crear packages/shared/theme
    ├─ Definir tokens (colores, espacios, tipografía)
    ├─ Exportar desde packages/shared
    └─ Integrar en admin

FASE 2 (5-6 días): Componentes Base
    ├─ Rediseñar Button, Card, Input
    ├─ Rediseñar Select, Dialog, Dropdown
    ├─ Rediseñar Tabs, Checkbox, Switch
    └─ QA visual en cada componente

FASE 3 (3-4 días): Animaciones & Micro-interacciones
    ├─ Instalar Framer Motion (si aplica)
    ├─ Agregar transiciones suaves a botones
    ├─ Hover, focus, active states
    ├─ Page transitions
    └─ Loading & skeleton states

FASE 4 (4-5 días): Integración en Admin
    ├─ Rediseñar Sidebar (con animaciones)
    ├─ Rediseñar Header
    ├─ Aplicar tema a layouts y páginas
    ├─ Revisar modal y forms
    ├─ Validar modo oscuro
    └─ QA funcional completo

FASE 5 (2-3 días): Documentación & Polish
    ├─ Crear guía de tema (THEME_GUIDE.md)
    ├─ Documentar cómo extender componentes
    ├─ Comments en código
    ├─ Storybook básico (opcional)
    └─ README para desarrolladores

FASE 6 (Futura - no incluida): Replicar en Storefront
    ├─ Importar mismo theme en apps/storefront
    ├─ Reutilizar componentes de packages/ui (opcional)
    └─ Adaptaciones específicas del storefront
```

### Prioridades por Fase

| Fase | Criticidad | Impacto | Esfuerzo |
|------|-----------|--------|---------|
| 1    | 🔴 Alta   | Base   | 3-4d    |
| 2    | 🔴 Alta   | Visual | 5-6d    |
| 3    | 🟡 Media  | UX     | 3-4d    |
| 4    | 🔴 Alta   | End-to-End | 4-5d |
| 5    | 🟢 Baja   | Mantenimiento | 2-3d |

---

## 🎨 Propuesta de Diseño

### 1. Paleta de Colores

#### Light Mode (por defecto)
```
Background:        #FFFFFF (white)
Foreground:        #000000 (black)
Card:              #FFFFFF (white)
Primary (accent):  #007AFF (Apple Blue)
Secondary:         #000000 (black)
Muted:             #F0F0F0 (light gray)
Muted-FG:          #666666 (medium gray)
Accent (hover):    #0D0D0D (almost black)
Border:            #E0E0E0 (subtle gray border)
Input BG:          #F5F5F5 (very light gray)
Destructive:       #FF3B30 (Apple Red)
```

#### Dark Mode
```
Background:        #121212 (almost black)
Foreground:        #FFFFFF (white)
Card:              #1A1A1A (slightly lighter)
Primary:           #007AFF (Apple Blue - unchanged)
Secondary:         #FFFFFF (white)
Muted:             #333333 (dark gray)
Muted-FG:          #B3B3B3 (light gray)
Accent:            #EEEEEE (very light gray)
Border:            #2D2D2D (subtle dark border)
Input BG:          #262626 (dark input)
Destructive:       #FF453A (Apple Red - darker)
```

### 2. Tipografía

```
Family:           -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
                  (Sistema nativo de cada OS)

Base Size:        16px (rem = 16px)

Scale (modular):
  - Body:         1rem (16px) - line-height: 1.5
  - Small:        0.875rem (14px) - line-height: 1.43
  - XSmall:       0.75rem (12px) - line-height: 1.33 (captions)
  - Large:        1.125rem (18px) - line-height: 1.56
  - XL:           1.5rem (24px) - line-height: 1.33
  - 2XL:          1.875rem (30px) - line-height: 1.2
  - 3XL:          2.25rem (36px) - line-height: 1.11

Weights:
  - Regular:      400
  - Medium:       500
  - Semibold:     600
  - Bold:         700

Letter-spacing:   -0.01em (sutilmente negativo, como Apple)
```

### 3. Tokens de Espaciado

```
Escala (base 8px - "8pt grid"):
  - xs:    0.25rem (4px)
  - sm:    0.5rem (8px)
  - md:    1rem (16px)
  - lg:    1.5rem (24px)
  - xl:    2rem (32px)
  - 2xl:   3rem (48px)
  - 3xl:   4rem (64px)

Padding Componentes:
  - Button:       px-4 py-2 (16px 8px)
  - Card:         p-6 (24px)
  - Input:        px-3 py-2 (12px 8px)
  - Modal:        p-6 (24px)
```

### 4. Border Radius

```
Componentes:
  - Button:         8px (rounded-lg)
  - Card:           8px (rounded-lg)
  - Input:          8px (rounded-lg)
  - Dialog:         12px (rounded-lg)
  - Pill/Badge:     full (rounded-full)

Variables en Tailwind:
  - lg:  var(--radius) = 0.5rem = 8px
  - md:  var(--radius) - 2px = 6px
  - sm:  var(--radius) - 4px = 4px
```

### 5. Sombras (Glassmorphism Apple)

```
Levels:
  - xs:  0 1px 2px 0 rgba(0, 0, 0, 0.04)
  - sm:  0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.04)
  - md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)
  - lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)

Glass (Blur):
  - backdrop-blur-md (12px)
  - background: rgba(255, 255, 255, 0.85) + backdrop-filter: blur(20px)
  - border: 1px solid rgba(0, 0, 0, 0.06)
```

### 6. Animaciones

```
Transiciones:
  - Standard:    cubic-bezier(0.25, 0.46, 0.45, 0.94) - 300ms (easeInOutQuad)
  - Quick:       cubic-bezier(0.4, 0, 0.2, 1) - 150ms (easeOutQuad)
  - Enter:       cubic-bezier(0.25, 0.46, 0.45, 0.94) - 200ms (easeInOutQuad)

Estados:
  - Hover:       +5% brightness, shadow-sm, scale-102
  - Active:      scale-95 (press effect)
  - Focus:       ring-2 ring-primary ring-offset-2
  - Disabled:    opacity-50, cursor-not-allowed

Keyframes:
  - fade-in:     opacity 0→1 (300ms)
  - slide-up:    translateY 8px→0, opacity 0→1 (300ms)
  - scale-in:    scale 0.98→1, opacity 0→1 (200ms)
  - spin:        rotate 0→360deg (continuous)
  - pulse:       opacity 1→0.5→1 (continuous)
```

---

## 🎯 Especificación de Componentes

Componentes prioritarios a rediseñar (en orden):

### TIER 1: Base Critical (afecta todo)
1. **Button** - Estilos default, destructive, outline, ghost
2. **Card** - Contenedor base
3. **Input / Textarea** - Campos de formulario

### TIER 2: Navigation & Interaction
4. **Sidebar** - Navegación principal (animada)
5. **Header** - Barra superior
6. **Dialog / Alert-Dialog** - Modales
7. **Dropdown-Menu** - Menús desplegables
8. **Tabs** - Navegación por pestañas

### TIER 3: Enhanced Components
9. **Select / Combobox** - Selecciones
10. **Checkbox / Switch** - Toggle controls
11. **Badge** - Labels/tags
12. **Table / Data-Table** - Tablas de datos

### TIER 4: Admin-Specific
13. **Product Form** - Formulario de productos (con variantes, imágenes)
14. **Order Panel** - Lista de órdenes
15. **User-Nav** - Menu de usuario

---

### Detalle: Button

**Estado Actual:**
```typescript
// Variantes: default, destructive, outline, secondary, ghost, link
// Tamaño: default (h-10), sm (h-9), lg (h-11), icon (h-10 w-10)
```

**Rediseño Apple:**
```
Estilos:
  - default:    bg-blue-600 text-white, hover:bg-blue-700 shadow-sm active:scale-95
  - destructive: bg-red-600 text-white, hover:bg-red-700 shadow-sm active:scale-95
  - outline:    border border-gray-300 bg-white text-black hover:bg-gray-50 active:scale-95
  - ghost:      transparent text-black hover:bg-gray-100 active:scale-95
  - link:       text-blue-600 underline hover:underline active:scale-95

Transición:      transition-smooth (300ms easeInOutQuad)
Focus ring:      ring-2 ring-blue-500 ring-offset-2
Border radius:   rounded-lg (8px)
Padding:         px-4 py-2 (respeta 8pt grid)
```

**Animación Framer Motion (opcional):**
```typescript
whileHover={{ scale: 1.02, shadow: '0 4px 12px rgba(0,0,0,0.15)' }}
whileTap={{ scale: 0.95 }}
transition={{ type: 'spring', stiffness: 300, damping: 20 }}
```

---

### Detalle: Card

**Estado Actual:**
```typescript
// Fondo blanco/gris, border, sombra mínima
```

**Rediseño Apple:**
```
Estilos:
  - bg-white border border-gray-200 rounded-lg shadow-sm
  - hover: shadow-md (subtle elevation)
  - padding: p-6 (24px - respeta spacing scale)
  - text-foreground

Dark mode:
  - bg-gray-900 border border-gray-800 shadow-sm
```

**Transición:**
```
transition-all 300ms easeInOutQuad
```

---

### Detalle: Sidebar

**Rediseño Apple:**
```
Estilos:
  - width: w-64 (256px, fixed)
  - bg-gray-50 (light gray, subtle)
  - border-r border-gray-200
  - glassmorphism: backdrop-blur-md (si scrollea)

Items de menú:
  - text-gray-600 px-3 py-2 rounded-lg
  - hover: bg-gray-100 text-black
  - active: bg-blue-50 text-blue-600
  - transition-smooth

Icons:
  - h-4 w-4 opacity-60 (subtle)
  - hover: opacity-100
```

**Animación:**
```
- Hover item:    background slide-in smooth, icon brighten
- Initial load:  slide-in from left (150ms stagger per item)
- Navigation:    fade-out page, fade-in new page (300ms)
```

---

### Detalle: Dialog

**Rediseño Apple:**
```
Estilos:
  - max-w-lg w-full rounded-lg
  - bg-white border border-gray-200 shadow-lg
  - backdrop: bg-black/80 (fondo oscuro)
  - padding: p-6 (24px)

Close button:
  - absolute top-4 right-4
  - opacity-60 hover:opacity-100
  - rounded-lg

Animación:
  - backdrop: fade-in (150ms)
  - content: scale-in (200ms cubic-bezier(0.25, 0.46, 0.45, 0.94))
  - Close: smooth fade-out y scale-down
```

---

## 💾 Integración Técnica

### Paso 1: Crear Sistema de Tema en `packages/shared`

**Crear estructura:**
```
packages/shared/src/
├── theme/
│   ├── colors.ts          # Paleta de colores
│   ├── typography.ts       # Escala tipográfica
│   ├── spacing.ts          # Escala de espaciado
│   ├── shadows.ts          # Sombras
│   ├── animations.ts       # Keyframes y curvas
│   ├── index.ts            # Exports principales
│   └── theme.config.ts     # Objeto completo de tema
├── constants/
├── types/
└── utils/
```

**Ejemplo `colors.ts`:**
```typescript
export const colors = {
  light: {
    background: '#FFFFFF',
    foreground: '#000000',
    primary: '#007AFF',
    muted: '#F0F0F0',
    border: '#E0E0E0',
    // ... más colores
  },
  dark: {
    background: '#121212',
    foreground: '#FFFFFF',
    primary: '#007AFF',
    muted: '#333333',
    border: '#2D2D2D',
    // ... más colores
  },
};
```

**Ejemplo `spacing.ts`:**
```typescript
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
} as const;
```

**Ejemplo `index.ts` (export):**
```typescript
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './animations';
export { themeConfig } from './theme.config';
```

### Paso 2: Integrar en Admin

**En `apps/admin/tailwind.config.ts`:**
```typescript
import { spacing, colors } from '@mantua/shared/theme';

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Ya mappea CSS variables, pero ahora con tokens compartidos
      },
      spacing,
      // ... más
    },
  },
};
```

**En `apps/admin/src/app/globals.css`:**
```css
/* Ya está bien definido con CSS variables */
:root {
  --background: 0 0% 100%;
  /* ... */
}
```

### Paso 3: Usar en Componentes

**Ejemplo Button rediseñado:**
```typescript
// apps/admin/src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-smooth disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95",
        outline: "border border-input hover:bg-muted active:scale-95",
        ghost: "hover:bg-muted active:scale-95",
      },
    },
  }
);
```

### Paso 4: Testing Localmente

```bash
# Levantar admin con cambios de tema
cd Mantua
pnpm dev

# Abrir en navegador: http://localhost:3000
# Validar:
# - Colores coinciden con propuesta
# - Espaciado respeta grid (8pt)
# - Animaciones suaves (dev tools → Slow 3x)
# - Modo oscuro funciona (toggle en top-right)
# - Responsive (mobile, tablet, desktop)
```

---

## 📚 Documentación y Mantenimiento

### Guía para Developers: "THEME_GUIDE.md"

**Contenido:**
1. Cómo agregar nuevos colores
2. Cómo agregar nuevas variantes de botones
3. Cómo importar y usar tokens
4. Paleta visual (screenshots)
5. Patrones comunes (ejemplo: formularios, cards)
6. Accesibilidad (contrast ratios, focus states)
7. Testing visual

### Mejoras Futuras

1. **Modo Oscuro Avanzado**
   - Detectar `prefers-color-scheme: dark`
   - Persistir preferencia en localStorage

2. **Variantes de Diseño**
   - Tema compacto (spacing reducido)
   - Tema amplío (spacing aumentado)
   - Alto contraste (accesibilidad)

3. **Animaciones Mejoradas**
   - Reducir motion si `prefers-reduced-motion: reduce`
   - Agregar más transiciones sofisticadas
   - Stagger animations en listas

4. **Integración Storefront**
   - Exportar mismo theme a `apps/storefront`
   - Crear paquete `@mantua/ui-kit` con componentes reutilizables

5. **Storybook**
   - Documentar cada componente
   - Showcases visuales
   - Interactivo

6. **Accessibility (a11y)**
   - WCAG 2.1 AA compliance
   - Contrast testing automatizado
   - Screen reader testing

---

## 📝 Resumen Ejecutivo

### ¿Qué se logra?

✅ Panel admin con diseño Apple: minimalista, limpio, accesible  
✅ Componentes reutilizables con variantes  
✅ Sistema de tema centralizado en `packages/shared`  
✅ Animaciones suaves y microinteracciones  
✅ Modo oscuro funcional  
✅ Documentación para developers  
✅ Base sólida para expandir a storefront  

### Timeline: 4-5 semanas (1 developer senior)

- Fase 1: 3-4 días (tema)
- Fase 2: 5-6 días (componentes)
- Fase 3: 3-4 días (animaciones)
- Fase 4: 4-5 días (integración)
- Fase 5: 2-3 días (docs)

### Tech Stack

- **Tailwind CSS v4** (CSS variables)
- **CVA** (variantes semánticas)
- **Shadcn/Radix UI** (accesible)
- **Framer Motion** (animaciones avanzadas - opcional)
- **TypeScript** (type-safe)
- **Next.js 15** (SSR/SSG)

---

**Próximos Pasos:**
1. Validar propuesta con equipo
2. Comenzar Fase 1 (tema base)
3. Iterar y refinar en Fase 2 (componentes)
4. QA visual en cada fase
5. Documentar aprendizajes

