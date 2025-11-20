-- ====================================================================
-- FIX: CORRECCIÓN DE TRIGGERS DE LOGIN (ELIMINAR CAMPO EMAIL)
-- ====================================================================
-- FECHA: 19 Noviembre 2025
-- DESCRIPCIÓN: 
-- La tabla `customers` no tiene columna `email` (se obtiene de auth.users).
-- Los triggers anteriores (en TRIGGERS_MEJORADOS.sql) intentaban insertar/actualizar `email`, 
-- causando el error "Database error granting user" al intentar hacer login/registro.
-- Este script redefine las funciones para eliminar esa referencia.

-- 1. Corregir handle_new_user (INSERT)
-- Se elimina 'email' de la lista de columnas y valores.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (id, phone, is_active)
  VALUES (NEW.id, NEW.phone, TRUE)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Corregir handle_update_user (UPDATE)
-- Se elimina 'email = NEW.email' del SET.
CREATE OR REPLACE FUNCTION public.handle_update_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.customers
  SET 
    first_name = NEW.raw_user_meta_data->>'first_name',
    last_name = NEW.raw_user_meta_data->>'last_name',
    phone = NEW.raw_user_meta_data->>'phone',
    -- email = NEW.email, -- ELIMINADO: No existe columna email en customers
    updated_at = NOW()
  WHERE id = NEW.id;
  
  -- Si el usuario fue eliminado (deleted_at != null), marcar como inactivo
  IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
    UPDATE public.customers
    SET is_active = FALSE,
        updated_at = NOW()
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;
