# 🏰 MANTUA - Ecommerce Industrial para Perú

**Versión:** 1.0 - Fase Admin en Desarrollo  
**Stack:** Next.js 15 (App Router) + Supabase + Turborepo + Tailwind CSS v4  
**Objetivo:** Venta de infraestructura tecnológica pesada (Starlink, Paneles Solares, Baterías) con pasarela de pago manual

---

## 🎯 Visión del Proyecto

Mantua es un ecommerce **híbrido industrial** diseñado específicamente para el mercado peruano de productos de alta tecnología y gran tamaño.

### El Problema que Resolvemos

1. **Carga Pesada**: No puedes enviar un panel solar de 50kg por Olva Courier estándar
2. **Logística Peruana**: Necesitas agencias de carga (Shalom, Marvisur) o fletes dedicados
3. **Desconfianza en Pagos Online**: Los clientes prefieren Yape/Plin y enviar comprobantes
4. **Montos Altos**: Compras de S/ 3,000+ requieren validación manual de pago

### La Solución

- **Sistema de Puntos de Acarreo**: Abstracción del costo logístico (0-100 puntos por producto)
- **Pasarela Manual**: Upload de comprobantes de pago + validación por staff
- **Cálculo Regional**: Diferenciación automática entre Lima/Callao y Provincia
- **Reserva de Stock**: Sistema inteligente que congela inventario durante validación

---

## 🚀 Quick Start

### Prerequisitos

```bash
Node.js 18+
pnpm 8+
Supabase CLI (opcional para desarrollo local)
```

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/mat-l-dev/Mantua.git
cd Mantua/mantua

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp apps/admin/.env.example apps/admin/.env.local
cp apps/storefront/.env.example apps/storefront/.env.local

# Ejecutar migraciones de base de datos
# Ver migration/SQL OFICIAL.sql - ejecutar en Supabase Dashboard

# Iniciar desarrollo
pnpm dev
```

### URLs Locales

- **Admin**: http://localhost:3000
- **Storefront**: http://localhost:3001

---

## 📦 Estructura del Monorepo

```
mantua/
├── apps/
│   ├── admin/              # Dashboard administrativo
│   │   ├── src/
│   │   │   ├── app/(dashboard)/
│   │   │   │   ├── products/   # CRUD Productos ✅
│   │   │   │   ├── orders/     # Gestión de órdenes
│   │   │   │   └── settings/   # Configuración tiers
│   │   │   ├── actions/        # Server Actions
│   │   │   ├── components/     # UI Components
│   │   │   └── lib/            # Utilidades
│   │   └── package.json
│   │
│   └── storefront/         # Tienda pública
│       ├── src/
│       │   ├── app/(shop)/
│       │   ├── app/(checkout)/
│       │   └── lib/
│       └── package.json
│
├── packages/
│   ├── shared/             # Código compartido
│   │   ├── types/          # database.types.ts
│   │   ├── constants/      # Enums
│   │   └── utils/          # formatCurrency
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/
│
└── migration/              # SQL
    ├── SQL OFICIAL.sql     # Schema completo
    ├── RLS_POLICIES.sql
    └── FIXES_SECURITY.sql
```

---

## 🧠 Conceptos Clave

### 1. Sistema de Puntos de Acarreo

Abstracción del costo logístico:

| Producto | Puntos | Justificación |
|----------|--------|---------------|
| Chip SIM | 0 | Digital/liviano |
| Starlink Kit | 10 | Caja mediana |
| Panel Solar | 50 | Carga pesada |

**Fórmula:**
```typescript
const tier = buscarTier(producto.puntos_acarreo, region);
costoEnvio += tier.costo * producto.cantidad;
```

### 2. Modalidades de Envío

**Lima/Callao**: Directo a domicilio, costo ajustable  
**Provincia**: Hasta agencia origen + flete **PAGO EN DESTINO**

### 3. Flujo de Pago

1. Cliente sube comprobante → Orden PENDING
2. Stock RESERVADO automáticamente
3. Staff valida → VERIFIED (descuenta) o REJECTED (libera)

---

## 🎨 Diseño

### Filosofía Apple Minimalista

- Colores: Negro, Blanco, Zinc
- Tipografía: Geist Sans
- Iconos: Lucide React
- Animaciones: ease-apple (300ms)

---

## 📊 Estado del Proyecto

### ✅ Completado

- [x] Turborepo configurado
- [x] Base de datos (30+ tablas)
- [x] Autenticación Supabase
- [x] Dashboard layout
- [x] **CRUD de Productos** con puntos de acarreo

### 🚧 En Desarrollo

- [ ] Upload de imágenes
- [ ] CRUD de Tiers
- [ ] Panel de órdenes
- [ ] Validación de comprobantes

### ⏳ Pendiente

- [ ] Storefront completo
- [ ] Checkout con voucher
- [ ] Carrito (Zustand)

---

## 📚 Documentación

- **[ARQUITECTURA.md](./ARQUITECTURA.md)** - Estructura técnica y base de datos
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guía de desarrollo
- **[migration/README.md](../migration/README.md)** - Guía de base de datos

---

## 🐛 Troubleshooting

```bash
# Reconstruir workspace
pnpm install --force

# Regenerar tipos
npx supabase gen types typescript --project-id <id> > packages/shared/src/types/database.types.ts

# Limpiar caché
pnpm turbo clean && rm -rf node_modules .turbo && pnpm install
```

---

**Última actualización:** Noviembre 2025  
**Equipo Mantua** 🇵🇪

