"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var Product = /** @class */ (function () {
    function Product(id, name, description, price, stock) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.validate();
    }
    Product.prototype.validate = function () {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error("El nombre del producto es obligatorio");
        }
        if (this.price <= 0) {
            throw new Error("El precio debe ser mayor a 0");
        }
        if (this.stock < 0) {
            throw new Error("El stock no puede ser negativo");
        }
    };
    return Product;
}());
exports.Product = Product;
