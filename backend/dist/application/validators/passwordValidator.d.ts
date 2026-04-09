/**
 * SCRUM-43: Validador de contraseñas
 */
export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare function validatePassword(password: string): PasswordValidationResult;
//# sourceMappingURL=passwordValidator.d.ts.map