export abstract class IHashComparor {
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
