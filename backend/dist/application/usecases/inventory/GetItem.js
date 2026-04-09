"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetItems = void 0;
class GetItems {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    async execute(filters) {
        console.log('🎯 Ejecutando GetItems con filtros:', filters);
        const result = await this.itemRepository.findAll(filters);
        console.log('📦 Resultado:', result);
        return result;
    }
}
exports.GetItems = GetItems;
//# sourceMappingURL=GetItem.js.map