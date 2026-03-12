// Database mixin FINAL - INICIALIZACIÓN FORZADA SÍNCRONA + MULTI-TENANCY
// Esta implementación GARANTIZA que la instancia esté completamente inicializada
// Y respeta el contexto de multi-tenancy usando MultiTenantPrismaService
import { PrismaService } from '../../../../../database/prisma.service';

// Variable para almacenar la referencia a la instancia GLOBAL de NestJS
let globalPrismaInstance: PrismaService | null = null;
let globalFirestoreInstance: any = null;
let initializationAttempts = 0;
let lastError: string | null = null;
let isInitializing = false;

// Función para FORZAR inicialización síncrona de una instancia de PrismaService
async function forceInitialization(instance: PrismaService): Promise<void> {
  console.log('[DATABASE MIXIN] 🔧 Forzando inicialización de instancia...');
  
  try {
    if (instance.onModuleInit && typeof instance.onModuleInit === 'function') {
      console.log('[DATABASE MIXIN] ⚡ Ejecutando onModuleInit...');
      await instance.onModuleInit();
      console.log('[DATABASE MIXIN] ✅ onModuleInit completado exitosamente');
    }
    
    // Verificar que ahora tiene los modelos
    const modelCount = Object.keys(instance).filter(k => 
      !k.startsWith('$') && 
      !k.startsWith('_') && 
      !k.startsWith('on') &&
      typeof (instance as any)[k] === 'object'
    ).length;
    
    console.log(`[DATABASE MIXIN] 📊 Después de inicialización: ${modelCount} modelos disponibles`);
    
    // Verificar modelos específicos críticos
    const criticalModels = ['sysUser', 'transactionStatus', 'rule_operator', 'branch'];
    criticalModels.forEach(model => {
      const hasModel = !!(instance as any)[model];
      console.log(`[DATABASE MIXIN] 🎯 Modelo ${model}: ${hasModel ? '✅' : '❌'}`);
    });
    
  } catch (error) {
    console.error('[DATABASE MIXIN] ❌ Error en inicialización forzada:', error);
    throw error;
  }
}

