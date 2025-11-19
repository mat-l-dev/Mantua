# 🛠️ GUÍA DE DESARROLLO - MANTUA

**Propósito**: Manual para desarrolladores que trabajan en el proyecto  
**Última actualización**: Noviembre 2025

---

## 🚀 Setup Inicial

### 1. Prerequisitos

```bash
# Verificar versiones
node --version  # >= 18.x
pnpm --version  # >= 8.x
git --version
```

### 2. Clonar e Instalar

```bash
git clone https://github.com/mat-l-dev/Mantua.git
cd Mantua/mantua
pnpm install
```

### 3. Configurar Variables de Entorno

#### Admin (`apps/admin/.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Storefront (`apps/storefront/.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Opcional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 4. Configurar Base de Datos

```bash
# 1. Ve a https://supabase.com/dashboard
# 2. Crea un proyecto nuevo
# 3. Ve a SQL Editor
# 4. Ejecuta en orden:
#    - migration/SQL OFICIAL.sql
#    - migration/RLS_POLICIES.sql
#    - migration/FIXES_SECURITY.sql
```

### 5. Generar Tipos de Supabase

```bash
# Instalar CLI de Supabase (una vez)
npm install -g supabase

# Generar tipos
npx supabase gen types typescript \
  --project-id tu-project-id \
  > packages/shared/src/types/database.types.ts
```

### 6. Iniciar Desarrollo

```bash
# Todos los proyectos
pnpm dev

# Solo admin
pnpm dev --filter=admin

# Solo storefront
pnpm dev --filter=storefront
```

**URLs:**
- Admin: http://localhost:3000
- Storefront: http://localhost:3001

---

## 📁 Estructura de Archivos

### Convenciones de Nombres

```
apps/admin/src/
├── app/
│   ├── (auth)/              # Rutas públicas (login)
│   ├── (dashboard)/         # Rutas protegidas
│   │   ├── products/
│   │   │   ├── page.tsx           # Lista (Server Component)
│   │   │   ├── new/
│   │   │   │   └── page.tsx       # Crear (Server Component)
│   │   │   └── [productId]/
│   │   │       └── page.tsx       # Editar
│   └── globals.css
│
├── actions/                 # Server Actions
│   ├── products.ts          # createProduct, updateProduct, etc.
│   └── auth/
│       ├── login.ts
│       └── logout.ts
│
├── components/
│   ├── products/            # Componentes específicos
│   │   ├── client.tsx       # "use client" wrapper
│   │   ├── columns.tsx      # TanStack Table columns
│   │   ├── data-table.tsx   # Tabla reutilizable
│   │   └── product-form.tsx # Formulario con RHF
│   │
│   └── ui/                  # Shadcn components
│       ├── button.tsx
│       ├── input.tsx
│       └── form.tsx
│
└── lib/
    ├── supabase/
    │   ├── client.ts        # Cliente para Client Components
    │   ├── server.ts        # Cliente para Server Components
    │   └── server-action.ts # Cliente para Server Actions
    │
    ├── validations/
    │   ├── product.ts       # Zod schemas
    │   └── order.ts
    │
    └── utils.ts             # cn(), etc.
```

---

## 🎨 Estilo y Diseño

### Tailwind CSS v4

#### Colores (Apple Style)

```css
/* globals.css */
@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(240 10% 3.9%);
  --color-primary: hsl(240 5.9% 10%);
  --color-secondary: hsl(240 4.8% 95.9%);
  --color-muted: hsl(240 4.8% 95.9%);
  --color-accent: hsl(240 4.8% 95.9%);
  --color-destructive: hsl(0 84.2% 60.2%);
  --color-border: hsl(240 5.9% 90%);
}
```

#### Componentes

