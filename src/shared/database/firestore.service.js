"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreService = void 0;
var common_1 = require("@nestjs/common");
var firestore_1 = require("@google-cloud/firestore");
var FirestoreService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FirestoreService = _classThis = /** @class */ (function () {
        function FirestoreService_1() {
            this.logger = new common_1.Logger(FirestoreService.name);
            if (!this.firestore) {
                this.logger.log('🔧 Initializing Firestore in constructor...');
                this.logger.log("   Project ID: ".concat(process.env.FIRESTORE_PROJECT_ID));
                this.logger.log("   Credentials: ".concat(process.env.GOOGLE_APPLICATION_CREDENTIALS));
                this.logger.log("   Database ID: (default)");
                this.firestore = new firestore_1.Firestore({
                    projectId: process.env.FIRESTORE_PROJECT_ID,
                    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
                    databaseId: '(default)',
                });
                this.logger.log('✅ Firestore instance created');
            }
        }
        FirestoreService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var testDoc, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.firestore) {
                                this.logger.log('🔧 Initializing Firestore in onModuleInit...');
                                this.firestore = new firestore_1.Firestore({
                                    projectId: process.env.FIRESTORE_PROJECT_ID,
                                    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
                                    databaseId: '(default)',
                                });
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            this.logger.log('🧪 Testing Firestore connection...');
                            return [4 /*yield*/, this.firestore.collection('_health_check').limit(1).get()];
                        case 2:
                            testDoc = _a.sent();
                            this.logger.log("\u2705 Firestore connection successful! (Retrieved ".concat(testDoc.size, " docs)"));
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("\u274C Firestore connection test FAILED!");
                            this.logger.error("   Error: ".concat(error_1.message));
                            this.logger.error("   Code: ".concat(error_1.code));
                            if (error_1.code === 5) {
                                this.logger.error("\n");
                                this.logger.error("\uD83D\uDD25 ERROR CODE 5 = DATABASE NOT FOUND!");
                                this.logger.error("\n");
                                this.logger.error("   La base de datos Firestore NO EXISTE en el proyecto.");
                                this.logger.error("\n");
                                this.logger.error("   SOLUCI\u00D3N:");
                                this.logger.error("   1. Ve a: https://console.firebase.google.com/project/".concat(process.env.FIRESTORE_PROJECT_ID, "/firestore"));
                                this.logger.error("   2. Crea una base de datos Firestore en modo Native");
                                this.logger.error("   3. Selecciona una ubicaci\u00F3n (ej: us-east1)");
                                this.logger.error("   4. Reinicia el servidor");
                                this.logger.error("\n");
                            }
                            this.logger.error("   Details: ".concat(JSON.stringify(error_1.details || {})));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        FirestoreService_1.prototype.collection = function (collectionPath) {
            return this.firestore.collection(collectionPath);
        };
        FirestoreService_1.prototype.doc = function (documentPath) {
            return this.firestore.doc(documentPath);
        };
        FirestoreService_1.prototype.getDocument = function (documentPath) {
            return __awaiter(this, void 0, void 0, function () {
                var snapshot;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.firestore.doc(documentPath).get()];
                        case 1:
                            snapshot = _a.sent();
                            return [2 /*return*/, snapshot.exists ? snapshot.data() : null];
                    }
                });
            });
        };
        FirestoreService_1.prototype.getCollection = function (collectionPath) {
            return __awaiter(this, void 0, void 0, function () {
                var snapshot;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.firestore.collection(collectionPath).get()];
                        case 1:
                            snapshot = _a.sent();
                            return [2 /*return*/, snapshot.docs.map(function (doc) {
                                    var data = doc.data();
                                    if (data && typeof data === 'object') {
                                        return data;
                                    }
                                    throw new Error("Invalid data in document at ".concat(doc.ref.path));
                                })];
                    }
                });
            });
        };
        FirestoreService_1.prototype.setDocument = function (documentPath_1, data_1) {
            return __awaiter(this, arguments, void 0, function (documentPath, data, merge) {
                var error_2;
                if (merge === void 0) { merge = true; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.logger.debug("\uD83D\uDCDD setDocument: ".concat(documentPath, " (merge: ").concat(merge, ")"));
                            return [4 /*yield*/, this.firestore.doc(documentPath).set(data, { merge: merge })];
                        case 1:
                            _a.sent();
                            this.logger.debug("\u2705 Document set successfully");
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error("\u274C setDocument FAILED: ".concat(documentPath));
                            this.logger.error("   Error: ".concat(error_2.message));
                            this.logger.error("   Code: ".concat(error_2.code));
                            this.logger.error("   Stack: ".concat(error_2.stack));
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        FirestoreService_1.prototype.updateDocument = function (documentPath, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.firestore.doc(documentPath).update(data)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        FirestoreService_1.prototype.deleteDocument = function (documentPath) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.firestore.doc(documentPath).delete()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return FirestoreService_1;
    }());
    __setFunctionName(_classThis, "FirestoreService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FirestoreService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FirestoreService = _classThis;
}();
exports.FirestoreService = FirestoreService;