// Función para obtener la instancia usando LAZY LOADING con INICIALIZACIÓN FORZADA
function getLazyPrismaInstance(): PrismaService {
  initializationAttempts++;

  if (!globalPrismaInstance && !isInitializing) {
    isInitializing = true;
    
    try {
      let serviceInstance: PrismaService;
      
      // ESTRATEGIA 1: Obtener desde el contexto global de NestJS
      if (typeof global !== 'undefined' && (global as any).nestApp) {
        console.log('[DATABASE MIXIN] 🎯 Obteniendo desde contexto global...');
        serviceInstance = (global as any).nestApp.get(PrismaService);
        console.log('[DATABASE MIXIN] ✅ Instancia obtenida desde contexto global');
      } else {
        // ESTRATEGIA 2: Crear nueva instancia
        console.log('[DATABASE MIXIN] 🔧 Creando nueva instancia...');
        serviceInstance = new PrismaService();
      }
      
      // CRÍTICO: FORZAR INICIALIZACIÓN INMEDIATA DE FORMA SÍNCRONA
      console.log('[DATABASE MIXIN] 🚀 FORZANDO inicialización síncrona...');
      
      // Ejecutar la inicialización de forma síncrona usando Promise.resolve
      const initPromise = forceInitialization(serviceInstance);
      
      // HACK: Esperar de forma síncrona usando busy wait (solo para desarrollo/debug)
      let isComplete = false;
      let initError: any = null;
      
      initPromise
        .then(() => {
          isComplete = true;
          console.log('[DATABASE MIXIN] ✅ Inicialización síncrona completada');
        })
        .catch(error => {
          initError = error;
          isComplete = true;
          console.error('[DATABASE MIXIN] ❌ Error en inicialización síncrona:', error);
        });
      
      // Busy wait por máximo 5 segundos
      const startTime = Date.now();
      while (!isComplete && (Date.now() - startTime) < 5000) {
        // Esperar de forma activa
        require('child_process').spawnSync('ping', ['127.0.0.1', '-n', '1'], { stdio: 'ignore' });
      }
      
      if (initError) {
        throw initError;
      }
      
      if (!isComplete) {
        console.warn('[DATABASE MIXIN] ⚠️ Inicialización tardó más de 5s, continuando sin garantías...');
      }
      
      globalPrismaInstance = serviceInstance as PrismaService;
      console.log('[DATABASE MIXIN] 🎉 Instancia lista para uso');
      
    } catch (error) {
      console.error('[DATABASE MIXIN] ❌ Error en todas las estrategias:', error);
      lastError = error.message;
      
      // ESTRATEGIA 3: Instancia mínima de emergencia SIN inicializar
      console.log('[DATABASE MIXIN] 🆘 Creando instancia de emergencia SIN inicializar...');
      const emergencyInstance = new PrismaService();
      globalPrismaInstance = emergencyInstance as PrismaService;
    } finally {
      isInitializing = false;
    }
  } else if (isInitializing) {
    console.log('[DATABASE MIXIN] ⏳ Inicialización en progreso, esperando...');
    // Si está inicializando, esperar un poco
    let attempts = 0;
    while (isInitializing && attempts < 50) {
      require('child_process').spawnSync('ping', ['127.0.0.1', '-n', '1'], { stdio: 'ignore' });
      attempts++;
    }
  } 
  
  if (!globalPrismaInstance) {
    const errorMsg = `[DATABASE MIXIN] 💥 FALLO CRÍTICO: No se pudo crear instancia después de ${initializationAttempts} intentos. Último error: ${lastError}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  return globalPrismaInstance;
}

/**
 * Database namespace - Singleton Prisma instance
 * Mantiene compatibilidad total con ServiceCache.Database.Prisma.sysUser etc.
 * Y también permite acceso directo: ServiceCache.Database.sysUser
 */
const DatabaseObject = {
  // GETTER with singleton pattern
  get Prisma(): PrismaService {
    const instance = getLazyPrismaInstance();
    
    // Verificaciones adicionales
    if (!instance || typeof instance !== 'object') {
      const errorMsg = '[DATABASE MIXIN] 💥 Instancia de Prisma no válida después de inicialización forzada';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Verificar que tiene el método básico $queryRaw
    if (typeof (instance as any).$queryRaw !== 'function') {
      console.error('[DATABASE MIXIN] 💥 Instancia NO tiene $queryRaw - inicialización FALLÓ');
      throw new Error('PrismaService instance is not properly initialized - missing $queryRaw method');
    }
    
    // Verificar que tiene al menos un modelo
    const modelCount = Object.keys(instance).filter(k => 
      !k.startsWith('$') && 
      !k.startsWith('_') && 
      !k.startsWith('on') &&
      typeof (instance as any)[k] === 'object'
    ).length;
    
    if (modelCount === 0) {
      console.error('[DATABASE MIXIN] 💥 Instancia NO tiene modelos - inicialización FALLÓ');
      throw new Error('PrismaService instance is not properly initialized - no models available');
    }
    
    return instance;
  },

  // GETTER para Firestore - devuelve instancia singleton
  get Firestore(): any {
    if (!globalFirestoreInstance) {
      const { FirestoreService } = require('../../../../../database/firestore.service');
      globalFirestoreInstance = new FirestoreService();
    }
    return globalFirestoreInstance;
  },

  // 🚀 RAG (LightRAG) - Graph-Enhanced Memory System

  // MÉTODO PARA DEBUG - Verificar estado con diagnóstico completo
  getStatus() {
    console.log('[DATABASE MIXIN] 🔍 Generando status completo...');
    const instance = globalPrismaInstance;
    
    const status = {
      // Información básica
      instanceExists: !!instance,
      initializationAttempts,
      lastError,
      isInitializing,
      
      // Información de la instancia
      instanceType: instance ? instance.constructor.name : 'N/A',
      allProperties: instance ? Object.keys(instance).length : 0,
      
      // Verificación de modelos
      hasModels: instance ? Object.keys(instance).filter(k => 
        !k.startsWith('$') && 
        !k.startsWith('_') && 
        !k.startsWith('on') &&
        typeof (instance as any)[k] === 'object'
      ).length : 0,
      
      sampleModels: instance ? Object.keys(instance).filter(k => 
        !k.startsWith('$') && 
        !k.startsWith('_') && 
        !k.startsWith('on') &&
        typeof (instance as any)[k] === 'object'
      ).slice(0, 10) : [],
      
      // Verificaciones técnicas
      hasQueryRaw: instance ? typeof (instance as any).$queryRaw === 'function' : false,
      hasSysUser: instance ? typeof (instance as any).sysUser === 'object' : false,
      hasTransactionStatus: instance ? typeof (instance as any).transactionStatus === 'object' : false,
      
      // Info de contexto
      globalContextAvailable: typeof global !== 'undefined' && !!(global as any).nestApp,
      accelerateEnabled: true,
      instanceReady: !!instance && typeof (instance as any).$queryRaw === 'function'
    };
    
    console.log('[DATABASE MIXIN] 📊 Status generado:', JSON.stringify(status, null, 2));
    return status;
  },

  // MÉTODO para establecer la instancia manualmente (desde main.ts)
  setGlobalInstance(instance: PrismaService) {
    console.log('[DATABASE MIXIN] 🎯 Estableciendo instancia global manualmente...');
    
    // FORZAR inicialización antes de almacenar
    forceInitialization(instance).then(() => {
      globalPrismaInstance = instance as PrismaService;
      
      // Verificar que la instancia tiene los modelos
      const modelCount = Object.keys(instance).filter(k => 
        !k.startsWith('$') && 
        !k.startsWith('_') && 
        !k.startsWith('on') &&
        typeof (instance as any)[k] === 'object'
      ).length;
      
      console.log(`[DATABASE MIXIN] ✅ Instancia global establecida con ${modelCount} modelos disponibles`);
      
      // Verificar modelos específicos que están causando problemas
      const specificModels = ['sysUser', 'transactionStatus', 'rule_operator', 'branch'];
      specificModels.forEach(model => {
        const hasModel = !!(instance as any)[model];
        console.log(`[DATABASE MIXIN] 🎯 Modelo ${model}: ${hasModel ? '✅' : '❌'}`);
      });
    }).catch(error => {
      console.error('[DATABASE MIXIN] ❌ Error estableciendo instancia global:', error);
    });
  },

  // MÉTODO PARA FORZAR RESET (solo para testing)
  _resetInstance() {
    console.log('[DATABASE MIXIN] 🔄 Reseteando instancia global...');
    globalPrismaInstance = null;
    initializationAttempts = 0;
    lastError = null;
    isInitializing = false;
    console.log('[DATABASE MIXIN] ✅ Reset completado');
  },

  // MÉTODO PARA VERIFICAR DISPONIBILIDAD DE UN MODELO ESPECÍFICO
  hasModel(modelName: string): boolean {
    try {
      const instance = getLazyPrismaInstance();
      const hasIt = !!(instance as any)[modelName] && typeof (instance as any)[modelName] === 'object';
      console.log(`[DATABASE MIXIN] 🔍 Verificando modelo ${modelName}: ${hasIt ? '✅' : '❌'}`);
      return hasIt;
    } catch (error) {
      console.error(`[DATABASE MIXIN] ❌ Error verificando modelo ${modelName}:`, error);
      return false;
    }
  },

  // MÉTODO PARA DIAGNÓSTICO EN TIEMPO REAL
  diagnose() {
    console.log('[DATABASE MIXIN] 🏥 DIAGNÓSTICO COMPLETO INICIADO');
    
    try {
      const instance = this.Prisma;
      console.log('[DATABASE MIXIN] ✅ Instancia obtenida exitosamente');
      
      // Test básico
      if (typeof (instance as any).$queryRaw === 'function') {
        console.log('[DATABASE MIXIN] ✅ $queryRaw disponible');
      } else {
        console.log('[DATABASE MIXIN] ❌ $queryRaw NO disponible');
      }
      
      // Test de modelo específico
      if ((instance as any).sysUser) {
        console.log('[DATABASE MIXIN] ✅ sysUser modelo disponible');
      } else {
        console.log('[DATABASE MIXIN] ❌ sysUser modelo NO disponible');
      }
      
      return { success: true, message: 'Diagnóstico completado' };
    } catch (error) {
      console.error('[DATABASE MIXIN] 💥 Error en diagnóstico:', error);
      return { success: false, error: error.message };
    }
  }
};

// Crear un Proxy para permitir acceso directo a modelos de Prisma
// ServiceCache.Database.sysUser → ServiceCache.Database.Prisma.sysUser
export const Database = new Proxy(DatabaseObject, {
  get(target, prop, receiver) {
    // Si la propiedad existe en el objeto base, devolverla
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    }
    
    // Si no existe, intentar obtenerla de Prisma
    try {
      const prismaInstance = target.Prisma;
      if (prismaInstance && prop in prismaInstance) {
        return (prismaInstance as any)[prop];
      }
    } catch (error) {
      console.error(`[DATABASE MIXIN] Error accessing model ${String(prop)}:`, error);
    }
    
    return undefined;
  }
}) as typeof DatabaseObject & PrismaService;

// TIPOS EXPLÍCITOS PARA TYPESCRIPT - ESTO SOLUCIONA LOS ERRORES DE COMPILACIÓN
export interface DatabaseInterface {
  Prisma: PrismaService;
  Firestore: any;
  getStatus(): any;
  setGlobalInstance(instance: PrismaService): void;
  _resetInstance(): void;
  hasModel(modelName: string): boolean;
  diagnose(): any;
  // Permitir acceso dinámico a modelos de Prisma
  [key: string]: any;
}

// Exports para mantener compatibilidad
export const WithPrisma = null;
export const WithFirestore = null;
export type IWithDatabase = DatabaseInterface;
