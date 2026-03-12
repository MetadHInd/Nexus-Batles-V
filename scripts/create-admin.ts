#!/usr/bin/env ts-node
/**
 * 🔧 Script para crear usuario admin
 * 
 * Uso: npx ts-node scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔍 Verificando si el usuario admin existe...');
    
    const existingAdmin = await prisma.sysUser.findFirst({
      where: { userEmail: 'admin@yoursaas.com' },
    });

    if (existingAdmin) {
      console.log('⚠️  Usuario admin ya existe. Actualizando contraseña...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.sysUser.update({
        where: { idsysUser: existingAdmin.idsysUser },
        data: { 
          userPassword: hashedPassword,
          is_active: true,
        },
      });
      
      console.log('✅ Contraseña actualizada correctamente');
      console.log('📧 Email: admin@yoursaas.com');
      console.log('🔑 Password: admin123');
      return;
    }

    console.log('📝 Creando usuario admin...');

    // Buscar o crear rol Admin
    let adminRole = await prisma.role.findFirst({
      where: { rolename: 'Admin' },
    });

    if (!adminRole) {
      console.log('🎭 Creando rol Admin...');
      adminRole = await prisma.role.create({
        data: {
          rolename: 'Admin',
          description: 'Administrator role with full access',
          priority: 100,
          tenant_ids: ['development'],
        },
      });
    }

    // Buscar o crear estado Active
    let activeStatus = await prisma.user_status.findFirst({
      where: { description: 'Active' },
    });

    if (!activeStatus) {
      console.log('📊 Creando estado Active...');
      activeStatus = await prisma.user_status.create({
        data: {
          description: 'Active',
          tenant_ids: ['development'],
        },
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Crear usuario admin
    const admin = await prisma.sysUser.create({
      data: {
        userEmail: 'admin@yoursaas.com',
        userPassword: hashedPassword,
        userName: 'Admin',
        userLastName: 'User',
        role_idrole: adminRole.idrole,
        user_status_iduser_status: activeStatus.iduser_status,
        is_active: true,
        tenant_ids: ['development'],
      },
    });

    console.log('✅ Usuario admin creado exitosamente!');
    console.log('📧 Email: admin@yoursaas.com');
    console.log('🔑 Password: admin123');
    console.log(`👤 ID: ${admin.idsysUser}`);

  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
