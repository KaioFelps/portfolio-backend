import { EntityUniqueId } from './entity-unique-id';

export class Entity<PropsType> {
  private _id: EntityUniqueId;

  // apenas acessível INTERNAMENTE à essa classe e classes que a extendam
  protected props: PropsType;

  get id() {
    return this._id;
  }

  protected constructor(props: PropsType, id?: EntityUniqueId) {
    this._id = id ?? new EntityUniqueId();
    this.props = props;
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true;
    }

    if (entity._id === this._id) {
      return true;
    }

    return false;
  }
}
