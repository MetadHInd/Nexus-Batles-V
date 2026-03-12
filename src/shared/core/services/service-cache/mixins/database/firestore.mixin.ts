import { FirestoreService } from 'src/shared/database/firestore.service';

/**
 * Extiende el servicio de caché para incluir Firestore.
 */
export interface IWithFirestore {
  readonly Firestore: FirestoreService;
}

type Constructor<T = object> = new (...args: any[]) => T;

export function WithFirestore<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    readonly _firestore = new FirestoreService();

    get Firestore(): FirestoreService {
      return this._firestore;
    }
  };
}

export { FirestoreService };
