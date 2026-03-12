import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  Firestore,
  CollectionReference,
  DocumentReference,
} from '@google-cloud/firestore';

@Injectable()
export class FirestoreService implements OnModuleInit {
  private readonly logger = new Logger(FirestoreService.name);
  private firestore: Firestore;

  constructor() {
    if (!this.firestore) {
      this.logger.log('🔧 Initializing Firestore in constructor...');
      this.logger.log(`   Project ID: ${process.env.FIRESTORE_PROJECT_ID}`);
      this.logger.log(`   Credentials: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
      this.logger.log(`   Database ID: (default)`);
      
      this.firestore = new Firestore({
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
      this.firestore = new Firestore({
        projectId: process.env.FIRESTORE_PROJECT_ID,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        databaseId: '(default)',
      });
    }
    
    // Test connection
    try {
      this.logger.log('🧪 Testing Firestore connection...');
      const testDoc = await this.firestore.collection('_health_check').limit(1).get();
      this.logger.log(`✅ Firestore connection successful! (Retrieved ${testDoc.size} docs)`);
    } catch (error: any) {
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

  collection<T>(collectionPath: string): CollectionReference<T> {
    return this.firestore.collection(collectionPath) as CollectionReference<T>;
  }

  doc<T>(documentPath: string): DocumentReference<T> {
    return this.firestore.doc(documentPath) as DocumentReference<T>;
  }

  async getDocument<T>(documentPath: string): Promise<T | null> {
    const snapshot = await this.firestore.doc(documentPath).get();
    return snapshot.exists ? (snapshot.data() as T) : null;
  }

  async getCollection<T>(collectionPath: string): Promise<T[]> {
    const snapshot = await (
      this.firestore.collection(collectionPath) as CollectionReference<T>
    ).get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      if (data && typeof data === 'object') {
        return data as T;
      }
      throw new Error(`Invalid data in document at ${doc.ref.path}`);
    });
  }

  async setDocument<T extends FirebaseFirestore.DocumentData>(
    documentPath: string,
    data: T,
    merge: boolean = true,
  ): Promise<void> {
    try {
      this.logger.debug(`📝 setDocument: ${documentPath} (merge: ${merge})`);
      await this.firestore.doc(documentPath).set(data, { merge });
      this.logger.debug(`✅ Document set successfully`);
    } catch (error: any) {
      this.logger.error(`❌ setDocument FAILED: ${documentPath}`);
      this.logger.error(`   Error: ${error.message}`);
      this.logger.error(`   Code: ${error.code}`);
      this.logger.error(`   Stack: ${error.stack}`);
      throw error;
    }
  }

  async updateDocument<T>(
    documentPath: string,
    data: Partial<T>,
  ): Promise<void> {
    await this.firestore.doc(documentPath).update(data);
  }

  async deleteDocument(documentPath: string): Promise<void> {
    await this.firestore.doc(documentPath).delete();
  }
}
