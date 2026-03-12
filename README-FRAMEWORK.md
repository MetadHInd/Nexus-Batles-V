# Generic SaaS Multi-Tenant Framework

## 🎯 Overview

This is a **fully generic multi-tenant SaaS framework** built with NestJS, PostgreSQL, Prisma, and Redis. It provides a complete foundation for building any type of business application without being tied to a specific industry or domain.

## ✨ Features

### Core Framework Components

- **Multi-Tenancy**: Full multi-tenant architecture with `tenant_ids` arrays
- **Authentication & Authorization**:
  - JWT-based authentication
  - API key support
  - Session management with refresh tokens
  - RBAC (Role-Based Access Control)
  - ABAC (Attribute-Based Access Control)
  - PBAC (Policy-Based Access Control)
- **Payment Processing**: Generic transaction system with Stripe integration
- **AI Agents**: Pluggable AI agent system with versioning
- **Messaging**: Multi-channel messaging (SMS, Email, WhatsApp, Push)
- **Webhooks**: Webhook system with idempotency
- **WebSockets**: Real-time communication support
- **Feature Flags**: Dynamic feature targeting
- **Security**:
  - Rate limiting
  - IP whitelisting/blacklisting
  - Audit logging
  - Permission tracking
- **Caching**: Redis-based caching with tenant isolation

### Permission System

The framework includes an advanced permission system with:

- **15+ permission tables** (permission_definition, role_permissions, user_permissions, policies, etc.)
- **Hierarchical roles** (Admin → Manager → User → Guest)
- **Scoped permissions** (system, tenant, organization, team, user, resource)
- **Permission conditions** (ABAC - attribute-based rules)
- **Policy rules** (PBAC - complex policy evaluation)
- **Permission auditing** (complete audit trail)

## 📁 Database Schema

### Core Tables (Generic)

**Users & Auth:**
- `sysUser` - System users
- `user_sessions` - JWT session management
- `api_keys` - API key authentication
- `role` - Roles with hierarchy
- `user_status` - User statuses

**Permissions (15 tables):**
- `permission_definition` - Permission definitions
- `role_permissions` - Role to permission mapping
- `user_permissions` - Direct user permissions
- `user_denied_permissions` - Explicit denials
- `permission_conditions` - ABAC conditions
- `policies` - Policy definitions
- `policy_rules` - Policy rules
- `audit_permission_log` - Permission audit trail

**Payments & Transactions:**
- `transaction` - Generic transactions
- `paymentType` - Payment types
- `paymentStatus` - Payment statuses
- `transactionStatus` - Transaction statuses
- `stripe_connect_accounts` - Stripe Connect accounts

**Messaging:**
- `messaging` - Generic message logs
- `messagelogs` - Email/SMS/Push logs

**AI Agents:**
- `agent` - AI agents
- `agent_version` - Agent versions
- `agent_status` - Agent statuses
- `role_has_agent_version` - Access control

**Webhooks & WebSockets:**
- `webhook_logs` - Webhook processing logs
- `webhook_idempotency` - Duplicate prevention
- `websocket_connections` - Active WebSocket connections

**Security:**
- `rate_limit_log` - Rate limiting tracking
- `ip_whitelist` - Allowed IPs
- `ip_blacklist` - Blocked IPs

**Audit:**
- `audit_permission_log` - Permission checks
- `audit_deletions` - Deleted records

**Configuration:**
- `feature_flags` - Feature flags with targeting
- `country`, `state`, `city` - Location data

### ❌ Removed (Business-Specific)

The following restaurant-specific tables have been **completely removed**:

- `restaurant`, `branch`, `menu`, `order`
- `item`, `category`, `dietary_restriction`
- `customer`, `delivery`, `provider`
- All restaurant-specific enums and business logic

These can be found in `database-business-example-restaurant.sql` as a reference for extending the framework.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
psql -U postgres -f database-setup.sql

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma db push

# Start Redis
redis-server

