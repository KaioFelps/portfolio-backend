import { ValueObject } from '@/core/entities/value-objects';
import { User } from '@/domain/users/entities/user';
import { LogAction, LogTargetType } from '@prisma/client';

export interface LogWithAuthorProps {
  action: LogAction;
  dispatcher?: User | null;
  target: string;
  targetType: LogTargetType;
  createdAt: Date;
}

export class LogWithAuthor extends ValueObject<LogWithAuthorProps> {
  private constructor(props: LogWithAuthorProps) {
    super(props);
  }

  public static create(props: LogWithAuthorProps) {
    return new LogWithAuthor(props);
  }

  get id() {
    return this.id;
  }

  get action() {
    return this.props.action;
  }

  get dispatcher() {
    return this.props.dispatcher;
  }

  get target() {
    return this.props.target;
  }

  get targetType() {
    return this.props.targetType;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
