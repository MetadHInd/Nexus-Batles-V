/**
 * Script para asignar un tenant a un usuario
 * 
 * Uso:
 * npx ts-node scripts/assign-tenant-to-user.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignTenantToUser() {
  try {
    const userEmail = 'test@ejemplo.com'; // Cambia esto por el email de tu usuario

    console.log(`🔍 Buscando usuario: ${userEmail}`);

    // Buscar usuario
    const user = await prisma.sysUser.findUnique({
      where: { userEmail },
    });

    if (!user) {
      console.error(`❌ Usuario no encontrado: ${userEmail}`);
      return;
    }

    console.log(`✅ Usuario encontrado: ID ${user.idsysUser}`);

    // Buscar o crear tenant "development"
    let tenant = await prisma.tenants.findFirst({
      where: { slug: 'development' },
    });

    if (!tenant) {
      console.log('📝 Creando tenant "development"...');
      tenant = await prisma.tenants.create({
        data: {
          slug: 'development',
          name: 'Development',
          is_active: true,
        },
      });
    }

    console.log(`✅ Tenant encontrado/creado: ${tenant.slug} (ID: ${tenant.tenant_sub})`);

    // Verificar si ya existe la relación
    const existingRelation = await prisma.user_tenants.findFirst({
      where: {
        user_id: user.idsysUser,
        tenant_id: tenant.tenant_sub,
      },
    });

    if (existingRelation) {
      console.log('✅ El usuario ya tiene este tenant asignado');
      return;
    }

    // Asignar tenant al usuario
    await prisma.user_tenants.create({
      data: {
        user_id: user.idsysUser,
        tenant_id: tenant.tenant_sub,
        is_default: true,
        is_active: true,
      },
    });

    console.log('🎉 ¡Tenant asignado exitosamente!');
    console.log(`   Usuario: ${userEmail}`);
    console.log(`   Tenant: ${tenant.name} (${tenant.slug})`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignTenantToUser();
