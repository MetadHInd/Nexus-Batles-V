import { Injectable, ForbiddenException } from '@nestjs/common';
import { Role } from '../../constants/roles.enum';
import { UserAuth } from '../../interfaces/shared/user-auth.interface';
import { GenericErrorMessages } from 'src/shared/constants/generic-error-messages.enum';

@Injectable()
export class RoleService {
  validate(user: UserAuth, allowedRoles: Role[]): void {
    if (!user || !allowedRoles.includes(user.role)) {
      throw new ForbiddenException(GenericErrorMessages.FORBIDDEN_ACCESS);
    }
  }
}
