import { on, createReducer, createAction, props, union } from '@ngrx/store';
import { expecter } from 'ts-snippet';

describe('classes/reducer', function(): void {
  const expectSnippet = expecter(
    code => `
// path goes from root
import {createAction, props} from './modules/store/src/action_creator';
import {on} from './modules/store/src/reducer_creator';
  ${code}`,
    {
      moduleResolution: 'node',
      target: 'es2015',
    }
  );

  describe('base', () => {
    const bar = createAction('[foobar] BAR', props<{ bar: number }>());
    const foo = createAction('[foobar] FOO', props<{ foo: number }>());

    describe('on', () => {
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

      it('should support reducers with multiple actions', () => {
        const both = union({ bar, foo });
        const func = (state: {}, action: typeof both) => ({});
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
          on(increase, state => state + 1),
          on(increase, state => state + 1)
        );

        expect(typeof counterReducer).toEqual('function');

        let state = 5;

        state = counterReducer(state, increase());
        expect(state).toEqual(7);
      });
    });
  });
});
