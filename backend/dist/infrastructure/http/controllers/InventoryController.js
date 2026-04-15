"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const logger_1 = require("../../logging/logger");
class InventoryController {
    constructor(searchItems, getItems, getItemById, deleteItem) {
        this.searchItems = searchItems;
        this.getItems = getItems;
        this.getItemById = getItemById;
        this.deleteItem = deleteItem;
        this.search = async (req, res, next) => {
            try {
                const { q } = req.query;
                const result = await this.searchItems.execute(q);
                (0, logger_1.logInventoryEvent)('search', {
                    query: q,
                    results: result.total,
                });
                res.status(200).json({
                    ...result,
                    message: result.total === 0 ? 'No se encontraron resultados' : undefined,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.list = async (req, res) => {
            try {
                const filters = {
                    tipo: req.query.tipo,
                    rareza: req.query.rareza,
                    page: req.query.page ? parseInt(req.query.page) : 1,
                    limit: req.query.limit ? parseInt(req.query.limit) : 16
                };
                const result = await this.getItems.execute(filters);
                res.json(result); // ✅ Ahora incluye page y totalPages
            }
            catch (error) {
                console.error('Error en list:', error);
                res.status(500).json({ error: 'Error al obtener items' });
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const result = await this.getItemById.execute(id);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.delete = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.userId;
                const result = await this.deleteItem.execute(id, userId);
                (0, logger_1.logInventoryEvent)('item.deleted', {
                    itemId: id,
                    userId,
                    deletedAt: result.deletedAt,
                });
                res.status(200).json({
                    message: 'Ítem eliminado exitosamente',
                    ...result,
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.InventoryController = InventoryController;
//# sourceMappingURL=InventoryController.js.map