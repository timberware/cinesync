/* eslint-disable @typescript-eslint/no-explicit-any */
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { ListDto } from '../dto/list.dto';

export class RemoveListFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(ListDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
