import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'is_public_route';

export function PublicRoute() {
  return SetMetadata(IS_PUBLIC, true);
}