# Start development server
npm run start:dev
```

### Default Credentials

```
Email: admin@yoursaas.com
Password: admin123
```

**⚠️ IMPORTANT:** Change the admin password immediately in production!

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/your_db"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# Google Cloud Storage (optional)
GCS_BUCKET_NAME=app-uploads
GCS_UPLOAD_PATH=uploads
GCS_PROJECT_ID=your-project-id
GCS_CREDENTIALS_PATH=./credentials.json

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twilio (optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# App Config
APP_NAME=YourSaaS
APP_PORT=3000
NODE_ENV=development
```

### Multi-Tenancy Setup

1. **Using Headers:**
```typescript
// In your HTTP requests, include:
headers: {
  'x-tenant-id': 'your-tenant-id'
}
```

2. **Automatic Filtering:**
```typescript
// Prisma middleware automatically filters by tenant_ids
// No manual filtering needed in most queries
const users = await prisma.sysUser.findMany(); // Auto-filtered by tenant
```

3. **System Tables:**
```typescript
// Bypass tenant filtering for system tables
const allCountries = await prisma.country.findMany(); // Not filtered
```

## 📚 How to Extend for Your Business

### Step 1: Define Your Domain Models

Create Prisma schema for your business:

```prisma
// schema.prisma

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  sku         String   @unique
  metadata    Json?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  tenant_ids  String[] @default(["development"])
  
  @@index([tenant_ids])
}

model Invoice {
  id             Int      @id @default(autoincrement())
  invoice_number String   @unique
  customer_id    Int
  total          Decimal  @db.Decimal(10, 2)
  status         String
  due_date       DateTime
  metadata       Json?
  created_at     DateTime @default(now())
  tenant_ids     String[] @default(["development"])
  
  @@index([tenant_ids])
  @@index([customer_id])
}
```

### Step 2: Add Custom Permissions

```sql
INSERT INTO permission_definition (code, resource, action, scope, level, description) VALUES
  ('products:create', 'products', 'create', null, 'tenant', 'Create products'),
  ('products:read', 'products', 'read', null, 'tenant', 'View products'),
  ('products:update', 'products', 'update', null, 'tenant', 'Update products'),
  ('products:delete', 'products', 'delete', null, 'tenant', 'Delete products'),
  ('invoices:create', 'invoices', 'create', null, 'tenant', 'Create invoices'),
  ('invoices:read', 'invoices', 'read', null, 'tenant', 'View invoices');
```

### Step 3: Create NestJS Modules

```typescript
// src/modules/products/products.module.ts
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

// src/modules/products/products.service.ts
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  
  // Tenant filtering is automatic!
  async findAll() {
    return this.prisma.product.findMany();
  }
  
  async create(data: CreateProductDto) {
    return this.prisma.product.create({ data });
  }
}
```

### Step 4: Use Permission Guards

```typescript
// src/modules/products/products.controller.ts
@Controller('products')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  
  @Get()
  @RequirePermissions('products:read')
  findAll() {
    return this.productsService.findAll();
  }
  
  @Post()
  @RequirePermissions('products:create')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }
}
```

## 🔐 Permission Examples

### Check Permission Programmatically

```typescript
const hasPermission = await permissionService.checkPermission(
  userId,
  'products:create',
  { tenantId: 'tenant-123' }
);

if (!hasPermission) {
  throw new ForbiddenException('Insufficient permissions');
}
```

### Assign Permission to Role

```typescript
await prisma.role_permissions.create({
  data: {
    role_id: managerRoleId,
    permission_id: productCreatePermissionId,
    granted_by: adminUserId,
  },
});
```

### Grant User-Specific Permission

```typescript
await prisma.user_permissions.create({
  data: {
    user_id: userId,
    permission_id: permissionId,
    resource_id: 'product-123', // Optional: specific resource
    expires_at: new Date('2024-12-31'), // Optional: temporary
  },
});
```

## 🎯 Use Cases

This framework can be used for:

