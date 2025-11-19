-- ====================================================================
-- TRIGGERS MEJORADOS PARA SINCRONIZACIÓN DE USUARIOS Y STAFF
-- ====================================================================

-- ====================================================================
-- 1. TRIGGER PARA CREAR USUARIO EN TABLA CUSTOMERS (INSERT)
-- ====================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (id, email, phone, is_active)
  VALUES (NEW.id, NEW.email, NEW.phone, TRUE)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Si el trigger ya existe, eliminarlo y recrearlo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ====================================================================
-- 2. TRIGGER PARA ACTUALIZAR DATOS EN TABLA CUSTOMERS (UPDATE)
-- ====================================================================
-- Sincroniza cambios de email, phone, y metadata cuando se actualiza auth.users
-- IMPORTANTE: Este trigger evita que cambios en auth.users rompan relaciones en customers

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
    email = NEW.email,
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

-- Trigger que se dispara al actualizar auth.users
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_update_user();

-- ====================================================================
-- 3. FUNCIÓN AUXILIAR PARA CALCULAR COSTO DE ENVÍO (Puntos de Acarreo)
-- ====================================================================
-- Esta función busca el tier de envío basado en puntos_acarreo

CREATE OR REPLACE FUNCTION get_shipping_cost(
  p_puntos_acarreo INTEGER,
  p_scope VARCHAR
)
RETURNS DECIMAL(12, 2) AS $$
DECLARE
  v_costo DECIMAL(12, 2);
BEGIN
  SELECT costo
  INTO v_costo
  FROM public.tiers_acarreo
  WHERE tier_scope = p_scope
    AND puntos_minimos <= p_puntos_acarreo
    AND puntos_maximos >= p_puntos_acarreo
  LIMIT 1;

  RETURN COALESCE(v_costo, 0.00);
END;
$$ LANGUAGE plpgsql STABLE;

-- ====================================================================
-- 4. TRIGGER PARA CALCULAR COSTO DE ENVÍO EN ÓRDENES
-- ====================================================================
-- Cuando se crea una orden, calcula automáticamente el costo de envío

CREATE OR REPLACE FUNCTION recalcular_envio_single()
RETURNS TRIGGER AS $$
DECLARE
  v_total_puntos INTEGER;
  v_costo_envio DECIMAL(12, 2);
BEGIN
  -- Obtener total de puntos_acarreo de los items de la orden
  SELECT COALESCE(SUM(oi.puntos_acarreo * oi.quantity), 0)
  INTO v_total_puntos
  FROM order_items oi
  WHERE oi.order_id = NEW.id;

  -- Calcular el costo de envío basado en el scope
  v_costo_envio := get_shipping_cost(v_total_puntos, NEW.shipping_scope);

  -- Actualizar el costo en la orden
  UPDATE orders
  SET shipping_cost = v_costo_envio,
      total = subtotal + v_costo_envio,
      updated_at = NOW()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Si el trigger ya existe, eliminarlo y recrearlo
DROP TRIGGER IF EXISTS on_order_created ON orders;

CREATE TRIGGER on_order_created
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION recalcular_envio_single();

-- ====================================================================
-- 5. TRIGGER PARA AUDITORÍA (Registrar cambios en tablas críticas)
-- ====================================================================

CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
DECLARE
  v_old_data JSONB;
  v_new_data JSONB;
  v_action audit_action;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_action := 'DELETE'::audit_action;
    v_old_data := row_to_json(OLD);
    v_new_data := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'UPDATE'::audit_action;
    v_old_data := row_to_json(OLD);
    v_new_data := row_to_json(NEW);
  ELSIF TG_OP = 'INSERT' THEN
    v_action := 'INSERT'::audit_action;
    v_old_data := NULL;
    v_new_data := row_to_json(NEW);
  END IF;

  INSERT INTO audit_log (table_name, action, old_data, new_data, user_id, created_at)
  VALUES (TG_TABLE_NAME, v_action, v_old_data, v_new_data, auth.uid(), NOW());

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear triggers de auditoría para tablas críticas
DROP TRIGGER IF EXISTS audit_products ON products;
CREATE TRIGGER audit_products
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes();

DROP TRIGGER IF EXISTS audit_orders ON orders;
CREATE TRIGGER audit_orders
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes();

DROP TRIGGER IF EXISTS audit_payment_proofs ON payment_proofs;
CREATE TRIGGER audit_payment_proofs
AFTER INSERT OR UPDATE OR DELETE ON payment_proofs
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes();

-- ====================================================================
-- TABLA DE AUDITORÍA (si no existe)
-- ====================================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR NOT NULL,
  action audit_action NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas de auditoría
CREATE INDEX IF NOT EXISTS idx_audit_log_table_action
ON audit_log(table_name, action, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_user
ON audit_log(user_id, created_at DESC);
