export class BadRequestError extends Error {
  constructor(message: string = 'Bad request.') {
    super(message);
  }
}
