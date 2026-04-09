"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminChatbotController = void 0;
const crypto_1 = require("crypto");
const connection_1 = require("../../database/connection");
const env_1 = require("../../../config/env");
const adminChatbotAuth_middleware_1 = require("../middlewares/adminChatbotAuth.middleware");
const CATEGORY_FILES = {
    arma: 'arma.json',
    armaduras: 'armaduras.json',
    efectos_aleatorios: 'efectos_aleatorios.json',
    epicas: 'epicas.json',
    habilidades_heroes: 'habilidades_heroes.json',
    heroes: 'heroes.json',
    items: 'items.json',
    mazo: 'mazo.json',
    mecanicas_juego: 'mecanicas_juego.json',
};
const CATEGORY_ARRAY_PATHS = {
    arma: ['arma'],
    armaduras: ['armaduras'],
    efectos_aleatorios: ['random_effects_system', 'effect_types'],
    epicas: ['epicas'],
    habilidades_heroes: ['habilidades'],
    heroes: ['heroes'],
    items: ['items'],
    mazo: ['deck_composition', 'cards'],
    mecanicas_juego: ['mecanicas', 'game_modes'],
};
class AdminChatbotController {
    constructor() {
        this.auditTableReady = false;
        this.login = async (req, res, _next) => {
            const username = String(req.body?.username ?? '').trim();
            const password = String(req.body?.password ?? '').trim();
            if (!username || !password) {
                res.status(400).json({
                    success: false,
                    error: 'MISSING_CREDENTIALS',
                    message: 'Debes enviar username y password para iniciar sesión de administrador.',
                });
                return;
            }
            if (username !== env_1.env.ADMIN_USERNAME || password !== env_1.env.ADMIN_PASSWORD) {
                res.status(401).json({
                    success: false,
                    error: 'INVALID_ADMIN_CREDENTIALS',
                    message: 'Credenciales de administrador inválidas.',
                });
                return;
            }
            const token = (0, adminChatbotAuth_middleware_1.createAdminChatbotSession)(username);
            res.json({
                success: true,
                data: {
                    username,
                    token,
                },
            });
        };
        this.logout = async (req, res) => {
            const token = req.header('x-admin-session') ?? req.header('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
            if (token) {
                (0, adminChatbotAuth_middleware_1.destroyAdminChatbotSession)(token);
            }
            res.json({ success: true, message: 'Sesión de administrador cerrada correctamente.' });
        };
        this.listKnowledgeBase = async (_req, res, next) => {
            try {
                const summary = await Promise.all(Object.entries(CATEGORY_FILES).map(async ([category, fileName]) => {
                    const entries = await this.readCategory(category);
                    return {
                        category,
                        fileName,
                        entriesCount: entries.length,
                    };
                }));
                res.json({ success: true, data: summary });
            }
            catch (error) {
                next(error);
            }
        };
        this.getKnowledgeBaseByCategory = async (req, res, next) => {
            try {
                const category = this.normalizeCategory(req.params.category);
                const fileName = this.getFileNameByCategory(category);
                const entries = await this.readCategory(category);
                res.json({
                    success: true,
                    data: {
                        category,
                        fileName,
                        entries,
                        entriesCount: entries.length,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.createKnowledgeBaseEntry = async (req, res, next) => {
            try {
                const category = this.normalizeCategory(req.params.category);
                const fileName = this.getFileNameByCategory(category);
                const entry = this.normalizeIncomingEntry(req.body);
                const sourcePath = this.getCategoryFilePath(category);
                const subcategoria = this.getSubcategoryByCategory(category);
                const entryId = this.getStableEntryId(entry);
                const persistedEntry = this.stripInternalId(entry);
                const nombre = this.extractName(persistedEntry);
                await connection_1.pool.query(`INSERT INTO knowledge_base_entries
          (categoria, subcategoria, entry_id, nombre, datos, source_file, source_path)
         VALUES (?, ?, ?, ?, CAST(? AS JSON), ?, ?)`, [category, subcategoria, entryId, nombre, JSON.stringify(persistedEntry), fileName, sourcePath]);
                const entryWithId = persistedEntry.id === undefined || persistedEntry.id === null || String(persistedEntry.id).trim() === ''
                    ? { ...persistedEntry, id: entryId }
                    : persistedEntry;
                const detail = this.getEntryDescriptor(entryWithId, 0);
                await this.insertAuditLog(fileName, 'agregar', detail, req.admin?.username ?? env_1.env.ADMIN_USERNAME);
                res.status(201).json({
                    success: true,
                    message: `Entrada agregada correctamente en ${fileName}.`,
                    data: entryWithId,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateKnowledgeBaseEntry = async (req, res, next) => {
            try {
                const category = this.normalizeCategory(req.params.category);
                const fileName = this.getFileNameByCategory(category);
                const entryId = String(req.params.id);
                const partialEntry = this.normalizeIncomingEntry(req.body);
                const sourcePath = this.getCategoryFilePath(category);
                const targetEntryId = await this.resolveTargetEntryId(category, entryId);
                if (!targetEntryId) {
                    res.status(404).json({
                        success: false,
                        error: 'ENTRY_NOT_FOUND',
                        message: `No se encontró una entrada con identificador ${entryId} en ${fileName}.`,
                    });
                    return;
                }
                const [rows] = await connection_1.pool.query(`SELECT datos
         FROM knowledge_base_entries
         WHERE categoria = ? AND source_path = ? AND entry_id = ?
         LIMIT 1`, [category, sourcePath, targetEntryId]);
                const currentRow = rows[0];
                if (!currentRow) {
                    res.status(404).json({
                        success: false,
                        error: 'ENTRY_NOT_FOUND',
                        message: `No se encontró una entrada con identificador ${entryId} en ${fileName}.`,
                    });
                    return;
                }
                const parsed = this.parseDatos(currentRow.datos);
                const currentEntry = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
                const nextEntry = {
                    ...currentEntry,
                    ...partialEntry,
                };
                const nextEntryId = this.getStableEntryId(nextEntry);
                const persistedNextEntry = this.stripInternalId(nextEntry);
                const nombre = this.extractName(persistedNextEntry);
                await connection_1.pool.query(`UPDATE knowledge_base_entries
         SET entry_id = ?, nombre = ?, datos = CAST(? AS JSON), updated_at = CURRENT_TIMESTAMP
         WHERE categoria = ? AND source_path = ? AND entry_id = ?`, [nextEntryId, nombre, JSON.stringify(persistedNextEntry), category, sourcePath, targetEntryId]);
                const responseEntry = persistedNextEntry.id === undefined || persistedNextEntry.id === null || String(persistedNextEntry.id).trim() === ''
                    ? { ...persistedNextEntry, id: nextEntryId }
                    : persistedNextEntry;
                const detail = this.getEntryDescriptor(responseEntry, 0);
                await this.insertAuditLog(fileName, 'editar', detail, req.admin?.username ?? env_1.env.ADMIN_USERNAME);
                res.json({
                    success: true,
                    message: `Entrada ${entryId} actualizada correctamente en ${fileName}.`,
                    data: responseEntry,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteKnowledgeBaseEntry = async (req, res, next) => {
            try {
                const category = this.normalizeCategory(req.params.category);
                const fileName = this.getFileNameByCategory(category);
                const entryId = String(req.params.id);
                const sourcePath = this.getCategoryFilePath(category);
                const targetEntryId = await this.resolveTargetEntryId(category, entryId);
                if (!targetEntryId) {
                    res.status(404).json({
                        success: false,
                        error: 'ENTRY_NOT_FOUND',
                        message: `No se encontró una entrada con identificador ${entryId} en ${fileName}.`,
                    });
                    return;
                }
                const [rows] = await connection_1.pool.query(`SELECT datos
         FROM knowledge_base_entries
         WHERE categoria = ? AND source_path = ? AND entry_id = ?
         LIMIT 1`, [category, sourcePath, targetEntryId]);
                const parsed = this.parseDatos(rows[0]?.datos);
                const deletedEntry = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
                    ? { ...parsed, id: targetEntryId }
                    : { id: targetEntryId };
                await connection_1.pool.query(`DELETE FROM knowledge_base_entries
         WHERE categoria = ? AND source_path = ? AND entry_id = ?`, [category, sourcePath, targetEntryId]);
                const detail = this.getEntryDescriptor(deletedEntry, 0);
                await this.insertAuditLog(fileName, 'eliminar', detail, req.admin?.username ?? env_1.env.ADMIN_USERNAME);
                res.json({
                    success: true,
                    message: `Entrada ${entryId} eliminada correctamente de ${fileName}.`,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getLogs = async (_req, res, next) => {
            try {
                await this.ensureAuditTable();
                const [rows] = await connection_1.pool.query(`SELECT id, fecha_hora, categoria, accion, detalle, admin_usuario
         FROM admin_audit_log
         ORDER BY fecha_hora DESC, id DESC`);
                res.json({ success: true, data: rows });
            }
            catch (error) {
                next(error);
            }
        };
        this.getBackups = async (_req, res, next) => {
            try {
                const { backupService } = await Promise.resolve().then(() => __importStar(require('../../database/MySQLBackupService')));
                const backupList = await backupService.listBackups(10);
                const backupsWithInfo = await Promise.all(backupList.map(async (fileName) => {
                    const info = await backupService.getBackupInfo(fileName);
                    return {
                        fileName,
                        size: info?.size ?? 0,
                        sizeKb: info ? (info.size / 1024).toFixed(2) : '0',
                        createdAt: info?.createdAt ?? new Date(),
                    };
                }));
                res.json({
                    success: true,
                    data: {
                        backups: backupsWithInfo,
                        totalCount: backupList.length,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
    normalizeCategory(rawCategory) {
        return String(rawCategory ?? '').trim().toLowerCase().replace(/\.json$/i, '');
    }
    getFileNameByCategory(category) {
        const fileName = CATEGORY_FILES[category];
        if (!fileName) {
            const valid = Object.keys(CATEGORY_FILES).join(', ');
            throw new Error(`Categoría inválida: ${category}. Categorías permitidas: ${valid}.`);
        }
        return fileName;
    }
    getCategoryFilePath(category) {
        return CATEGORY_ARRAY_PATHS[category].join('.');
    }
    async readCategory(category) {
        const sourcePath = this.getCategoryFilePath(category);
        const [rows] = await connection_1.pool.query(`SELECT entry_id, datos
       FROM knowledge_base_entries
       WHERE categoria = ? AND source_path = ?
       ORDER BY id ASC`, [category, sourcePath]);
        const result = [];
        for (const row of rows) {
            const parsed = this.parseDatos(row.datos);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                continue;
            }
            const asEntry = parsed;
            if (asEntry.id === undefined || asEntry.id === null || String(asEntry.id).trim() === '') {
                result.push({
                    ...asEntry,
                    id: row.entry_id,
                });
            }
            else {
                result.push(asEntry);
            }
        }
        return result;
    }
    async writeCategory(category, entries) {
        const sourcePath = this.getCategoryFilePath(category);
        const subcategoria = this.getSubcategoryByCategory(category);
        const sourceFile = this.getFileNameByCategory(category);
        for (const entry of entries) {
            const entryId = this.getStableEntryId(entry);
            const sanitized = this.stripInternalId(entry);
            const nombre = this.extractName(sanitized);
            await connection_1.pool.query(`INSERT INTO knowledge_base_entries
          (categoria, subcategoria, entry_id, nombre, datos, source_file, source_path)
         VALUES (?, ?, ?, ?, CAST(? AS JSON), ?, ?)
         ON DUPLICATE KEY UPDATE
           nombre = VALUES(nombre),
           datos = VALUES(datos),
           source_file = VALUES(source_file),
           source_path = VALUES(source_path),
           updated_at = CURRENT_TIMESTAMP`, [category, subcategoria, entryId, nombre, JSON.stringify(sanitized), sourceFile, sourcePath]);
        }
    }
    parseDatos(raw) {
        if (raw === null || raw === undefined) {
            return null;
        }
        if (typeof raw === 'string') {
            try {
                return JSON.parse(raw);
            }
            catch {
                return raw;
            }
        }
        return raw;
    }
    getSubcategoryByCategory(category) {
        const pathSegments = CATEGORY_ARRAY_PATHS[category] ?? [category];
        return pathSegments[pathSegments.length - 1];
    }
    getStableEntryId(entry) {
        const raw = entry.id;
        if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
            return String(raw);
        }
        return (0, crypto_1.randomUUID)();
    }
    stripInternalId(entry) {
        const cloned = { ...entry };
        const id = cloned.id;
        if (id !== undefined && id !== null && String(id).trim() !== '') {
            return cloned;
        }
        delete cloned.id;
        return cloned;
    }
    extractName(entry) {
        const preferredKeys = ['nombre', 'name', 'title', 'titulo', 'type', 'effect', 'mode', 'hero'];
        for (const key of preferredKeys) {
            const value = entry[key];
            if (value !== undefined && value !== null && String(value).trim() !== '') {
                return String(value);
            }
        }
        return null;
    }
    async resolveTargetEntryId(category, id) {
        const sourcePath = this.getCategoryFilePath(category);
        const [directRows] = await connection_1.pool.query(`SELECT entry_id
       FROM knowledge_base_entries
       WHERE categoria = ? AND source_path = ? AND entry_id = ?
       LIMIT 1`, [category, sourcePath, id]);
        const direct = directRows;
        if (direct.length > 0) {
            return direct[0].entry_id;
        }
        if (!/^\d+$/.test(id)) {
            return null;
        }
        const offset = Number(id);
        const [indexRows] = await connection_1.pool.query(`SELECT entry_id
       FROM knowledge_base_entries
       WHERE categoria = ? AND source_path = ?
       ORDER BY id ASC
       LIMIT 1 OFFSET ?`, [category, sourcePath, offset]);
        const byIndex = indexRows;
        if (byIndex.length === 0) {
            return null;
        }
        return byIndex[0].entry_id;
    }
    normalizeIncomingEntry(payload) {
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            throw new Error('La entrada enviada es inválida. Se esperaba un objeto JSON.');
        }
        return payload;
    }
    ensureEntryIdentifier(entry) {
        if (entry.id !== undefined && entry.id !== null && String(entry.id).trim() !== '') {
            return entry;
        }
        return {
            ...entry,
            id: (0, crypto_1.randomUUID)(),
        };
    }
    findEntryIndex(entries, id) {
        const byId = entries.findIndex((entry) => {
            if (entry.id === undefined || entry.id === null) {
                return false;
            }
            return String(entry.id) === id;
        });
        if (byId >= 0) {
            return byId;
        }
        if (/^\d+$/.test(id)) {
            const index = Number(id);
            if (index >= 0 && index < entries.length) {
                return index;
            }
        }
        return -1;
    }
    getEntryDescriptor(entry, index) {
        const preferredKeys = ['nombre', 'name', 'title', 'titulo', 'id'];
        for (const key of preferredKeys) {
            const value = entry[key];
            if (value !== undefined && value !== null && String(value).trim() !== '') {
                return String(value);
            }
        }
        return `entry_index_${index}`;
    }
    async ensureAuditTable() {
        if (this.auditTableReady) {
            return;
        }
        await connection_1.pool.query(`
      CREATE TABLE IF NOT EXISTS admin_audit_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        categoria VARCHAR(100) NOT NULL,
        accion ENUM('agregar', 'editar', 'eliminar') NOT NULL,
        detalle VARCHAR(255) NOT NULL,
        admin_usuario VARCHAR(100) NOT NULL,
        INDEX idx_fecha_hora (fecha_hora DESC)
      )
    `);
        this.auditTableReady = true;
    }
    async insertAuditLog(categoria, accion, detalle, adminUsuario) {
        await this.ensureAuditTable();
        await connection_1.pool.query(`INSERT INTO admin_audit_log (categoria, accion, detalle, admin_usuario)
       VALUES (?, ?, ?, ?)`, [categoria, accion, detalle, adminUsuario]);
    }
}
exports.AdminChatbotController = AdminChatbotController;
//# sourceMappingURL=AdminChatbotController.js.map