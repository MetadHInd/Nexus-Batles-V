import { FirestoreService } from 'src/shared/database/firestore.service';
export interface IWithFirestore {
    readonly Firestore: FirestoreService;
}
type Constructor<T = object> = new (...args: any[]) => T;
export declare function WithFirestore<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        readonly _firestore: FirestoreService;
        get Firestore(): FirestoreService;
    };
} & TBase;
export { FirestoreService };
