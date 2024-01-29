import { Expect, expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('createActionGroup', () => {
  const snippetFactory = (code: string): string => `
    import { createActionGroup, emptyProps, props } from '@ngrx/store';

    ${code}
  `;

  function testWith(expectSnippet: (code: string) => Expect): void {
    it('should create action group', () => {
      const snippet = expectSnippet(`
        const authApiActions = createActionGroup({
          source: 'Auth API',
          events: {
            'Login Success': props<{ userId: number; token: string }>(),
            'Login Failure': props<{ error: string }>(),
            'Logout Success': emptyProps(),
            'Logout Failure': (error: Error) => ({ error }),
          },
        });

        let loginSuccess: typeof authApiActions.loginSuccess;
        let loginFailure: typeof authApiActions.loginFailure;
        let logoutSuccess: typeof authApiActions.logoutSuccess;
        let logoutFailure: typeof authApiActions.logoutFailure;
      `);

      snippet.toInfer(
        'loginSuccess',
        `ActionCreator<
          "[Auth API] Login Success",
          (props: { userId: number; token: string; }) =>
            { userId: number; token: string; } & Action<"[Auth API] Login Success">
        >`
      );
      snippet.toInfer(
        'loginFailure',
        `ActionCreator<
          "[Auth API] Login Failure",
          (props: { error: string; }) =>
            { error: string; } & Action<"[Auth API] Login Failure">
        >`
      );
      snippet.toInfer(
        'logoutSuccess',
        `ActionCreator<
          "[Auth API] Logout Success",
          () => Action<"[Auth API] Logout Success">
        >`
      );
      snippet.toInfer(
        'logoutFailure',
        `FunctionWithParametersType<
          [error: Error],
          { error: Error; } & Action<"[Auth API] Logout Failure">
        > & Action<"[Auth API] Logout Failure">`
      );
    });

    describe('source', () => {
      it('should fail when source is not a string literal type', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API' as string,
            events: {},
          });
        `).toFail(/source must be a string literal type/);
      });
    });

    describe('events', () => {
      it('should infer events dictionary', () => {
        expectSnippet(`
          const authApiActions = createActionGroup({
            source: 'Auth API',
            events: {
              'Login Success': props<{ token: string; }>,
              'Login Failure': (message: string) => ({ message }),
            },
          });
        `).toInfer(
          'authApiActions',
          "ActionGroup<\"Auth API\", { 'Login Success': () => ActionCreatorProps<{ token: string; }>; 'Login Failure': (message: string) => { message: string; }; }>"
        );
      });

      it('should infer events defined as an empty object', () => {
        expectSnippet(`
          const authApiActions = createActionGroup({
            source: 'Auth API',
            events: {},
          });
        `).toInfer('authApiActions', 'ActionGroup<"Auth API", {}>');
      });
    });

    describe('event name', () => {
      it('should create action name by camel casing the event name', () => {
        const snippet = expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              ' Load BOOKS  suCCess  ': emptyProps(),
              loadBooksFailure: emptyProps(),
            },
          });

          let loadBooksSuccess: typeof booksApiActions.loadBOOKSSuCCess;
          let loadBooksFailure: typeof booksApiActions.loadBooksFailure;
        `);

        snippet.toInfer(
          'loadBooksSuccess',
          `ActionCreator<
            "[Books API]  Load BOOKS  suCCess  ",
            () => Action<"[Books API]  Load BOOKS  suCCess  ">
          >`
        );
        snippet.toInfer(
          'loadBooksFailure',
          `ActionCreator<
            "[Books API] loadBooksFailure",
            () => Action<"[Books API] loadBooksFailure">
          >`
        );
      });

      it('should fail when event name is not a string literal type', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              ['Load Books Success' as string]: emptyProps()
            },
          });
        `).toFail(/event name must be a string literal type/);
      });

      it('should fail when two event names are mapped to the same action name', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              '  Load Books  success ': emptyProps(),
              'load Books Success': props<{ books: string[] }>(),
            }
          });
        `).toFail(/loadBooksSuccess action is already defined/);
      });
    });

    describe('props', () => {
      it('should infer when props are typed as union', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              'Load Books Success': props<{ books: string[]; total: number } | { books: symbol[] }>(),
            },
          });

          let loadBooksSuccess: typeof booksApiActions.loadBooksSuccess;
        `).toInfer(
          'loadBooksSuccess',
          'ActionCreator<"[Books API] Load Books Success", (props: { books: string[]; total: number; } | { books: symbol[]; }) => ({ books: string[]; total: number; } | { books: symbol[]; }) & Action<"[Books API] Load Books Success">>'
        );
      });

      it('should infer when props are typed as intersection', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              'Load Books Success': props<{ books: string[] } & { total: number }>(),
            },
          });

          let loadBooksSuccess: typeof booksApiActions.loadBooksSuccess;
        `).toInfer(
          'loadBooksSuccess',
          'ActionCreator<"[Books API] Load Books Success", (props: { books: string[]; } & { total: number; }) => { books: string[]; } & { total: number; } & Action<"[Books API] Load Books Success">>'
        );
      });

      it('should fail when props contain a type property', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              'Load Books Success': props<{ books: string[]; type: any }>(),
            },
          });
        `).toFail(
          /action creator cannot return an object with a property named `type`/
        );
      });

      it('should fail when props are an array', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              'Load Books Success': props<string[]>(),
            },
          });
        `).toFail(/action creator cannot return an array/);
      });

      it('should fail when props are an empty object', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              'Load Books Success': props<{}>(),
            },
          });
        `).toFail(/action creator cannot return an empty object/);
      });

      it('should fail when props are a primitive value', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              'Load Books Success': props<string>(),
            },
          });
        `).toFail(/action creator props cannot be a primitive value/);
      });
    });

    describe('props factory', () => {
      it('should fail when props factory returns an object with type property', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              'Load Books Success': (books: string[]) => ({ books, type: 'T' }),
            },
          });
        `).toFail(
          /action creator cannot return an object with a property named `type`/
        );
      });

      it('should fail when props factory returns an array', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              'Load Books Success': (books: string[]) => books,
            },
          });
        `).toFail(/action creator cannot return an array/);
      });

      it('should fail when props factory returns an empty object', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              'Load Books Success': () => ({}),
            },
          });
        `).toFail(/action creator cannot return an empty object/);
      });

      it('should fail when props factory returns a primitive value', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              'Load Books Success': () => '',
            },
          });
        `).toFail(/Type '\(\) => string' is not assignable to type 'never'/);
      });
    });
  }

  describe('strict mode', () => {
    const expectSnippet = expecter(snippetFactory, {
      ...compilerOptions(),
      strict: true,
    });

    testWith(expectSnippet);
  });

  describe('non-strict mode', () => {
    const expectSnippet = expecter(snippetFactory, {
      ...compilerOptions(),
      strict: false,
    });

    testWith(expectSnippet);
  });
});
