# Generic SaaS Framework - Database Setup Guide

## 🚀 Quick Setup

### 1. Crear la Base de Datos

```bash
# Opción 1: Usando psql
psql -U postgres -f create-database.sql

# Opción 2: Manualmente
psql -U postgres
CREATE DATABASE galatea;
\c galatea
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
\q
```

### 2. Ejecutar el Schema Setup

```bash
# Crear todas las tablas y datos iniciales
psql -U postgres -d galatea -f database-setup.sql
```

### 3. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env  # o usar tu editor favorito
```

**Mínimo requerido en .env:**
```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/galatea"
JWT_SECRET=genera_un_string_aleatorio_seguro_aqui
JWT_REFRESH_SECRET=genera_otro_string_aleatorio_diferente
REDIS_HOST=localhost
```

### 4. Generar Prisma Client

```bash
# Instalar dependencias
npm install

# Generar el cliente de Prisma
npx prisma generate

# Verificar que Prisma detectó todos los modelos
npx prisma validate
```

### 5. Iniciar Redis

```bash
# Windows (usando Docker)
docker run -d -p 6379:6379 redis:alpine

# Linux/Mac
redis-server

# O usando Docker Compose (si tienes docker-compose.yml)
docker-compose up -d redis
```

### 6. Iniciar la Aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## 🔐 Credenciales por Defecto

```
Email: admin@yoursaas.com
Password: admin123
```

**⚠️ IMPORTANTE:** Cambiar la contraseña inmediatamente:

```sql
-- Generar nuevo hash bcrypt y actualizar
UPDATE "sysUser" 
SET "userPassword" = '$2b$10$TU_NUEVO_HASH_BCRYPT' 
WHERE "userEmail" = 'admin@yoursaas.com';
```

## 📊 Verificar la Instalación

```bash
# Verificar conexión a la base de datos
psql -U postgres -d galatea -c "SELECT COUNT(*) FROM \"sysUser\";"

# Debe retornar: 1 (el usuario admin)

# Verificar tablas creadas
psql -U postgres -d galatea -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"

# Verificar permisos creados
psql -U postgres -d galatea -c "SELECT COUNT(*) FROM permission_definition;"

# Debe retornar: 50+ permisos
```

## 🔧 Comandos Útiles

### Database Management

```bash
# Backup completo
pg_dump -U postgres galatea > backup_$(date +%Y%m%d).sql

# Restore desde backup
psql -U postgres galatea < backup_20260111.sql

# Limpiar y recrear
psql -U postgres -f create-database.sql
psql -U postgres -d galatea -f database-setup.sql
```

### Prisma Commands

```bash
# Ver el estado actual
npx prisma studio

# Generar migraciones (si usas Prisma Migrate)
npx prisma migrate dev --name init

# Sincronizar sin migraciones
npx prisma db push

# Resetear completamente
npx prisma migrate reset
```

### Docker Commands (si usas Docker)

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Recrear todo
docker-compose down -v
docker-compose up -d --build
```

## 📋 Estructura de Tablas Creadas

### Core (15 tablas)
- `sysUser`, `role`, `user_status`
- `user_sessions`, `api_keys`
- Location: `country`, `state`, `city`

### Permissions (10 tablas)
- `permission_definition`
- `role_permissions`
- `user_permissions`
- `user_denied_permissions`
- `permission_conditions`
- `policies`, `policy_rules`
- `audit_permission_log`

### Payments (5 tablas)
- `paymentType`, `paymentStatus`, `transactionStatus`
- `transaction`
- `stripe_connect_accounts`

### Security (3 tablas)
- `rate_limit_log`
- `ip_whitelist`, `ip_blacklist`

### AI Agents (4 tablas)
- `agent`, `agent_status`
- `agent_version`
- `role_has_agent_version`

### Communications (4 tablas)
- `messaging`, `messagelogs`
- `webhook_logs`, `webhook_idempotency`
- `websocket_connections`

### Configuration (2 tablas)
- `feature_flags`
- `audit_deletions`

**Total: ~45 tablas core del framework**

## 🎯 Datos Iniciales (Seed Data)

El script crea automáticamente:

### Roles
- Admin (prioridad: 100)
- Manager (prioridad: 50)
- User (prioridad: 25)
- Guest (prioridad: 10)

### Permisos (50+)
- users:* (create, read, update, delete, list)
- roles:* (create, read, update, delete, list, assign)
- permissions:* (create, read, update, delete, list, assign)
- records:* (create, read, update, delete, list, export, import)
- config:* (read, update)
- reports:* (create, read, export, list)
- contacts:* (create, read, update, delete, list)
- transactions:* (create, read, update, list, refund)
- agents:* (read, list, execute)
- audit:* (read, list)
- system:* (config, health, cache:clear)

### Estados
- User Status: Active, Inactive, Suspended
- Agent Status: Active, Inactive, Testing
- Payment Types: Credit Card, Debit Card, Cash, Bank Transfer, Stripe, PayPal
- Payment Status: Pending, Completed, Failed, Refunded, Canceled
- Transaction Status: Pending, Processing, Completed, Failed, Canceled

### Ubicaciones de Ejemplo
- Country: United States, United Kingdom, Canada
- States: California, Texas, Ontario
- Cities: San Francisco, Los Angeles, Austin, Toronto

### Feature Flags
- enable_ai_features: TRUE
- enable_advanced_analytics: FALSE
- enable_export_pdf: TRUE
- enable_webhooks: TRUE

### Usuario Admin
- Email: admin@yoursaas.com
- Password: admin123
- Role: Admin
- Status: Active

## 🛠️ Troubleshooting

### Error: "database does not exist"
```bash
psql -U postgres -f create-database.sql
```

### Error: "extension does not exist"
```bash
psql -U postgres -d galatea
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### Error: "relation already exists"
```bash
# Limpiar base de datos
psql -U postgres -d galatea -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Volver a ejecutar
psql -U postgres -d galatea -f database-setup.sql
```

### Error: "Prisma Client not generated"
```bash
npx prisma generate --force
```

### Error: "Redis connection refused"
```bash
# Windows/Mac/Linux con Docker
docker run -d -p 6379:6379 redis:alpine

# Verificar
redis-cli ping
# Debe retornar: PONG
```

## 🔄 Migración desde Sistema Antiguo

Si tienes un sistema de restaurantes existente y quieres migrar:

1. **Backup de datos antiguos:**
```bash
pg_dump -U postgres old_database > old_backup.sql
```

2. **Crear nueva estructura:**
```bash
psql -U postgres -f create-database.sql
psql -U postgres -d galatea -f database-setup.sql
```

3. **Script de migración personalizado:**
Necesitarás crear un script que mapee tus tablas antiguas al nuevo schema genérico. Ver `database-business-example-restaurant.sql` para referencia.

## 📚 Próximos Pasos

1. ✅ Base de datos creada
2. ✅ Tablas configuradas
3. ✅ Datos iniciales cargados
4. ⏭️ Configurar variables de entorno
5. ⏭️ Cambiar contraseña de admin
6. ⏭️ Crear tus modelos de negocio específicos
7. ⏭️ Definir permisos personalizados
8. ⏭️ Desarrollar tu aplicación

## 📞 Soporte

Para más información, revisa:
- `README-FRAMEWORK.md` - Documentación completa del framework
- `database-business-example-restaurant.sql` - Ejemplo de extensión
- `docs/` - Documentación técnica adicional

---

**¡Tu framework SaaS genérico está listo para usar! 🚀**
