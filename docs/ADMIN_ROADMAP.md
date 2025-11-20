# 🗺️ Roadmap de Desarrollo - Panel Administrativo (Admin)

Este documento detalla el estado actual del desarrollo del panel administrativo (`apps/admin`) y las funcionalidades faltantes necesarias para completar la versión 1.0, basado en el esquema de base de datos y los requerimientos del negocio.

**Última actualización:** 20 de Noviembre, 2025

---

## 📊 Estado Actual

El panel administrativo se encuentra en una fase **inicial**. La infraestructura base está lista, pero la mayoría de los módulos de negocio aún no tienen interfaz de usuario.

### ✅ Implementado
*   **Infraestructura**:
    *   Autenticación (Login/Logout) con Supabase Auth.
    *   Layout principal (Sidebar, Header, Modo Oscuro).
    *   Configuración de Tailwind v4 con diseño Apple-style.
    *   Configuración de ESLint y TypeScript estricto.
*   **Productos (`/products`)**:
    *   Listado básico de productos.
    *   Creación de productos simples (Nombre, Precio, Costo, Puntos de Acarreo).
    *   **Soporte de Variantes**: Creación y edición de variantes (`product_variants`).
    *   **Gestión de Stock**: Asignación de stock inicial (`product_stock`).
*   **Configuración (`/settings`)**:
    *   Gestión de costos de envío por "Tiers" (`/settings/shipping`).
    *   **Gestión de Staff**: ABM de usuarios y roles (`/settings/staff`).
    *   **Gestión de Órdenes**: Listado, detalle y cambio de estados (`/orders`).
    *   **Verificación de Pagos**: Validación de comprobantes en detalle de orden.
    *   **Gestión de Clientes**: Listado y detalle de clientes (`/customers`).
    *   **Logística y Agencias**: Gestión de `pickup_locations` y `stock_locations` (`/settings/locations`).
    *   **Dashboard Principal**: KPIs, Gráficos de ingresos y ventas recientes (`/`).
    *   **Auditoría**: Visor de logs de seguridad y trazabilidad (`/settings/audit`).

---

## 🚧 Funcionalidades Faltantes (Prioridad Alta)

Estas son las características críticas que bloquean el lanzamiento operativo del sistema.

*(Sección vacía - Funcionalidades críticas completadas)*

---

## 📋 Funcionalidades Faltantes (Prioridad Media)

Necesarias para una operación fluida pero no bloqueantes para el "Happy Path" inicial.

*(Sección vacía - Funcionalidades de prioridad media completadas)*

---

## 💾 Contexto de Base de Datos (Tablas sin UI)

Las siguientes tablas existen en `migration/SQL OFICIAL.sql` pero no tienen ninguna interfaz en el Admin:

*(Todas las tablas principales tienen UI)*

---

## 👣 Siguientes Pasos Recomendados

1.  **QA Final**: Pruebas exhaustivas de flujo completo.
2.  **Despliegue**: Preparación para producción.
