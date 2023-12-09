import { randomUUID } from 'crypto';

export class EntityUniqueId {
  private value: string;

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  toValue() {
    return this.value;
  }

  public equals(id: EntityUniqueId) {
    return id.toValue() === this.value;
  }
}
