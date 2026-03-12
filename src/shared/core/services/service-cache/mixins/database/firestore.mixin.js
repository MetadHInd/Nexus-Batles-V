"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreService = void 0;
exports.WithFirestore = WithFirestore;
var firestore_service_1 = require("../../../../../../../../../../../src/shared/database/firestore.service");
Object.defineProperty(exports, "FirestoreService", { enumerable: true, get: function () { return firestore_service_1.FirestoreService; } });
function WithFirestore(Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._firestore = new firestore_service_1.FirestoreService();
            return _this;
        }
        Object.defineProperty(class_1.prototype, "Firestore", {
            get: function () {
                return this._firestore;
            },
            enumerable: false,
            configurable: true
        });
        return class_1;
    }(Base));
}
