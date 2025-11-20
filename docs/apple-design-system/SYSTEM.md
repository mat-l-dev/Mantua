# 🎨 Apple Design System - Especificación

**Versión:** 1.0  
**Fecha:** 20 de Noviembre, 2025  
**Propósito:** Especificación completa de paleta, tipografía, tokens y componentes

---

## 📋 Tabla de Contenidos

1. [Paleta de Colores](#paleta-de-colores)
2. [Tipografía](#tipografía)
3. [Tokens de Espaciado](#tokens-de-espaciado)
4. [Sombras](#sombras)
5. [Animaciones](#animaciones)
6. [Componentes Prioritarios](#componentes-prioritarios)

---

## 🎨 Paleta de Colores

### Light Mode (por defecto)
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

### Dark Mode
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

---

## ✍️ Tipografía

### Font Family
```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
(Sistema nativo de cada OS)
```

### Escala Modular
```
- Body:    1rem (16px) - line-height: 1.5
- Small:   0.875rem (14px) - line-height: 1.43
- XSmall:  0.75rem (12px) - line-height: 1.33
- Large:   1.125rem (18px) - line-height: 1.56
- XL:      1.5rem (24px) - line-height: 1.33
- 2XL:     1.875rem (30px) - line-height: 1.2
- 3XL:     2.25rem (36px) - line-height: 1.11
```

### Font Weights
```
- Regular:    400
- Medium:     500
- Semibold:   600
- Bold:       700
```

### Letter Spacing
```
-0.01em (sutilmente negativo, como Apple)
```

---

## 📏 Tokens de Espaciado

### Escala 8pt Grid
```
- xs:    0.25rem (4px)
- sm:    0.5rem (8px)
- md:    1rem (16px)
- lg:    1.5rem (24px)
- xl:    2rem (32px)
- 2xl:   3rem (48px)
- 3xl:   4rem (64px)
```

### Padding Componentes
```
- Button:    px-4 py-2 (16px 8px)
- Card:      p-6 (24px)
- Input:     px-3 py-2 (12px 8px)
- Modal:     p-6 (24px)
```

### Border Radius
```
- Button/Card/Input:  8px (rounded-lg)
- Dialog:             12px (rounded-lg)
- Pill/Badge:         full (rounded-full)
```

---

## 🌫️ Sombras (Glassmorphism)

### Elevation Levels
```
- xs:  0 1px 2px 0 rgba(0, 0, 0, 0.04)
- sm:  0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.04)
- md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)
- lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)
```

### Glass Effect
```
backdrop-blur-md (12px)
background: rgba(255, 255, 255, 0.85)
border: 1px solid rgba(0, 0, 0, 0.06)
```

---

## 🎬 Animaciones

### Curvas de Easing
```
- Standard:    cubic-bezier(0.25, 0.46, 0.45, 0.94) - 300ms
- Quick:       cubic-bezier(0.4, 0, 0.2, 1) - 150ms
- Enter:       cubic-bezier(0.25, 0.46, 0.45, 0.94) - 200ms
```

### Estados Interactivos
```
- Hover:      +5% brightness, shadow-sm, scale-102
- Active:     scale-95 (press effect)
- Focus:      ring-2 ring-primary ring-offset-2
- Disabled:   opacity-50, cursor-not-allowed
```

### Keyframes
```
- fade-in:    opacity 0→1 (300ms)
- slide-up:   translateY 8px→0, opacity 0→1 (300ms)
- scale-in:   scale 0.98→1, opacity 0→1 (200ms)
- spin:       rotate 0→360deg (continuous)
- pulse:      opacity 1→0.5→1 (continuous)
- ripple:     Custom ripple effect on click
- bounce:     Y-axis bounce animation
```

---

## 🎯 Componentes Prioritarios

### Tier 1: Base Critical
1. **Button** - default, destructive, outline, ghost, link
2. **Card** - contenedor base con glasmorphism
3. **Input** - campos de formulario

### Tier 2: Navigation & Interaction
4. **Sidebar** - navegación principal con stagger animations
5. **Header** - barra superior
6. **Dialog** - modales
7. **Dropdown** - menús desplegables

### Tier 3: Enhanced
8. **Select** - selecciones
9. **Checkbox/Switch** - toggle controls
10. **Badge** - labels/tags
11. **Table** - tablas de datos

### Tier 4: Admin-Specific
12. **Product Form** - con variantes e imágenes
13. **Order Panel** - lista de órdenes
14. **User Menu** - menu de usuario

---

## 📝 Notas de Implementación

- **CSS Variables**: Usar en `globals.css` (ya está)
- **Tailwind Integration**: Extender config con tokens
- **Dark Mode**: `.dark` class selector
- **Accesibilidad**: WCAG 2.1 AA compliance
- **Performance**: CSS animations (GPU-accelerated)
- **Type Safety**: TypeScript en todos los tokens

---

**Ver también:**
- `IMPLEMENTATION.md` - Qué fue implementado
- `PHASE4.md` - Próximos pasos
