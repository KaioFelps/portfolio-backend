export class WrongCredentialError extends Error {
  constructor() {
    super('Wrong credentials.');
  }
}
