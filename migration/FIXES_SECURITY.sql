-- ===================================================
-- FIXES SEGURIDAD - Ejecutar DESPUÉS de SQL OFICIAL
-- ===================================================
-- Este script arregla las 15 advertencias de Supabase Database Linter
-- 1. Mueve extensiones de public a extensions schema
-- 2. Agrega SET search_path a todas las funciones

-- 1. CREAR SCHEMA PARA EXTENSIONES
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. MOVER EXTENSIONES A SCHEMA SEGURO
ALTER EXTENSION pg_trgm SET SCHEMA extensions;
ALTER EXTENSION pgcrypto SET SCHEMA extensions;

-- 3. ARREGLAR TODAS LAS FUNCIONES CON search_path

-- log_inventory_movement
CREATE OR REPLACE FUNCTION public.log_inventory_movement()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND (OLD.quantity <> NEW.quantity OR OLD.reserved_quantity <> NEW.reserved_quantity) THEN
        IF OLD.quantity <> NEW.quantity THEN
            INSERT INTO public.inventory_logs (
                variant_id,
                location_id,
                movement_type,
                quantity_change,
                quantity_before,
                quantity_after,
                notes
            ) VALUES (
                NEW.variant_id,
                NEW.location_id,
                'adjustment',
                NEW.quantity - OLD.quantity,
                OLD.quantity,
                NEW.quantity,
                'Stock ajustado manualmente'
            );
        END IF;
        
        IF OLD.reserved_quantity <> NEW.reserved_quantity THEN
            INSERT INTO public.inventory_logs (
                variant_id,
                location_id,
                movement_type,
                quantity_change,
                quantity_before,
                quantity_after,
                notes
            ) VALUES (
                NEW.variant_id,
                NEW.location_id,
                CASE WHEN NEW.reserved_quantity > OLD.reserved_quantity THEN 'reservation' ELSE 'release' END,
                NEW.reserved_quantity - OLD.reserved_quantity,
                OLD.reserved_quantity,
                NEW.reserved_quantity,
                'Reserva modificada manualmente'
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- log_order_status_change
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.status <> NEW.status THEN
        INSERT INTO public.order_status_history (
            order_id,
            old_status,
            new_status,
            notes
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            'Estado actualizado'
        );
    END IF;
    RETURN NEW;
END;
$$;

-- trg_populate_order_item_snapshot
CREATE OR REPLACE FUNCTION public.trg_populate_order_item_snapshot()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    IF NEW.product_name IS NULL OR NEW.product_name = '' THEN
        SELECT p.name INTO NEW.product_name
        FROM public.products p
        JOIN public.product_variants pv ON pv.product_id = p.id
        WHERE pv.id = NEW.variant_id;
        
        IF NEW.product_name IS NULL THEN
            NEW.product_name := 'Producto sin nombre';
        END IF;
    END IF;
    
    IF NEW.unit_price IS NULL OR NEW.unit_cost IS NULL THEN
        SELECT pv.selling_price, p.cost_price 
        INTO NEW.unit_price, NEW.unit_cost
        FROM public.products p
        JOIN public.product_variants pv ON pv.product_id = p.id
        WHERE pv.id = NEW.variant_id;
    END IF;
    
    IF NEW.puntos_acarreo IS NULL OR NEW.puntos_acarreo = 0 THEN
        SELECT p.puntos_acarreo INTO NEW.puntos_acarreo
        FROM public.products p
        JOIN public.product_variants pv ON pv.product_id = p.id
        WHERE pv.id = NEW.variant_id;
        
        NEW.puntos_acarreo := COALESCE(NEW.puntos_acarreo, 0);
    END IF;
    
    RETURN NEW;
END;
$$;

-- trg_prevent_empty_orders
CREATE OR REPLACE FUNCTION public.trg_prevent_empty_orders()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    IF NEW.status <> OLD.status AND NEW.status NOT IN ('pending', 'cancelled') THEN
        IF NOT EXISTS (SELECT 1 FROM public.order_items WHERE order_id = NEW.id) THEN
            RAISE EXCEPTION 'No se puede cambiar estado de orden sin items (orden: %)', NEW.id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- ensure_single_default_address
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    IF NEW.is_default THEN
        UPDATE public.shipping_addresses 
        SET is_default = FALSE 
        WHERE customer_id = NEW.customer_id 
        AND (CASE 
            WHEN TG_OP = 'INSERT' THEN TRUE
            WHEN TG_OP = 'UPDATE' THEN id <> NEW.id
            ELSE FALSE
        END);
    END IF;
    RETURN NEW;
END;
$$;

-- validate_stock_on_order_item
CREATE OR REPLACE FUNCTION public.validate_stock_on_order_item()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_available INTEGER;
    v_location_id UUID;
BEGIN
    SELECT stock_location_id INTO v_location_id FROM public.orders WHERE id = NEW.order_id;
    
    IF v_location_id IS NULL THEN
        SELECT id INTO v_location_id 
        FROM public.stock_locations 
        WHERE is_active = TRUE 
        LIMIT 1;
    END IF;
    
    IF v_location_id IS NULL THEN
        RAISE EXCEPTION 'No hay ubicaciones de stock activas';
    END IF;
    
    SELECT (quantity - reserved_quantity) INTO v_available
    FROM public.product_stock
    WHERE variant_id = NEW.variant_id AND location_id = v_location_id;
    
    IF v_available IS NULL THEN
        RAISE WARNING 'No hay stock configurado para la variante %', NEW.variant_id;
    ELSIF v_available < NEW.quantity THEN
        IF COALESCE(current_setting('app.stock_strict_validation', TRUE), 'true') = 'true' THEN
            RAISE EXCEPTION 'Stock insuficiente para la variante %. Disponible: %, Solicitado: %', 
                NEW.variant_id, v_available, NEW.quantity;
        ELSE
            RAISE WARNING 'Stock insuficiente para la variante %. Disponible: %, Solicitado: %', 
                NEW.variant_id, v_available, NEW.quantity;
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error validando stock: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- release_stock
CREATE OR REPLACE FUNCTION public.release_stock(
    p_variant_id UUID,
    p_location_id UUID,
    p_quantity INTEGER,
    p_order_id UUID,
    p_changed_by UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_current_reserved INTEGER;
BEGIN
    SELECT reserved_quantity INTO v_current_reserved
    FROM public.product_stock
    WHERE variant_id = p_variant_id AND location_id = p_location_id
    FOR UPDATE;
    
    IF v_current_reserved IS NULL OR v_current_reserved < p_quantity THEN
        RETURN FALSE;
    END IF;
    
    UPDATE public.product_stock
    SET reserved_quantity = reserved_quantity - p_quantity
    WHERE variant_id = p_variant_id AND location_id = p_location_id;
    
    INSERT INTO public.inventory_logs (
        variant_id,
        location_id,
        movement_type,
        quantity_change,
        quantity_before,
        quantity_after,
        reference_id,
        notes,
        created_by
    ) VALUES (
        p_variant_id,
        p_location_id,
        'release',
        p_quantity,
        v_current_reserved,
        v_current_reserved - p_quantity,
        p_order_id,
        'Reserva liberada',
        p_changed_by
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error liberando stock: %', SQLERRM;
        RETURN FALSE;
END;
$$;

-- update_order_subtotal
CREATE OR REPLACE FUNCTION public.update_order_subtotal()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_order_id UUID;
    v_new_subtotal DECIMAL(12,2);
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_order_id := OLD.order_id;
    ELSE
        v_order_id := NEW.order_id;
    END IF;
    
    SELECT COALESCE(SUM(unit_price * quantity), 0) INTO v_new_subtotal
    FROM public.order_items
    WHERE order_id = v_order_id;
    
    UPDATE public.orders
    SET subtotal = v_new_subtotal
    WHERE id = v_order_id;
    
    RETURN NULL;
END;
$$;

-- auto_release_stock_on_cancel
CREATE OR REPLACE FUNCTION public.auto_release_stock_on_cancel()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    rec RECORD;
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
        FOR rec IN 
            SELECT oi.variant_id, oi.quantity
            FROM public.order_items oi
            WHERE oi.order_id = NEW.id
        LOOP
            PERFORM public.release_stock(
                rec.variant_id,
                COALESCE(NEW.stock_location_id, (SELECT id FROM public.stock_locations WHERE is_active = TRUE LIMIT 1)),
                rec.quantity,
                NEW.id,
                NULL
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$;

-- cleanup_old_data
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS void 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_audit_days INTEGER;
    v_inventory_days INTEGER;
    v_cart_days INTEGER;
BEGIN
    SELECT (value->>0)::INTEGER INTO v_audit_days FROM public.system_config WHERE key = 'retention.audit_logs_days';
    SELECT (value->>0)::INTEGER INTO v_inventory_days FROM public.system_config WHERE key = 'retention.inventory_logs_days';
    SELECT (value->>0)::INTEGER INTO v_cart_days FROM public.system_config WHERE key = 'retention.cart_sessions_days';
    
    DELETE FROM public.audit_logs WHERE created_at < NOW() - (COALESCE(v_audit_days, 730) || ' days')::INTERVAL;
    DELETE FROM public.inventory_logs WHERE created_at < NOW() - (COALESCE(v_inventory_days, 365) || ' days')::INTERVAL;
    DELETE FROM public.cart_sessions WHERE updated_at < NOW() - (COALESCE(v_cart_days, 30) || ' days')::INTERVAL;
    
    RAISE NOTICE 'Limpieza completada: audit_logs (>% días), inventory_logs (>% días), cart_sessions (>% días)', 
        COALESCE(v_audit_days, 730), COALESCE(v_inventory_days, 365), COALESCE(v_cart_days, 30);
END;
$$;

-- get_dashboard_metrics
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics(p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    total_orders BIGINT,
    total_revenue DECIMAL,
    pending_orders BIGINT,
    pending_payments BIGINT,
    low_stock_items BIGINT
) 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.orders WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL),
        COALESCE((SELECT SUM(total_amount) FROM public.orders WHERE status = 'completed' AND created_at >= NOW() - (p_days || ' days')::INTERVAL), 0),
        (SELECT COUNT(*) FROM public.orders WHERE status IN ('pending', 'processing', 'verified')),
        (SELECT COUNT(*) FROM public.payment_proofs WHERE status = 'pending'),
        (SELECT COUNT(DISTINCT variant_id) FROM public.product_stock WHERE (quantity - reserved_quantity) <= 5);
END;
$$;

-- search_products
CREATE OR REPLACE FUNCTION public.search_products(search_query TEXT)
RETURNS TABLE (
    product_id UUID,
    product_name VARCHAR,
    relevance REAL
) 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        GREATEST(
            extensions.similarity(p.name, search_query),
            extensions.similarity(COALESCE(p.description, ''), search_query) * 0.5
        ) as relevance
    FROM public.products p
    WHERE p.is_active = true
      AND (p.name ILIKE '%' || search_query || '%' 
           OR p.description ILIKE '%' || search_query || '%'
           OR p.sku ILIKE '%' || search_query || '%'
           OR EXISTS (
               SELECT 1 FROM public.product_tags pt 
               JOIN public.product_tag_mapping ptm ON pt.id = ptm.tag_id
               WHERE ptm.product_id = p.id AND pt.name ILIKE '%' || search_query || '%'
           ))
    ORDER BY relevance DESC, p.created_at DESC
    LIMIT 50;
END;
$$;

-- prevent_negative_stock
CREATE OR REPLACE FUNCTION public.prevent_negative_stock()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    IF NEW.quantity < 0 THEN
        RAISE EXCEPTION 'Stock no puede ser negativo. Variant: %, Location: %', NEW.variant_id, NEW.location_id;
    END IF;
    IF NEW.reserved_quantity < 0 THEN
        RAISE EXCEPTION 'Reserva no puede ser negativa. Variant: %, Location: %', NEW.variant_id, NEW.location_id;
    END IF;
    RETURN NEW;
END;
$$;

-- process_return
CREATE OR REPLACE FUNCTION public.process_return(
    p_variant_id UUID,
    p_location_id UUID,
    p_quantity INTEGER,
    p_return_id UUID,
    p_changed_by UUID DEFAULT NULL
)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_current_qty INTEGER;
BEGIN
    UPDATE public.product_stock
    SET quantity = quantity + p_quantity
    WHERE variant_id = p_variant_id AND location_id = p_location_id
    RETURNING quantity INTO v_current_qty;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    INSERT INTO public.inventory_logs (
        variant_id,
        location_id,
        movement_type,
        quantity_change,
        quantity_before,
        quantity_after,
        reference_id,
        notes,
        created_by
    ) VALUES (
        p_variant_id,
        p_location_id,
        'return',
        p_quantity,
        v_current_qty - p_quantity,
        v_current_qty,
        p_return_id,
        'Producto devuelto',
        p_changed_by
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error procesando devolución: %', SQLERRM;
        RETURN FALSE;
END;
$$;

-- =========================
-- FIN DEL SCRIPT DE FIXES
-- =========================
