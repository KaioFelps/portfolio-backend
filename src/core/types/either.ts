export class Fail<TFail, TOk> {
  readonly value: TFail;

  constructor(value: TFail) {
    this.value = value;
  }

  isFail(): this is Fail<TFail, TOk> {
    return true;
  }

  isOk(): this is Ok<TFail, TOk> {
    return false;
  }
}

export class Ok<TFail, TOk> {
  readonly value: TOk;

  constructor(value: TOk) {
    this.value = value;
  }

  isFail(): this is Fail<TFail, TOk> {
    return false;
  }

  isOk(): this is Ok<TFail, TOk> {
    return true;
  }
}

export type Either<TFail, TOk> = Fail<TFail, TOk> | Ok<TFail, TOk>;

export function fail<TFail, TOk>(value: TFail): Either<TFail, TOk> {
  return new Fail(value);
}

export function ok<TFail, TOk>(value: TOk): Either<TFail, TOk> {
  return new Ok(value);
}
