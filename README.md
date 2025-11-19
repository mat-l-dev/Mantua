🏰 Proyecto MANTUA - Contexto Técnico Maestro

Propósito: Documento fuente de verdad para el desarrollo del Ecommerce Mantua.
Estado: 🟡 Fase 1: Construcción del Admin Panel (Login completado, Dashboard pendiente).
Tech Stack: Next.js 15, Supabase (SSR), Turborepo, Shadcn/UI, Zustand.

1. 🎯 Visión del Proyecto

Ecommerce especializado en venta de equipos tecnológicos de gran tamaño (Starlink, Kits Solares) en Perú.

Modelo de Venta: Pasarela de Pago Manual (Subida de voucher Yape/Plin/BCP).

Logística: Cálculo de envíos basado en "Esfuerzo Logístico" (Puntos) debido a la carga pesada.

2. 🏗️ Arquitectura (Monorepo)

mantua/
├── apps/
│   ├── 🛍️ storefront/   (La Tienda - Puerto 3000)
│   │   ├── src/actions  (Lógica de Checkout y Envíos)
│   │   └── src/lib      (Zustand Store, Clientes Supabase)
│   └── 🔐 admin/        (El Panel - Puerto 3001)
│       ├── src/actions  (Gestión de Órdenes y Productos)
│       └── src/app      (Dashboard Protegido)
└── packages/
    └── 📦 shared/       (Lógica Compartida)
        ├── types/       (database.types.ts - Generado de SQL)
        ├── constants/   (Enums: Payment Methods, Order Status)
        └── utils/       (Format Currency: S/ PEN)


3. 🧠 Reglas de Negocio (Core)

A. Logística: Sistema de "Puntos de Acarreo"

No usamos APIs de courier tradicionales.

Lógica: Cada producto tiene puntos_acarreo (int).

Fórmula de Costo: El sistema suma el costo por producto linealmente.

Costo Total = Σ (Tier del Producto × Cantidad)

Escenarios:

Provincia: El costo cobrado es el traslado a la agencia (Shalom/Marvisur). El flete real es Pago en Destino.

Lima/Callao: El costo es una tarifa plana sugerida (Indrive/Motorizado), editable manualmente por el Admin al procesar la orden.

B. Flujo de Pago Manual

Cliente hace checkout -> Orden estado pending.

Cliente sube foto del voucher -> Orden estado processing.

Admin verifica foto en Dashboard -> Orden estado verified (Resta Stock) o rejected.

C. Autenticación Híbrida

Supabase Auth: Maneja el login seguro.

Trigger SQL (handle_new_user): Sincroniza automáticamente cada registro de auth.users a la tabla pública customers para poder asociarle órdenes.

4. ✅ Estado Actual del Desarrollo

Infraestructura & Configuración

[x] Monorepo Turborepo inicializado (pnpm workspaces).

[x] Shadcn/UI configurado en ambas apps (Themes: New York).

[x] Paquete @mantua/shared operativo y linkeado.

[x] Clientes Supabase SSR (client.ts, server.ts, middleware.ts) creados.

Base de Datos (Supabase)

[x] Schema SQL completo (products, orders, tiers_acarreo, etc.).

[x] Políticas RLS (Seguridad Row Level) activas.

[x] Trigger de Auth (public.customers) activo.

[x] Ajuste: Función SQL de envío antigua eliminada en favor de cálculo en TypeScript.

Aplicación: Admin Panel

[x] Estructura de rutas ((auth), (dashboard)).

[x] Módulo de Login completo (UI + Server Action).

[x] Validación con Zod.

[ ] Pendiente: Página Principal (Dashboard Metrics).

Aplicación: Storefront

[x] Lógica de Cálculo de Envíos (calculate-shipping.ts) creada.

[ ] Pendiente: Home Page y Catálogo visual.

5. 📝 Roadmap (Siguientes Pasos)

Dashboard Home (admin): Crear la vista principal con métricas vacías (para tener a dónde llegar tras el login).

Gestor de Productos (admin): CRUD para crear items y asignarles sus Puntos de Acarreo.

Configuración de Tiers (admin): Interfaz para definir cuánto cuesta cada tramo de puntos.

Catálogo Público (storefront): Mostrar los productos reales de la BD.

6. 🤖 Instrucciones para IAs Colaboradoras

"Al generar código para Mantua:

Usa Next.js 15 Server Actions para mutaciones.

Respeta la estructura de carpetas src/.

Importa tipos desde @mantua/shared.

La lógica de envíos reside en apps/storefront/actions/checkout, no en la BD."