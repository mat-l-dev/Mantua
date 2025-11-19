--1. Extensiones y Tipos
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ENUMs para estados y tipos
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'verified', 'rejected', 'shipped', 'completed', 'cancelled');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE customer_type AS ENUM ('persona_natural', 'empresa');
CREATE TYPE document_type AS ENUM ('dni', 'ruc', 'ce');
CREATE TYPE proof_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE address_label AS ENUM ('casa', 'trabajo', 'agencia', 'otro');
CREATE TYPE return_reason AS ENUM ('defective', 'wrong_product', 'not_as_described', 'changed_mind', 'other');
CREATE TYPE return_status AS ENUM ('requested', 'approved', 'rejected', 'in_transit', 'received', 'refunded');
CREATE TYPE stock_movement_type AS ENUM ('purchase', 'sale', 'return', 'adjustment', 'reservation', 'release');
CREATE TYPE audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE');

--2. Catálogo

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    image_path TEXT,
    published BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR NOT NULL UNIQUE,
    sku VARCHAR UNIQUE NOT NULL,
    description TEXT,
    image_path TEXT,
    cost_price DECIMAL(12,2) NOT NULL CHECK (cost_price >= 0),
    selling_price DECIMAL(12,2) NOT NULL CHECK (selling_price >= 0),
    puntos_acarreo INTEGER NOT NULL DEFAULT 0,
    shipping_policy VARCHAR(20) DEFAULT 'normal', -- 'normal', 'gratis'
    dimensions JSONB DEFAULT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

--3. Tags y Múltiples Imágenes

