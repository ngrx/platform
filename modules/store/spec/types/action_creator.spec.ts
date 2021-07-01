import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('createAction()', () => {
  const expectSnippet = expecter(
    (code) => `
      import {createAction, props, union} from '@ngrx/store';

      ${code}
    `,
    compilerOptions()
  );

  describe('with props', () => {
    it('should enforce ctor parameters', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<{ foo: number }>());
        const fooAction = foo({ foo: '42' });
      `).toFail(/'string' is not assignable to type 'number'/);
    });

    it('should enforce action property types', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<{ foo: number }>());
        const fooAction = foo({ foo: 42 });
        const value: string = fooAction.foo;
      `).toFail(/'number' is not assignable to type 'string'/);
    });

    it('should enforce action property names', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<{ foo: number }>());
        const fooAction = foo({ foo: 42 });
        const value = fooAction.bar;
      `).toFail(/'bar' does not exist on type/);
    });

    it('should not allow type property', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<{ type: number }>());
      `).toFail(
        / Type 'ActionCreatorProps<\{ type: number; \}>' is not assignable to type '"action creator props cannot have a property named `type`"'/
      );
    });

    it('should not allow arrays', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<[]>());
      `).toFail(
        /Type 'ActionCreatorProps<\[\]>' is not assignable to type '"action creator props cannot be an array"'/
      );
    });

    it('should not allow empty objects', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<{}>());
      `).toFail(
        /Type 'ActionCreatorProps<\{\}>' is not assignable to type '"action creator props cannot be an empty object"'/
      );
    });

    it('should not allow strings', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<string>());
      `).toFail(
        /Type 'string' is not assignable to type '"action creator props cannot be a primitive value"'/
      );
    });

    it('should not allow numbers', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<number>());
      `).toFail(
        /Type 'number' is not assignable to type '"action creator props cannot be a primitive value"'/
      );
    });

    it('should not allow bigints', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<bigint>());
      `).toFail(
        /Type 'bigint' is not assignable to type '"action creator props cannot be a primitive value"'/
      );
    });

    it('should not allow booleans', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<boolean>());
      `).toFail(
        /Type 'boolean' is not assignable to type '"action creator props cannot be a primitive value"'/
      );
    });

    it('should not allow null', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<null>());
      `).toFail(
        /Type 'null' is not assignable to type '"action creator props cannot be a primitive value"'/
      );
    });

    it('should not allow undefined', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<undefined>());
      `).toFail(
        /Type 'undefined' is not assignable to type '"action creator props cannot be a primitive value"'/
      );
    });
  });

  describe('with function', () => {
    it('should enforce ctor parameters', () => {
      expectSnippet(`
        const foo = createAction('FOO', (foo: number) => ({ foo }));
        const fooAction = foo('42');
      `).toFail(/not assignable to parameter of type 'number'/);
    });

    it('should enforce action property types', () => {
      expectSnippet(`
        const foo = createAction('FOO', (foo: number) => ({ foo }));
        const fooAction = foo(42);
        const value: string = fooAction.foo;
      `).toFail(/'number' is not assignable to type 'string'/);
    });

    it('should enforce action property names', () => {
      expectSnippet(`
        const foo = createAction('FOO', (foo: number) => ({ foo }));
        const fooAction = foo(42);
        const value = fooAction.bar;
      `).toFail(/'bar' does not exist on type/);
    });

    it('should not allow type property', () => {
      expectSnippet(`
        const foo = createAction('FOO', (type: string) => ({type}));
      `).toFail(
        /Type '\{ type: string; \}' is not assignable to type '"action creator props cannot have a property named `type`"'/
      );
    });

    it('should allow default parameters', () => {
      expectSnippet(`
        const foo = createAction('FOO', (bar = 3) => ({bar}));
      `).toSucceed();
    });

    it('should not allow arrays', () => {
      expectSnippet(`
        const foo = createAction('FOO', () => [ ]);
      `).toFail(
        /Type 'any\[\]' is not assignable to type '"action creator props cannot be an array"'/
      );
    });

    it('should not allow strings', () => {
      expectSnippet(`
        const foo = createAction('FOO', () => '');
      `).toFail(
        /Type 'string' is not assignable to type '"action creator cannot return a primitive value"'/
      );
    });

    it('should not allow numbers', () => {
      expectSnippet(`
        const foo = createAction('FOO', () => 0);
      `).toFail(
        /Type 'number' is not assignable to type '"action creator cannot return a primitive value"'/
      );
    });

    it('should not allow bigints', () => {
      expectSnippet(`
        const foo = createAction('FOO', () => 0n);
      `).toFail(
        /Type 'bigint' is not assignable to type '"action creator cannot return a primitive value"'/
      );
    });

    it('should not allow booleans', () => {
      expectSnippet(`
        const foo = createAction('FOO', () => false);
      `).toFail(
        /Type 'boolean' is not assignable to type '"action creator cannot return a primitive value"'/
      );
    });

    it('should not allow null', () => {
      expectSnippet(`
        const foo = createAction('FOO', () => null);
      `).toFail(
        /Type 'null' is not assignable to type '"action creator cannot return a primitive value"'/
      );
    });

    it('should not allow undefined', () => {
      expectSnippet(`
        const foo = createAction('FOO', () => undefined);
      `).toFail(
        /Type 'undefined' is not assignable to type '"action creator cannot return a primitive value"'/
      );
    });
  });
});
