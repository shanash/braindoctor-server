export class ApplicationError extends Error {
  constructor(message, status) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong. Please try again.';

    this.status = status || 500;
  }
}

export class UserNotFoundError extends ApplicationError {
  constructor(message) {
    super(message || 'No User found.', 404);
  }
}

export class FileConventionError extends ApplicationError {
  constructor(message) {
    super(message || 'Invalid file specification.', 404);
  }
}

export class NotCorrectRequestError extends ApplicationError {
  constructor(message) {
    super(message || 'Not Correct user reqeust.', 404);
  }
}