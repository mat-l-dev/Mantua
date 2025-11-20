# 🎯 Rediseño de Componentes - Ejemplos Detallados

> Este documento contiene ejemplos de código TypeScript/React para cada componente rediseñado en estilo Apple.

---

## 📦 Componentes Base (TIER 1)

### 1. Button.tsx (Rediseñado)

**Antes:**
```typescript
// Versión genérica con algunos estilos
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        // ...
      },
    },
  }
);
```

**Después (Apple Style):**
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles - Tailwind + nuestros tokens
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-smooth disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // ✨ Apple Default: Azul sólido, sombra suave, hover suave, active scale
        default: 
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-sm",
        
        // ✨ Destructive (rojo): Similar a default pero rojo
        destructive: 
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95 shadow-sm",
        
        // ✨ Outline: Borde sutil, hover cambia fondo
        outline: 
          "border border-input bg-background hover:bg-muted active:scale-95",
        
        // ✨ Secondary: Negro sólido (para acciones principales alternativas)
        secondary: 
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 shadow-sm",
        
        // ✨ Ghost: Transparente, hover sutil
        ghost: 
          "hover:bg-muted active:scale-95",
        
        // ✨ Link: Solo texto azul, sin decoración
        link: 
          "text-primary underline-offset-4 hover:underline",
      },
      
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**Con Framer Motion (opcional - para animaciones avanzadas):**
```typescript
import { motion } from 'framer-motion'

export const ButtonWithMotion = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      />
    )
  }
)
```

**Uso:**
```typescript
// Default
<Button>Click me</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Outline
<Button variant="outline">Cancel</Button>

// Ghost
<Button variant="ghost">More options</Button>

// Disabled
<Button disabled>Disabled</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

---

### 2. Card.tsx (Rediseñado)

**Antes:**
```typescript
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
```

**Después (Apple Style):**
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base: border sutil, shadow mínima, transición suave
      "rounded-lg border border-input bg-card text-card-foreground shadow-sm transition-smooth hover:shadow-md",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**Uso:**
```typescript
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido aquí
  </CardContent>
  <CardFooter>
    <Button>Acción</Button>
  </CardFooter>
</Card>
```

---

### 3. Input.tsx (Rediseñado)

**Antes:**
```typescript
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
```

**Después (Apple Style):**
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        // Base: Alto 40px, border sutil, bg muy claro, transición suave
        "flex h-10 w-full rounded-lg border border-input bg-input px-3 py-2 text-sm transition-smooth",
        // Placeholder: Texto gris suave
        "placeholder:text-muted-foreground",
        // Focus: Anillo azul, sin outline defecto
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Disabled: Opaco, no-click
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
```

---

## 🧭 Componentes Navigation (TIER 2)

### 4. Sidebar.tsx (Rediseñado)

**Antes:**
```typescript
// Sidebar genérico sin muchas animaciones
export function Sidebar() {
  return (
    <div className="hidden border-r bg-zinc-50 dark:bg-zinc-900 lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      {/* items */}
    </div>
  )
}
```

