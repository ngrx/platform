import { createAction, props, union } from '@ngrx/store';

describe('Action Creators', () => {
  let originalTimeout: number;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

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

    it('should allow the union of types in props', () => {
      interface A {
        sameProp: 'A';
      }
      interface B {
        sameProp: 'B';
        extraProp: string;
      }
      type U = A | B;
      const foo = createAction('FOO', props<U>());

      const fooA = foo({ sameProp: 'A' });
      const fooB = foo({ sameProp: 'B', extraProp: 'allowed' });

      expect(fooA).toEqual({ type: 'FOO', sameProp: 'A' });
      expect(fooB).toEqual({
        type: 'FOO',
        sameProp: 'B',
        extraProp: 'allowed',
      });
    });

    it('should be serializable', () => {
      const foo = createAction('FOO', props<{ foo: number }>());
      const fooAction = foo({ foo: 42 });
      const text = JSON.stringify(fooAction);

      expect(JSON.parse(text)).toEqual({ foo: 42, type: 'FOO' });
    });
  });
});
