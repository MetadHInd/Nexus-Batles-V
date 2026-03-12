import { OnModuleInit } from '@nestjs/common';
import { CollectionReference, DocumentReference } from '@google-cloud/firestore';
export declare class FirestoreService implements OnModuleInit {
    private readonly logger;
    private firestore;
    constructor();
    onModuleInit(): Promise<void>;
    collection<T>(collectionPath: string): CollectionReference<T>;
    doc<T>(documentPath: string): DocumentReference<T>;
    getDocument<T>(documentPath: string): Promise<T | null>;
    getCollection<T>(collectionPath: string): Promise<T[]>;
    setDocument<T extends FirebaseFirestore.DocumentData>(documentPath: string, data: T, merge?: boolean): Promise<void>;
    updateDocument<T>(documentPath: string, data: Partial<T>): Promise<void>;
    deleteDocument(documentPath: string): Promise<void>;
}
