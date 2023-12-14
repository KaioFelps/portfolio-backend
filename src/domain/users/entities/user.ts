import { Entity } from '@/core/entities/entity';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';

export enum UserRole {
  admin = 'ADMIN',
  editor = 'EDITOR',
}

export interface UserProps {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

export class User extends Entity<UserProps> {
  constructor(props: UserProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: EntityUniqueId) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }

  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get email() {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  set role(value: UserRole) {
    this.props.role = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
