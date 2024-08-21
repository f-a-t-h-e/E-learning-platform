import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({
    description: 'The HTTP status code of the error',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'A short description of the error',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'A more detailed error message',
    example: 'Invalid input data',
    nullable: true,
  })
  error?: string;
}

export class BadRequestResponse implements ErrorResponse {
  @ApiProperty({
    description:
      'The HTTP status code indicating a client-side error due to invalid input or request.',
    example: 400,
  })
  statusCode: 400;

  @ApiProperty({
    description:
      'A brief description of the error type, indicating that the request was malformed or invalid.',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description:
      'A detailed message explaining what was wrong with the request, such as missing parameters or invalid data.',
    example: 'The email field is required and cannot be empty.',
    nullable: true,
    required: false,
  })
  error?: string;
}

export class UnauthorizedResponse implements ErrorResponse {
  @ApiProperty({
    description:
      'The HTTP status code indicating that the request requires user authentication.',
    example: 401,
  })
  statusCode: 401;

  @ApiProperty({
    description:
      'A brief description indicating that authentication is required to access the resource.',
    example: 'Unauthorized',
  })
  message: string;

  @ApiProperty({
    description:
      'A detailed message explaining why the request is unauthorized, such as invalid credentials or missing token.',
    example: 'Authentication token is missing or invalid.',
    nullable: true,
    required: false,
  })
  error?: string;
}

export class ForbiddenResponse implements ErrorResponse {
  @ApiProperty({
    description:
      'The HTTP status code indicating that the server understood the request but refuses to authorize it.',
    example: 403,
  })
  statusCode: 403;

  @ApiProperty({
    description:
      'A brief description indicating that access to the resource is forbidden.',
    example: 'Forbidden',
  })
  message: string;

  @ApiProperty({
    description:
      'A detailed message explaining why access is forbidden, such as insufficient permissions.',
    example: 'You do not have permission to access this resource.',
    nullable: true,
    required: false,
  })
  error?: string;
}

export class NotFoundResponse implements ErrorResponse {
  @ApiProperty({
    description:
      'The HTTP status code indicating that the requested resource was not found.',
    example: 404,
  })
  statusCode: 404;

  @ApiProperty({
    description:
      'A brief description indicating that the requested resource could not be found on the server.',
    example: 'Not Found',
  })
  message: string;

  @ApiProperty({
    description:
      'A detailed message explaining which resource could not be found, such as a missing user or endpoint.',
    example: 'The user with the given ID does not exist.',
    nullable: true,
    required: false,
  })
  error?: string;
}

export class InternalServerErrorResponse implements ErrorResponse {
  @ApiProperty({
    description:
      'The HTTP status code indicating that an unexpected server error occurred.',
    example: 500,
  })
  statusCode: 500;

  @ApiProperty({
    description:
      'A brief description indicating that an internal server error occurred, which is not related to the client request.',
    example: 'Internal Server Error',
  })
  message: string;

  @ApiProperty({
    description:
      'A detailed message providing additional context about the server error, such as stack traces or unexpected failures.',
    example:
      'An unexpected error occurred while processing the request. Please try again later.',
    nullable: true,
    required: false,
  })
  error?: string;
}
