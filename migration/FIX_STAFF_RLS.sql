-- ====================================================================
-- FIX: CORRECCIÓN DE POLÍTICAS RLS PARA STAFF
-- ====================================================================
-- FECHA: 19 Noviembre 2025
-- DESCRIPCIÓN: 
-- La política anterior "Staff view all staff" dependía de la función `is_staff()`,
-- la cual a su vez consultaba la tabla `staff`. Esto creaba un bucle infinito o
-- impedía que un usuario viera su propio registro para "demostrar" que es staff.
--
-- SOLUCIÓN:
-- Permitir explícitamente que cualquier usuario autenticado vea SU PROPIO registro
-- en la tabla `staff`. Esto rompe el bucle y permite que `is_staff()` funcione.

-- 1. Eliminar política defectuosa
DROP POLICY IF EXISTS "Staff view all staff" ON public.staff;

-- 2. Crear nueva política híbrida
-- Permite ver tu propio registro (para validación) O ver todos si ya eres staff confirmado.
CREATE POLICY "Staff view themselves and others" ON public.staff
FOR SELECT TO authenticated
USING (
  auth.uid() = id          -- Regla base: Siempre puedo verme a mí mismo
  OR
  public.is_staff()        -- Regla admin: Si soy staff, veo a todos
);

-- 3. Asegurar que la función is_staff sea segura
-- (Recreamos para asegurar que use search_path seguro, aunque ya estaba en SQL OFICIAL)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, auth, extensions
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.staff
    WHERE id = auth.uid()
    AND is_active = true
  );
END;
$$;

-- 4. (Opcional) Re-insertar tu usuario por si acaso el UUID estaba mal
-- Esto usa el email para buscar el UUID correcto dinámicamente.
DO $$
DECLARE
  v_target_email TEXT := 'mathew_lazo_guerra@hotmail.com'; -- TU EMAIL
  v_user_id UUID;
  v_role_id UUID;
BEGIN
  -- Buscar ID real del usuario
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_target_email;
  
  IF v_user_id IS NOT NULL THEN
    -- Buscar rol SuperAdmin
    SELECT id INTO v_role_id FROM public.staff_roles WHERE name = 'SuperAdmin';
    
    -- Insertar o actualizar
    INSERT INTO public.staff (id, first_name, last_name, role_id, is_active)
    VALUES (v_user_id, 'Mathew', 'Lazo', v_role_id, TRUE)
    ON CONFLICT (id) DO UPDATE SET
      is_active = TRUE,
      role_id = v_role_id;
      
    RAISE NOTICE '✅ Usuario % sincronizado en tabla staff', v_target_email;
  ELSE
    RAISE WARNING '⚠️ No se encontró usuario con email %', v_target_email;
  END IF;
END $$;
