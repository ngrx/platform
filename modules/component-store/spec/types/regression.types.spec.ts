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

  describe('updater exact return type', () => {
    it('should work with state containing optional properties', () => {
      const store = new ComponentStore<{ req: string; opt?: number }>({
        req: 'a',
      });
      store.updater((state) => ({ req: 'b' }))();
    });

    it('should work with state containing index signature', () => {
      const store = new ComponentStore<{ [key: string]: number }>({});
      store.updater((state, v: number) => ({ ...state, newKey: v }))(5);
    });

    it('should catch excess properties with concrete state type', () => {
      const store = new ComponentStore<{ name: string }>({ name: 'test' });
      store.updater((state, v: string) => ({
        ...state,
        name: v,
        // @ts-expect-error updater callback return type must exactly match the state type. Remove excess properties.
        extra: true,
      }))('test');
    });
  });
});