- **Accounting/Financial Apps** - Invoices, expenses, reports
- **CRM Systems** - Contacts, leads, opportunities
- **ERP Systems** - Inventory, orders, suppliers
- **Project Management** - Tasks, projects, teams
- **E-commerce Platforms** - Products, orders, customers
- **Healthcare Apps** - Patients, appointments, records
- **Education Platforms** - Students, courses, grades
- **Any Multi-Tenant SaaS** - The framework is domain-agnostic!

## 📖 API Documentation

Once running, visit:

- Swagger UI: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/health`

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔍 Monitoring

### Check Permission Audit Logs

```sql
SELECT * FROM audit_permission_log 
WHERE user_id = 1 
ORDER BY created_at DESC 
LIMIT 50;
```

### Check Active Sessions

```sql
SELECT * FROM user_sessions 
WHERE is_active = true 
AND expires_at > NOW();
```

### Monitor Rate Limiting

```sql
SELECT * FROM rate_limit_log 
WHERE is_blocked = true 
ORDER BY window_start DESC;
```

## 🛠️ Maintenance

### Clear Expired Sessions

```sql
DELETE FROM user_sessions 
WHERE expires_at < NOW();
```

### Vacuum Database

```sql
VACUUM ANALYZE;
```

### Clear Cache

```bash
npm run cache:clear
```

## 📝 Architecture

```
backend/
├── src/
│   ├── modules/           # Business modules (add yours here)
│   │   ├── user-profile/
│   │   ├── users/
│   │   └── [your-modules]/
│   ├── shared/
│   │   ├── cache/         # Redis caching
│   │   ├── config/        # Configuration
│   │   ├── core/          # Core services
│   │   │   ├── tenant-validator/
│   │   │   └── schema-context/
│   │   ├── database/      # Prisma service
│   │   ├── enums/         # Generic enums
│   │   ├── guards/        # Auth guards
│   │   ├── integrations/  # External services
│   │   │   ├── authorization/
│   │   │   ├── payments/
│   │   │   ├── twilio/
│   │   │   └── google-cloud-storage/
│   │   └── services/
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma      # Extend with your models
├── database-setup.sql     # Generic core schema
├── database-business-example-restaurant.sql  # Restaurant example
└── README.md
```

## 🤝 Contributing

This is a generic framework. To contribute:

1. Keep changes domain-agnostic
2. Use generic naming (records, contacts, transactions)
3. Add new features as optional modules
4. Document extension points
5. Maintain backward compatibility

## 📄 License

MIT

## 🆘 Support

For questions or issues:

1. Check `docs/` folder for detailed guides
2. Review `database-business-example-restaurant.sql` for extension examples
3. Open an issue on GitHub

## ⚠️ Security Notes

- **Change default admin password** immediately
- Use strong JWT secrets (minimum 256 bits)
- Enable HTTPS in production
- Set up proper CORS configuration
- Review and adjust rate limits
- Enable IP whitelisting for admin endpoints
- Regular security audits recommended
- Keep dependencies updated

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Change default admin credentials
- [ ] Set strong JWT secrets
- [ ] Configure proper CORS
- [ ] Set up database backups
- [ ] Configure Redis persistence
- [ ] Enable SSL/TLS
- [ ] Set up monitoring (Prometheus, Grafana, etc.)
- [ ] Configure logging (Winston, Sentry, etc.)
- [ ] Test rate limiting
- [ ] Review permission definitions
- [ ] Set up CI/CD pipeline
- [ ] Load testing

### Recommended Stack

- **Database**: PostgreSQL 14+ (RDS, Cloud SQL, etc.)
- **Cache**: Redis 6+ (ElastiCache, Redis Cloud, etc.)
- **Hosting**: Docker + Kubernetes, Google Cloud Run, AWS ECS
- **CDN**: CloudFlare, AWS CloudFront
- **Monitoring**: Datadog, New Relic, Prometheus
- **Logging**: ELK Stack, CloudWatch, Stackdriver

---

**Built with ❤️ using NestJS, Prisma, PostgreSQL, and Redis**

For business-specific implementation example, see: [database-business-example-restaurant.sql](./database-business-example-restaurant.sql)
