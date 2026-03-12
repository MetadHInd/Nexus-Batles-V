"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    id;
    name;
    description;
    price;
    stock;
    constructor(id, name, description, price, stock) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.validate();
    }
    validate() {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error("El nombre del producto es obligatorio");
        }
        if (this.price <= 0) {
            throw new Error("El precio debe ser mayor a 0");
        }
        if (this.stock < 0) {
            throw new Error("El stock no puede ser negativo");
        }
    }
}
exports.Product = Product;
//# sourceMappingURL=Product.js.map