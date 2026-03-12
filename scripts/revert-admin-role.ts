#!/usr/bin/env ts-node
/**
 * 🔧 Script para revertir rol del admin a ID=1
 * 
 * Uso: npx ts-node backend/scripts/revert-admin-role.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function revertAdminRole() {
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
    console.log(`🎭 Rol actual: ID ${admin.role_idrole}`);

    // Asegurarse de que existe el rol Admin con ID=1
    let adminRole = await prisma.role.findUnique({
      where: { idrole: 1 },
    });

    if (!adminRole) {
      console.log('🎭 Creando rol Admin con ID=1...');
      adminRole = await prisma.role.create({
        data: {
          idrole: 1,
          rolename: 'Admin',
          description: 'Administrator role - Highest level access',
          priority: 1,
          tenant_ids: ['development', 'production', 'demo'],
        },
      });
    } else {
      console.log(`✅ Rol con ID=1 existe: ${adminRole.rolename}`);
      // Actualizar nombre si es necesario
      if (adminRole.rolename !== 'Admin') {
        await prisma.role.update({
          where: { idrole: 1 },
          data: { 
            rolename: 'Admin',
            description: 'Administrator role - Highest level access',
            priority: 1,
          },
        });
        console.log('✅ Rol actualizado a "Admin"');
      }
    }

    // Actualizar usuario admin para que tenga role_idrole = 1
    if (admin.role_idrole !== 1) {
      console.log('🔄 Actualizando rol del admin a ID=1...');
      
      await prisma.sysUser.update({
        where: { idsysUser: admin.idsysUser },
        data: { 
          role_idrole: 1,
        },
      });
      
      console.log('✅ Rol actualizado correctamente');
    } else {
      console.log('✅ Admin ya tiene role_idrole = 1');
    }

    console.log('');
    console.log('🎉 Configuración completada:');
    console.log('📧 Email: admin@yoursaas.com');
    console.log('🔑 Password: admin123');
    console.log('🎭 Rol: ADMIN (ID: 1)');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

revertAdminRole();
