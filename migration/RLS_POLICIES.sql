-- ===================================================
-- RLS POLICIES - Ejecutar DESPUÉS de FIXES_SECURITY
-- ===================================================
-- Este script agrega políticas RLS para las 4 tablas que las necesitaban
-- Completa la seguridad del sistema

-- ===========================
-- 1. CART_ITEMS - Carritos persistentes
-- ===========================
-- Los usuarios solo ven sus propios items de carrito

CREATE POLICY "Users view own cart items" ON public.cart_items
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.cart_sessions cs
        WHERE cs.id = cart_items.cart_session_id
        AND cs.customer_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users manage own cart items" ON public.cart_items
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.cart_sessions cs
        WHERE cs.id = cart_items.cart_session_id
        AND cs.customer_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users update own cart items" ON public.cart_items
FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.cart_sessions cs
        WHERE cs.id = cart_items.cart_session_id
        AND cs.customer_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.cart_sessions cs
        WHERE cs.id = cart_items.cart_session_id
        AND cs.customer_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users delete own cart items" ON public.cart_items
FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.cart_sessions cs
        WHERE cs.id = cart_items.cart_session_id
        AND cs.customer_id = (SELECT auth.uid())
    )
);

-- Staff puede ver y administrar todos los carritos
CREATE POLICY "Staff view all cart items" ON public.cart_items
FOR SELECT TO authenticated
USING (public.is_staff());

CREATE POLICY "Staff manage all cart items" ON public.cart_items
FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- ===========================
-- 2. ORDER_COUPONS - Cupones aplicados a órdenes
-- ===========================
-- Los usuarios ven solo los cupones de sus propias órdenes
-- Staff ve todos

CREATE POLICY "Customers view own order coupons" ON public.order_coupons
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_coupons.order_id
        AND o.customer_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Staff view all order coupons" ON public.order_coupons
FOR SELECT TO authenticated
USING (public.is_staff());

CREATE POLICY "Customers apply coupons to own orders" ON public.order_coupons
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_coupons.order_id
        AND o.customer_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Only staff can manage coupons on orders" ON public.order_coupons
FOR UPDATE TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

CREATE POLICY "Only staff can remove coupons from orders" ON public.order_coupons
FOR DELETE TO authenticated
USING (public.is_staff());

-- ===========================
-- 3. PRODUCT_TAG_MAPPING - Relación entre productos y tags
-- ===========================
-- Lectura pública (todos ven qué tags tienen los productos)
-- Solo staff puede crear/modificar/borrar

CREATE POLICY "Everyone can view product tags" ON public.product_tag_mapping
FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY "Only staff can add tags to products" ON public.product_tag_mapping
FOR INSERT TO authenticated
WITH CHECK (public.is_staff());

CREATE POLICY "Only staff can modify product tags" ON public.product_tag_mapping
FOR UPDATE TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

CREATE POLICY "Only staff can remove tags from products" ON public.product_tag_mapping
FOR DELETE TO authenticated
USING (public.is_staff());

-- ===========================
-- 4. RETURN_ITEMS - Items devueltos
-- ===========================
-- Los clientes ven solo los items de sus propias devoluciones
-- Staff ve todos

CREATE POLICY "Customers view own return items" ON public.return_items
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.returns r
        WHERE r.id = return_items.return_id
        AND r.customer_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Staff view all return items" ON public.return_items
FOR SELECT TO authenticated
USING (public.is_staff());

CREATE POLICY "Customers create own return items" ON public.return_items
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.returns r
        WHERE r.id = return_items.return_id
        AND r.customer_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Only staff can update return items" ON public.return_items
FOR UPDATE TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

CREATE POLICY "Only staff can delete return items" ON public.return_items
FOR DELETE TO authenticated
USING (public.is_staff());

-- =========================
-- FIN DEL SCRIPT DE RLS
-- =========================
