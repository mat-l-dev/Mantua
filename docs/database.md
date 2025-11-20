# 🗄️ Guía de Base de Datos

## 📍 Ubicación de Scripts SQL

Todos los scripts SQL están en la carpeta `migration/` del repositorio:

```
migration/
├── SQL OFICIAL.sql         # Schema completo (ejecutar primero)
├── RLS_POLICIES.sql        # Políticas de seguridad
├── FIXES_SECURITY.sql      # Parches de seguridad
├── FIX_LOGIN_TRIGGER_EMAIL.sql # Fix error login (Database error granting user)
└── README.md               # Documentación detallada
```

## 🚀 Setup Inicial

### 1. Crear Proyecto en Supabase

```bash
# Ir a https://supabase.com/dashboard
# Crear un nuevo proyecto
# Esperar ~2 minutos para que se aprovisione
```

### 2. Ejecutar Migraciones

**Opción A: Dashboard de Supabase (Recomendado)**

1. Ve a SQL Editor en tu proyecto
2. Copia y pega el contenido de `SQL OFICIAL.sql`
3. Haz clic en "Run"
4. Repite con `RLS_POLICIES.sql`
5. Repite con `FIXES_SECURITY.sql`
6. Repite con `FIX_LOGIN_TRIGGER_EMAIL.sql` (Si tienes error de login)
7. Usa `PROMOTE_TO_STAFF_BY_EMAIL.sql` para dar acceso a tu usuario.
8. Ejecuta `FIX_STAFF_RLS.sql` si tienes problemas de "Acceso denegado" (Fix recursividad RLS).
9. Ejecuta `FIX_LINTER_WARNINGS.sql` para mejorar la seguridad de las funciones.

**Opción B: CLI de Supabase**

```bash
# Instalar CLI
npm install -g supabase

# Autenticar
supabase login

# Ejecutar scripts
supabase db push --file migration/SQL\ OFICIAL.sql
supabase db push --file migration/RLS_POLICIES.sql
supabase db push --file migration/FIXES_SECURITY.sql
```

### 3. Verificar Instalación

```sql
-- En SQL Editor de Supabase
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';
-- Debería retornar ~30 tablas

SELECT COUNT(*) FROM pg_trigger;
-- Debería retornar varios triggers
```

## 📊 Tablas Principales

| Tabla | Propósito | Campos Críticos |
|-------|-----------|-----------------|
| `products` | Catálogo base | `puntos_acarreo`, `shipping_policy` |
| `product_variants` | Variantes (tallas, colores) | `attributes` (JSONB) |
| `product_stock` | Inventario | `quantity`, `reserved_quantity` |
| `orders` | Órdenes de compra | `status`, `shipping_cost`, `shipping_scope` |
| `order_items` | Items de la orden | `puntos_acarreo` (copiado) |
| `payment_proofs` | Comprobantes | `proof_image_path`, `status` |
| `tiers_acarreo` | Costos de envío | `puntos_minimos`, `puntos_maximos`, `costo` |
| `customers` | Clientes | Sincronizado con `auth.users` |
| `staff` | Administradores | `role_id`, `permissions` |

## 🔄 Regenerar Tipos de TypeScript

Después de cambios en el schema:

```bash
npx supabase gen types typescript \
  --project-id <tu-project-id> \
  > packages/shared/src/types/database.types.ts
```

## 🔐 Variables de Entorno

Necesitas estas credenciales de Supabase:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Dónde encontrarlas:**
1. Ve a Settings → API en tu proyecto de Supabase
2. Copia "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
3. Copia "anon public" → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copia "service_role" → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ **SECRETO**)

## 🧪 Datos de Prueba

Para testing local:

```sql
-- Insertar categorías de ejemplo
INSERT INTO categories (name, published, is_active) VALUES
  ('Conectividad', true, true),
  ('Energía Solar', true, true),
  ('Baterías', true, true);

-- Insertar tiers de ejemplo
INSERT INTO tiers_acarreo (nombre_tier, tier_scope, tier_mode, puntos_minimos, puntos_maximos, costo) VALUES
  ('Liviano', 'lima_callao', 'acarreo', 0, 10, 15.00),
  ('Medio', 'lima_callao', 'acarreo', 11, 50, 35.00),
  ('Pesado', 'lima_callao', 'acarreo', 51, 100, 60.00),
  ('Liviano', 'provincia', 'acarreo', 0, 10, 25.00),
  ('Medio', 'provincia', 'acarreo', 11, 50, 50.00),
  ('Pesado', 'provincia', 'acarreo', 51, 100, 90.00);

-- Insertar ubicación de stock
INSERT INTO stock_locations (name, address, is_active) VALUES
  ('Almacén Principal Lima', 'Av. Industrial 123, Lima', true);

-- Insertar métodos de pago
INSERT INTO payment_methods (name, is_active, instructions) VALUES
  ('Yape', true, 'Yapear al 999 888 777 - Nombre: Mantua SAC'),
  ('Plin', true, 'Plin al 999 888 777'),
  ('Transferencia BCP', true, 'Cuenta: 1234567890 - CCI: 00212345678901234567');
```

## 🐛 Troubleshooting

### Error: "relation does not exist"

**Causa**: Tabla no creada

```sql
-- Verificar si existe
SELECT * FROM information_schema.tables 
WHERE table_name = 'products';

-- Si no existe, ejecutar SQL OFICIAL.sql de nuevo
```

### Error: "permission denied"

**Causa**: RLS bloqueando queries

```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'products';

-- Desactivar RLS temporalmente (SOLO DESARROLLO)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

### Error: "function does not exist"

**Causa**: Triggers no creados

```sql
-- Verificar triggers
SELECT tgname FROM pg_trigger WHERE tgname LIKE '%recalcular%';

-- Si no existen, ejecutar la sección de triggers del SQL
```

## 📚 Documentación Adicional

Para arquitectura completa de base de datos, ver:
- **[ARQUITECTURA.md](./ARQUITECTURA.md)** - Diagramas y relaciones
- **[migration/README.md](../migration/README.md)** - Guía detallada de migraciones

---

**Última actualización:** Noviembre 2025
