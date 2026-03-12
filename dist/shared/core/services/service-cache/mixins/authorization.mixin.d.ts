import { TokenService } from 'src/shared/core/auth/services/shared/token.service';
import { PasswordService } from 'src/shared/core/auth/services/shared/password.service';
import { RoleService } from 'src/shared/core/auth/services/shared/role.service';
import { SignatureService } from 'src/shared/core/auth/services/shared/signature.service';
type Constructor<T = object> = new (...args: any[]) => T;
export declare function WithAuthorization<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        readonly tokenService: TokenService;
        readonly passwordService: PasswordService;
        readonly roleService: RoleService;
        readonly signatureService: SignatureService;
        get Authorization(): {
            TokenService: TokenService;
            PasswordService: PasswordService;
            RoleService: RoleService;
            SignatureService: SignatureService;
        };
    };
} & TBase;
export {};
