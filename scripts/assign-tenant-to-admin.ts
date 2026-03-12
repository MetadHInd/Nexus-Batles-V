#!/usr/bin/env ts-node
/**
 * 🔧 Script para asignar tenant al usuario admin
 * 
 * Uso: npx ts-node scripts/assign-tenant-to-admin.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignTenantToAdmin() {
  try {
    console.log('🔍 Buscando usuario admin...');
    
    const admin = await prisma.sysUser.findFirst({
      where: { userEmail: 'admin@yoursaas.com' },
    });

    if (!admin) {
      console.error('❌ Usuario admin no encontrado');
      return;
    }

    console.log(`✅ Usuario admin encontrado (ID: ${admin.idsysUser})\n`);

    console.log('🏢 Obteniendo tenants disponibles...');
    const tenants = await prisma.tenants.findMany({
      where: { is_active: true },
    });

    if (tenants.length === 0) {
      console.error('❌ No hay tenants disponibles. Ejecuta create-initial-tenants.ts primero.');
      return;
    }

    console.log(`📋 Encontrados ${tenants.length} tenants:\n`);

    for (const tenant of tenants) {
      console.log(`🔧 Asignando tenant: ${tenant.name} (${tenant.slug})...`);

      // Verificar si ya está asignado
      const existing = await prisma.user_tenants.findUnique({
        where: {
          user_id_tenant_id: {
            user_id: admin.idsysUser,
            tenant_id: tenant.id,
          },
        },
      });

      if (existing) {
        console.log(`   ⚠️  Ya asignado`);
        continue;
      }

      // Asignar tenant al admin (el primero será el default)
      const isDefault = tenants[0].id === tenant.id;
      
      await prisma.user_tenants.create({
        data: {
          user_id: admin.idsysUser,
          tenant_id: tenant.id,
          is_default: isDefault,
          role_in_tenant: 'admin',
          is_active: true,
        },
      });

      console.log(`   ✅ Asignado ${isDefault ? '(DEFAULT)' : ''}`);
      console.log(`   🔑 Tenant Sub: ${tenant.tenant_sub}`);
    }

    console.log('\n✅ Tenants asignados exitosamente al usuario admin!');
    console.log('\n📝 Ahora puedes hacer login y seleccionar el tenant');
    console.log('   Email: admin@yoursaas.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

assignTenantToAdmin();
