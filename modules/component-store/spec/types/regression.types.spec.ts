import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('regression component-store', () => {
  const expectSnippet = expecter(
    (code) => `
        import { ComponentStore } from '@ngrx/component-store';
        import { of, EMPTY, Observable } from 'rxjs';
        import { concatMap } from 'rxjs/operators';

        ${code}
      `,
    compilerOptions()
  );

  it('https://github.com/ngrx/platform/issues/3482', () => {
    const effectTest = `
        interface SomeType {
          name: string;
          prop: string;
        }

        export abstract class MyStore<
          QueryVariables extends SomeType
        > extends ComponentStore<any> {
          protected abstract readonly query$: Observable<Omit<QueryVariables, 'name'>>;

          readonly load = this.effect(
            (origin$: Observable<Omit<QueryVariables, 'name'> | null>) => origin$
          );

          protected constructor() {
            super();
          }

          protected initializeLoad() {
            // 👇 this should work
            this.load(this.query$);
          }
        }
      `;
    expectSnippet(effectTest).toSucceed();
  });

  describe('updater exact return type', () => {
    it('should work with state containing optional properties', () => {
      expectSnippet(`
        const store = new ComponentStore<{ req: string; opt?: number }>({ req: 'a' });
        store.updater((state) => ({ req: 'b' }))();
      `).toSucceed();
    });

    it('should work with state containing index signature', () => {
      expectSnippet(`
        const store = new ComponentStore<{ [key: string]: number }>({});
        store.updater((state, v: number) => ({...state, newKey: v}))(5);
      `).toSucceed();
    });

    it('should catch excess properties with concrete state type', () => {
      expectSnippet(`
        const store = new ComponentStore<{ name: string }>({ name: 'test' });
        store.updater((state, v: string) => ({...state, name: v, extra: true}))('test');
      `).toFail(/Remove excess properties/);
    });
  });
});
