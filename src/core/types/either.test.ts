import { Either, ok, fail } from './either';

describe('Either functional error handling', () => {
  function isFour(value: number): Either<string, number> {
    if (value === 4) {
      return ok(value);
    }

    return fail('is not four');
  }

  test('if result can be ok', () => {
    const result = isFour(2 + 2);

    expect(result.isOk()).toBe(true);

    expect(result.isFail()).toBe(false);

    expect(result.value).toBe(4);
  });

  test('if result can be fail', () => {
    const result = isFour(2 + 1);

    expect(result.isOk()).toBe(false);

    expect(result.isFail()).toBe(true);

    expect(result.value).toEqual(expect.any(String));
  });
});
