/**
 * Genera una firma HMAC-SHA256 para un payload.
 */
export declare function generateHMAC(payload: string): string;
/**
 * Valida una firma HMAC usando comparacion de tiempo constante
 * para prevenir timing attacks.
 */
export declare function validateHMAC(payload: string, receivedSignature: string): boolean;
//# sourceMappingURL=hmac.d.ts.map