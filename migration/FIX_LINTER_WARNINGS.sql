-- ====================================================================
-- FIX: LINTER WARNINGS & SECURITY
-- ====================================================================
-- FECHA: 19 Noviembre 2025
-- DESCRIPCIÓN: 
-- 1. Soluciona la advertencia "Function search_path mutable" en `handle_new_user`.
--    Se agrega `SET search_path = public` para evitar hijacking de rutas de búsqueda.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- 🔒 FIX: Asegura que solo busque en schema public
AS $$
BEGIN
  INSERT INTO public.customers (id, phone, is_active)
  VALUES (NEW.id, NEW.phone, TRUE)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- NOTA SOBRE "Leaked Password Protection":
-- Esta advertencia no se arregla con SQL. Debes ir a:
-- Supabase Dashboard > Authentication > Providers > Email > Password Protection
-- Y habilitar "Check for leaked passwords".
