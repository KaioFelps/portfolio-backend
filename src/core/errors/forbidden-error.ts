export class ForbiddenError extends Error {
  constructor(message: string = 'Unauthorized.') {
    super(message);
  }
}
