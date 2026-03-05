// Tipos para TU backend (The Nexus Battles V)
export type PlayerRole = 'PLAYER' | 'ADMIN' | 'MODERATOR';

// Tipos de items según TU backend
export type ItemTipo = 'Héroe' | 'Arma' | 'Armadura' | 'Habilidad' | 'Ítem' | 'Épica';
export type ItemRareza = 'Común' | 'Rara' | 'Épica' | 'Legendaria';

export interface Item {
  id: string;
  nombre: string;
  tipo: ItemTipo;
  rareza: ItemRareza;
  imagen: string | null;
  descripcion: string;
  habilidades: string[];
  efectos: string[];
  ataque: number;
  defensa: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicPlayer {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  apodo: string;
  avatar: string | null;
  rol: PlayerRole;
  emailVerified: boolean;
  createdAt: string;
}

export interface Filters {
  tipo?: string;
  rareza?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, string[]>;
}

// Mantener los tipos originales de Auctions y Missions si los usarás
export type ItemRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type ItemType = 'WEAPON' | 'ARMOR' | 'SPELL' | 'POTION' | 'ARTIFACT';
export type MissionDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'LEGENDARY';
export type MissionStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
export type AuctionStatus = 'ACTIVE' | 'CLOSED' | 'CANCELLED';

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  placedAt: string;
}

export interface Auction {
  id: string;
  itemId: string;
  itemName: string;
  rarity: ItemRarity;
  startingPrice: number;
  currentPrice: number;
  currentWinnerId: string | null;
  status: AuctionStatus;
  endsAt: string;
  createdAt: string;
  bids: Bid[];
}

export interface MissionObjective {
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface Mission {
  id: string;
  playerId: string;
  title: string;
  description: string;
  difficulty: MissionDifficulty;
  objectives: MissionObjective[];
  reward: { gold: number; xp: number };
  status: MissionStatus;
  aiNarrative: string;
  expiresAt: string;
  createdAt: string;
  completedAt: string | null;
}

export interface InventoryItem {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  stats: {
    attack?: number;
    defense?: number;
    magic?: number;
    agility?: number;
    critChance?: number;
  };
  isEquipped: boolean;
  acquiredAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  player: Pick<PublicPlayer, 'id' | 'apodo' | 'rol'>;
}