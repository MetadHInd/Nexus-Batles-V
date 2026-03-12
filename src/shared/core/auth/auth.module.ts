import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '../../cache/cache.module';
import { SSEModule } from '../sse/sse.module';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';

// Services
import { InternalAuthService } from './services/internal/auth.service';
import { ExternalAuthService } from './services/external/auth.service';
import { TokenService } from './services/shared/token.service';
import { PasswordService } from './services/shared/password.service';
import { RoleService } from './services/shared/role.service';
import { SignatureService } from './services/shared/signature.service';
import { ChecksumService } from './services/shared/checksum.service';
import { JwtSecretProvider } from './services/shared/jwt-secret.provider';
import { AuthCacheService } from './services/auth-cache.service';
import { UserRoleService } from './services/user-role.service';
import { UsersService } from './services/users.service';

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { BranchAccessGuard } from './guards/branch-access.guard';
import { DualRoleGuard } from './guards/dual-role.guard';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as any,
      },
    }),
    CacheModule,
    SSEModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    // Auth Services
    InternalAuthService,
    ExternalAuthService,
    TokenService,
    PasswordService,
    RoleService,
    SignatureService,
    ChecksumService,
    JwtSecretProvider,
    AuthCacheService,
    UserRoleService,
    UsersService,

    // Strategies
    JwtStrategy,

    // Guards
    JwtAuthGuard,
    RolesGuard,
    BranchAccessGuard,
    DualRoleGuard,
  ],
  exports: [
    // Auth Services
    InternalAuthService,
    ExternalAuthService,
    TokenService,
    PasswordService,
    RoleService,
    SignatureService,
    ChecksumService,
    JwtSecretProvider,
    AuthCacheService,
    UserRoleService,
    UsersService,

    // Strategies
    JwtStrategy,

    // Guards
    JwtAuthGuard,
    RolesGuard,
    BranchAccessGuard,
    DualRoleGuard,

    // Modules
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}
