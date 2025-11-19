# 📚 Documentación Mantua

> Ecommerce B2C de conectividad rural: Starlink, kits solares, baterías

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
