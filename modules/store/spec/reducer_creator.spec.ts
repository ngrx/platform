import {
  ActionType,
  on,
  createReducer,
  createAction,
  props,
  union,
} from '@ngrx/store';

describe('classes/reducer', function (): void {
  describe('base', () => {
    const bar = createAction('[foobar] BAR', props<{ bar: number }>());
    const foo = createAction('[foobar] FOO', props<{ foo: number }>());

    describe('on', () => {
      it('should support reducers with multiple actions', () => {
        const both = union({ bar, foo });
        const func = (state: unknown, action: typeof both) => ({});
        const result = on(foo, bar, func);
        expect(result.types).toContain(bar.type);
        expect(result.types).toContain(foo.type);
      });
    });

    describe('createReducer', () => {
      it('should create a reducer', () => {
        interface State {
          foo?: number;
          bar?: number;
        }

        const fooBarReducer = createReducer(
          {} as State,
          on(foo, (state, { foo }) => ({ ...state, foo })),
          on(bar, (state, { bar }) => ({ ...state, bar }))
        );

        expect(typeof fooBarReducer).toEqual('function');

        let state = fooBarReducer(undefined, { type: 'UNKNOWN' });
        expect(state).toEqual({});

        state = fooBarReducer(state, foo({ foo: 42 }));
        expect(state).toEqual({ foo: 42 });

        state = fooBarReducer(state, bar({ bar: 54 }));
        expect(state).toEqual({ foo: 42, bar: 54 });
      });

      it('should support reducers with multiple actions', () => {
        type State = string[];

        const fooBarReducer = createReducer(
          [] as State,
          on(foo, bar, (state, { type }) => [...state, type])
        );

        expect(typeof fooBarReducer).toEqual('function');

        let state = fooBarReducer(undefined, { type: 'UNKNOWN' });
        expect(state).toEqual([]);

        state = fooBarReducer(state, foo({ foo: 42 }));
        expect(state).toEqual(['[foobar] FOO']);

        state = fooBarReducer(state, bar({ bar: 54 }));
        expect(state).toEqual(['[foobar] FOO', '[foobar] BAR']);
      });

      it('should support "on"s to have identical action types', () => {
        const increase = createAction('[COUNTER] increase');

        const counterReducer = createReducer(
          0,
          on(increase, (state) => state + 1),
          on(increase, (state) => state + 1)
        );

        expect(typeof counterReducer).toEqual('function');

        let state = 5;

        state = counterReducer(state, increase());
        expect(state).toEqual(7);
      });

      it('supports a union for State', () => {
        interface StatePart1 {
          foo?: number;
        }

        interface StatePart2 {
          bar: number;
        }

        const fooBarReducer = createReducer<StatePart1 | StatePart2>(
          {},
          on(foo, (state, { foo }) => ({ ...state, foo })),
          on(bar, (state, { bar }) => ({ ...state, bar }))
        );

        expect(typeof fooBarReducer).toEqual('function');
      });

      it('accepts custom functions with specified generics (within on calls)', () => {
        interface State {
          foo?: number;
          bar?: number;
        }

        function mutableReducer<S, A>(callback: (state: S, action: A) => S) {
          return (oldState: S, value: A) => {
            return ((state: S) => callback(state, value))(oldState) as S;
          };
        }

        const fooBarReducer = createReducer(
          {} as State,
          on(
            foo,
            mutableReducer<State, ActionType<typeof foo>>((state, { foo }) => ({
              ...state,
              foo,
            }))
          ),
          on(bar, (state, { bar }) => ({ ...state, bar }))
        );

        expect(typeof fooBarReducer).toEqual('function');

        let state = fooBarReducer(undefined, { type: 'UNKNOWN' });
        expect(state).toEqual({});

        state = fooBarReducer(state, foo({ foo: 42 }));
        expect(state).toEqual({ foo: 42 });

        state = fooBarReducer(state, bar({ bar: 54 }));
        expect(state).toEqual({ foo: 42, bar: 54 });
      });

      it('accepts custom functions with inferred types (within on calls)', () => {
        //                       baz the same prop `foo` 👇
        const baz = createAction('[foobar] BAZ', props<{ foo: number }>());

        interface State {
          foo?: number;
          bar?: number;
        }

        function mutableReducer<S, A>(callback: (state: S, action: A) => S) {
          return (oldState: S, value: A) => {
            return ((state: S) => callback(state, value))(oldState) as S;
          };
        }

        const fooBarReducer = createReducer(
          {} as State,
          on(
            foo,
            mutableReducer((state, { foo }) => ({
              ...state,
              foo,
            }))
          ),
          on(
            foo,
            baz,
            mutableReducer((state, { foo }) => ({
              ...state,
              foo,
            }))
          ),
          on(bar, (state, { bar }) => ({ ...state, bar })),
          on(foo, bar, baz, (state, { type }) => ({ ...state }))
        );

        expect(typeof fooBarReducer).toEqual('function');

        let state = fooBarReducer(undefined, { type: 'UNKNOWN' });
        expect(state).toEqual({});

        state = fooBarReducer(state, foo({ foo: 42 }));
        expect(state).toEqual({ foo: 42 });

        state = fooBarReducer(state, bar({ bar: 54 }));
        expect(state).toEqual({ foo: 42, bar: 54 });
      });
    });
  });
});
