"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithFirestore = exports.WithPrisma = exports.Database = void 0;
// Database mixin FINAL - INICIALIZACIÓN FORZADA SÍNCRONA + MULTI-TENANCY
// Esta implementación GARANTIZA que la instancia esté completamente inicializada
// Y respeta el contexto de multi-tenancy usando MultiTenantPrismaService
var prisma_service_1 = require("../../../../../database/prisma.service");
// Variable para almacenar la referencia a la instancia GLOBAL de NestJS
var globalPrismaInstance = null;
var globalFirestoreInstance = null;
var initializationAttempts = 0;
var lastError = null;
var isInitializing = false;
// Función para FORZAR inicialización síncrona de una instancia de PrismaService
function forceInitialization(instance) {
    return __awaiter(this, void 0, void 0, function () {
        var modelCount, criticalModels, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[DATABASE MIXIN] 🔧 Forzando inicialización de instancia...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (!(instance.onModuleInit && typeof instance.onModuleInit === 'function')) return [3 /*break*/, 3];
                    console.log('[DATABASE MIXIN] ⚡ Ejecutando onModuleInit...');
                    return [4 /*yield*/, instance.onModuleInit()];
                case 2:
                    _a.sent();
                    console.log('[DATABASE MIXIN] ✅ onModuleInit completado exitosamente');
                    _a.label = 3;
                case 3:
                    modelCount = Object.keys(instance).filter(function (k) {
                        return !k.startsWith('$') &&
                            !k.startsWith('_') &&
                            !k.startsWith('on') &&
                            typeof instance[k] === 'object';
                    }).length;
                    console.log("[DATABASE MIXIN] \uD83D\uDCCA Despu\u00E9s de inicializaci\u00F3n: ".concat(modelCount, " modelos disponibles"));
                    criticalModels = ['sysUser', 'transactionStatus', 'rule_operator', 'branch'];
                    criticalModels.forEach(function (model) {
                        var hasModel = !!instance[model];
                        console.log("[DATABASE MIXIN] \uD83C\uDFAF Modelo ".concat(model, ": ").concat(hasModel ? '✅' : '❌'));
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('[DATABASE MIXIN] ❌ Error en inicialización forzada:', error_1);
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Función para obtener la instancia usando LAZY LOADING con INICIALIZACIÓN FORZADA
function getLazyPrismaInstance() {
    initializationAttempts++;
    if (!globalPrismaInstance && !isInitializing) {
        isInitializing = true;
        try {
            var serviceInstance = void 0;
            // ESTRATEGIA 1: Obtener desde el contexto global de NestJS
            if (typeof global !== 'undefined' && global.nestApp) {
                console.log('[DATABASE MIXIN] 🎯 Obteniendo desde contexto global...');
                serviceInstance = global.nestApp.get(prisma_service_1.PrismaService);
                console.log('[DATABASE MIXIN] ✅ Instancia obtenida desde contexto global');
            }
            else {
                // ESTRATEGIA 2: Crear nueva instancia
                console.log('[DATABASE MIXIN] 🔧 Creando nueva instancia...');
                serviceInstance = new prisma_service_1.PrismaService();
            }
            // CRÍTICO: FORZAR INICIALIZACIÓN INMEDIATA DE FORMA SÍNCRONA
            console.log('[DATABASE MIXIN] 🚀 FORZANDO inicialización síncrona...');
            // Ejecutar la inicialización de forma síncrona usando Promise.resolve
            var initPromise = forceInitialization(serviceInstance);
            // HACK: Esperar de forma síncrona usando busy wait (solo para desarrollo/debug)
            var isComplete_1 = false;
            var initError_1 = null;
            initPromise
                .then(function () {
                isComplete_1 = true;
                console.log('[DATABASE MIXIN] ✅ Inicialización síncrona completada');
            })
                .catch(function (error) {
                initError_1 = error;
                isComplete_1 = true;
                console.error('[DATABASE MIXIN] ❌ Error en inicialización síncrona:', error);
            });
            // Busy wait por máximo 5 segundos
            var startTime = Date.now();
            while (!isComplete_1 && (Date.now() - startTime) < 5000) {
                // Esperar de forma activa
                require('child_process').spawnSync('ping', ['127.0.0.1', '-n', '1'], { stdio: 'ignore' });
            }
            if (initError_1) {
                throw initError_1;
            }
            if (!isComplete_1) {
                console.warn('[DATABASE MIXIN] ⚠️ Inicialización tardó más de 5s, continuando sin garantías...');
            }
            globalPrismaInstance = serviceInstance;
            console.log('[DATABASE MIXIN] 🎉 Instancia lista para uso');
        }
        catch (error) {
            console.error('[DATABASE MIXIN] ❌ Error en todas las estrategias:', error);
            lastError = error.message;
            // ESTRATEGIA 3: Instancia mínima de emergencia SIN inicializar
            console.log('[DATABASE MIXIN] 🆘 Creando instancia de emergencia SIN inicializar...');
            var emergencyInstance = new prisma_service_1.PrismaService();
            globalPrismaInstance = emergencyInstance;
        }
        finally {
            isInitializing = false;
        }
    }
    else if (isInitializing) {
        console.log('[DATABASE MIXIN] ⏳ Inicialización en progreso, esperando...');
        // Si está inicializando, esperar un poco
        var attempts = 0;
        while (isInitializing && attempts < 50) {
            require('child_process').spawnSync('ping', ['127.0.0.1', '-n', '1'], { stdio: 'ignore' });
            attempts++;
        }
    }
    if (!globalPrismaInstance) {
        var errorMsg = "[DATABASE MIXIN] \uD83D\uDCA5 FALLO CR\u00CDTICO: No se pudo crear instancia despu\u00E9s de ".concat(initializationAttempts, " intentos. \u00DAltimo error: ").concat(lastError);
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
var DatabaseObject = {
    // GETTER with singleton pattern
    get Prisma() {
        var instance = getLazyPrismaInstance();
        // Verificaciones adicionales
        if (!instance || typeof instance !== 'object') {
            var errorMsg = '[DATABASE MIXIN] 💥 Instancia de Prisma no válida después de inicialización forzada';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        // Verificar que tiene el método básico $queryRaw
        if (typeof instance.$queryRaw !== 'function') {
            console.error('[DATABASE MIXIN] 💥 Instancia NO tiene $queryRaw - inicialización FALLÓ');
            throw new Error('PrismaService instance is not properly initialized - missing $queryRaw method');
        }
        // Verificar que tiene al menos un modelo
        var modelCount = Object.keys(instance).filter(function (k) {
            return !k.startsWith('$') &&
                !k.startsWith('_') &&
                !k.startsWith('on') &&
                typeof instance[k] === 'object';
        }).length;
        if (modelCount === 0) {
            console.error('[DATABASE MIXIN] 💥 Instancia NO tiene modelos - inicialización FALLÓ');
            throw new Error('PrismaService instance is not properly initialized - no models available');
        }
        return instance;
    },
    // GETTER para Firestore - devuelve instancia singleton
    get Firestore() {
        if (!globalFirestoreInstance) {
            var FirestoreService = require('../../../../../database/firestore.service').FirestoreService;
            globalFirestoreInstance = new FirestoreService();
        }
        return globalFirestoreInstance;
    },
    // 🚀 RAG (LightRAG) - Graph-Enhanced Memory System
    // MÉTODO PARA DEBUG - Verificar estado con diagnóstico completo
    getStatus: function () {
        console.log('[DATABASE MIXIN] 🔍 Generando status completo...');
        var instance = globalPrismaInstance;
        var status = {
            // Información básica
            instanceExists: !!instance,
            initializationAttempts: initializationAttempts,
            lastError: lastError,
            isInitializing: isInitializing,
            // Información de la instancia
            instanceType: instance ? instance.constructor.name : 'N/A',
            allProperties: instance ? Object.keys(instance).length : 0,
            // Verificación de modelos
            hasModels: instance ? Object.keys(instance).filter(function (k) {
                return !k.startsWith('$') &&
                    !k.startsWith('_') &&
                    !k.startsWith('on') &&
                    typeof instance[k] === 'object';
            }).length : 0,
            sampleModels: instance ? Object.keys(instance).filter(function (k) {
                return !k.startsWith('$') &&
                    !k.startsWith('_') &&
                    !k.startsWith('on') &&
                    typeof instance[k] === 'object';
            }).slice(0, 10) : [],
            // Verificaciones técnicas
            hasQueryRaw: instance ? typeof instance.$queryRaw === 'function' : false,
            hasSysUser: instance ? typeof instance.sysUser === 'object' : false,
            hasTransactionStatus: instance ? typeof instance.transactionStatus === 'object' : false,
            // Info de contexto
            globalContextAvailable: typeof global !== 'undefined' && !!global.nestApp,
            accelerateEnabled: true,
            instanceReady: !!instance && typeof instance.$queryRaw === 'function'
        };
        console.log('[DATABASE MIXIN] 📊 Status generado:', JSON.stringify(status, null, 2));
        return status;
    },
    // MÉTODO para establecer la instancia manualmente (desde main.ts)
    setGlobalInstance: function (instance) {
        console.log('[DATABASE MIXIN] 🎯 Estableciendo instancia global manualmente...');
        // FORZAR inicialización antes de almacenar
        forceInitialization(instance).then(function () {
            globalPrismaInstance = instance;
            // Verificar que la instancia tiene los modelos
            var modelCount = Object.keys(instance).filter(function (k) {
                return !k.startsWith('$') &&
                    !k.startsWith('_') &&
                    !k.startsWith('on') &&
                    typeof instance[k] === 'object';
            }).length;
            console.log("[DATABASE MIXIN] \u2705 Instancia global establecida con ".concat(modelCount, " modelos disponibles"));
            // Verificar modelos específicos que están causando problemas
            var specificModels = ['sysUser', 'transactionStatus', 'rule_operator', 'branch'];
            specificModels.forEach(function (model) {
                var hasModel = !!instance[model];
                console.log("[DATABASE MIXIN] \uD83C\uDFAF Modelo ".concat(model, ": ").concat(hasModel ? '✅' : '❌'));
            });
        }).catch(function (error) {
            console.error('[DATABASE MIXIN] ❌ Error estableciendo instancia global:', error);
        });
    },
    // MÉTODO PARA FORZAR RESET (solo para testing)
    _resetInstance: function () {
        console.log('[DATABASE MIXIN] 🔄 Reseteando instancia global...');
        globalPrismaInstance = null;
        initializationAttempts = 0;
        lastError = null;
        isInitializing = false;
        console.log('[DATABASE MIXIN] ✅ Reset completado');
    },
    // MÉTODO PARA VERIFICAR DISPONIBILIDAD DE UN MODELO ESPECÍFICO
    hasModel: function (modelName) {
        try {
            var instance = getLazyPrismaInstance();
            var hasIt = !!instance[modelName] && typeof instance[modelName] === 'object';
            console.log("[DATABASE MIXIN] \uD83D\uDD0D Verificando modelo ".concat(modelName, ": ").concat(hasIt ? '✅' : '❌'));
            return hasIt;
        }
        catch (error) {
            console.error("[DATABASE MIXIN] \u274C Error verificando modelo ".concat(modelName, ":"), error);
            return false;
        }
    },
    // MÉTODO PARA DIAGNÓSTICO EN TIEMPO REAL
    diagnose: function () {
        console.log('[DATABASE MIXIN] 🏥 DIAGNÓSTICO COMPLETO INICIADO');
        try {
            var instance = this.Prisma;
            console.log('[DATABASE MIXIN] ✅ Instancia obtenida exitosamente');
            // Test básico
            if (typeof instance.$queryRaw === 'function') {
                console.log('[DATABASE MIXIN] ✅ $queryRaw disponible');
            }
            else {
                console.log('[DATABASE MIXIN] ❌ $queryRaw NO disponible');
            }
            // Test de modelo específico
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
// Crear un Proxy para permitir acceso directo a modelos de Prisma
// ServiceCache.Database.sysUser → ServiceCache.Database.Prisma.sysUser
exports.Database = new Proxy(DatabaseObject, {
    get: function (target, prop, receiver) {
        // Si la propiedad existe en el objeto base, devolverla
        if (prop in target) {
            return Reflect.get(target, prop, receiver);
        }
        // Si no existe, intentar obtenerla de Prisma
        try {
            var prismaInstance = target.Prisma;
            if (prismaInstance && prop in prismaInstance) {
                return prismaInstance[prop];
            }
        }
        catch (error) {
            console.error("[DATABASE MIXIN] Error accessing model ".concat(String(prop), ":"), error);
        }
        return undefined;
    }
});
// Exports para mantener compatibilidad
exports.WithPrisma = null;
exports.WithFirestore = null;
