import { createAction, props, union } from '@ngrx/store';
import { expecter } from 'ts-snippet';

describe('Action Creators', () => {
  let originalTimeout: number;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  const expectSnippet = expecter(
    code => `
  // path goes from root
  import {createAction, props, union} from './modules/store/src/action_creator';
    ${code}`,
    {
      moduleResolution: 'node',
      target: 'es2015',
    }
  );

  describe('createAction', () => {
    it('should create an action', () => {
      const foo = createAction('FOO', (foo: number) => ({ foo }));
      const fooAction = foo(42);

      expect(fooAction).toEqual({ type: 'FOO', foo: 42 });
    });

    it('should narrow the action', () => {
      const foo = createAction('FOO', (foo: number) => ({ foo }));
      const bar = createAction('BAR', (bar: number) => ({ bar }));
      const both = union({ foo, bar });
      const narrow = (action: typeof both) => {
        if (action.type === foo.type) {
          expect(action.foo).toEqual(42);
        } else {
          throw new Error('Should not get here.');
        }
      };

      narrow(foo(42));
    });

    it('should be serializable', () => {
      const foo = createAction('FOO', (foo: number) => ({ foo }));
      const fooAction = foo(42);
      const text = JSON.stringify(fooAction);

      expect(JSON.parse(text)).toEqual({ type: 'FOO', foo: 42 });
    });

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
  });

  describe('empty', () => {
    it('should allow empty action', () => {
      const foo = createAction('FOO');
      const fooAction = foo();

      expect(fooAction).toEqual({ type: 'FOO' });
    });
  });

  describe('props', () => {
    it('should create an action', () => {
      const foo = createAction('FOO', props<{ foo: number }>());
      const fooAction = foo({ foo: 42 });

      expect(fooAction).toEqual({ type: 'FOO', foo: 42 });
    });

    it('should narrow the action', () => {
      const foo = createAction('FOO', props<{ foo: number }>());
      const bar = createAction('BAR', props<{ bar: number }>());
      const both = union({ foo, bar });
      const narrow = (action: typeof both) => {
        if (action.type === foo.type) {
          expect(action.foo).toEqual(42);
        } else {
          throw new Error('Should not get here.');
        }
      };

      narrow(foo({ foo: 42 }));
    });

    it('should be serializable', () => {
      const foo = createAction('FOO', props<{ foo: number }>());
      const fooAction = foo({ foo: 42 });
      const text = JSON.stringify(fooAction);

      expect(JSON.parse(text)).toEqual({ foo: 42, type: 'FOO' });
    });

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
  });
});
