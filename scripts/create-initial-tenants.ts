#!/usr/bin/env ts-node
/**
 * 🔧 Script para crear tenants iniciales
 * 
 * Uso: npx ts-node scripts/create-initial-tenants.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createInitialTenants() {
  try {
    console.log('🏢 Creando tenants iniciales...\n');
    
    const tenants = [
      {
        slug: 'development',
        name: 'Development Environment',
        description: 'Tenant para desarrollo y testing',
        is_active: true,
        metadata: { environment: 'dev', maxUsers: 100 }
      },
      {
        slug: 'production',
        name: 'Production Environment',
        description: 'Tenant para producción',
        is_active: true,
        metadata: { environment: 'prod', maxUsers: 1000 }
      },
      {
        slug: 'demo',
        name: 'Demo Tenant',
        description: 'Tenant para demostraciones',
        is_active: true,
        metadata: { environment: 'demo', maxUsers: 50 }
      }
    ];

    for (const tenantData of tenants) {
      // Verificar si ya existe
      const exists = await prisma.tenants.findUnique({
        where: { slug: tenantData.slug },
      });

      if (exists) {
        console.log(`⚠️  Tenant '${tenantData.slug}' ya existe (tenant_sub: ${exists.tenant_sub})`);
        continue;
      }

      // Crear tenant
      const tenant = await prisma.tenants.create({
        data: tenantData,
      });

      console.log(`✅ Tenant creado: ${tenant.slug}`);
      console.log(`   📧 Name: ${tenant.name}`);
      console.log(`   🔑 Tenant Sub: ${tenant.tenant_sub}`);
      console.log(`   🏷️  Slug: ${tenant.slug}`);
      console.log('');
    }

    console.log('\n✅ Tenants iniciales creados exitosamente!');
    console.log('\n📝 Recuerda usar el tenant_sub en el header:');
    console.log('   x-tenant-sub: <UUID del tenant>');

  } catch (error) {
    console.error('❌ Error al crear tenants:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createInitialTenants();
