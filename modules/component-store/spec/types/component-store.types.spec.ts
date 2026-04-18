import { expectTypeOf, describe, it } from 'vitest';
import { EMPTY, Observable, Subscription, of, concatMap } from 'rxjs';
import { ComponentStore } from '../../';

interface Obj {
  prop: string;
}

enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR',
}

describe('ComponentStore types', () => {
  describe('effect', () => {
    const number$: Observable<number> = of(5);
    const string$: Observable<string> = of('string');

    describe('infers Subscription', () => {
      it('when argument type is specified and a variable with corresponding type is passed', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect((e: Observable<string>) => number$)(
          'string'
        );
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it(
        'when argument type is specified, returns EMPTY and ' +
          'a variable with corresponding type is passed',
        () => {
          const componentStore = new ComponentStore();
          const sub = componentStore.effect((e: Observable<string>) => EMPTY)(
            'string'
          );
          expectTypeOf(sub).toEqualTypeOf<Subscription>();
        }
      );

      it('when argument type is specified and an Observable with corresponding type is passed', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect((e: Observable<string>) => EMPTY)(
          string$
        );
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is specified as Observable<unknown> and any type is passed', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect((e: Observable<unknown>) => EMPTY)(5);
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when generic type is specified and a variable with corresponding type is passed', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect<string>((e) => number$)('string');
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when generic type is specified as unknown and a variable with any type is passed', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect<unknown>((e) => number$)('string');
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when generic type is specified as unknown and origin can still be piped', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect<unknown>((e) =>
          e.pipe(concatMap(() => of()))
        )('string');
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when generic type is specified as unknown and origin can still be piped', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect<unknown>((e) =>
          e.pipe(concatMap(() => of()))
        )('string');
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is an interface and a variable with corresponding type is passed', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect((e: Observable<Obj>) => number$)({
          prop: 'string',
        });
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is a partial interface and a variable with corresponding type is passed', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect(
          (e: Observable<Partial<Obj>>) => number$
        )({ prop: 'string' });
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });
    });

    describe('for void types', () => {
      it('when generic type is specified as void the argument is optional', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect<void>((e) => EMPTY)();
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is specified as Observable<void> the argument is optional', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect((e: Observable<void>) => EMPTY)();
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when type is not specified the argument is optional', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect((e) => EMPTY)();
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when type is specified as void the argument can be a void$', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect((e: Observable<void>) => EMPTY)(
          of<void>()
        );
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when type is specified as void the argument can be a void', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect((e) => EMPTY)({} as unknown as void);
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when generic type is specified as void and origin can still be piped', () => {
        const componentStore = new ComponentStore();
        const sub = componentStore.effect<void>((e) =>
          e.pipe(concatMap(() => number$))
        )();
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });
    });

    describe('catches improper usage', () => {
      it('when type is specified and argument is not passed', () => {
        const componentStore = new ComponentStore();
        // @ts-expect-error Expected 1 arguments, but got 0
        componentStore.effect((e: Observable<string>) => of())();
      });

      it('when type is specified and argument of incorrect type is passed', () => {
        const componentStore = new ComponentStore();
        // @ts-expect-error Argument of type 'number' is not assignable to parameter of type 'string | Observable<string>'
        componentStore.effect((e: Observable<string>) => number$)(5);
      });

      it('when type is specified and Observable argument of incorrect type is passed', () => {
        const componentStore = new ComponentStore();
        // @ts-expect-error Argument of type 'Observable<number>' is not assignable to parameter of type 'string | Observable<string>'
        componentStore.effect((e: Observable<string>) => string$)(number$);
      });

      it('when argument type is specified as Observable<unknown> and type is not passed', () => {
        const componentStore = new ComponentStore();
        // @ts-expect-error Expected 1 arguments, but got 0
        componentStore.effect((e: Observable<unknown>) => EMPTY)();
      });

      it('when generic type is specified and a variable with incorrect type is passed', () => {
        const componentStore = new ComponentStore();
        // @ts-expect-error Argument of type 'number' is not assignable to parameter of type 'string | Observable<string>'
        componentStore.effect<string>((e) => number$)(5);
      });

      it('when generic type is specified as void and a variable with incorrect type is passed', () => {
        const componentStore = new ComponentStore();
        // @ts-expect-error Argument of type 'number' is not assignable to parameter of type 'void | Observable<void>'
        componentStore.effect<void>((e) => number$)(5);
      });

      it('when generic type is specified as unknown and a variable is not passed', () => {
        const componentStore = new ComponentStore();
        // @ts-expect-error Expected 1 arguments, but got 0
        componentStore.effect<unknown>((e) => number$)();
      });
    });
  });

  describe('updater', () => {
    const number$: Observable<number> = of(5);
    const string$: Observable<string> = of('string');

    describe('infers Subscription', () => {
      it('when argument type is specified and a variable with corresponding type is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const sub = componentStore.updater((state, v: string) => ({
          ...state,
        }))('string');
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is specified and an Observable with corresponding type is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const sub = componentStore.updater((state, v: string) => ({
          ...state,
        }))(string$);
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is an interface and a variable with corresponding type is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const sub = componentStore.updater((state, v: Obj) => ({ ...state }))({
          prop: 'obj',
        });
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is an partial interface and a variable with corresponding type is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const sub = componentStore.updater((state, v: Partial<Obj>) => ({
          ...state,
        }))({ prop: 'obj' });
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is an enum and a variable with corresponding type is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const sub = componentStore.updater((state, v: LoadingState) => ({
          ...state,
        }))(LoadingState.LOADED);
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is a union and a variable with corresponding type is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const sub = componentStore.updater((state, v: string | number) => ({
          ...state,
        }))(5);
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is an intersection and a variable with corresponding type is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const sub = componentStore.updater(
          (state, v: { p: string } & { p2: number }) => ({ ...state })
        )({ p: 's', p2: 3 });
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when argument type is unknown and any variable is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const sub = componentStore.updater((state, v: unknown) => ({
          ...state,
        }))({ anything: 'works' });
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when generic type is specified and any variable is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const sub = componentStore.updater<string>((state, v) => ({
          ...state,
        }))('works');
        expectTypeOf(sub).toEqualTypeOf<Subscription>();
      });

      it('when type is not specified and nothing is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const v = componentStore.updater((state) => ({ ...state }))();
        expectTypeOf(v).toBeVoid();
      });

      it('when type void is specified and nothing is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        const v = componentStore.updater<void>((state) => ({ ...state }))();
        expectTypeOf(v).toBeVoid();
      });
    });

    describe('catches improper usage', () => {
      it('when type is specified and argument is not passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        // @ts-expect-error Expected 1 arguments, but got 0
        componentStore.updater((state, v: string) => ({ ...state }))();
      });

      it('when argument type is unknown and nothing is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        // @ts-expect-error Expected 1 arguments, but got 0
        componentStore.updater((state, v: unknown) => ({ ...state }))();
      });

      it('when no argument is expected but one is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        // @ts-expect-error Expected 0 arguments, but got 1
        componentStore.updater((state) => ({ ...state }))('string');
      });

      it('when type is specified and Observable argument of incorrect type is passed', () => {
        const componentStore = new ComponentStore({
          prop: 'init',
          prop2: 'yeah!',
        });
        // @ts-expect-error Argument of type 'Observable<number>' is not assignable to parameter of type 'string | Observable<string>'
        componentStore.updater((state, v: string) => ({ ...state }))(number$);
      });
    });
  });
});
