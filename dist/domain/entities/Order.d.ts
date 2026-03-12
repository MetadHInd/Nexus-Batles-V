export declare class Order {
    id: number | null;
    userId: number;
    total: number;
    createdAt: Date;
    constructor(id: number | null, userId: number, total: number, createdAt?: Date);
}
