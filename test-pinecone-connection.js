"use strict";
/**
 * Script de diagnóstico para verificar la conexión a Pinecone
 * Prueba si el sistema de memoria está funcionando correctamente
 */
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
var dotenv_1 = require("dotenv");
var pinecone_1 = require("@pinecone-database/pinecone");
// Cargar variables de entorno
(0, dotenv_1.config)();
function testPineconeConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var pinecone, indexes, indexName, indexDescription, index, stats, testNamespace, managerNamespace, managerStats, error_1, error_2;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    console.log('🔍 Testing Pinecone Connection...\n');
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 9, , 10]);
                    // 1. Verificar variables de entorno
                    console.log('📋 Environment Variables:');
                    console.log("PINECONE_API_KEY: ".concat(process.env.PINECONE_API_KEY ? '✅ Set' : '❌ Missing'));
                    console.log("PINECONE_INDEX_NAME: ".concat(process.env.PINECONE_INDEX_NAME || 'galatea-core-prod'));
                    console.log("OPENAI_API_KEY: ".concat(process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'));
                    console.log('');
                    if (!process.env.PINECONE_API_KEY) {
                        throw new Error('PINECONE_API_KEY is not set in .env file');
                    }
                    // 2. Conectar a Pinecone
                    console.log('🔌 Connecting to Pinecone...');
                    pinecone = new pinecone_1.Pinecone({
                        apiKey: process.env.PINECONE_API_KEY,
                    });
                    // 3. Listar índices
                    console.log('📊 Listing indexes...');
                    return [4 /*yield*/, pinecone.listIndexes()];
                case 2:
                    indexes = _g.sent();
                    console.log("Found ".concat(((_a = indexes.indexes) === null || _a === void 0 ? void 0 : _a.length) || 0, " indexes:"));
                    (_b = indexes.indexes) === null || _b === void 0 ? void 0 : _b.forEach(function (index) {
                        console.log("  - ".concat(index.name, " (").concat(index.dimension, " dimensions, ").concat(index.metric, " metric)"));
                    });
                    console.log('');
                    indexName = process.env.PINECONE_INDEX_NAME || 'galatea-core-prod';
                    console.log("\uD83D\uDD0D Checking index: ".concat(indexName));
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 7, , 8]);
                    return [4 /*yield*/, pinecone.describeIndex(indexName)];
                case 4:
                    indexDescription = _g.sent();
                    console.log("\u2705 Index found!");
                    console.log("  - Name: ".concat(indexDescription.name));
                    console.log("  - Dimension: ".concat(indexDescription.dimension));
                    console.log("  - Metric: ".concat(indexDescription.metric));
                    console.log("  - Host: ".concat(indexDescription.host));
                    console.log("  - Status: ".concat(((_c = indexDescription.status) === null || _c === void 0 ? void 0 : _c.state) || 'Unknown'));
                    console.log('');
                    // 5. Conectar al índice y verificar estadísticas
                    console.log('📈 Getting index statistics...');
                    index = pinecone.index(indexName);
                    return [4 /*yield*/, index.describeIndexStats()];
                case 5:
                    stats = _g.sent();
                    console.log("  - Total vectors: ".concat(stats.totalRecordCount || 0));
                    console.log("  - Namespaces: ".concat(Object.keys(stats.namespaces || {}).length));
                    if (stats.namespaces) {
                        Object.entries(stats.namespaces).forEach(function (_a) {
                            var ns = _a[0], data = _a[1];
                            console.log("    - ".concat(ns, ": ").concat(data.recordCount || 0, " vectors"));
                        });
                    }
                    console.log('');
                    // 6. Test de escritura (opcional)
                    console.log('✏️ Testing write operation...');
                    testNamespace = 'test-connection';
                    return [4 /*yield*/, index.namespace(testNamespace).upsert([
                            {
                                id: 'test-vector-' + Date.now(),
                                values: Array(1536).fill(0.1), // Dimensión de text-embedding-3-small
                                metadata: {
                                    test: true,
                                    timestamp: new Date().toISOString(),
                                },
                            },
                        ])];
                case 6:
                    _g.sent();
                    console.log('✅ Write test successful!');
                    console.log('');
                    // 7. Verificar namespace manager-assistant
                    console.log('🔍 Checking manager-assistant namespace...');
                    managerNamespace = 'manager-assistant';
                    managerStats = (_d = stats.namespaces) === null || _d === void 0 ? void 0 : _d[managerNamespace];
                    if (managerStats) {
                        console.log("\u2705 Namespace found with ".concat(managerStats.recordCount || 0, " vectors"));
                    }
                    else {
                        console.log('⚠️ Namespace not found - will be created on first write');
                    }
                    console.log('');
                    console.log('✅ All tests passed! Pinecone connection is working correctly.');
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _g.sent();
                    if ((_e = error_1.message) === null || _e === void 0 ? void 0 : _e.includes('not found')) {
                        console.error("\u274C Index \"".concat(indexName, "\" does not exist!"));
                        console.error('Available indexes:', (_f = indexes.indexes) === null || _f === void 0 ? void 0 : _f.map(function (i) { return i.name; }).join(', '));
                    }
                    else {
                        throw error_1;
                    }
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_2 = _g.sent();
                    console.error('❌ Error testing Pinecone connection:');
                    console.error(error_2.message);
                    console.error('\nFull error:', error_2);
                    process.exit(1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Ejecutar el test
testPineconeConnection()
    .then(function () {
    console.log('\n✅ Pinecone connection test completed successfully!');
    process.exit(0);
})
    .catch(function (error) {
    console.error('\n❌ Pinecone connection test failed!', error);
    process.exit(1);
});
