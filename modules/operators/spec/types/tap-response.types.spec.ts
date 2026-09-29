import { expectTypeOf, describe, it } from 'vitest';
import { of } from 'rxjs';
import { tapResponse } from '../../';

describe('tapResponse types', () => {
  it('requires next and error handlers', () => {
    of(1).pipe(
      // @ts-expect-error error handler is required
      tapResponse({
        next: () => {},
      })
    );

    of(1).pipe(
      // @ts-expect-error next handler is required
      tapResponse({
        error: () => {},
      })
    );
  });

  it('infers next and error type', () => {
    of(1).pipe(
      tapResponse({
        next: (value) => expectTypeOf(value).toEqualTypeOf<number>(),
        error: (error: { message: string }) =>
          expectTypeOf(error).toEqualTypeOf<{ message: string }>(),
      })
    );
  });

  it('uses unknown as default error type', () => {
    of(true).pipe(
      tapResponse({
        next: (value) => expectTypeOf(value).toEqualTypeOf<boolean>(),
        error: (error) => expectTypeOf(error).toEqualTypeOf<unknown>(),
      })
    );
  });
});
