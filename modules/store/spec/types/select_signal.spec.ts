import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('Store.selectSignal()', () => {
  const expectSnippet = expecter(
    (code) => `
      import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

      interface State { foo: { bar: { baz: [] } } };
      const store = {} as Store<State>;
      const fooSelector = createFeatureSelector<State, State['foo']>('foo')
      const barSelector = createSelector(fooSelector, s => s.bar)

      ${code}
    `,
    compilerOptions()
  );

  describe('as property', () => {
    describe('with functions', () => {
      it('should enforce that properties exists on state (root)', () => {
        expectSnippet(
          `const selector = store.selectSignal(s => s.mia);`
        ).toFail(/Property 'mia' does not exist on type 'State'/);
      });

      it('should enforce that properties exists on state (nested)', () => {
        expectSnippet(
          `const selector = store.selectSignal(s => s.foo.bar.mia);`
        ).toFail(/Property 'mia' does not exist on type '\{ baz: \[\]; \}'/);
      });

      it('should infer correctly (root)', () => {
        expectSnippet(
          `const selector = store.selectSignal(s => s.foo);`
        ).toInfer('selector', 'Signal<{ bar: { baz: []; }; }>');
      });

      it('should infer correctly (nested)', () => {
        expectSnippet(
          `const selector = store.selectSignal(s => s.foo.bar);`
        ).toInfer('selector', 'Signal<{ baz: []; }>');
      });
    });

    describe('with selectors', () => {
      it('should infer correctly', () => {
        expectSnippet(
          `const selector = store.selectSignal(fooSelector);`
        ).toInfer('selector', 'Signal<{ bar: { baz: []; }; }>');

        expectSnippet(
          `const selector = store.selectSignal(barSelector);`
        ).toInfer('selector', 'Signal<{ baz: []; }>');
      });
    });
  });
});