CREATE TABLE product_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    slug VARCHAR NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_tag_mapping (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES product_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

--4. Variantes y Stock

-- Crear primero stock_locations para que product_stock pueda referenciarla
CREATE TABLE stock_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR,
    sku VARCHAR UNIQUE,
    attributes JSONB,
    selling_price DECIMAL(12,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES stock_locations(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    UNIQUE(variant_id, location_id),
    CONSTRAINT chk_reserved_not_exceed CHECK (reserved_quantity <= quantity)
);

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


--5. Usuarios y Direcciones

CREATE TABLE customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_type customer_type NOT NULL DEFAULT 'persona_natural',
    first_name VARCHAR,
    last_name VARCHAR,
    document_hash TEXT UNIQUE,
    phone VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shipping_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    label address_label NOT NULL DEFAULT 'casa',
    address TEXT NOT NULL,
    departamento VARCHAR NOT NULL,
    provincia VARCHAR NOT NULL,
    distrito VARCHAR NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

--6. Staff y Permisos (Crítico para Seguridad)

CREATE TABLE staff_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    permissions JSONB NOT NULL DEFAULT '{}', -- {"orders:verify": true, "products:edit": true}
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE staff (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES staff_roles(id) ON DELETE SET NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    phone VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

--7. Tiers y Pickup Locations (Debe ir ANTES de orders por FK)

CREATE TABLE tiers_acarreo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_tier VARCHAR NOT NULL,
    tier_scope VARCHAR(20) NOT NULL DEFAULT 'provincia',
    tier_mode VARCHAR(20) NOT NULL DEFAULT 'acarreo',
    puntos_minimos INTEGER NOT NULL DEFAULT 0,
    puntos_maximos INTEGER NOT NULL,
    costo DECIMAL(12,2) NOT NULL CHECK (costo >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_tier_range CHECK (puntos_maximos > puntos_minimos)
);

CREATE TABLE pickup_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    departamento VARCHAR NOT NULL,
    provincia VARCHAR NOT NULL,
    distrito VARCHAR NOT NULL,
    direccion TEXT NOT NULL,
    horarios TEXT,
    capacidad INTEGER CHECK (capacidad > 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

--8. Métodos de Pago

CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

--9. Órdenes y Items

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    shipping_address_id UUID REFERENCES shipping_addresses(id) ON DELETE SET NULL,
    pickup_location_id UUID REFERENCES pickup_locations(id) ON DELETE SET NULL,
    stock_location_id UUID NOT NULL REFERENCES stock_locations(id),
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
    shipping_cost DECIMAL(12,2) DEFAULT 0,
    shipping_real_cost DECIMAL(12,2),
    total_amount DECIMAL(12,2) GENERATED ALWAYS AS (subtotal + COALESCE(shipping_cost, 0)) STORED,
    shipping_mode VARCHAR(20), -- acarreo, envio_directo, pickup
    shipping_scope VARCHAR(20), -- lima_callao, provincia
    status order_status DEFAULT 'pending',
    notes TEXT, -- Comentarios internos del staff
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_shipping_mode_and_location CHECK (
        (shipping_mode IN ('acarreo', 'envio_directo') AND shipping_address_id IS NOT NULL AND pickup_location_id IS NULL) OR
        (shipping_mode = 'pickup' AND pickup_location_id IS NOT NULL AND shipping_address_id IS NULL)
    )
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    unit_cost DECIMAL(12,2), -- Para análisis de margen
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    puntos_acarreo INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

--10. Comprobantes de Pago (Crítico para el Negocio)

CREATE TABLE payment_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
    proof_image_path TEXT NOT NULL,
    operation_number VARCHAR,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    status proof_status DEFAULT 'pending',
    verified_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

--11. Cupones y Descuentos

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR NOT NULL UNIQUE,
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(12,2) NOT NULL CHECK (discount_value > 0),
    min_purchase DECIMAL(12,2) DEFAULT 0,
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (valid_until > valid_from),
    CHECK (max_uses IS NULL OR uses_count <= max_uses)
);

CREATE TABLE order_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE RESTRICT,
    discount_amount DECIMAL(12,2) NOT NULL CHECK (discount_amount > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(order_id, coupon_id)
);

--12. Devoluciones (Returns)

CREATE TABLE returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    reason return_reason NOT NULL,
    description TEXT,
    status return_status DEFAULT 'requested',
    approved_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    refund_amount DECIMAL(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE return_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id UUID NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

--13. Reviews y Wishlists

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR,
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, customer_id, order_id)
);

CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

--14. Carritos Persistentes

CREATE TABLE cart_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    session_token VARCHAR UNIQUE, -- Para usuarios no autenticados
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK ((customer_id IS NOT NULL) OR (session_token IS NOT NULL))
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_session_id UUID NOT NULL REFERENCES cart_sessions(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cart_session_id, variant_id)
);

--15. Auditoría y Logs (Crítico para Trazabilidad)

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status order_status,
    new_status order_status NOT NULL,
    changed_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES stock_locations(id) ON DELETE CASCADE,
    movement_type stock_movement_type NOT NULL,
    quantity_change INTEGER NOT NULL, -- Positivo o negativo
    quantity_before INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    reference_id UUID, -- ID de orden, devolución, etc.
    notes TEXT,
    created_by UUID REFERENCES staff(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR NOT NULL,
    record_id UUID NOT NULL,
    action audit_action NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

--16. Funciones Helper para Staff (antes de RLS)

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.staff
    WHERE id = (SELECT auth.uid())
    AND is_active = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.has_staff_permission(permission_name text)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
DECLARE
  user_permissions jsonb;
BEGIN
  SELECT sr.permissions INTO user_permissions
  FROM public.staff s
  JOIN public.staff_roles sr ON s.role_id = sr.id
  WHERE s.id = (SELECT auth.uid())
  AND s.is_active = true
  AND sr.is_active = true;
  
  RETURN COALESCE((user_permissions -> permission_name)::boolean, false);
END;
$$;

--17. Función y Trigger para Cálculo Automático

CREATE OR REPLACE FUNCTION public.fn_recalcular_envio_single(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_region VARCHAR;
    v_scope VARCHAR;
    v_mode VARCHAR;
    v_total_puntos INTEGER := 0;
    v_shipping_cost DECIMAL(12,2) := 0;
    v_all_gratis BOOLEAN := TRUE;
    rec RECORD;
BEGIN
    -- Validar que tengamos un order_id
    IF p_order_id IS NULL THEN 
        RETURN;
    END IF;

    -- Obtener región desde shipping_address_id en orders
    SELECT sa.departamento INTO v_region 
    FROM public.orders o 
    LEFT JOIN public.shipping_addresses sa ON o.shipping_address_id = sa.id
    WHERE o.id = p_order_id;
    
    -- Si no hay dirección, no calcular envío
    IF v_region IS NULL THEN
        RETURN;
    END IF;
    
    v_scope := CASE WHEN v_region IN ('Lima','Callao') THEN 'lima_callao' ELSE 'provincia' END;

    -- Obtener modo de envío
    SELECT shipping_mode INTO v_mode FROM public.orders WHERE id = p_order_id;
    
    -- Si es pickup, costo = 0
    IF v_mode = 'pickup' THEN
        UPDATE public.orders SET shipping_scope = v_scope, shipping_cost = 0
        WHERE id = p_order_id;
        RETURN;
    END IF;

    -- Calcular puntos y política de envío con agregación (optimizado)
    SELECT 
        COALESCE(SUM(CASE WHEN p.shipping_policy <> 'gratis' THEN oi.puntos_acarreo * oi.quantity ELSE 0 END), 0),
        COALESCE(BOOL_AND(p.shipping_policy = 'gratis'), TRUE)
    INTO v_total_puntos, v_all_gratis
    FROM public.order_items oi
    JOIN public.product_variants pv ON oi.variant_id = pv.id
    JOIN public.products p ON pv.product_id = p.id
    WHERE oi.order_id = p_order_id;

    -- Si todos son gratis o no hay items, costo = 0
    IF v_all_gratis THEN
        v_shipping_cost := 0;
    ELSE
        -- Buscar tier correspondiente
        SELECT costo INTO v_shipping_cost FROM public.tiers_acarreo
        WHERE tier_scope = v_scope AND tier_mode = v_mode
        AND puntos_minimos <= v_total_puntos AND puntos_maximos >= v_total_puntos
        LIMIT 1;
        
        -- Si no se encuentra tier, mantener en 0
        v_shipping_cost := COALESCE(v_shipping_cost, 0);
    END IF;

    -- Actualizar orden
    UPDATE public.orders SET shipping_scope = v_scope, shipping_cost = v_shipping_cost
    WHERE id = p_order_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error recalculando envío para orden %: %', p_order_id, SQLERRM;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_recalcular_envio_statement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_order_ids UUID[];
    v_order_id UUID;
BEGIN
    -- Obtener IDs únicos de ambas tablas (deduplicar con UNION)
    SELECT array_agg(DISTINCT order_id) INTO v_order_ids
    FROM (
        SELECT order_id FROM new_table WHERE order_id IS NOT NULL
        UNION
        SELECT order_id FROM old_table WHERE order_id IS NOT NULL
    ) t;

    -- Procesar cada orden una sola vez
    IF v_order_ids IS NOT NULL THEN
        FOREACH v_order_id IN ARRAY v_order_ids
        LOOP
            PERFORM public.fn_recalcular_envio_single(v_order_id);
        END LOOP;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalcular_envio_after_order_items
AFTER INSERT OR UPDATE OR DELETE ON public.order_items
REFERENCING NEW TABLE AS new_table OLD TABLE AS old_table
FOR EACH STATEMENT EXECUTE FUNCTION public.fn_recalcular_envio_statement();

--17. Índices para Performance

-- Índices en Foreign Keys principales
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_stock_variant ON product_stock(variant_id);
CREATE INDEX idx_product_stock_location ON product_stock(location_id);

-- Índices para tags e imágenes
CREATE INDEX idx_product_tag_mapping_product ON product_tag_mapping(product_id);
CREATE INDEX idx_product_tag_mapping_tag ON product_tag_mapping(tag_id);
CREATE INDEX idx_product_images_variant ON product_images(variant_id);
CREATE INDEX idx_product_images_primary ON product_images(variant_id, is_primary);

-- Índices para staff y roles
CREATE INDEX idx_staff_role ON staff(role_id);

CREATE INDEX idx_shipping_addresses_customer ON shipping_addresses(customer_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_shipping_address ON orders(shipping_address_id);
CREATE INDEX idx_orders_pickup_location ON orders(pickup_location_id);
CREATE INDEX idx_orders_stock_location ON orders(stock_location_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status, created_at DESC);

-- Índices GIN para búsquedas en JSONB
CREATE INDEX idx_product_variants_attributes ON product_variants USING GIN(attributes);
CREATE INDEX idx_staff_roles_permissions ON staff_roles USING GIN(permissions);

-- Índices GIN para búsquedas de texto parcial
CREATE INDEX idx_products_name_trgm ON products USING GIN(name gin_trgm_ops);
CREATE INDEX idx_product_tags_name_trgm ON product_tags USING GIN(name gin_trgm_ops);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id);

-- Índices para comprobantes y pagos
CREATE INDEX idx_payment_proofs_order ON payment_proofs(order_id);
CREATE INDEX idx_payment_proofs_status ON payment_proofs(status);
CREATE INDEX idx_payment_proofs_verified_by ON payment_proofs(verified_by);
CREATE INDEX idx_payment_proofs_operation ON payment_proofs(operation_number);

-- Índices para cupones
CREATE INDEX idx_coupons_active ON coupons(is_active, valid_from, valid_until);
CREATE INDEX idx_order_coupons_order ON order_coupons(order_id);
CREATE INDEX idx_order_coupons_coupon ON order_coupons(coupon_id);

-- Índice para búsquedas por puntos de acarreo
CREATE INDEX idx_products_puntos_acarreo ON products(puntos_acarreo);

-- Índices para devoluciones
CREATE INDEX idx_returns_order ON returns(order_id);
CREATE INDEX idx_returns_customer ON returns(customer_id);
CREATE INDEX idx_returns_status ON returns(status);
CREATE INDEX idx_return_items_return ON return_items(return_id);

-- Índices para reviews y wishlists
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_published ON reviews(is_published, created_at DESC);
CREATE INDEX idx_wishlists_customer ON wishlists(customer_id);
CREATE INDEX idx_wishlists_product ON wishlists(product_id);

-- Índices para carritos
CREATE INDEX idx_cart_sessions_customer ON cart_sessions(customer_id);
CREATE INDEX idx_cart_sessions_token ON cart_sessions(session_token);
CREATE INDEX idx_cart_items_session ON cart_items(cart_session_id);
CREATE INDEX idx_cart_items_variant ON cart_items(variant_id);

-- Índices para auditoría
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_changed_by ON order_status_history(changed_by);
CREATE INDEX idx_inventory_logs_variant ON inventory_logs(variant_id);
CREATE INDEX idx_inventory_logs_location ON inventory_logs(location_id);
CREATE INDEX idx_inventory_logs_type ON inventory_logs(movement_type, created_at DESC);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_changed_by ON audit_logs(changed_by);

-- Índice para búsquedas por región
CREATE INDEX idx_pickup_locations_region ON pickup_locations(departamento, provincia, distrito);
CREATE INDEX idx_shipping_addresses_region ON shipping_addresses(departamento, provincia);

-- Índices para consultas frecuentes por fecha
CREATE INDEX idx_orders_created_at_status ON orders(created_at DESC, status);
CREATE INDEX idx_products_created_at_active ON products(created_at DESC) WHERE is_active = true;

-- Índices parciales para órdenes activas y pagos pendientes (optimización dashboard)
CREATE INDEX idx_orders_active_status ON orders(status, created_at DESC) 
WHERE status IN ('pending', 'processing', 'verified');

CREATE INDEX idx_payment_proofs_pending ON payment_proofs(created_at DESC) 
WHERE status = 'pending';

-- Índice parcial para órdenes canceladas (optimización de limpieza)
CREATE INDEX idx_orders_cancelled ON orders(created_at) 
WHERE status = 'cancelled';

--18. Triggers para updated_at Automático

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER trg_update_categories BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_products BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_product_variants BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_stock_locations BEFORE UPDATE ON stock_locations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_customers BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_shipping_addresses BEFORE UPDATE ON shipping_addresses
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_staff_roles BEFORE UPDATE ON staff_roles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_staff BEFORE UPDATE ON staff
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_payment_methods BEFORE UPDATE ON payment_methods
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_orders BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_payment_proofs BEFORE UPDATE ON payment_proofs
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_coupons BEFORE UPDATE ON coupons
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_tiers_acarreo BEFORE UPDATE ON tiers_acarreo
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_pickup_locations BEFORE UPDATE ON pickup_locations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_returns BEFORE UPDATE ON returns
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_reviews BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_cart_sessions BEFORE UPDATE ON cart_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_cart_items BEFORE UPDATE ON cart_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_product_stock BEFORE UPDATE ON product_stock
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_product_images BEFORE UPDATE ON product_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_product_tag_mapping BEFORE UPDATE ON product_tag_mapping
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_order_items BEFORE UPDATE ON order_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_return_items BEFORE UPDATE ON return_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_inventory_logs BEFORE UPDATE ON inventory_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_order_status_history BEFORE UPDATE ON order_status_history
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_update_audit_logs BEFORE UPDATE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

--19. Triggers para Auditoría de Stock

CREATE OR REPLACE FUNCTION log_inventory_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- Capturar cambios en quantity o reserved_quantity
    IF TG_OP = 'UPDATE' AND (OLD.quantity <> NEW.quantity OR OLD.reserved_quantity <> NEW.reserved_quantity) THEN
        -- Log para cambio de quantity
        IF OLD.quantity <> NEW.quantity THEN
            INSERT INTO inventory_logs (
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
        
        -- Log para cambio de reserved_quantity
        IF OLD.reserved_quantity <> NEW.reserved_quantity THEN
            INSERT INTO inventory_logs (
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_stock_changes
AFTER UPDATE ON product_stock
FOR EACH ROW EXECUTE FUNCTION log_inventory_movement();

--20. Trigger para Historial de Estado de Órdenes

CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.status <> NEW.status THEN
        INSERT INTO order_status_history (
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_order_status
AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

--21. Función para Reservar Stock

CREATE OR REPLACE FUNCTION public.reserve_stock(
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
    v_available INTEGER;
    v_user_id UUID;
BEGIN
    -- Validar permisos: solo staff o el dueño de la orden
    v_user_id := (SELECT auth.uid());
    
    IF NOT public.is_staff() THEN
        IF NOT EXISTS (SELECT 1 FROM public.orders o WHERE o.id = p_order_id AND o.customer_id = v_user_id) THEN
            RAISE EXCEPTION 'No tienes permisos para reservar stock';
        END IF;
    END IF;
    
    -- Verificar stock disponible
    SELECT (quantity - reserved_quantity) INTO v_available
    FROM public.product_stock
    WHERE variant_id = p_variant_id AND location_id = p_location_id
    FOR UPDATE;
    
    IF v_available IS NULL OR v_available < p_quantity THEN
        RETURN FALSE;
    END IF;
    
    -- Reservar stock
    UPDATE public.product_stock
    SET reserved_quantity = reserved_quantity + p_quantity
    WHERE variant_id = p_variant_id AND location_id = p_location_id;
    
    -- Log
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
        'reservation',
        -p_quantity,
        v_available,
        v_available - p_quantity,
        p_order_id,
        'Stock reservado para orden',
        COALESCE(p_changed_by, v_user_id)
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error reservando stock: %', SQLERRM;
        RETURN FALSE;
END;
$$;

--22. Función para Confirmar Venta (descontar stock)

CREATE OR REPLACE FUNCTION public.confirm_sale(
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
    v_current_qty INTEGER;
    v_user_id UUID;
BEGIN
    -- Validar permisos: solo staff puede confirmar ventas
    IF NOT public.is_staff() THEN
        RAISE EXCEPTION 'Solo el staff puede confirmar ventas';
    END IF;
    
    v_user_id := (SELECT auth.uid());
    
    -- Liberar reserva y descontar del stock real
    UPDATE public.product_stock
    SET 
        quantity = quantity - p_quantity,
        reserved_quantity = reserved_quantity - p_quantity
    WHERE variant_id = p_variant_id AND location_id = p_location_id
    RETURNING quantity INTO v_current_qty;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Log
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
        'sale',
        -p_quantity,
        v_current_qty + p_quantity,
        v_current_qty,
        p_order_id,
        'Venta confirmada',
        COALESCE(p_changed_by, v_user_id)
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error confirmando venta: %', SQLERRM;
        RETURN FALSE;
END;
$$;

--23. Función para Procesar Devolución (reintegrar stock)

CREATE OR REPLACE FUNCTION process_return(
    p_variant_id UUID,
    p_location_id UUID,
    p_quantity INTEGER,
    p_return_id UUID,
    p_changed_by UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_qty INTEGER;
BEGIN
    -- Reintegrar al stock
    UPDATE product_stock
    SET quantity = quantity + p_quantity
    WHERE variant_id = p_variant_id AND location_id = p_location_id
    RETURNING quantity INTO v_current_qty;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Log
    INSERT INTO inventory_logs (
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
$$ LANGUAGE plpgsql;

--24. Trigger para Auto-poblar product_name en order_items

CREATE OR REPLACE FUNCTION trg_populate_order_item_snapshot()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-rellenar product_name si está vacío
    IF NEW.product_name IS NULL OR NEW.product_name = '' THEN
        SELECT p.name INTO NEW.product_name
        FROM products p
        JOIN product_variants pv ON pv.product_id = p.id
        WHERE pv.id = NEW.variant_id;
        
        -- Si no se encuentra, usar valor por defecto
        IF NEW.product_name IS NULL THEN
            NEW.product_name := 'Producto sin nombre';
        END IF;
    END IF;
    
    -- Auto-rellenar unit_price y unit_cost desde variante y producto
    IF NEW.unit_price IS NULL OR NEW.unit_cost IS NULL THEN
        SELECT pv.selling_price, p.cost_price 
        INTO NEW.unit_price, NEW.unit_cost
        FROM products p
        JOIN product_variants pv ON pv.product_id = p.id
        WHERE pv.id = NEW.variant_id;
    END IF;
    
    -- Auto-rellenar puntos_acarreo si es NULL o 0
    IF NEW.puntos_acarreo IS NULL OR NEW.puntos_acarreo = 0 THEN
        SELECT p.puntos_acarreo INTO NEW.puntos_acarreo
        FROM products p
        JOIN product_variants pv ON pv.product_id = p.id
        WHERE pv.id = NEW.variant_id;
        
        NEW.puntos_acarreo := COALESCE(NEW.puntos_acarreo, 0);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_items_snapshot
BEFORE INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION trg_populate_order_item_snapshot();

--25. Trigger para Prevenir Órdenes Vacías

CREATE OR REPLACE FUNCTION trg_prevent_empty_orders()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo validar cuando cambia el estado
    IF NEW.status <> OLD.status AND NEW.status NOT IN ('pending', 'cancelled') THEN
        IF NOT EXISTS (SELECT 1 FROM order_items WHERE order_id = NEW.id) THEN
            RAISE EXCEPTION 'No se puede cambiar estado de orden sin items (orden: %)', NEW.id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_check_items
BEFORE UPDATE ON orders
FOR EACH ROW WHEN (NEW.status IS DISTINCT FROM OLD.status)
EXECUTE FUNCTION trg_prevent_empty_orders();

--26. Trigger para Dirección Default Única

CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se marca como default, desmarcar las demás
    IF NEW.is_default THEN
        UPDATE shipping_addresses 
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_unique_default_address
BEFORE INSERT OR UPDATE ON shipping_addresses
FOR EACH ROW WHEN (NEW.is_default = TRUE)
EXECUTE FUNCTION ensure_single_default_address();

--27. Trigger para Validar Stock al Crear Order Items

CREATE OR REPLACE FUNCTION validate_stock_on_order_item()
RETURNS TRIGGER AS $$
DECLARE
    v_available INTEGER;
    v_location_id UUID;
BEGIN
    -- Obtener location_id de la orden o usar la primera activa
    SELECT stock_location_id INTO v_location_id FROM orders WHERE id = NEW.order_id;
    
    IF v_location_id IS NULL THEN
        SELECT id INTO v_location_id 
        FROM stock_locations 
        WHERE is_active = TRUE 
        LIMIT 1;
    END IF;
    
    IF v_location_id IS NULL THEN
        RAISE EXCEPTION 'No hay ubicaciones de stock activas';
    END IF;
    
    -- Verificar stock disponible
    SELECT (quantity - reserved_quantity) INTO v_available
    FROM product_stock
    WHERE variant_id = NEW.variant_id AND location_id = v_location_id;
    
    IF v_available IS NULL THEN
        RAISE WARNING 'No hay stock configurado para la variante %', NEW.variant_id;
    ELSIF v_available < NEW.quantity THEN
        -- Validación estricta configurable
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_stock_before_order_item
BEFORE INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION validate_stock_on_order_item();

--28. Función de Auditoría Genérica (Opcional)

CREATE OR REPLACE FUNCTION public.generic_audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_record_id UUID;
    v_user_id UUID;
BEGIN
    -- Obtener ID del registro
    IF TG_OP = 'DELETE' THEN
        v_record_id := OLD.id;
    ELSE
        v_record_id := NEW.id;
    END IF;
    
    -- Obtener usuario actual
    v_user_id := (SELECT auth.uid());
    
    -- Insertar en audit_logs
    INSERT INTO public.audit_logs (
        table_name, 
        record_id, 
        action, 
        old_data, 
        new_data,
        changed_by
    ) VALUES (
        TG_TABLE_NAME::VARCHAR,
        v_record_id,
        TG_OP::audit_action,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        v_user_id
    );
    
    RETURN COALESCE(NEW, OLD);
EXCEPTION
    WHEN OTHERS THEN
        -- No fallar la operación principal si falla el audit
        RAISE WARNING 'Error en auditoría genérica: %', SQLERRM;
        RETURN COALESCE(NEW, OLD);
END;
$$;

-- Aplicar a tablas críticas (descomenta las que necesites)
-- CREATE TRIGGER trg_audit_orders AFTER INSERT OR UPDATE OR DELETE ON orders
-- FOR EACH ROW EXECUTE FUNCTION generic_audit_trigger();

-- CREATE TRIGGER trg_audit_payment_proofs AFTER INSERT OR UPDATE OR DELETE ON payment_proofs
-- FOR EACH ROW EXECUTE FUNCTION generic_audit_trigger();

--33. Triggers de Auditoría para Tablas Críticas

-- Auditoría de customers
CREATE TRIGGER trg_audit_customers 
AFTER INSERT OR UPDATE OR DELETE ON customers
FOR EACH ROW EXECUTE FUNCTION generic_audit_trigger();

-- Auditoría de products
CREATE TRIGGER trg_audit_products 
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION generic_audit_trigger();

-- Auditoría de product_stock (CRUCIAL)
CREATE TRIGGER trg_audit_product_stock 
AFTER INSERT OR UPDATE OR DELETE ON product_stock
FOR EACH ROW EXECUTE FUNCTION generic_audit_trigger();

-- Auditoría de orders
CREATE TRIGGER trg_audit_orders 
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION generic_audit_trigger();

-- Auditoría de payment_proofs
CREATE TRIGGER trg_audit_payment_proofs 
AFTER INSERT OR UPDATE OR DELETE ON payment_proofs
FOR EACH ROW EXECUTE FUNCTION generic_audit_trigger();

-- Auditoría de staff_roles (permisos)
CREATE TRIGGER trg_audit_staff_roles 
AFTER INSERT OR UPDATE OR DELETE ON staff_roles
FOR EACH ROW EXECUTE FUNCTION generic_audit_trigger();

--29. Función para Liberar Reservas de Stock

CREATE OR REPLACE FUNCTION release_stock(
    p_variant_id UUID,
    p_location_id UUID,
    p_quantity INTEGER,
    p_order_id UUID,
    p_changed_by UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_reserved INTEGER;
BEGIN
    -- Verificar reserva actual
    SELECT reserved_quantity INTO v_current_reserved
    FROM product_stock
    WHERE variant_id = p_variant_id AND location_id = p_location_id
    FOR UPDATE;
    
    IF v_current_reserved IS NULL OR v_current_reserved < p_quantity THEN
        RETURN FALSE;
    END IF;
    
    -- Liberar reserva
    UPDATE product_stock
    SET reserved_quantity = reserved_quantity - p_quantity
    WHERE variant_id = p_variant_id AND location_id = p_location_id;
    
    -- Log
    INSERT INTO inventory_logs (
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
$$ LANGUAGE plpgsql;

--30. Trigger para Actualizar Subtotal Automáticamente

CREATE OR REPLACE FUNCTION update_order_subtotal()
RETURNS TRIGGER AS $$
DECLARE
    v_order_id UUID;
    v_new_subtotal DECIMAL(12,2);
BEGIN
    -- Obtener order_id
    IF TG_OP = 'DELETE' THEN
        v_order_id := OLD.order_id;
    ELSE
        v_order_id := NEW.order_id;
    END IF;
    
    -- Calcular nuevo subtotal
    SELECT COALESCE(SUM(unit_price * quantity), 0) INTO v_new_subtotal
    FROM order_items
    WHERE order_id = v_order_id;
    
    -- Actualizar orden
    UPDATE orders
    SET subtotal = v_new_subtotal
    WHERE id = v_order_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_subtotal
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW EXECUTE FUNCTION update_order_subtotal();

--31. Trigger para Auto-Liberar Stock al Cancelar

CREATE OR REPLACE FUNCTION auto_release_stock_on_cancel()
RETURNS TRIGGER AS $$
DECLARE
    rec RECORD;
BEGIN
    -- Solo procesar si cambia a cancelled
    IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
        -- Liberar stock de todos los items (usar NEW para ubicación actual)
        FOR rec IN 
            SELECT oi.variant_id, oi.quantity
            FROM order_items oi
            WHERE oi.order_id = NEW.id
        LOOP
            PERFORM release_stock(
                rec.variant_id,
                COALESCE(NEW.stock_location_id, (SELECT id FROM stock_locations WHERE is_active = TRUE LIMIT 1)),
                rec.quantity,
                NEW.id,
                NULL
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_release_stock
AFTER UPDATE ON orders
FOR EACH ROW WHEN (NEW.status = 'cancelled' AND OLD.status IS DISTINCT FROM 'cancelled')
EXECUTE FUNCTION auto_release_stock_on_cancel();

--32. Tabla de Configuración del Sistema

CREATE TABLE system_config (
    key VARCHAR PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuraciones por defecto
INSERT INTO system_config (key, value, description) VALUES 
('shipping.max_free_points', '0'::jsonb, 'Máximo de puntos para envío gratis'),
('stock.enable_reservation', 'true'::jsonb, 'Activar sistema de reservas de stock'),
('orders.min_amount', '0'::jsonb, 'Monto mínimo de orden'),
('retention.audit_logs_days', '730'::jsonb, 'Días a mantener logs de auditoría'),
('retention.inventory_logs_days', '365'::jsonb, 'Días a mantener logs de inventario'),
('retention.cart_sessions_days', '30'::jsonb, 'Días a mantener carritos abandonados')
ON CONFLICT (key) DO NOTHING;

--33. Función de Limpieza Automática de Datos Antiguos

CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
DECLARE
    v_audit_days INTEGER;
    v_inventory_days INTEGER;
    v_cart_days INTEGER;
BEGIN
    -- Obtener configuraciones
    SELECT (value->>0)::INTEGER INTO v_audit_days FROM system_config WHERE key = 'retention.audit_logs_days';
    SELECT (value->>0)::INTEGER INTO v_inventory_days FROM system_config WHERE key = 'retention.inventory_logs_days';
    SELECT (value->>0)::INTEGER INTO v_cart_days FROM system_config WHERE key = 'retention.cart_sessions_days';
    
    -- Limpiar datos antiguos
    DELETE FROM audit_logs WHERE created_at < NOW() - (COALESCE(v_audit_days, 730) || ' days')::INTERVAL;
    DELETE FROM inventory_logs WHERE created_at < NOW() - (COALESCE(v_inventory_days, 365) || ' days')::INTERVAL;
    DELETE FROM cart_sessions WHERE updated_at < NOW() - (COALESCE(v_cart_days, 30) || ' days')::INTERVAL;
    
    RAISE NOTICE 'Limpieza completada: audit_logs (>% días), inventory_logs (>% días), cart_sessions (>% días)', 
        COALESCE(v_audit_days, 730), COALESCE(v_inventory_days, 365), COALESCE(v_cart_days, 30);
END;
$$ LANGUAGE plpgsql;

--34. Función de Métricas Dashboard

CREATE OR REPLACE FUNCTION get_dashboard_metrics(p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    total_orders BIGINT,
    total_revenue DECIMAL,
    pending_orders BIGINT,
    pending_payments BIGINT,
    low_stock_items BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL),
        COALESCE((SELECT SUM(total_amount) FROM orders WHERE status = 'completed' AND created_at >= NOW() - (p_days || ' days')::INTERVAL), 0),
        (SELECT COUNT(*) FROM orders WHERE status IN ('pending', 'processing', 'verified')),
        (SELECT COUNT(*) FROM payment_proofs WHERE status = 'pending'),
        (SELECT COUNT(DISTINCT variant_id) FROM product_stock WHERE (quantity - reserved_quantity) <= 5);
END;
$$ LANGUAGE plpgsql;

--35. Función de Búsqueda Mejorada

CREATE OR REPLACE FUNCTION search_products(search_query TEXT)
RETURNS TABLE (
    product_id UUID,
    product_name VARCHAR,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        GREATEST(
            SIMILARITY(p.name, search_query),
            SIMILARITY(COALESCE(p.description, ''), search_query) * 0.5
        ) as relevance
    FROM products p
    WHERE p.is_active = true
      AND (p.name ILIKE '%' || search_query || '%' 
           OR p.description ILIKE '%' || search_query || '%'
           OR p.sku ILIKE '%' || search_query || '%'
           OR EXISTS (
               SELECT 1 FROM product_tags pt 
               JOIN product_tag_mapping ptm ON pt.id = ptm.tag_id
               WHERE ptm.product_id = p.id AND pt.name ILIKE '%' || search_query || '%'
           ))
    ORDER BY relevance DESC, p.created_at DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

--36. Trigger Prevención Stock Negativo

CREATE OR REPLACE FUNCTION prevent_negative_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantity < 0 THEN
        RAISE EXCEPTION 'Stock no puede ser negativo. Variant: %, Location: %', NEW.variant_id, NEW.location_id;
    END IF;
    IF NEW.reserved_quantity < 0 THEN
        RAISE EXCEPTION 'Reserva no puede ser negativa. Variant: %, Location: %', NEW.variant_id, NEW.location_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_negative_stock
BEFORE UPDATE ON product_stock
FOR EACH ROW EXECUTE FUNCTION prevent_negative_stock();

--37. Índice para Análisis de Margen

-- Optimizar análisis de rentabilidad por orden
CREATE INDEX idx_order_items_order_margin ON order_items(order_id, unit_cost) WHERE unit_cost IS NOT NULL;

-- Nota: Si no usas Supabase/auth.users, descomenta:
-- CREATE SCHEMA IF NOT EXISTS auth;
-- CREATE TABLE IF NOT EXISTS auth.users (id UUID PRIMARY KEY);

-- =========================
-- 38. ROW LEVEL SECURITY (RLS) - HABILITAR EN TODAS LAS TABLAS
-- =========================

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tag_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiers_acarreo ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- =========================
-- 39. POLÍTICAS RLS BÁSICAS (Políticas esenciales - expandir según necesidad)
-- =========================

-- CATÁLOGO: Lectura pública, escritura solo staff
CREATE POLICY "Categories viewable by everyone" ON categories FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Only staff can modify categories" ON categories FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Active products viewable by everyone" ON products FOR SELECT TO authenticated, anon USING (is_active = true AND published = true);
CREATE POLICY "Authenticated can view all products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only staff can modify products" ON products FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Variants of active products viewable" ON product_variants FOR SELECT TO authenticated, anon USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_variants.product_id AND p.is_active = true AND p.published = true));
CREATE POLICY "Authenticated can view all variants" ON product_variants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only staff can modify variants" ON product_variants FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Tags viewable by everyone" ON product_tags FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Only staff can modify tags" ON product_tags FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Product images viewable by everyone" ON product_images FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Only staff can modify images" ON product_images FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Only staff can view/modify stock" ON product_stock FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY "Only staff can view/modify stock locations" ON stock_locations FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- USUARIOS: Solo ven sus propios datos
CREATE POLICY "Users view own profile" ON customers FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);
CREATE POLICY "Staff view all customers" ON customers FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Users insert own profile" ON customers FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);
CREATE POLICY "Users update own profile" ON customers FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
CREATE POLICY "Only staff can delete customers" ON customers FOR DELETE TO authenticated USING (public.is_staff());

CREATE POLICY "Users view own addresses" ON shipping_addresses FOR SELECT TO authenticated USING ((SELECT auth.uid()) = customer_id);
CREATE POLICY "Staff view all addresses" ON shipping_addresses FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Users manage own addresses" ON shipping_addresses FOR ALL TO authenticated USING ((SELECT auth.uid()) = customer_id) WITH CHECK ((SELECT auth.uid()) = customer_id);

-- STAFF: Solo staff puede acceder
CREATE POLICY "Staff view all staff" ON staff FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Only staff can modify staff" ON staff FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY "Staff view all roles" ON staff_roles FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Only staff can modify roles" ON staff_roles FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ÓRDENES: Clientes ven solo las suyas, staff ve todas
CREATE POLICY "Customers view own orders" ON orders FOR SELECT TO authenticated USING ((SELECT auth.uid()) = customer_id);
CREATE POLICY "Staff view all orders" ON orders FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Customers create own orders" ON orders FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = customer_id);
CREATE POLICY "Only staff can update orders" ON orders FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY "Only staff can delete orders" ON orders FOR DELETE TO authenticated USING (public.is_staff());

CREATE POLICY "Customers view own order items" ON order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.customer_id = (SELECT auth.uid())));
CREATE POLICY "Staff view all order items" ON order_items FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Customers insert own order items" ON order_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.customer_id = (SELECT auth.uid())));
CREATE POLICY "Only staff can update order items" ON order_items FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- PAGOS: Muy restrictivo
CREATE POLICY "Customers view own payment proofs" ON payment_proofs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM orders o WHERE o.id = payment_proofs.order_id AND o.customer_id = (SELECT auth.uid())));
CREATE POLICY "Staff view all payment proofs" ON payment_proofs FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Customers insert own payment proofs" ON payment_proofs FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM orders o WHERE o.id = payment_proofs.order_id AND o.customer_id = (SELECT auth.uid())));
CREATE POLICY "Only staff can update payment proofs" ON payment_proofs FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "Payment methods viewable by everyone" ON payment_methods FOR SELECT TO authenticated, anon USING (is_active = true);
CREATE POLICY "Only staff can modify payment methods" ON payment_methods FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ENVÍO: Lectura pública
CREATE POLICY "Shipping tiers viewable by everyone" ON tiers_acarreo FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Only staff can modify tiers" ON tiers_acarreo FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY "Pickup locations viewable by everyone" ON pickup_locations FOR SELECT TO authenticated, anon USING (is_active = true);
CREATE POLICY "Only staff can modify pickup locations" ON pickup_locations FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- CUPONES: Lectura pública de activos
CREATE POLICY "Active coupons viewable by everyone" ON coupons FOR SELECT TO authenticated, anon USING (is_active = true AND valid_from <= NOW() AND valid_until >= NOW());
CREATE POLICY "Staff view all coupons" ON coupons FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Only staff can modify coupons" ON coupons FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- DEVOLUCIONES: Clientes ven solo las suyas
CREATE POLICY "Customers view own returns" ON returns FOR SELECT TO authenticated USING ((SELECT auth.uid()) = customer_id);
CREATE POLICY "Staff view all returns" ON returns FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Customers create own returns" ON returns FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = customer_id);
CREATE POLICY "Only staff can update returns" ON returns FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- REVIEWS Y WISHLISTS
CREATE POLICY "Published reviews viewable by everyone" ON reviews FOR SELECT TO authenticated, anon USING (is_published = true);
CREATE POLICY "Customers view own reviews" ON reviews FOR SELECT TO authenticated USING ((SELECT auth.uid()) = customer_id);
CREATE POLICY "Customers manage own reviews" ON reviews FOR ALL TO authenticated USING ((SELECT auth.uid()) = customer_id) WITH CHECK ((SELECT auth.uid()) = customer_id);

CREATE POLICY "Users view own wishlist" ON wishlists FOR SELECT TO authenticated USING ((SELECT auth.uid()) = customer_id);
CREATE POLICY "Users manage own wishlist" ON wishlists FOR ALL TO authenticated USING ((SELECT auth.uid()) = customer_id) WITH CHECK ((SELECT auth.uid()) = customer_id);

-- CARRITOS: Usuarios ven solo los suyos
CREATE POLICY "Users view own cart sessions" ON cart_sessions FOR SELECT TO authenticated USING ((SELECT auth.uid()) = customer_id);
CREATE POLICY "Users manage own cart sessions" ON cart_sessions FOR ALL TO authenticated USING ((SELECT auth.uid()) = customer_id) WITH CHECK ((SELECT auth.uid()) = customer_id);

-- AUDITORÍA: Solo staff
CREATE POLICY "Only staff can view audit logs" ON audit_logs FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Only staff can view inventory logs" ON inventory_logs FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Only staff can view order history" ON order_status_history FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Only staff can view system config" ON system_config FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Only staff can modify system config" ON system_config FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- =========================
-- FIN DEL SCRIPT
-- =========================
