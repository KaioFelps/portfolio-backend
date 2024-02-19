import { Entity } from './entity';
import { EntityUniqueId } from './entity-unique-id';

export interface ITag {
  value: string;
}

export class Tag extends Entity<ITag> {
  get value() {
    return this.value;
  }

  static create(props: ITag, id?: EntityUniqueId) {
    return new Tag(props, id);
  }
}
