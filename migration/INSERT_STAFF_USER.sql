-- ====================================================================
-- INSERTAR TU USUARIO COMO STAFF
-- ====================================================================
-- Este script agrega tu usuario a la tabla `staff` para que puedas acceder al admin
-- con el nuevo middleware que verifica si eres staff.

-- IMPORTANTE: Antes de ejecutar, reemplaza 'tu-uuid-aqui' con tu UUID real
-- Puedes encontrar tu UUID en:
-- 1. Ve a Supabase Dashboard → Authentication → Users
-- 2. Haz click en tu usuario
-- 3. Copia el "User UID" (será algo como: a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p)

-- ====================================================================
-- CREAR ROLES DE STAFF (opcional, pero recomendado)
-- ====================================================================

-- Si no tienes la tabla staff_roles, créala primero
CREATE TABLE IF NOT EXISTS public.staff_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL UNIQUE,        -- "SuperAdmin", "Moderator", etc
  description TEXT,
  permissions JSONB,                   -- {views: [products, orders], actions: [create, edit]}
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar rol SuperAdmin
INSERT INTO public.staff_roles (name, description, is_active)
VALUES (
  'SuperAdmin',
  'Acceso total a todas las secciones del admin',
  TRUE
)
ON CONFLICT (name) DO NOTHING;

-- Insertar rol Moderator
INSERT INTO public.staff_roles (name, description, is_active)
VALUES (
  'Moderator',
  'Puede gestionar productos y órdenes',
  TRUE
)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================
-- INSERTAR TÚ COMO STAFF
-- ====================================================================

-- Opción 1: Insertarme como SuperAdmin (REEMPLAZA CON TUS DATOS)
INSERT INTO public.staff (
  id,                              -- Tu UUID de auth.users
  first_name,                      -- Tu nombre
  last_name,                       -- Tu apellido
  phone,                           -- Tu teléfono (opcional)
  role_id,                         -- UUID del rol SuperAdmin
  is_active,                       -- TRUE = tienes acceso
  created_at,
  updated_at
)
SELECT
  'tu-uuid-aqui',                  -- ⚠️ REEMPLAZA CON TU UUID
  'Tu Nombre',                     -- ⚠️ REEMPLAZA CON TU NOMBRE
  'Tu Apellido',                   -- ⚠️ REEMPLAZA CON TU APELLIDO
  'tu-telefono',                   -- ⚠️ Tu teléfono (opcional)
  sr.id,                           -- Role ID de SuperAdmin
  TRUE,                            -- Activo
  NOW(),
  NOW()
FROM
  public.staff_roles sr
WHERE
  sr.name = 'SuperAdmin'           -- Obtiene el rol SuperAdmin
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role_id = EXCLUDED.role_id,
  updated_at = NOW();

-- ====================================================================
-- VERIFICAR QUE FUE INSERTADO CORRECTAMENTE
-- ====================================================================

-- Ejecuta esto para verificar que fuiste agregado como staff
SELECT
  s.id,
  s.first_name,
  s.last_name,
  sr.name as role_name,
  s.is_active,
  s.created_at
FROM public.staff s
LEFT JOIN public.staff_roles sr ON s.role_id = sr.id
WHERE s.id = 'tu-uuid-aqui'        -- ⚠️ REEMPLAZA CON TU UUID
LIMIT 1;

-- Si ves una fila con tu nombre, ¡Éxito! Ya eres staff.

-- ====================================================================
-- PASO A PASO PARA EJECUTAR ESTO EN SUPABASE
-- ====================================================================
-- 1. Ve a https://supabase.com/dashboard
-- 2. Selecciona tu proyecto "Mantua"
-- 3. Ve a "SQL Editor" (izquierda) → "New Query"
-- 4. Copia TODO el bloque "INSERTAR TÚ COMO STAFF" (la Opción 1)
-- 5. Haz click en "Run" (o Ctrl+Enter)
-- 6. Deberías ver "INSERT 1" o similar si fue exitoso
-- 7. Ejecuta la query de verificación al final para confirmar

-- ====================================================================
-- EXTRA: SI NECESITAS VER TU UUID
-- ====================================================================

-- Ejecuta esta query para ver todos los usuarios y sus UUIDs
-- SELECT id, email, created_at FROM auth.users LIMIT 10;

-- El UUID que buscas es el que corresponde a tu email.

-- ====================================================================
-- VERIFICACIÓN FINAL: USUARIOS STAFF
-- ====================================================================

-- Si ejecutaste la Opción 1, ejecuta esto para ver todos los staff:
SELECT
  s.id,
  s.first_name,
  s.last_name,
  sr.name as role_name,
  s.is_active,
  s.created_at
FROM public.staff s
LEFT JOIN public.staff_roles sr ON s.role_id = sr.id
ORDER BY s.created_at DESC;
