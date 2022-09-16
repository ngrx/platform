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
      `).toInfer('reducer', 'ActionReducer<State, Action>');
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
      `).toInfer('reducer', 'ActionReducer<string[], Action>');
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
      `).toInfer('reducer', 'ActionReducer<number, Action>');
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
      ReducerTypes<{
        name: string;
    }, [ActionCreator<"FOO", (props: {
        foo: string;
    }) => {
        foo: string;
    } & TypedAction<"FOO">>]>
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
      ReducerTypes<{
        name: string;
    }, [ActionCreator<"FOO", () => TypedAction<"FOO">>]>
    `
      );
    });
  });
});
