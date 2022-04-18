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
            { userId: number; token: string; } & TypedAction<"[Auth API] Login Success">
        >`
      );
      snippet.toInfer(
        'loginFailure',
        `ActionCreator<
          "[Auth API] Login Failure",
          (props: { error: string; }) =>
            { error: string; } & TypedAction<"[Auth API] Login Failure">
        >`
      );
      snippet.toInfer(
        'logoutSuccess',
        `ActionCreator<
          "[Auth API] Logout Success",
          () => TypedAction<"[Auth API] Logout Success">
        >`
      );
      snippet.toInfer(
        'logoutFailure',
        `FunctionWithParametersType<
          [error: Error],
          { error: Error; } & TypedAction<"[Auth API] Logout Failure">
        > & TypedAction<"[Auth API] Logout Failure">`
      );
    });

    describe('source', () => {
      it('should fail when source is not a template literal type', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API' as string,
            events: {},
          });
        `).toFail(/source must be a template literal type/);
      });
    });

    describe('event name', () => {
      it('should create action name by camel casing the event name', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              ' Load BOOKS  suCCess  ': emptyProps(),
            },
          });

          let loadBooksSuccess: typeof booksApiActions.loadBooksSuccess;
        `).toInfer(
          'loadBooksSuccess',
          `ActionCreator<
            "[Books API]  Load BOOKS  suCCess  ",
            () => TypedAction<"[Books API]  Load BOOKS  suCCess  ">
          >`
        );
      });

      it('should fail when event name is an empty string', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              '': emptyProps(),
            },
          });
        `).toFail(
          /event name cannot be an empty string or contain only spaces/
        );
      });

      it('should fail when event name contains only spaces', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              ' ': emptyProps(),
            },
          });
        `).toFail(
          /event name cannot be an empty string or contain only spaces/
        );
      });

      it('should fail when event name is not a template literal type', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              ['Load Books Success' as string]: emptyProps()
            },
          });
        `).toFail(/event name must be a template literal type/);
      });

      describe('forbidden characters', () => {
        [
          String.raw`\\`,
          '/',
          '|',
          '<',
          '>',
          '[',
          ']',
          '{',
          '}',
          '(',
          ')',
          '.',
          ',',
          '!',
          '?',
          '#',
          '%',
          '^',
          '&',
          '*',
          '+',
          '-',
          '~',
          '"',
          String.raw`\'`,
          '`',
        ].forEach((char) => {
          it(`should fail when event name contains ${char} in the beginning`, () => {
            expectSnippet(`
              const booksApiActions = createActionGroup({
                source: 'Books API',
                events: {
                  '${char}Load Books Success': emptyProps(),
                },
              });
          `).toFail(/event name cannot contain/);
          });

          it(`should fail when event name contains ${char} in the middle`, () => {
            expectSnippet(`
              const booksApiActions = createActionGroup({
                source: 'Books API',
                events: {
                  'Load Books ${char} Success': emptyProps(),
                },
              });
          `).toFail(/event name cannot contain/);
          });

          it(`should fail when event name contains ${char} in the end`, () => {
            expectSnippet(`
              const booksApiActions = createActionGroup({
                source: 'Books API',
                events: {
                  'Load Books Success${char}': emptyProps(),
                },
              });
          `).toFail(/event name cannot contain/);
          });
        });
      });

      it('should fail when two event names are mapped to the same action name', () => {
        expectSnippet(`
          const booksApiActions = createActionGroup({
            source: 'Books API',
            events: {
              '  Load BOOks  success ': emptyProps(),
              'load Books Success': props<{ books: string[] }>(),
            }
          });
        `).toFail(/loadBooksSuccess action is already defined/);
      });
    });

    describe('props', () => {
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
