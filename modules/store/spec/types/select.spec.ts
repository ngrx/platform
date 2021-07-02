import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('select()', () => {
  const expectSnippet = expecter(
    (code) => `
      import { Store, select, createSelector, createFeatureSelector } from '@ngrx/store';

      interface State { foo: { bar: { baz: [] } } };
      const store = {} as Store<State>;
      const fooSelector = createFeatureSelector<State, State['foo']>('foo')
      const barSelector = createSelector(fooSelector, s => s.bar)

      ${code}
    `,
    compilerOptions()
  );

  describe('as property', () => {
    describe('with strings', () => {
      it('should enforce that properties exists on state (root)', () => {
        expectSnippet(`const selector = store.select('mia');`).toFail(
          /Argument of type '"mia"' is not assignable to parameter of type '"foo"'/
        );
      });

      it('should enforce that properties exists on state (nested)', () => {
        expectSnippet(
          `const selector = store.select('foo', 'bar', 'mia');`
        ).toFail(
          /Argument of type '"mia"' is not assignable to parameter of type '"baz"'/
        );
      });

      it('should infer correctly (root)', () => {
        expectSnippet(`const selector = store.select('foo');`).toInfer(
          'selector',
          'Observable<{ bar: { baz: []; }; }>'
        );
      });

      it('should infer correctly (nested)', () => {
        expectSnippet(`const selector = store.select('foo', 'bar');`).toInfer(
          'selector',
          'Observable<{ baz: []; }>'
        );
      });
    });

    describe('with functions', () => {
      it('should enforce that properties exists on state (root)', () => {
        expectSnippet(`const selector = store.select(s => s.mia);`).toFail(
          /Property 'mia' does not exist on type 'State'/
        );
      });

      it('should enforce that properties exists on state (nested)', () => {
        expectSnippet(
          `const selector = store.select(s => s.foo.bar.mia);`
        ).toFail(/Property 'mia' does not exist on type '\{ baz: \[\]; \}'/);
      });

      it('should infer correctly (root)', () => {
        expectSnippet(`const selector = store.select(s => s.foo);`).toInfer(
          'selector',
          'Observable<{ bar: { baz: []; }; }>'
        );
      });

      it('should infer correctly (nested)', () => {
        expectSnippet(`const selector = store.select(s => s.foo.bar);`).toInfer(
          'selector',
          'Observable<{ baz: []; }>'
        );
      });
    });

    describe('with selectors', () => {
      it('should infer correctly', () => {
        expectSnippet(`const selector = store.select(fooSelector);`).toInfer(
          'selector',
          'Observable<{ bar: { baz: []; }; }>'
        );

        expectSnippet(`const selector = store.select(barSelector);`).toInfer(
          'selector',
          'Observable<{ baz: []; }>'
        );
      });
    });
  });

  describe('as operator', () => {
    describe('with strings', () => {
      it('should enforce that properties exists on state (root)', () => {
        expectSnippet(`const selector = store.pipe(select('mia'));`).toFail(
          /Argument of type '"mia"' is not assignable to parameter of type '"foo"'/
        );
      });

      it('should enforce that properties exists on state (nested)', () => {
        expectSnippet(
          `const selector = store.pipe(select('foo', 'bar', 'mia'));`
        ).toFail(
          /Argument of type '"mia"' is not assignable to parameter of type '"baz"'/
        );
      });

      it('should infer correctly (root)', () => {
        expectSnippet(`const selector = store.pipe(select('foo'));`).toInfer(
          'selector',
          'Observable<{ bar: { baz: []; }; }>'
        );
      });

      it('should infer correctly (nested)', () => {
        expectSnippet(
          `const selector = store.pipe(select('foo', 'bar'));`
        ).toInfer('selector', 'Observable<{ baz: []; }>');
      });
    });

    describe('with functions', () => {
      it('should enforce that properties exists on state (root)', () => {
        expectSnippet(
          `const selector = store.pipe(select(s => s.mia));`
        ).toFail(/Property 'mia' does not exist on type 'State'/);
      });

      it('should enforce that properties exists on state (nested)', () => {
        expectSnippet(
          `const selector = store.pipe(select(s => s.foo.bar.mia));`
        ).toFail(/Property 'mia' does not exist on type '\{ baz: \[\]; \}'/);
      });

      it('should infer correctly (root)', () => {
        expectSnippet(
          `const selector = store.pipe(select(s => s.foo));`
        ).toInfer('selector', 'Observable<{ bar: { baz: []; }; }>');
      });

      it('should infer correctly (nested)', () => {
        expectSnippet(
          `const selector = store.pipe(select(s => s.foo.bar));`
        ).toInfer('selector', 'Observable<{ baz: []; }>');
      });
    });

    describe('with selectors', () => {
      it('should infer correctly', () => {
        expectSnippet(
          `const selector = store.pipe(select(fooSelector));`
        ).toInfer('selector', 'Observable<{ bar: { baz: []; }; }>');

        expectSnippet(
          `const selector = store.pipe(select(barSelector));`
        ).toInfer('selector', 'Observable<{ baz: []; }>');
      });
    });
  });
});
