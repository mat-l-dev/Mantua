# Guía de migración para `SQL OFICIAL`

Este repositorio contiene dos piezas clave:

1. **`SQL OFICIAL.sql`**: el script completo que crea todas las tablas, funciones, triggers e índices necesarios para el flujo de ecommerce (productos, usuarios, órdenes, auditoría, stock y métricas).
2. **`SQL OFICIAL manual.sql`**: un complemento que documenta tareas manuales y configuraciones (buckets de Supabase Storage, registros de proveedores de email, etc.) que no se pueden automatizar totalmente con SQL.

## ¿Qué hace el SQL principal?
- **Extensiones y ENUMs**: carga `pgcrypto`, `pg_trgm` y define 15 tipos enumerados que modelan estados de orden, métodos de pago, tipos de documento, motivos de devolución, movimientos de stock y acciones de auditoría.
- **Catálogo e inventario**: incluye `categories`, `products`, `product_variants`, `stock_locations`, `product_stock`, `product_images`, `tags` y su relación con productos. Todos los precios y cantidades tienen restricciones (`CHECK`) para evitar valores negativos.
- **Usuarios y staff**: se apoya en `auth.users` (Supabase) y añade perfiles (`customers`, `staff`), direcciones, roles con permisos JSONB y triggers para mantener consistencia.
- **Órdenes, pagos y postventa**: modela `orders`, `order_items`, comprobantes de pago, cupones, devoluciones, reseñas, wishlists y carritos persistentes. Tiene columnas generadas (`total_amount`) y triggers que mantienen subtotal, stock y auditoría.
- **Auditoría y utilidades**: crea `order_status_history`, `inventory_logs`, `audit_logs`, además de funciones para recalcular envíos, reservas/confirmaciones de stock, limpieza de datos antiguos y métricas.
- **Índices y triggers**: incluye 67 índices (GIN, compuestos, parciales) y 35 triggers para `updated_at`, validación de stock, auditoría y liberaciones automáticas.

## ¿Para qué sirve el SQL manual?
El archivo `SQL OFICIAL manual.sql` no se ejecuta como un conjunto de comandos; contiene:
- Comentarios con pasos manuales para crear buckets de Supabase Storage desde el panel, CLI o API.
- Sentencias de ejemplo para registrar nombres de buckets, claves de Resend u otros proveedores en `system_config`.
- Recordatorios para revisar políticas de acceso, metadata adicional y tareas operativas que siempre serán manuales.

Usá ese archivo como checklist antes de desplegar en producción.

## Buckets de Supabase y herramientas auxiliares
- **Supabase CLI** (`supabase`): es open source y gratuito; autentica con las credenciales de tu proyecto y ejecuta comandos como `supabase storage bucket create <nombre>`. Solo genera costos en la factura si excedes los límites del plan (el plan Starter ya incluye muchos GB de almacenamiento y transferencias). Puedes usar el CLI tanto en el flujo local como en CI.
- **MCP** (el CLI o helper que uses con tu equipo): si te referís a `mcp` como herramienta propia del proyecto, también aprovecha los mismos proyectos y claves. No hay costos añadidos por usar la herramienta, solo el consumo de Supabase.
- **Limitación SQL**: como ya se menciona en el archivo manual, Supabase no tiene sintaxis `CREATE BUCKET` que puedas correr dentro de `SQL OFICIAL.sql`. Por eso el bucket se debe crear manualmente (dashboard o CLI/API) y luego registrar su nombre/URL en `system_config` o en otra tabla que uses en la aplicación.

## ¿Qué hacer después de ejecutar el SQL?
1. Cargar datos base: productos, variantes, ubicaciones de stock, tiers de envío y al menos un stock_location activo.
2. Probar flujos críticos: carrito → orden → comprobante → cálculo de envío → reserva/confirmación → cancelación → liberación de stock.
3. Revisar las tablas de auditoría (`inventory_logs`, `order_status_history`, `audit_logs`) para asegurarte de que capturan la información esperada.
4. Crear el bucket desde el panel o el CLI (`supabase storage bucket create ...`), luego ejecutar las sentencias de `SQL OFICIAL manual.sql` para registrar sus datos y cualquier credencial de Resend.