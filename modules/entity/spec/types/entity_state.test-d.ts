import { expectTypeOf, describe, it } from 'vitest';
import { createEntityAdapter, EntityAdapter, EntityState } from '../..';

interface Book {
  id: string;
  title: string;
}

interface BookState extends EntityState<Book> {
  selectedBookId: string | null;
}

const adapter: EntityAdapter<Book> = createEntityAdapter<Book>();

describe('EntityState Types', () => {
  describe('getInitialState', () => {
    it('can set the initial state', () => {
      const initialState: BookState = adapter.getInitialState({
        selectedBookId: '1',
      });

      expectTypeOf(initialState).toEqualTypeOf<BookState>();
    });

    it('can set the initial state with additional properties', () => {
      const initialState: BookState = adapter.getInitialState({
        selectedBookId: '1',
      });

      expectTypeOf(initialState).toEqualTypeOf<BookState>();
    });

    it('can set the initial state with unknown properties when the state is untyped', () => {
      const initialState = adapter.getInitialState({
        selectedBookId: '1',
        otherProperty: 'value',
      });

      expectTypeOf(initialState).toExtend<EntityState<Book>>();
    });
  });
});
