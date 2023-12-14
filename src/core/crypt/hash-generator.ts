export abstract class IHashGenerator {
  abstract generate(plain: string): Promise<string>;
}
