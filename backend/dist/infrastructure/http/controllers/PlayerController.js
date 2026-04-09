"use strict";
/**
 * PlayerController.ts — Infrastructure / Controllers
 * Implementa todos los endpoints de /api/v1/players que estaban en 501.
 *
 * Endpoints que cubre:
 *   GET  /players/rankings         → playerController.getRankings
 *   GET  /players/me               → playerController.getMe
 *   PATCH /players/me              → playerController.updateMe
 *   GET  /players/me/inventory     → playerController.getInventory
 *   GET  /players/:id              → playerController.getById
 *
 * NOTA: Este controlador lee directamente de los repositorios MySQL.
 * El equipo de dominio puede extraerlos a use cases en la siguiente iteración.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerController = exports.PlayerController = void 0;
const MySQLPlayerRepository_1 = require("../../repositories/MySQLPlayerRepository");
const logger_1 = require("../../logging/logger");
class PlayerController {
    // ── GET /api/v1/players/rankings ────────────────────────────────────────────
    async getRankings(req, res, next) {
        try {
            const limit = Math.min(parseInt(req.query.limit) || 50, 100);
            const offset = parseInt(req.query.offset) || 0;
            const players = await MySQLPlayerRepository_1.playerRepository.findRankings(limit, offset);
            res.json({
                success: true,
                data: players.map(p => ({
                    id: p.id,
                    username: p.username,
                    role: p.role,
                    rank: p.rank,
                    gold: p.coins,
                    xp: p.xp ?? 0,
                })),
            });
        }
        catch (err) {
            next(err);
        }
    }
    // ── GET /api/v1/players/me ───────────────────────────────────────────────────
    async getMe(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
                return;
            }
            const player = await MySQLPlayerRepository_1.playerRepository.findById(userId);
            if (!player) {
                res.status(404).json({ success: false, error: 'PLAYER_NOT_FOUND' });
                return;
            }
            // Nunca exponer passwordHash
            res.json({
                success: true,
                data: {
                    id: player.id,
                    username: player.username,
                    email: player.email,
                    role: player.role,
                    rank: player.rank,
                    gold: player.coins,
                    xp: player.xp ?? 0,
                    createdAt: player.createdAt,
                },
            });
        }
        catch (err) {
            next(err);
        }
    }
    // ── PATCH /api/v1/players/me ─────────────────────────────────────────────────
    async updateMe(req, res, next) {
        try {
            const userId = req.user?.id;
            const { username } = req.body;
            // Solo se permite cambiar el username por ahora
            if (!username || typeof username !== 'string' || username.trim().length < 3) {
                res.status(400).json({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: 'El username debe tener al menos 3 caracteres',
                });
                return;
            }
            const updated = await MySQLPlayerRepository_1.playerRepository.updateUsername(userId, username.trim());
            if (!updated) {
                res.status(409).json({ success: false, error: 'USERNAME_TAKEN' });
                return;
            }
            logger_1.logger.info('PlayerController.updateMe', { userId, username });
            res.json({
                success: true,
                data: { username: username.trim() },
            });
        }
        catch (err) {
            next(err);
        }
    }
    // ── GET /api/v1/players/me/inventory ─────────────────────────────────────────
    async getInventory(req, res, next) {
        try {
            const userId = req.user?.id;
            const items = await MySQLPlayerRepository_1.playerRepository.findInventory(userId);
            res.json({
                success: true,
                data: items.map(item => ({
                    id: item.id,
                    ownerId: item.player_id,
                    name: item.name,
                    description: item.metadata?.description ?? '',
                    type: item.metadata?.type ?? 'ARTIFACT',
                    rarity: item.rarity,
                    stats: item.metadata?.stats ?? {},
                    isEquipped: item.metadata?.isEquipped ?? false,
                    acquiredAt: item.acquired_at,
                })),
            });
        }
        catch (err) {
            next(err);
        }
    }
    // ── GET /api/v1/players/:id ──────────────────────────────────────────────────
    async getById(req, res, next) {
        try {
            const player = await MySQLPlayerRepository_1.playerRepository.findById(req.params.id);
            if (!player) {
                res.status(404).json({ success: false, error: 'PLAYER_NOT_FOUND' });
                return;
            }
            // Vista pública: sin email ni passwordHash
            res.json({
                success: true,
                data: {
                    id: player.id,
                    username: player.username,
                    role: player.role,
                    rank: player.rank,
                    gold: player.coins,
                    xp: player.xp ?? 0,
                },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.PlayerController = PlayerController;
exports.playerController = new PlayerController();
//# sourceMappingURL=PlayerController.js.map