**Después (Apple Style con Animaciones):**
```typescript
import Link from "next/link"
import { Package, ShoppingCart, Users, BarChart3, Truck, MapPin, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Órdenes", href: "/orders", icon: ShoppingCart },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Logística", href: "/settings/locations", icon: MapPin },
  { name: "Envíos", href: "/settings/shipping", icon: Truck },
  { name: "Staff", href: "/settings/staff", icon: Users },
  { name: "Auditoría", href: "/settings/audit", icon: ShieldAlert },
]

export function Sidebar() {
  return (
    // ✨ Apple Style: Fondo claro sutil, borde derecho fino, glassmorphism
    <div className="hidden border-r border-input bg-background/95 glass lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex h-full flex-col">
        {/* Header del Sidebar */}
        <div className="flex h-14 items-center border-b border-input px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg tracking-tight">Mantua Admin</span>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="grid gap-1 px-2">
            {routes.map((route, index) => (
              <li 
                key={route.href}
                // ✨ Stagger animation en carga
                style={{
                  animation: `slideInLeft 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                <Link
                  href={route.href}
                  className={cn(
                    // Base
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    // Transición suave
                    "transition-smooth",
                    // Hover: Fondo suave, texto más oscuro
                    "text-muted-foreground hover:bg-muted hover:text-foreground",
                    // Active (implementar con pathname check en cliente)
                    // "data-active:bg-blue-50 data-active:text-blue-600"
                  )}
                >
                  <route.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{route.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Keyframes para stagger */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
```

**Con Framer Motion (más limpio):**
```typescript
import { motion } from 'framer-motion'

export function Sidebar() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="hidden border-r border-input bg-background/95 glass lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-14 items-center border-b border-input px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg tracking-tight">Mantua Admin</span>
          </Link>
        </div>

        {/* Navigation con stagger */}
        <motion.nav 
          className="flex-1 overflow-y-auto py-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.ul className="grid gap-1 px-2">
            {routes.map((route) => (
              <motion.li key={route.href} variants={itemVariants}>
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    "transition-smooth",
                    "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <route.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{route.name}</span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.nav>
      </div>
    </div>
  )
}
```

---

### 5. Dialog.tsx (Rediseñado)

**Antes:**
```typescript
const DialogContent = React.forwardRef<...>(
  ({ className, children, ...props }, ref) => (
    <DialogPrimitive.Content
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg",
        className
      )}
      {...props}
      ref={ref}
    >
      {children}
    </DialogPrimitive.Content>
  )
)
```

**Después (Apple Style):**
```typescript
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Backdrop: Negro semitransparente con fade-in
      "fixed inset-0 z-50 bg-black/80",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // ✨ Apple Style: Redondeado, sombra elegante, border sutil, padding generoso
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
        "gap-4 border border-input bg-background p-6 shadow-md rounded-lg",
        // Animaciones: Fade + Scale
        "transition-smooth",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
      {/* Close button: Esquina superior derecha, sutil */}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg opacity-60 transition-smooth hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        <X className="h-4 w-4" />
        <span className="sr-only">Cerrar</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
```

**Uso:**
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>¿Confirmar acción?</DialogTitle>
      <DialogDescription>
        Esta acción no se puede deshacer.
      </DialogDescription>
    </DialogHeader>
    <div className="flex gap-4">
      <Button variant="outline">Cancelar</Button>
      <Button>Confirmar</Button>
    </div>
  </DialogContent>
</Dialog>
```

---

## 🎨 Estilos CSS Compartidos (globals.css)

Ya está en `apps/admin/src/app/globals.css`, pero aquí va un resumen de lo clave:

```css
@layer utilities {
  /* Transición standard Apple (300ms easeInOutQuad) */
  .transition-smooth {
    transition: all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* Transición rápida (150ms) */
  .transition-quick {
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Glassmorphism Apple */
  .glass {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .dark .glass {
    background: rgba(18, 18, 18, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  /* Sombras sutiles */
  .shadow-xs {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
  }

  .shadow-sm {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
  }

  /* Etc. */
}
```

---

## 📋 Checklist de Implementación

### Antes de comenzar
- [ ] Crear rama `feat/apple-design-system`
- [ ] Crear `packages/shared/src/theme/`
- [ ] Documentar propuesta en APPLE_DESIGN_SYSTEM.md ✅

### Fase 1: Tema Base
- [ ] `packages/shared/src/theme/colors.ts`
- [ ] `packages/shared/src/theme/typography.ts`
- [ ] `packages/shared/src/theme/spacing.ts`
- [ ] `packages/shared/src/theme/animations.ts`
- [ ] `packages/shared/src/theme/index.ts`

### Fase 2: Componentes Base
- [ ] Button.tsx rediseñado
- [ ] Card.tsx rediseñado
- [ ] Input.tsx rediseñado
- [ ] Textarea.tsx
- [ ] Select.tsx

### Fase 3: Animaciones
- [ ] Instalar Framer Motion (opcional)
- [ ] Agregar transiciones a buttons
- [ ] Agregar stagger a listas
- [ ] Agregar page transitions

### Fase 4: Integración Admin
- [ ] Sidebar.tsx rediseñado
- [ ] Header.tsx rediseñado
- [ ] Aplicar a todas las páginas
- [ ] Validar modo oscuro
- [ ] QA visual completo

### Fase 5: Documentación
- [ ] THEME_GUIDE.md
- [ ] Crear Storybook (opcional)
- [ ] Comments en componentes

---

**Próximos Pasos:** Iniciar Fase 1 con `packages/shared/theme/`

