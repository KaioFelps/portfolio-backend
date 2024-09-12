import { Entity } from '@/core/entities/entity';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';

export enum LogAction {
  created = 'CREATED',
  updated = 'UPDATED',
  deleted = 'DELETED',
}

export enum LogTargetType {
  post = 'POST',
  project = 'PROJECT',
  user = 'USER',
  tag = 'TAG',
}

export interface LogProps {
  dispatcherId?: EntityUniqueId | null;
  targetType: LogTargetType;
  target: string;
  action: LogAction;
  createdAt: Date;
}

export class Log extends Entity<LogProps> {
  constructor(props: LogProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(
    props: Optional<LogProps, 'createdAt' | 'dispatcherId'>,
    id?: EntityUniqueId,
  ) {
    const log = new Log(
      {
        ...props,
        dispatcherId: props.dispatcherId ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return log;
  }

  get dispatcherId() {
    return this.props.dispatcherId;
  }

  get target() {
    return this.props.target;
  }

  get targetType() {
    return this.props.targetType;
  }

  get action() {
    return this.props.action;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
