"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FirestoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreService = void 0;
const common_1 = require("@nestjs/common");
const firestore_1 = require("@google-cloud/firestore");
let FirestoreService = FirestoreService_1 = class FirestoreService {
    logger = new common_1.Logger(FirestoreService_1.name);
    firestore;
    constructor() {
        if (!this.firestore) {
            this.logger.log('🔧 Initializing Firestore in constructor...');
            this.logger.log(`   Project ID: ${process.env.FIRESTORE_PROJECT_ID}`);
            this.logger.log(`   Credentials: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
            this.logger.log(`   Database ID: (default)`);
            this.firestore = new firestore_1.Firestore({
                projectId: process.env.FIRESTORE_PROJECT_ID,
                keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
                databaseId: '(default)',
            });
            this.logger.log('✅ Firestore instance created');
        }
    }
    async onModuleInit() {
        if (!this.firestore) {
            this.logger.log('🔧 Initializing Firestore in onModuleInit...');
            this.firestore = new firestore_1.Firestore({
                projectId: process.env.FIRESTORE_PROJECT_ID,
                keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
                databaseId: '(default)',
            });
        }
        try {
            this.logger.log('🧪 Testing Firestore connection...');
            const testDoc = await this.firestore.collection('_health_check').limit(1).get();
            this.logger.log(`✅ Firestore connection successful! (Retrieved ${testDoc.size} docs)`);
        }
        catch (error) {
            this.logger.error(`❌ Firestore connection test FAILED!`);
            this.logger.error(`   Error: ${error.message}`);
            this.logger.error(`   Code: ${error.code}`);
            if (error.code === 5) {
                this.logger.error(`\n`);
                this.logger.error(`🔥 ERROR CODE 5 = DATABASE NOT FOUND!`);
                this.logger.error(`\n`);
                this.logger.error(`   La base de datos Firestore NO EXISTE en el proyecto.`);
                this.logger.error(`\n`);
                this.logger.error(`   SOLUCIÓN:`);
                this.logger.error(`   1. Ve a: https://console.firebase.google.com/project/${process.env.FIRESTORE_PROJECT_ID}/firestore`);
                this.logger.error(`   2. Crea una base de datos Firestore en modo Native`);
                this.logger.error(`   3. Selecciona una ubicación (ej: us-east1)`);
                this.logger.error(`   4. Reinicia el servidor`);
                this.logger.error(`\n`);
            }
            this.logger.error(`   Details: ${JSON.stringify(error.details || {})}`);
        }
    }
    collection(collectionPath) {
        return this.firestore.collection(collectionPath);
    }
    doc(documentPath) {
        return this.firestore.doc(documentPath);
    }
    async getDocument(documentPath) {
        const snapshot = await this.firestore.doc(documentPath).get();
        return snapshot.exists ? snapshot.data() : null;
    }
    async getCollection(collectionPath) {
        const snapshot = await this.firestore.collection(collectionPath).get();
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            if (data && typeof data === 'object') {
                return data;
            }
            throw new Error(`Invalid data in document at ${doc.ref.path}`);
        });
    }
    async setDocument(documentPath, data, merge = true) {
        try {
            this.logger.debug(`📝 setDocument: ${documentPath} (merge: ${merge})`);
            await this.firestore.doc(documentPath).set(data, { merge });
            this.logger.debug(`✅ Document set successfully`);
        }
        catch (error) {
            this.logger.error(`❌ setDocument FAILED: ${documentPath}`);
            this.logger.error(`   Error: ${error.message}`);
            this.logger.error(`   Code: ${error.code}`);
            this.logger.error(`   Stack: ${error.stack}`);
            throw error;
        }
    }
    async updateDocument(documentPath, data) {
        await this.firestore.doc(documentPath).update(data);
    }
    async deleteDocument(documentPath) {
        await this.firestore.doc(documentPath).delete();
    }
};
exports.FirestoreService = FirestoreService;
exports.FirestoreService = FirestoreService = FirestoreService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FirestoreService);
//# sourceMappingURL=firestore.service.js.map