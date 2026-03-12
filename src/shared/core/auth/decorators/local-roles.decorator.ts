import { SetMetadata } from '@nestjs/common';
import { LocalRole } from '../constants/roles.enum';

export const LocalRoles = (...roles: LocalRole[]) =>
  SetMetadata('localRoles', roles);
