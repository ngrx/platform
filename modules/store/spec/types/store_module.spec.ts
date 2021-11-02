import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('StoreModule', () => {
  const expectSnippet = expecter(
    (code) => `
      import { StoreModule, ActionReducerMap, Action, createReducer } from '@ngrx/store';

      interface State {
        featureA: object;
        featureB: object;
      }

      const reducers: ActionReducerMap<State, Action> = {} as ActionReducerMap<
        State,
        Action
      >;

      function metaReducer(reducer) {
        return (state, action) => {
          return reducer(state, action);
        };
      }

      ${code}
    `,
    compilerOptions()
  );

  describe('StoreModule.forRoot()', () => {
    it('accepts initialState and metaReducers with matching State', () => {
      expectSnippet(`
        StoreModule.forRoot(reducers, {
          initialState: { featureA: {} },
          metaReducers: [metaReducer]
        });
      `).toSucceed();
    });

    it("throws when initial state don't with store state", () => {
      expectSnippet(`
        StoreModule.forRoot(reducers, {
          initialState: { notExisting: 3 },
          metaReducers: [metaReducer]
        });
      `).toFail(
        /Type '{ notExisting: number; }' is not assignable to type 'InitialState<State>/
      );
    });
  });

  describe('StoreModule.forFeature()', () => {
    it('accepts initialState and metaReducers with matching State', () => {
      expectSnippet(`
        StoreModule.forFeature('feature', reducers, {
          initialState: { featureA: {} },
          metaReducers: [metaReducer]
        });
      `).toSucceed();
    });

    it("throws when initial state don't with store state", () => {
      expectSnippet(`
        StoreModule.forFeature('feature', reducers, {
          initialState: { notExisting: 3 },
          metaReducers: [metaReducer]
        });
      `).toFail(
        /Type '{ notExisting: number; }' is not assignable to type 'InitialState<State>/
      );
    });

    it('throws when store config is passed along with slice object', () => {
      expectSnippet(`
        StoreModule.forFeature(
          { name: 'feature', reducer: createReducer(0) },
          { initialState: 100, metaReducers: [metaReducer] }
        );
      `).toFail(/No overload matches this call/);
    });
  });
});
