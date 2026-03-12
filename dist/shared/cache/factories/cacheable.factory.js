"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheableFactory = void 0;
class CacheableFactory {
    static create(raw, Model) {
        return Model.fromJSON(raw);
    }
    static createMany(rawList, Model) {
        return rawList.map((item) => Model.fromJSON(item));
    }
}
exports.CacheableFactory = CacheableFactory;
//# sourceMappingURL=cacheable.factory.js.map