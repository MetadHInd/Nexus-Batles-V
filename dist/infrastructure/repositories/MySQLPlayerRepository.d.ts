import type { Player } from '../../domain/entities/Player';
interface InventoryRow {
    id: string;
    player_id: string;
    name: string;
    rarity: string;
    metadata: any;
    acquired_at: Date;
}
declare class MySQLPlayerRepository {
    findById(id: string): Promise<Player | null>;
    findByEmail(email: string): Promise<Player | null>;
    findByUsername(username: string): Promise<Player | null>;
    save(data: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>): Promise<Player>;
    update(id: string, data: Partial<Player>): Promise<Player>;
    updateRank(id: string, newRank: number): Promise<void>;
    getRankings(limit: number, offset: number): Promise<Player[]>;
    findRankings(limit: number, offset: number): Promise<Player[]>;
    findInventory(playerId: string): Promise<InventoryRow[]>;
    updateUsername(playerId: string, username: string): Promise<boolean>;
    addCoins(playerId: string, amount: number): Promise<void>;
    private _map;
}
export declare const playerRepository: MySQLPlayerRepository;
export {};
