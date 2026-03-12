import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Extrae el managerId del request
 * Busca en: query params > body > user (JWT payload)
 * 
 * @example
 * ```typescript
 * @Sse('stream')
 * streamEvents(
 *   @ManagerId() managerId: string
 * ) { ... }
 * ```
 */
export const ManagerId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    // 1. Query param
    if (request.query.managerId && typeof request.query.managerId === 'string') {
      return request.query.managerId;
    }

    // 2. Body (para POST requests)
    if (request.body?.managerId) {
      return request.body.managerId;
    }

    // 3. User payload del JWT
    const user = (request as any).user;
    if (user?.managerId) {
      return user.managerId;
    }

    // 4. Inferir del userId si existe convención
    if (user?.id || user?.sub) {
      return user.id || user.sub;
    }

    return undefined;
  },
);

/**
 * Extrae el tenantId del request
 * Busca en: query params > user (JWT payload) > headers
 * 
 * @example
 * ```typescript
 * @Sse('stream')
 * streamEvents(
 *   @TenantId() tenantId: string
 * ) { ... }
 * ```
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    // 1. Query param
    if (request.query.tenantId && typeof request.query.tenantId === 'string') {
      return request.query.tenantId;
    }

    // 2. User payload del JWT
    const user = (request as any).user;
    if (user?.tenantId) {
      return user.tenantId;
    }

    // 3. Header personalizado
    const tenantHeader = request.headers['x-tenant-id'];
    if (tenantHeader && typeof tenantHeader === 'string') {
      return tenantHeader;
    }

    return undefined;
  },
);

/**
 * Extrae el clientId/sessionId del request
 * 
 * @example
 * ```typescript
 * @Sse('stream')
 * streamEvents(
 *   @SessionId() sessionId: string
 * ) { ... }
 * ```
 */
export const SessionId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    // 1. Query param
    if (request.query.sessionId && typeof request.query.sessionId === 'string') {
      return request.query.sessionId;
    }

    // 2. Body
    if (request.body?.sessionId) {
      return request.body.sessionId;
    }

    // 3. Header
    const sessionHeader = request.headers['x-session-id'];
    if (sessionHeader && typeof sessionHeader === 'string') {
      return sessionHeader;
    }

    return undefined;
  },
);

/**
 * Extrae el usuario completo del JWT payload
 * 
 * @example
 * ```typescript
 * @Sse('stream')
 * streamEvents(
 *   @SSEUser() user: any
 * ) { ... }
 * ```
 */
export const SSEUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = (request as any).user;

    return data ? user?.[data] : user;
  },
);

/**
 * Extrae metadata del cliente desde query params
 * 
 * @example
 * ```typescript
 * @Sse('stream')
 * streamEvents(
 *   @ClientMetadata() metadata: Record<string, any>
 * ) { ... }
 * ```
 */
export const ClientMetadata = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Record<string, any> => {
    const request = ctx.switchToHttp().getRequest<Request>();

    // Construir metadata desde query params y headers
    return {
      userAgent: request.headers['user-agent'],
      ip: request.ip || request.socket.remoteAddress,
      referer: request.headers.referer,
      origin: request.headers.origin,
      // Metadata personalizada desde query params
      ...request.query,
    };
  },
);
