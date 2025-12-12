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
});
