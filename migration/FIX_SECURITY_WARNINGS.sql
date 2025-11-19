-- ====================================================================
-- FIX SECURITY WARNINGS - Correcciones de Supabase Linter
-- ====================================================================

-- ====================================================================
-- 1. CORREGIR FUNCTION SEARCH PATH EN handle_new_user
-- ====================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.customers (id, email, phone, is_active)
  VALUES (NEW.id, NEW.email, NEW.phone, TRUE)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ====================================================================
-- 2. CORREGIR FUNCTION SEARCH PATH EN get_shipping_cost
-- ====================================================================

DROP FUNCTION IF EXISTS get_shipping_cost(INTEGER, VARCHAR);

CREATE OR REPLACE FUNCTION get_shipping_cost(
  p_puntos_acarreo INTEGER,
  p_scope VARCHAR
)
RETURNS DECIMAL(12, 2)
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER SET search_path = public
AS $$
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
$$;

-- ====================================================================
-- 3. CORREGIR FUNCTION SEARCH PATH EN recalcular_envio_single
-- ====================================================================

DROP TRIGGER IF EXISTS on_order_created ON orders;
DROP FUNCTION IF EXISTS recalcular_envio_single();

CREATE OR REPLACE FUNCTION recalcular_envio_single()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
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
$$;

CREATE TRIGGER on_order_created
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION recalcular_envio_single();

-- ====================================================================
-- 4. CORREGIR FUNCTION SEARCH PATH EN audit_log_changes
-- ====================================================================

DROP TRIGGER IF EXISTS audit_products ON products;
DROP TRIGGER IF EXISTS audit_orders ON orders;
DROP TRIGGER IF EXISTS audit_payment_proofs ON payment_proofs;
DROP FUNCTION IF EXISTS audit_log_changes();

CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
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
$$;

-- Recrear triggers de auditoría para tablas críticas
CREATE TRIGGER audit_products
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_orders
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_payment_proofs
AFTER INSERT OR UPDATE OR DELETE ON payment_proofs
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes();

-- ====================================================================
-- 5. HABILITAR RLS EN audit_log
-- ====================================================================

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo ven sus propios logs de auditoría
DROP POLICY IF EXISTS audit_log_users_own_logs ON public.audit_log;
CREATE POLICY audit_log_users_own_logs ON public.audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Los staff/admin pueden ver todos los logs
DROP POLICY IF EXISTS audit_log_staff_view_all ON public.audit_log;
CREATE POLICY audit_log_staff_view_all ON public.audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.staff
      WHERE id = auth.uid()
    )
  );

-- Política: Solo el sistema puede insertar en audit_log (a través de trigger)
DROP POLICY IF EXISTS audit_log_insert_only_system ON public.audit_log;
CREATE POLICY audit_log_insert_only_system ON public.audit_log
  FOR INSERT WITH CHECK (FALSE);  -- Solo triggers pueden insertar
