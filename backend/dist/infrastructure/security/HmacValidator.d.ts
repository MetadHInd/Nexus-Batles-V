/**
 * HmacValidator.ts — Infrastructure / Security
 * FIX: import de config corregido. Coma extra en ruta '../../config/index,' eliminada.
 *      Reemplazado por import directo de env.
 */
export declare class HmacValidator {
    private readonly secret;
    constructor();
    sign(payload: string | object): string;
    validate(payload: string | object, signature: string): boolean;
    validateWithTimestamp(payload: string | object, signature: string, timestamp: number, maxAgeSeconds?: number): boolean;
}
//# sourceMappingURL=HmacValidator.d.ts.map