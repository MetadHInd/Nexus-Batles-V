"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreService = void 0;
exports.WithFirestore = WithFirestore;
const firestore_service_1 = require("../../../../../database/firestore.service");
Object.defineProperty(exports, "FirestoreService", { enumerable: true, get: function () { return firestore_service_1.FirestoreService; } });
function WithFirestore(Base) {
    return class extends Base {
        _firestore = new firestore_service_1.FirestoreService();
        get Firestore() {
            return this._firestore;
        }
    };
}
//# sourceMappingURL=firestore.mixin.js.map