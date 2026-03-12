"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerRepository = void 0;
const connection_1 = require("../database/connection");
const crypto_1 = require("crypto");
class MySQLPlayerRepository {
    async findById(id) {
        const [rows] = await connection_1.pool.execute('SELECT * FROM players WHERE id = ? LIMIT 1', [id]);
        if (!rows.length)
            return null;
        return this._map(rows[0]);
    }
    async findByEmail(email) {
        const [rows] = await connection_1.pool.execute('SELECT * FROM players WHERE email = ? LIMIT 1', [email]);
        if (!rows.length)
            return null;
        return this._map(rows[0]);
    }
    async findByUsername(username) {
        const [rows] = await connection_1.pool.execute('SELECT * FROM players WHERE username = ? LIMIT 1', [username]);
        if (!rows.length)
            return null;
        return this._map(rows[0]);
    }
    async save(data) {
        const id = (0, crypto_1.randomUUID)();
        await connection_1.pool.execute(`INSERT INTO players (id, username, email, password_hash, role, \`rank\`, coins)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, data.username, data.email, data.passwordHash, data.role, data.rank, data.coins]);
        const player = await this.findById(id);
        return player;
    }
    async update(id, data) {
        const fields = [];
        const values = [];
        if (data.username) {
            fields.push('username = ?');
            values.push(data.username);
        }
        if (data.passwordHash) {
            fields.push('password_hash = ?');
            values.push(data.passwordHash);
        }
        if (data.role) {
            fields.push('role = ?');
            values.push(data.role);
        }
        if (data.rank != null) {
            fields.push('`rank` = ?');
            values.push(data.rank);
        }
        if (data.coins != null) {
            fields.push('coins = ?');
            values.push(data.coins);
        }
        if (fields.length) {
            fields.push('updated_at = NOW()');
            values.push(id);
            await connection_1.pool.execute(`UPDATE players SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        const player = await this.findById(id);
        return player;
    }
    async updateRank(id, newRank) {
        await connection_1.pool.execute('UPDATE players SET `rank` = ?, updated_at = NOW() WHERE id = ?', [newRank, id]);
    }
    async getRankings(limit, offset) {
        const [rows] = await connection_1.pool.execute('SELECT * FROM players ORDER BY `rank` DESC LIMIT ? OFFSET ?', [limit, offset]);
        return rows.map((r) => this._map(r));
    }
    async findRankings(limit, offset) {
        return this.getRankings(limit, offset);
    }
    async findInventory(playerId) {
        const [rows] = await connection_1.pool.execute(`SELECT id, player_id, name, rarity, metadata, acquired_at
       FROM inventory_items
       WHERE player_id = ?
       ORDER BY acquired_at DESC`, [playerId]);
        return rows.map((r) => ({
            ...r,
            metadata: r.metadata ? (typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata) : {},
        }));
    }
    async updateUsername(playerId, username) {
        try {
            const [result] = await connection_1.pool.execute('UPDATE players SET username = ?, updated_at = NOW() WHERE id = ?', [username, playerId]);
            return result.affectedRows > 0;
        }
        catch (err) {
            if (err.code === 'ER_DUP_ENTRY')
                return false;
            throw err;
        }
    }
    async addCoins(playerId, amount) {
        await connection_1.pool.execute('UPDATE players SET coins = coins + ?, updated_at = NOW() WHERE id = ?', [amount, playerId]);
    }
    _map(row) {
        return {
            id: row.id,
            username: row.username,
            email: row.email,
            passwordHash: row.password_hash,
            role: row.role,
            rank: row.rank,
            coins: row.coins,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}
exports.playerRepository = new MySQLPlayerRepository();
//# sourceMappingURL=MySQLPlayerRepository.js.map