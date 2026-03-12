"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheableFactory = void 0;
var CacheableFactory = /** @class */ (function () {
    function CacheableFactory() {
    }
    CacheableFactory.create = function (raw, Model) {
        return Model.fromJSON(raw);
    };
    CacheableFactory.createMany = function (rawList, Model) {
        return rawList.map(function (item) { return Model.fromJSON(item); });
    };
    return CacheableFactory;
}());
exports.CacheableFactory = CacheableFactory;
