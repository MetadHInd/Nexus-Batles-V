"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLItemRepository = void 0;
// infrastructure/repositories/MySQLItemRepository.ts
const connection_1 = require("../database/connection");
const Item_1 = require("../../domain/entities/Item");
class MySQLItemRepository {
    async findById(id) {
        const [rows] = await connection_1.pool.query('SELECT * FROM items WHERE id = ? AND activo = true', [id]);
        if (rows.length === 0)
            return null;
        return this.mapToEntity(rows[0]);
    }
    async findAll(filters) {
        // Construir query base
        let query = 'SELECT * FROM items WHERE activo = true';
        let countQuery = 'SELECT COUNT(*) as total FROM items WHERE activo = true';
        const params = [];
        const countParams = [];
        // Aplicar filtros
        if (filters.tipo) {
            query += ' AND tipo = ?';
            countQuery += ' AND tipo = ?';
            params.push(filters.tipo);
            countParams.push(filters.tipo);
        }
        if (filters.rareza) {
            query += ' AND rareza = ?';
            countQuery += ' AND rareza = ?';
            params.push(filters.rareza);
            countParams.push(filters.rareza);
        }
        if (filters.userId) {
            query += ' AND user_id = ?';
            countQuery += ' AND user_id = ?';
            params.push(filters.userId);
            countParams.push(filters.userId);
        }
        // Paginación
        const limit = filters.limit || 16;
        const page = filters.page || 1;
        const offset = (page - 1) * limit;
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);
        console.log('📝 Query findAll:', query);
        console.log('📌 Params:', params);
        // Ejecutar queries
        const [rows] = await connection_1.pool.query(query, params);
        const [countResult] = await connection_1.pool.query(countQuery, countParams);
        const total = countResult[0]?.total || 0;
        const items = rows.map(row => this.mapToEntity(row));
        // ✅ Calcular totalPages
        const totalPages = Math.ceil(total / limit);
        console.log('📊 Resultado:', { total, page, totalPages, itemsCount: items.length });
        return {
            items,
            total,
            page,
            totalPages
        };
    }
    async search(query) {
        const searchQuery = `%${query}%`;
        const [rows] = await connection_1.pool.query(`SELECT * FROM items 
       WHERE activo = true 
       AND (nombre LIKE ? OR descripcion LIKE ?)
       LIMIT 50`, [searchQuery, searchQuery]);
        return rows.map(row => this.mapToEntity(row));
    }
    async save(item) {
        const props = item.toPersistence();
        await connection_1.pool.query(`INSERT INTO items (
        id, nombre, tipo, rareza, imagen, descripcion, 
        habilidades, efectos, ataque, defensa, user_id,
        en_subasta, en_mazo_activo, activo, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            props.id,
            props.nombre,
            props.tipo,
            props.rareza,
            props.imagen || null,
            props.descripcion,
            JSON.stringify(props.habilidades || []),
            JSON.stringify(props.efectos || []),
            props.ataque || 0,
            props.defensa || 0,
            props.userId || null,
            props.enSubasta || false,
            props.enMazoActivo || false,
            props.activo !== undefined ? props.activo : true,
            props.createdAt || new Date(),
            props.updatedAt || new Date()
        ]);
        return item;
    }
    async update(item) {
        const props = item.toPersistence();
        await connection_1.pool.query(`UPDATE items SET
        nombre = ?, tipo = ?, rareza = ?, imagen = ?,
        descripcion = ?, habilidades = ?, efectos = ?,
        ataque = ?, defensa = ?, user_id = ?,
        en_subasta = ?, en_mazo_activo = ?, updated_at = ?
      WHERE id = ? AND activo = true`, [
            props.nombre,
            props.tipo,
            props.rareza,
            props.imagen || null,
            props.descripcion,
            JSON.stringify(props.habilidades || []),
            JSON.stringify(props.efectos || []),
            props.ataque || 0,
            props.defensa || 0,
            props.userId || null,
            props.enSubasta || false,
            props.enMazoActivo || false,
            new Date(),
            props.id
        ]);
        return item;
    }
    async delete(id) {
        const [result] = await connection_1.pool.query('UPDATE items SET activo = false, deleted_at = ? WHERE id = ?', [new Date(), id]);
        return result.affectedRows > 0;
    }
    mapToEntity(row) {
        return new Item_1.Item({
            id: row.id,
            nombre: row.nombre,
            tipo: row.tipo,
            rareza: row.rareza,
            imagen: row.imagen || undefined,
            descripcion: row.descripcion,
            habilidades: this.parseJSON(row.habilidades, []),
            efectos: this.parseJSON(row.efectos, []),
            ataque: row.ataque,
            defensa: row.defensa,
            userId: row.user_id || undefined,
            enSubasta: row.en_subasta,
            enMazoActivo: row.en_mazo_activo,
            activo: row.activo,
            deletedAt: row.deleted_at || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
    parseJSON(data, defaultValue) {
        if (!data)
            return defaultValue;
        try {
            return typeof data === 'string' ? JSON.parse(data) : data;
        }
        catch {
            console.error('Error parseando JSON:', data);
            return defaultValue;
        }
    }
}
exports.MySQLItemRepository = MySQLItemRepository;
//# sourceMappingURL=MySQLItemRepository.js.map