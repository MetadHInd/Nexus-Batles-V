import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import { AnswerManager } from '../utils/answer-manager';

@Injectable()
export class AnswerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response & { ms: number }>();
    const req = ctx.getRequest();

    // Excluir rutas SSE - no modificar headers en streams SSE
    if (req.url && req.url.includes('/sse/')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        AnswerManager.handleSuccess(res, data);
      }),
    );
  }
}
