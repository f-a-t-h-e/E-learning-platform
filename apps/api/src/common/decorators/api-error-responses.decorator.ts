import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
} from '../entities/error-response.entity';

export function ApiErrorResponses() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: BadRequestResponse,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: UnauthorizedResponse,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      type: ForbiddenResponse,
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
      type: NotFoundResponse,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: InternalServerErrorResponse,
    }),
  );
}
