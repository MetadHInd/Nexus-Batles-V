#!/usr/bin/env ts-node
/**
 * 🔧 Script para asignar rol ADMIN (id=2) al usuario admin
 * 
 * Uso: npx ts-node scripts/fix-admin-role.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAdminRole() {
  try {
    console.log('🔍 Buscando usuario admin...');
    
    const admin = await prisma.sysUser.findFirst({
      where: { userEmail: 'admin@yoursaas.com' },
      include: { role: true },
    });

    if (!admin) {
      console.log('❌ Usuario admin no encontrado');
      return;
    }

    console.log(`📧 Admin encontrado: ${admin.userEmail}`);
    console.log(`🎭 Rol actual: ${admin.role?.rolename || 'N/A'} (ID: ${admin.role_idrole})`);

    // Buscar o crear rol Admin con idrole = 2
    let adminRole = await prisma.role.findUnique({
      where: { idrole: 2 },
    });

    if (!adminRole) {
      console.log('🎭 Creando rol Admin con ID 2...');
      adminRole = await prisma.role.create({
        data: {
          idrole: 2,
          rolename: 'Admin',
          description: 'Administrator role with full system access',
          priority: 100,
          tenant_ids: ['development', 'production', 'demo'],
        },
      });
    } else {
      console.log(`✅ Rol Admin (ID: 2) ya existe: ${adminRole.rolename}`);
    }

    // Actualizar usuario admin
    if (admin.role_idrole !== 2) {
      console.log('🔄 Actualizando rol del admin a ADMIN (ID: 2)...');
      
      await prisma.sysUser.update({
        where: { idsysUser: admin.idsysUser },
        data: { 
          role_idrole: 2,
        },
      });
      
      console.log('✅ Rol actualizado correctamente');
    } else {
      console.log('✅ Admin ya tiene el rol correcto');
    }

    console.log('');
    console.log('🎉 Configuración completada:');
    console.log('📧 Email: admin@yoursaas.com');
    console.log('🔑 Password: admin123');
    console.log('🎭 Rol: ADMIN (ID: 2)');

  } catch (error) {
    console.error('❌ Error al actualizar rol:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminRole();
