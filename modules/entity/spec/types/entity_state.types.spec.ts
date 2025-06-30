import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('EntityState Types', () => {
  const expectSnippet = expecter(
    (code) => `
        import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

        interface Book {
          id: string;
          title: string;
        }

        interface BookState extends EntityState<Book> {
          selectedBookId: string | null;
        }

        export const adapter: EntityAdapter<Book> = createEntityAdapter<Book>();
        ${code}
      `,
    compilerOptions()
  );

  describe('getInitialState', () => {
    it('can set the initial state', () => {
      expectSnippet(`
        export const initialState: BookState = adapter.getInitialState({
          selectedBookId: '1',
        });

      `).toSucceed();
    });

    it('can set the initial state with additional properties', () => {
      expectSnippet(`
        export const initialState: BookState = adapter.getInitialState({
          selectedBookId: '1',
        });

      `).toSucceed();
    });

    it('throws when setting the initial state with unknown properties', () => {
      expectSnippet(`
        export const initialState: BookState = adapter.getInitialState({
          selectedBookId: '1',
          otherProperty: 'value',
        });
      `).toFail(
        /Object literal may only specify known properties, and 'otherProperty' does not exist in type 'Omit<BookState, keyof EntityState<T>>'/i
      );
    });

    it('can set the initial state with unknown properties when the state is untyped', () => {
      expectSnippet(`
        export const initialState = adapter.getInitialState({
          selectedBookId: '1',
          otherProperty: 'value',
        });
      `).toSucceed();
    });
  });
});
