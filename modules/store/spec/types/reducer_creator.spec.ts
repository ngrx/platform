import { expecter } from 'ts-snippet';

describe('createReducer()', () => {
  const expectSnippet = expecter(
    code => `
      // path goes from root
      import {createAction, props, on} from './modules/store';

      ${code}
    `,
    {
      moduleResolution: 'node',
      target: 'es2015',
    }
  );

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
  });
});
