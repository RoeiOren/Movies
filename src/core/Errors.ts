export class ServiceError {
  private message: string;
  private code: number;

  constructor(message: string, code: number) {
    this.message = message;
    this.code = code;
  }
}

export class InternalError extends ServiceError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

export class AuthenticationError extends ServiceError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class forbiddenError extends ServiceError {
  constructor(message = 'Resource forbidden') {
    super(message, 403);
  }
}

export class BadRequestError extends ServiceError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class ValidationError extends ServiceError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class NotFoundError extends ServiceError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}
