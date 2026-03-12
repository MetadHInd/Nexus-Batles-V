import { SetMetadata } from '@nestjs/common';

export const BYPASS_FOR_SYSTEM_ADMIN_KEY = 'bypassForSystemAdmin';
export const BypassForSystemAdmin = () =>
  SetMetadata(BYPASS_FOR_SYSTEM_ADMIN_KEY, true);
