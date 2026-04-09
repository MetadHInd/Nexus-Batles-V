export declare class Rating {
    readonly id: string;
    readonly itemId: string;
    readonly userId: string;
    readonly score: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, itemId: string, // ⚠️ Cambiado de productId a itemId
    userId: string, score: number, // En el código se llama score
    createdAt: Date, updatedAt: Date);
    static create(itemId: string, userId: string, score: number): Rating;
    updateScore(newScore: number): Rating;
}
//# sourceMappingURL=Rating.d.ts.map