```tsx
// Botón primario
<Button>Crear Producto</Button>

// Botón secundario
<Button variant="outline">Cancelar</Button>

// Botón destructivo
<Button variant="destructive">Eliminar</Button>

// Badge
<Badge variant="secondary">10 pts</Badge>
<Badge variant="destructive">Inactivo</Badge>

// Input con Form
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Nombre</FormLabel>
      <FormControl>
        <Input placeholder="Producto..." {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### Animaciones Apple

```tsx
// Fade in
<div className="animate-apple-fade-in">...</div>

// Slide up
<div className="animate-apple-slide-up">...</div>

// Transition suave
<button className="transition-all duration-300 ease-apple hover:scale-105">
  Hover me
</button>
```

---

## 🔧 Patrones de Desarrollo

### 1. Server Actions (Mutaciones)

```typescript
// apps/admin/src/actions/products.ts
'use server'

import { createClient } from '@/lib/supabase/server';
import { productSchema, ProductFormValues } from '@/lib/validations/product';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(data: ProductFormValues) {
  // 1. Crear cliente de Supabase
  const supabase = await createClient();
  
  // 2. Validar datos (opcional, ya validado en cliente)
  const validated = productSchema.parse(data);
  
  // 3. Insertar en BD
  const { error } = await supabase
    .from('products')
    .insert([{
      ...validated,
      slug: generateSlug(validated.name)
    } as never]);
  
  if (error) {
    console.error('Error:', error);
    return { error: error.message };
  }
  
  // 4. Revalidar cache de Next.js
  revalidatePath('/products');
  
  // 5. Redirigir (opcional)
  redirect('/products');
}

// Función helper
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '') + 
    '-' + Math.floor(Math.random() * 1000);
}
```

### 2. Server Components (Lectura)

```typescript
// apps/admin/src/app/(dashboard)/products/page.tsx
import { createClient } from '@/lib/supabase/server';
import { ProductClient } from '@/components/products/client';
import { format } from 'date-fns';

export default async function ProductsPage() {
  const supabase = await createClient();
  
  // Consulta directa (Server-side, sin fetch)
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Formatear datos para UI
  const formattedProducts = (products || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    selling_price: Number(item.selling_price),
    puntos_acarreo: item.puntos_acarreo,
    is_active: item.is_active,
    created_at: format(new Date(item.created_at), 'dd/MM/yyyy'),
  }));
  
  // Pasar a Client Component
  return (
    <div className="p-8">
      <ProductClient data={formattedProducts} />
    </div>
  );
}
```

### 3. Client Components (Interactividad)

```typescript
// apps/admin/src/components/products/client.tsx
"use client"

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Plus } from 'lucide-react';

interface ProductClientProps {
  data: ProductColumn[];
}

export function ProductClient({ data }: ProductClientProps) {
  const router = useRouter();
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Productos ({data.length})</h2>
          <p className="text-muted-foreground">
            Gestiona el catálogo y los puntos de acarreo
          </p>
        </div>
        <Button onClick={() => router.push('/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>
      
      <DataTable columns={columns} data={data} />
    </>
  );
}
```

### 4. Formularios con React Hook Form + Zod

```typescript
// apps/admin/src/components/products/product-form.tsx
"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormValues } from '@/lib/validations/product';
import { createProduct } from '@/actions/products';

export function ProductForm() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      selling_price: 0,
      puntos_acarreo: 0,
      is_active: true,
      published: true
    }
  });
  
  async function onSubmit(data: ProductFormValues) {
    const result = await createProduct(data);
    
    if (result?.error) {
      alert(`Error: ${result.error}`);
    }
    // Si no hay error, redirect automático en la action
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input placeholder="Starlink Standard Kit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* ... más campos ... */}
        
        <Button type="submit">Crear Producto</Button>
      </form>
    </Form>
  );
}
```

### 5. Validación con Zod

```typescript
// apps/admin/src/lib/validations/product.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  sku: z.string().min(1, 'El SKU es obligatorio'),
  description: z.string().optional(),
  cost_price: z.coerce.number().min(0),
  selling_price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  puntos_acarreo: z.coerce.number()
    .int()
    .min(0, 'Mínimo 0 puntos')
    .max(100, 'Máximo 100 puntos'),
  is_active: z.boolean().default(true),
  published: z.boolean().default(true)
});

