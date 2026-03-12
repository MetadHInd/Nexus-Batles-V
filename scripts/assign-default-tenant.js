/**
 * Script para asignar tenant por defecto al usuario admin
 * Ejecutar: node scripts/assign-default-tenant.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function assignDefaultTenant() {
  try {
    console.log('🏢 Asignando tenant por defecto al usuario admin...\n');

    // 1. Buscar usuario admin
    const adminUser = await prisma.sysUser.findFirst({
      where: {
        userEmail: 'admin@yoursaas.com',
      },
    });

    if (!adminUser) {
      console.error('❌ Usuario admin no encontrado');
      process.exit(1);
    }

    console.log(`✅ Usuario encontrado: ${adminUser.userName} (ID: ${adminUser.idsysUser})`);

    // 2. Buscar o crear tenant por defecto
    let defaultTenant = await prisma.tenants.findFirst({
      where: {
        slug: 'default',
      },
    });

    if (!defaultTenant) {
      console.log('📝 Creando tenant por defecto...');
      defaultTenant = await prisma.tenants.create({
        data: {
          slug: 'default',
          name: 'Default Tenant',
          description: 'Tenant por defecto del sistema',
          is_active: true,
        },
      });
      console.log(`✅ Tenant creado: ${defaultTenant.name} (UUID: ${defaultTenant.tenant_sub})`);
    } else {
      console.log(`✅ Tenant encontrado: ${defaultTenant.name} (UUID: ${defaultTenant.tenant_sub})`);
    }

    // 3. Verificar si ya existe la asignación
    const existingAssignment = await prisma.user_tenants.findUnique({
      where: {
        user_id_tenant_id: {
          user_id: adminUser.idsysUser,
          tenant_id: defaultTenant.id,
        },
      },
    });

    if (existingAssignment) {
      console.log('⚠️  El usuario ya tiene asignado este tenant');
      
      // Actualizar para asegurar que está activo y por defecto
      await prisma.user_tenants.update({
        where: {
          user_id_tenant_id: {
            user_id: adminUser.idsysUser,
            tenant_id: defaultTenant.id,
          },
        },
        data: {
          is_default: true,
          is_active: true,
          role_in_tenant: 'SUPER_ADMIN',
        },
      });
      
      console.log('✅ Asignación actualizada (activa y por defecto)');
    } else {
      // 4. Crear asignación
      console.log('📝 Creando asignación usuario-tenant...');
      await prisma.user_tenants.create({
        data: {
          user_id: adminUser.idsysUser,
          tenant_id: defaultTenant.id,
          is_default: true,
          is_active: true,
          role_in_tenant: 'SUPER_ADMIN',
          assigned_by: adminUser.idsysUser,
        },
      });
      console.log('✅ Asignación creada exitosamente');
    }

    // 5. Verificar resultado
    const userWithTenants = await prisma.sysUser.findUnique({
      where: { idsysUser: adminUser.idsysUser },
      include: {
        user_tenants: {
          include: {
            tenants: true,
          },
        },
      },
    });

    console.log('\n📊 Resumen:');
    console.log(`   Usuario: ${userWithTenants.userName} ${userWithTenants.userLastName}`);
    console.log(`   Email: ${userWithTenants.userEmail}`);
    console.log(`   UUID: ${userWithTenants.uuid}`);
    console.log(`   Tenants asignados: ${userWithTenants.user_tenants.length}`);
    
    if (userWithTenants.user_tenants.length > 0) {
      console.log('\n   Tenants:');
      userWithTenants.user_tenants.forEach((ut) => {
        console.log(`   - ${ut.tenants.name} (${ut.tenants.tenant_sub})`);
        console.log(`     Rol: ${ut.role_in_tenant || 'N/A'}`);
        console.log(`     Por defecto: ${ut.is_default ? 'Sí' : 'No'}`);
        console.log(`     Activo: ${ut.is_active ? 'Sí' : 'No'}`);
      });
    }

    console.log('\n✅ Proceso completado exitosamente');
    console.log('🔄 Reinicia el servidor para que los cambios surtan efecto\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

assignDefaultTenant();
