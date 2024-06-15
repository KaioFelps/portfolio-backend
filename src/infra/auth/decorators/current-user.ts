import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TokenPayload } from '../jwt-strategy';

export const CurrentUser = createParamDecorator(
  (_factory, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const thereIsNoUser = Object.keys(request.user ?? {}).length === 0;
    return thereIsNoUser ? null : (request.user as TokenPayload);
  },
);
