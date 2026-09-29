import { it, describe } from 'vitest';
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
    it('throws when setting the initial state with unknown properties', () => {
      adapter.getInitialState<BookState>({
        selectedBookId: '1',
        // @ts-expect-error Object literal may only specify known properties, and 'otherProperty' does not exist in type 'Omit<BookState, keyof EntityState<T>>'
        otherProperty: 'value',
      });
    });
  });
});