export type ProductFormValues = z.infer<typeof productSchema>;
```

---

## 🧪 Testing (Futuro)

```bash
# Unit tests (Vitest)
pnpm test

# E2E tests (Playwright)
pnpm test:e2e

# Coverage
pnpm test:coverage
```

---

## 🔍 Debugging

### Supabase Logs

```typescript
// Habilitar logs detallados
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('id', productId);

if (error) {
  console.error('Supabase Error:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
}
```

### Next.js Debug

```bash
# Mostrar info de build
pnpm build --debug

# Analizar bundle
pnpm build && pnpm analyze
```

### React DevTools

```bash
# Instalar extensión de Chrome
# https://chrome.google.com/webstore/detail/react-developer-tools
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@mantua/shared'"

**Causa**: Workspace no sincronizado

```bash
pnpm install --force
```

### Error: TypeScript en database.types.ts

**Causa**: Tipos desactualizados

```bash
npx supabase gen types typescript \
  --project-id <tu-id> \
  > packages/shared/src/types/database.types.ts
```

### Error: "Failed to fetch" en Supabase

**Causa**: Variables de entorno incorrectas

```bash
# Verificar
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Reiniciar servidor
pnpm dev
```

### Error: RLS Policy en Supabase

**Síntoma**: Query funciona en SQL Editor pero falla en app

**Solución**: Verificar políticas RLS

```sql
-- Ver políticas activas
SELECT * FROM pg_policies WHERE tablename = 'products';

-- Desactivar RLS temporalmente (SOLO DESARROLLO)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

### Build falla en Turborepo

```bash
# Limpiar todo
pnpm turbo clean
rm -rf node_modules .turbo .next
pnpm install
pnpm build
```

### Problemas con Tailwind CSS

```bash
# Reconstruir cache
rm -rf .next
pnpm dev
```

---

## 📦 Deployment

### Vercel (Recomendado)

```bash
# 1. Conectar repo a Vercel
# 2. Configurar variables de entorno
# 3. Deploy automático en cada push a main

# Root Directory: apps/admin  (o apps/storefront)
# Build Command: cd ../.. && pnpm turbo build --filter=admin
# Output Directory: .next
```

### Variables de Entorno en Vercel

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
```

---

## 🎯 Checklist antes de Commit

- [ ] `pnpm lint` pasa sin errores
- [ ] `pnpm build` compila exitosamente
- [ ] No hay `console.log()` olvidados
- [ ] Tipos de TypeScript correctos (no usar `any`)
- [ ] Componentes tienen nombres descriptivos
- [ ] Server Actions tienen `'use server'`
- [ ] Client Components tienen `"use client"`
- [ ] Variables de entorno documentadas si se agregan nuevas

---

## 📖 Recursos

### Documentación Oficial

- **Next.js 15**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn/UI**: https://ui.shadcn.com
- **TanStack Table**: https://tanstack.com/table
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev

### Comunidad

- Discord de Next.js
- Subreddit r/nextjs
- GitHub Discussions de Supabase

---

## 🔐 Seguridad

### Checklist de Seguridad

- [ ] RLS habilitado en todas las tablas públicas
- [ ] Service Role Key NUNCA en código cliente
- [ ] Validación Zod en Server Actions
- [ ] Rate limiting en endpoints críticos (futuro)
- [ ] CORS configurado correctamente
- [ ] Sanitización de inputs SQL (Supabase lo hace)

### Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, **NO** abras un issue público. Contacta directamente al equipo.

---

**Última actualización:** Noviembre 2025  
**Mantenido por:** Equipo Mantua
