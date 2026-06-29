import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('createReducer()', () => {
  const expectSnippet = expecter(
    (code) => `
      import {createAction, createReducer, on, props, ActionCreator, ActionReducer} from '@ngrx/store';

      ${code}
    `,
    compilerOptions()
  );

  describe('createReducer()', () => {
    it('should support objects', () => {
      expectSnippet(`
        interface State { name: string };
        const initialState: State = { name: 'sarah' };

        const setAction = createAction('set', props<{ value: State }>());
        const resetAction = createAction('reset');

        const reducer = createReducer(
          initialState,
          on(setAction, (_, { value }) => value),
          on(resetAction, () => initialState),
        );
      `).toInfer('reducer', 'ActionReducer<State, Action<string>>');
    });

    it('should support arrays', () => {
      expectSnippet(`
        const initialState: string[] = [];

        const setAction = createAction('set', props<{ value: string[] }>());
        const resetAction = createAction('reset');

        const reducer = createReducer(
          initialState,
          on(setAction, (_, { value }) => value),
          on(resetAction, () => initialState),
        );
      `).toInfer('reducer', 'ActionReducer<string[], Action<string>>');
    });

    it('should support primitive types', () => {
      expectSnippet(`
        const initialState: number = 0;

        const setAction = createAction('set', props<{ value: number }>());
        const resetAction = createAction('reset');

        const reducer = createReducer(
          initialState,
          on(setAction, (_, { value }) => value),
          on(resetAction, () => initialState),
        );
      `).toInfer('reducer', 'ActionReducer<number, Action<string>>');
    });

    it('should support a generic reducer factory', () => {
      expectSnippet(`
        const creator = null as unknown as ActionCreator;

        export function createGenericReducer<TState extends object>(initialState: TState): ActionReducer<TState> {
          const reducer = createReducer(
            initialState,
            on(creator, (state, action) => {
              return state ;
            })
          );

          return reducer;
        }
      `).toSucceed();
    });
  });

  describe('on()', () => {
    it('should enforce action property types', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<{ foo: number }>());
        on(foo, (state, action) => { const foo: string = action.foo; return state; });
      `).toFail(/'number' is not assignable to type 'string'/);
    });

    it('should enforce action property names', () => {
      expectSnippet(`
        const foo = createAction('FOO', props<{ foo: number }>());
        on(foo, (state, action) => { const bar: string = action.bar; return state; });
      `).toFail(/'bar' does not exist on type/);
    });

    it('should infer the typed based on state and actions type with action used in on function', () => {
      expectSnippet(`
        interface State { name: string };
        const foo = createAction('FOO', props<{ foo: string }>());
        const onFn = on(foo, (state: State, action) => ({  name: action.foo }));
      `).toInfer(
        'onFn',
        `
      ReducerTypes<State, [ActionCreator<"FOO", (props: {
        foo: string;
    }) => {
        foo: string;
    } & Action<"FOO">>]>
    `
      );
    });

    it('should infer the typed based on state and actions type without action', () => {
      expectSnippet(`
        interface State { name: string };
        const foo = createAction('FOO');
        const onFn = on(foo, (state: State) => ({ name: 'some value' }));
      `).toInfer(
        'onFn',
        `
      ReducerTypes<State, [ActionCreator<"FOO", () => Action<"FOO">>]>
    `
      );
    });

    describe('valid patterns', () => {
      it('should allow spread with property override inside createReducer', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const setName = createAction('setName', props<{ name: string }>());

          const reducer = createReducer(
            initialState,
            on(setName, (state, { name }) => ({ ...state, name })),
          );
        `).toSucceed();
      });

      it('should allow returning initialState inside createReducer', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const reset = createAction('reset');

          const reducer = createReducer(
            initialState,
            on(reset, () => initialState),
          );
        `).toSucceed();
      });

      it('should allow returning state directly inside createReducer', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const noop = createAction('noop');

          const reducer = createReducer(
            initialState,
            on(noop, (state) => state),
          );
        `).toSucceed();
      });

      it('should allow standalone on() with explicit state type', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const setName = createAction('setName', props<{ name: string }>());

          const onFn = on(setName, (state: State, { name }) => ({ ...state, name }));
        `).toSucceed();
      });

      it('should allow explicit return of all properties inside createReducer', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const setName = createAction('setName', props<{ name: string }>());

          const reducer = createReducer(
            initialState,
            on(setName, (state, { name }) => ({ name, count: state.count })),
          );
        `).toSucceed();
      });

      it('should allow on() with multiple action creators', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const action1 = createAction('action1');
          const action2 = createAction('action2');

          const reducer = createReducer(
            initialState,
            on(action1, action2, (state) => ({ ...state, count: state.count + 1 })),
          );
        `).toSucceed();
      });
    });

    describe('catches excess properties', () => {
      it('should catch excess properties in on() callback inside createReducer', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const setName = createAction('setName', props<{ name: string }>());

          const reducer = createReducer(
            initialState,
            on(setName, (state, { name }) => ({ ...state, name, extra: true })),
          );
        `).toFail(/Remove excess properties/);
      });

      it('should catch excess properties in standalone on() with explicit state type', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const setName = createAction('setName', props<{ name: string }>());

          const onFn = on(setName, (state: State, { name }) => ({ ...state, name, extra: true }));
        `).toFail(/Remove excess properties/);
      });

      it('should catch excess properties when returning explicit object', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const setName = createAction('setName', props<{ name: string }>());

          const reducer = createReducer(
            initialState,
            on(setName, (state, { name }) => ({ name, count: state.count, extra: 'bad' })),
          );
        `).toFail(/Remove excess properties/);
      });

      it('should catch excess properties when explicit return type annotation is used', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const setName = createAction('setName', props<{ name: string }>());

          const reducer = createReducer(
            initialState,
            on(setName, (state, { name }): State => ({ ...state, name, extra: true })),
          );
        `).toFail(/does not exist in type/);
      });

      it('should catch excess properties from void on() callback', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const noop = createAction('noop');

          const reducer = createReducer(
            initialState,
            on(noop, (state) => ({ ...state, extra: true })),
          );
        `).toFail(/Remove excess properties/);
      });
    });

    describe('edge cases', () => {
      it('should work with state containing optional properties', () => {
        expectSnippet(`
          interface State { req: string; opt?: number };
          const initialState: State = { req: 'a' };
          const update = createAction('update');

          const reducer = createReducer(
            initialState,
            on(update, (state) => ({ req: 'b' })),
          );
        `).toSucceed();
      });

      it('should work with state containing index signature', () => {
        expectSnippet(`
          const initialState: { [key: string]: number } = {};
          const add = createAction('add', props<{ key: string; value: number }>());

          const reducer = createReducer(
            initialState,
            on(add, (state, { key, value }) => ({ ...state, [key]: value })),
          );
        `).toSucceed();
      });

      it('should catch excess properties with index signature state', () => {
        expectSnippet(`
          interface State { name: string };
          const initialState: State = { name: 'test' };
          const update = createAction('update');

          const reducer = createReducer(
            initialState,
            on(update, (state) => ({ ...state, extra: true })),
          );
        `).toFail(/Remove excess properties/);
      });
    });

    describe('already enforced type checks', () => {
      it('should catch missing required properties inside createReducer', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const setName = createAction('setName', props<{ name: string }>());

          const reducer = createReducer(
            initialState,
            on(setName, (state, { name }) => ({ name })),
          );
        `).toFail(/is missing in type/);
      });

      it('should catch wrong property types inside createReducer', () => {
        expectSnippet(`
          interface State { name: string; count: number };
          const initialState: State = { name: 'test', count: 0 };
          const setName = createAction('setName', props<{ name: string }>());

          const reducer = createReducer(
            initialState,
            on(setName, (state, { name }) => ({ ...state, name: 123 })),
          );
        `).toFail(/not assignable to type/);
      });
    });
  });
}, 8_000);
