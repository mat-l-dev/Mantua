# 📚 Documentación Mantua

> Ecommerce B2C de conectividad rural: Starlink, kits solares, baterías

## 🎨 Apple Design System (NEW!)

Ver carpeta [`apple-design-system/`](./apple-design-system/):
- **OVERVIEW.md** - Guía rápida del sistema
- **SYSTEM.md** - Especificación de diseño (colores, tipografía, tokens)
- **IMPLEMENTATION.md** - Qué fue implementado (Phases 1-3)
- **PHASE4.md** - Cómo aplicar cambios a más páginas

**Resumen:** Apple Design System está 100% implementado (Phases 1-3). Phase 4 lista para integrar en todas las páginas.

---

## 📊 Estado Actual del Proyecto

### [STATUS.md](./STATUS.md) 📈 (NEW!)
**Estado completo del Apple Design System**
- Phases 1-3 completadas ✅
- Archivos implementados y ubicaciones
- Próximos pasos (Phase 4)
- Documentación desactualizada vs actualizada

**Cuándo leer:** Primero, para entender qué está hecho

---

### [STRUCTURE_ANALYSIS.md](./STRUCTURE_ANALYSIS.md) 🔍 (NEW!)
**Análisis de estructura de páginas**
- Cómo funciona cada page (Orders, Products, Customers)
- Qué cambios son seguros
- Qué cambios rompen todo
- Checklist de seguridad

**Cuándo leer:** Antes de modificar páginas en Phase 4

---

## 📖 Documentos Esenciales

### [README.md](./README.md) 🚀
**Visión general y Quick Start**
- ¿Qué es Mantua?
- Instalación rápida
- Estructura del monorepo
- Conceptos clave (Puntos de Acarreo, Pago Manual)
- Estado del proyecto

**Cuándo leer:** Primero, para entender el proyecto completo

---

### [ARQUITECTURA.md](./ARQUITECTURA.md) 🏗️
**Arquitectura técnica completa**
- Database Schema (30+ tablas con diagramas)
- Flujos de datos (Orders, Payments, Stock)
- Triggers y funciones SQL
- RLS Policies
- Patrones de código (Server Actions, Client Components)
- Integración Supabase

**Cuándo leer:** Para implementar features, entender data flows, debugging

---

### [DEVELOPMENT.md](./DEVELOPMENT.md) 💻
**Guía del desarrollador**
- Setup del entorno (pnpm, Supabase, env vars)
- Convenciones de código (TypeScript, React, CSS)
- Estructura de carpetas detallada
- Comandos útiles (dev, build, lint, migrate)
- Troubleshooting (errores comunes + soluciones)
- Deploy (Vercel)

**Cuándo leer:** Para desarrollar, resolver errores, deployment

---

### [database.md](./database.md) 🗄️
**Guía de base de datos**
- Setup inicial (Supabase Dashboard o CLI)
- Ubicación de scripts SQL (migration/)
- Tablas principales
- Regenerar tipos TypeScript
- Variables de entorno
- Datos de prueba
- Troubleshooting SQL

**Cuándo leer:** Para setup DB, migrations, debugging SQL

---

## 📂 Archivos SQL

Ver carpeta: **[migration/](../migration/)**

```
migration/
├── SQL OFICIAL.sql         # Schema completo (30+ tablas, triggers, indexes)
├── RLS_POLICIES.sql        # Row Level Security policies
├── FIXES_SECURITY.sql      # Parches de seguridad
└── README.md               # Guía detallada de migrations
```

---

## 🎯 Flujo de Lectura Recomendado

### Para nuevos desarrolladores:
1. **README.md** - Entender qué es el proyecto
2. **DEVELOPMENT.md** - Setup del entorno
3. **database.md** - Configurar Supabase
4. **ARQUITECTURA.md** - Estudiar patrones y schema

### Para implementar features:
1. **ARQUITECTURA.md** - Revisar data flow y patrones
2. **DEVELOPMENT.md** - Seguir convenciones
3. **database.md** - Si necesitas cambios en DB

### Para debugging:
1. **DEVELOPMENT.md** - Sección Troubleshooting
2. **database.md** - Si el error es SQL
3. **ARQUITECTURA.md** - Entender el flow completo

### Para AI Context:
- Leer los 4 archivos principales en orden
- Revisar migration/SQL OFICIAL.sql para schema completo
- Ver ejemplos de código en ARQUITECTURA.md

---

**Última actualización:** Noviembre 2025
