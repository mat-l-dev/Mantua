-- ====================================================================
-- SCRIPT: PROMOVER USUARIO A STAFF POR EMAIL
-- ====================================================================
-- Este script busca un usuario por su email y lo agrega a la tabla `staff`
-- con el rol de 'SuperAdmin'.
-- Úsalo si no puedes acceder al admin después de loguearte.

DO $$
DECLARE
  -- ⚠️ REEMPLAZA ESTE EMAIL CON EL TUYO
  v_target_email TEXT := 'mathew_lazo_guerra@hotmail.com'; 
  
  v_user_id UUID;
  v_role_id UUID;
BEGIN
  -- 1. Buscar el ID del usuario en auth.users
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = v_target_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Error: No se encontró ningún usuario con el email %. Asegúrate de haberte registrado primero.', v_target_email;
  END IF;

  -- 2. Buscar o crear el rol SuperAdmin
  SELECT id INTO v_role_id 
  FROM public.staff_roles 
  WHERE name = 'SuperAdmin';

  IF v_role_id IS NULL THEN
    INSERT INTO public.staff_roles (name, description, is_active) 
    VALUES ('SuperAdmin', 'Acceso total al sistema', TRUE)
    RETURNING id INTO v_role_id;
  END IF;

  -- 3. Insertar o Actualizar en la tabla staff
  INSERT INTO public.staff (id, first_name, last_name, role_id, is_active, created_at, updated_at)
  VALUES (
    v_user_id, 
    'Admin', -- Nombre genérico, puedes cambiarlo luego en perfil
    'User', 
    v_role_id, 
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    is_active = TRUE,
    role_id = v_role_id,
    updated_at = NOW();
    
  RAISE NOTICE '✅ ÉXITO: El usuario % ha sido promovido a Staff (SuperAdmin). Intenta loguearte de nuevo.', v_target_email;
END $$;
