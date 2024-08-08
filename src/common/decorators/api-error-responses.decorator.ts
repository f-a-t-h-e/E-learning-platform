import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BadRequestResponse, InternalServerErrorResponse, NotFoundResponse, UnauthorizedResponse } from '../entities/error-response.entity';

export function ApiErrorResponses() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      type: BadRequestResponse,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      type: UnauthorizedResponse,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found',
      type: NotFoundResponse,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: InternalServerErrorResponse,
    }),
  );
}
