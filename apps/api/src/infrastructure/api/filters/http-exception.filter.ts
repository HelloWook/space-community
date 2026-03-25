// 전역 HTTP 예외 필터

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

/** HTTP 예외를 잡아 통일된 에러 응답 형식으로 반환하는 필터 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // 문자열 또는 객체 형태의 예외 응답 처리
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as Record<string, unknown>).message ||
          exception.message;

    const error =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as Record<string, unknown>).error ||
          exception.name;

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
