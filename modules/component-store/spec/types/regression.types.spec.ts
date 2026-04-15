import { ComponentStore } from '../../';
import { Observable } from 'rxjs';
import { describe, it } from 'vitest';

describe('regression component-store', () => {
  it('https://github.com/ngrx/platform/issues/3482', () => {
    interface SomeType {
      name: string;
      prop: string;
    }

    abstract class MyStore<
      QueryVariables extends SomeType,
    > extends ComponentStore<any> {
      protected abstract readonly query$: Observable<
        Omit<QueryVariables, 'name'>
      >;

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
  });
});
