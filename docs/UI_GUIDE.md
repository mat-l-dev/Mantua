# 🎨 Mantua UI Guide - Apple Design System

**Versión:** 2.0 (Refactorizado)
**Fecha:** 20 de Noviembre, 2025

Este documento describe el sistema de diseño implementado en `apps/admin`, basado en los principios de Apple Human Interface Guidelines.

---

## 1. Filosofía de Diseño

El objetivo es crear una interfaz que se sienta **nativa**, **profesional** y **limpia**.

- **Tipografía**: Usamos la fuente del sistema (`-apple-system`, `BlinkMacSystemFont`, etc.) para máxima legibilidad y familiaridad.
- **Color**: Paleta neutra (blancos, grises sutiles) con un color de acento principal (Apple Blue `#007AFF`).
- **Espaciado**: Generoso, basado en múltiplos de 4px.
- **Radio de Borde**: `0.75rem` (12px) para tarjetas y botones, creando una apariencia moderna y amigable.
- **Sombras**: Muy sutiles (`shadow-sm`), solo elevando elementos cuando es necesario.

---

## 2. Variables CSS (Theming)

El tema se controla completamente desde `apps/admin/src/app/globals.css` usando variables CSS en formato HSL. Esto permite un modo oscuro perfecto y fácil mantenimiento.

### Colores Principales

| Variable | Color (Light) | Color (Dark) | Uso |
|----------|---------------|--------------|-----|
| `--background` | `#FAFAFA` | `#000000` | Fondo de la aplicación |
| `--card` | `#FFFFFF` | `#1C1C1E` | Fondo de tarjetas y contenedores |
| `--primary` | `#007AFF` | `#007AFF` | Botones principales, enlaces, estados activos |
| `--secondary` | `#F5F5F7` | `#2C2C2E` | Botones secundarios, fondos de items |
| `--destructive` | `#FF3B30` | `#FF453A` | Acciones destructivas (eliminar) |
| `--border` | `#E5E5EA` | `#38383A` | Bordes sutiles |

---

## 3. Componentes

Los componentes UI (`apps/admin/src/components/ui`) han sido refactorizados para usar estas variables en lugar de valores hardcoded.

### Button
```tsx
<Button variant="default">Action</Button> // Azul
<Button variant="secondary">Cancel</Button> // Gris claro
<Button variant="destructive">Delete</Button> // Rojo
<Button variant="outline">Edit</Button> // Borde gris
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido...
  </CardContent>
</Card>
```

### Input
```tsx
<Input placeholder="Escribe aquí..." />
```
El input tiene un anillo de foco azul (`ring-primary`) y un borde sutil.

---

## 4. Cómo mantener el estilo

1. **No uses Hex Codes**: Evita `bg-[#F5F5F5]`. Usa `bg-secondary` o `bg-muted`.
2. **Usa las clases de utilidad**: `text-muted-foreground` en lugar de `text-gray-500`.
3. **Respeta el radio**: Usa `rounded-lg` (que mapea a `var(--radius)`) para contenedores grandes.

---

## 5. Modo Oscuro

El sistema soporta modo oscuro nativamente. Solo asegúrate de usar las variables semánticas (`bg-background`, `text-foreground`) y el sistema cambiará automáticamente los valores HSL.
