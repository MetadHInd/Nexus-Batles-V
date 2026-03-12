"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithFirestore = exports.WithPrisma = exports.Database = void 0;
const prisma_service_1 = require("../../../../../database/prisma.service");
let globalPrismaInstance = null;
let globalFirestoreInstance = null;
let initializationAttempts = 0;
let lastError = null;
let isInitializing = false;
async function forceInitialization(instance) {
    console.log('[DATABASE MIXIN] 🔧 Forzando inicialización de instancia...');
    try {
        if (instance.onModuleInit && typeof instance.onModuleInit === 'function') {
            console.log('[DATABASE MIXIN] ⚡ Ejecutando onModuleInit...');
            await instance.onModuleInit();
            console.log('[DATABASE MIXIN] ✅ onModuleInit completado exitosamente');
        }
        const modelCount = Object.keys(instance).filter(k => !k.startsWith('$') &&
            !k.startsWith('_') &&
            !k.startsWith('on') &&
            typeof instance[k] === 'object').length;
        console.log(`[DATABASE MIXIN] 📊 Después de inicialización: ${modelCount} modelos disponibles`);
        const criticalModels = ['sysUser', 'transactionStatus', 'rule_operator', 'branch'];
        criticalModels.forEach(model => {
            const hasModel = !!instance[model];
            console.log(`[DATABASE MIXIN] 🎯 Modelo ${model}: ${hasModel ? '✅' : '❌'}`);
        });
    }
    catch (error) {
        console.error('[DATABASE MIXIN] ❌ Error en inicialización forzada:', error);
        throw error;
    }
}
function getLazyPrismaInstance() {
    initializationAttempts++;
    if (!globalPrismaInstance && !isInitializing) {
        isInitializing = true;
        try {
            let serviceInstance;
            if (typeof global !== 'undefined' && global.nestApp) {
                console.log('[DATABASE MIXIN] 🎯 Obteniendo desde contexto global...');
                serviceInstance = global.nestApp.get(prisma_service_1.PrismaService);
                console.log('[DATABASE MIXIN] ✅ Instancia obtenida desde contexto global');
            }
            else {
                console.log('[DATABASE MIXIN] 🔧 Creando nueva instancia...');
                serviceInstance = new prisma_service_1.PrismaService();
            }
            console.log('[DATABASE MIXIN] 🚀 FORZANDO inicialización síncrona...');
            const initPromise = forceInitialization(serviceInstance);
            let isComplete = false;
            let initError = null;
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
            const startTime = Date.now();
            while (!isComplete && (Date.now() - startTime) < 5000) {
                require('child_process').spawnSync('ping', ['127.0.0.1', '-n', '1'], { stdio: 'ignore' });
            }
            if (initError) {
                throw initError;
            }
            if (!isComplete) {
                console.warn('[DATABASE MIXIN] ⚠️ Inicialización tardó más de 5s, continuando sin garantías...');
            }
            globalPrismaInstance = serviceInstance;
            console.log('[DATABASE MIXIN] 🎉 Instancia lista para uso');
        }
        catch (error) {
            console.error('[DATABASE MIXIN] ❌ Error en todas las estrategias:', error);
            lastError = error.message;
            console.log('[DATABASE MIXIN] 🆘 Creando instancia de emergencia SIN inicializar...');
            const emergencyInstance = new prisma_service_1.PrismaService();
            globalPrismaInstance = emergencyInstance;
        }
        finally {
            isInitializing = false;
        }
    }
    else if (isInitializing) {
        console.log('[DATABASE MIXIN] ⏳ Inicialización en progreso, esperando...');
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
const DatabaseObject = {
    get Prisma() {
        const instance = getLazyPrismaInstance();
        if (!instance || typeof instance !== 'object') {
            const errorMsg = '[DATABASE MIXIN] 💥 Instancia de Prisma no válida después de inicialización forzada';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        if (typeof instance.$queryRaw !== 'function') {
            console.error('[DATABASE MIXIN] 💥 Instancia NO tiene $queryRaw - inicialización FALLÓ');
            throw new Error('PrismaService instance is not properly initialized - missing $queryRaw method');
        }
        const modelCount = Object.keys(instance).filter(k => !k.startsWith('$') &&
            !k.startsWith('_') &&
            !k.startsWith('on') &&
            typeof instance[k] === 'object').length;
        if (modelCount === 0) {
            console.error('[DATABASE MIXIN] 💥 Instancia NO tiene modelos - inicialización FALLÓ');
            throw new Error('PrismaService instance is not properly initialized - no models available');
        }
        return instance;
    },
    get Firestore() {
        if (!globalFirestoreInstance) {
            const { FirestoreService } = require('../../../../../database/firestore.service');
            globalFirestoreInstance = new FirestoreService();
        }
        return globalFirestoreInstance;
    },
    getStatus() {
        console.log('[DATABASE MIXIN] 🔍 Generando status completo...');
        const instance = globalPrismaInstance;
        const status = {
            instanceExists: !!instance,
            initializationAttempts,
            lastError,
            isInitializing,
            instanceType: instance ? instance.constructor.name : 'N/A',
            allProperties: instance ? Object.keys(instance).length : 0,
            hasModels: instance ? Object.keys(instance).filter(k => !k.startsWith('$') &&
                !k.startsWith('_') &&
                !k.startsWith('on') &&
                typeof instance[k] === 'object').length : 0,
            sampleModels: instance ? Object.keys(instance).filter(k => !k.startsWith('$') &&
                !k.startsWith('_') &&
                !k.startsWith('on') &&
                typeof instance[k] === 'object').slice(0, 10) : [],
            hasQueryRaw: instance ? typeof instance.$queryRaw === 'function' : false,
            hasSysUser: instance ? typeof instance.sysUser === 'object' : false,
            hasTransactionStatus: instance ? typeof instance.transactionStatus === 'object' : false,
            globalContextAvailable: typeof global !== 'undefined' && !!global.nestApp,
            accelerateEnabled: true,
            instanceReady: !!instance && typeof instance.$queryRaw === 'function'
        };
        console.log('[DATABASE MIXIN] 📊 Status generado:', JSON.stringify(status, null, 2));
        return status;
    },
    setGlobalInstance(instance) {
        console.log('[DATABASE MIXIN] 🎯 Estableciendo instancia global manualmente...');
        forceInitialization(instance).then(() => {
            globalPrismaInstance = instance;
            const modelCount = Object.keys(instance).filter(k => !k.startsWith('$') &&
                !k.startsWith('_') &&
                !k.startsWith('on') &&
                typeof instance[k] === 'object').length;
            console.log(`[DATABASE MIXIN] ✅ Instancia global establecida con ${modelCount} modelos disponibles`);
            const specificModels = ['sysUser', 'transactionStatus', 'rule_operator', 'branch'];
            specificModels.forEach(model => {
                const hasModel = !!instance[model];
                console.log(`[DATABASE MIXIN] 🎯 Modelo ${model}: ${hasModel ? '✅' : '❌'}`);
            });
        }).catch(error => {
            console.error('[DATABASE MIXIN] ❌ Error estableciendo instancia global:', error);
        });
    },
    _resetInstance() {
        console.log('[DATABASE MIXIN] 🔄 Reseteando instancia global...');
        globalPrismaInstance = null;
        initializationAttempts = 0;
        lastError = null;
        isInitializing = false;
        console.log('[DATABASE MIXIN] ✅ Reset completado');
    },
    hasModel(modelName) {
        try {
            const instance = getLazyPrismaInstance();
            const hasIt = !!instance[modelName] && typeof instance[modelName] === 'object';
            console.log(`[DATABASE MIXIN] 🔍 Verificando modelo ${modelName}: ${hasIt ? '✅' : '❌'}`);
            return hasIt;
        }
        catch (error) {
            console.error(`[DATABASE MIXIN] ❌ Error verificando modelo ${modelName}:`, error);
            return false;
        }
    },
    diagnose() {
        console.log('[DATABASE MIXIN] 🏥 DIAGNÓSTICO COMPLETO INICIADO');
        try {
            const instance = this.Prisma;
            console.log('[DATABASE MIXIN] ✅ Instancia obtenida exitosamente');
            if (typeof instance.$queryRaw === 'function') {
                console.log('[DATABASE MIXIN] ✅ $queryRaw disponible');
            }
            else {
                console.log('[DATABASE MIXIN] ❌ $queryRaw NO disponible');
            }
            if (instance.sysUser) {
                console.log('[DATABASE MIXIN] ✅ sysUser modelo disponible');
            }
            else {
                console.log('[DATABASE MIXIN] ❌ sysUser modelo NO disponible');
            }
            return { success: true, message: 'Diagnóstico completado' };
        }
        catch (error) {
            console.error('[DATABASE MIXIN] 💥 Error en diagnóstico:', error);
            return { success: false, error: error.message };
        }
    }
};
exports.Database = new Proxy(DatabaseObject, {
    get(target, prop, receiver) {
        if (prop in target) {
            return Reflect.get(target, prop, receiver);
        }
        try {
            const prismaInstance = target.Prisma;
            if (prismaInstance && prop in prismaInstance) {
                return prismaInstance[prop];
            }
        }
        catch (error) {
            console.error(`[DATABASE MIXIN] Error accessing model ${String(prop)}:`, error);
        }
        return undefined;
    }
});
exports.WithPrisma = null;
exports.WithFirestore = null;
//# sourceMappingURL=database.mixin.js.map