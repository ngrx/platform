import { expecter } from 'ts-snippet';

describe('createAction()', () => {
  const expectSnippet = expecter(
    code => `
      // path goes from root
      import {createAction, props, union} from './modules/store';

      ${code}
    `,
    {
      moduleResolution: 'node',
      target: 'es2015',
    }
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
        /Argument of type '"type property is not allowed in action creators"' is not assignable to parameter of type/
      );
    });

    it('should not allow ararys', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<[]>());
      `).toFail(
        /Argument of type '"arrays are not allowed in action creators"' is not assignable to parameter of type/
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
        /Type '{ type: string; }' is not assignable to type '"type property is not allowed in action creators"'/
      );
    });

    it('should not allow arrays', () => {
      expectSnippet(`
        const foo = createAction('FOO', () => [ ]);
      `).toFail(
        /Type 'any\[]' is not assignable to type '"arrays are not allowed in action creators"'/
      );
    });
  });
});
