export abstract class IEncryptor {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>;
}
