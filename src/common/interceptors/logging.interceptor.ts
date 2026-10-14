import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const start = Date.now();

        const request = context.switchToHttp().getRequest();

        console.log(`Before: ${request.method} ${request.url}`);

        return next.handle().pipe(
            tap(() => {
                console.log(`Handler finished in ${Date.now() - start}ms`);
            }),
        );
    }
}