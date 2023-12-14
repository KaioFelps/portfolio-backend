import { Entity } from '@/core/entities/entity';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';

export enum LogTarget {
  project = 'project',
  post = 'post',
  user = 'user',
}

export enum LogAction {
  created = 'created',
  updated = 'updated',
  deleted = 'deleted',
}

export interface LogProps {
  dispatcherId: EntityUniqueId;
  target: LogTarget;
  action: LogAction;
  createdAt: Date;
}

export class Log extends Entity<LogProps> {
  constructor(props: LogProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(props: Optional<LogProps, 'createdAt'>, id?: EntityUniqueId) {
    const project = new Log(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return project;
  }

  get dispatcherId() {
    return this.props.dispatcherId;
  }

  get target() {
    return this.props.target.toString();
  }

  get action() {
    return this.props.action;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
