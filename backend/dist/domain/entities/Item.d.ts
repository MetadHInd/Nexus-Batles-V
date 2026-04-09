export interface ItemProps {
    id?: string;
    nombre: string;
    tipo: 'Héroe' | 'Arma' | 'Armadura' | 'Habilidad' | 'Ítem' | 'Épica';
    rareza?: 'Común' | 'Rara' | 'Épica' | 'Legendaria';
    imagen?: string;
    descripcion?: string;
    habilidades?: string[];
    efectos?: string[];
    ataque?: number;
    defensa?: number;
    userId?: string;
    enSubasta?: boolean;
    enMazoActivo?: boolean;
    activo?: boolean;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Item {
    readonly id: string;
    readonly nombre: string;
    readonly tipo: 'Héroe' | 'Arma' | 'Armadura' | 'Habilidad' | 'Ítem' | 'Épica';
    readonly rareza: 'Común' | 'Rara' | 'Épica' | 'Legendaria';
    readonly imagen: string | null;
    readonly descripcion: string;
    readonly habilidades: string[];
    readonly efectos: string[];
    readonly ataque: number;
    readonly defensa: number;
    readonly userId: string | null;
    readonly enSubasta: boolean;
    readonly enMazoActivo: boolean;
    activo: boolean;
    deletedAt: Date | null;
    readonly updatedAt: Date;
    readonly createdAt: Date;
    constructor(props: ItemProps);
    private validate;
    canBeDeleted(): void;
    markAsDeleted(): void;
    belongsTo(userId: string): boolean;
    toPublic(): any;
    toPersistence(): ItemProps;
    static fromPersistence(data: ItemProps): Item;
}
//# sourceMappingURL=Item.d.ts.map