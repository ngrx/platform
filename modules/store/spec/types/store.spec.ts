import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('Store', () => {
  const expectSnippet = expecter(
    (code) => `
      import { Store, createAction } '@ngrx/store';

      const store = {} as Store<{}>;
      const fooAction = createAction('foo')

      ${code}
    `,
    compilerOptions()
  );

  it('should not allow passing action creator function without calling it', () => {
    expectSnippet(`store.dispatch(fooAction);`).toFail(
      /is not assignable to type '"Functions are not allowed to be dispatched. Did you forget to call the action creator function/
    );
  });
});
