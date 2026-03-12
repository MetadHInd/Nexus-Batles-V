// src/shared/core/services/service-cache/mixins/authorization.mixin.ts
import { TokenService } from 'src/shared/core/auth/services/shared/token.service';
import { PasswordService } from 'src/shared/core/auth/services/shared/password.service';
import { RoleService } from 'src/shared/core/auth/services/shared/role.service';
import { InternalAuthService } from 'src/shared/core/auth/services/internal/auth.service';
import { ExternalAuthService } from 'src/shared/core/auth/services/external/auth.service';
import { SignatureService } from 'src/shared/core/auth/services/shared/signature.service';

type Constructor<T = object> = new (...args: any[]) => T;

export function WithAuthorization<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    public readonly tokenService = new TokenService();
    public readonly passwordService = new PasswordService();
    public readonly roleService = new RoleService();
    public readonly signatureService = new SignatureService();
    // public readonly checksumService = new ChecksumService(
    //   new SignatureService(),
    // );
    // Nota: ChecksumService debe ser inyectado por NestJS donde se necesite.

    // NOTA: InternalAuthService y ExternalAuthService son servicios de NestJS 
    // con @Injectable() y deben ser inyectados, no instanciados directamente
    // public readonly internal = new InternalAuthService();
    // public readonly external = new ExternalAuthService();

    get Authorization() {
      return {
        TokenService: this.tokenService,
        PasswordService: this.passwordService,
        RoleService: this.roleService,
        SignatureService: this.signatureService,
        // ChecksumService: this.checksumService, // Debe ser inyectado donde se necesite
        // Internal: this.internal, // Debe ser inyectado por NestJS
        // External: this.external, // Debe ser inyectado por NestJS
      };
    }
  };
}
