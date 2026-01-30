import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('ComponentStore types', () => {
  describe('effect', () => {
    const expectSnippet = expecter(
      (code) => `
        import { ComponentStore } from '@ngrx/component-store';
        import { of, EMPTY, Observable } from 'rxjs';
        import { concatMap } from 'rxjs/operators';

        interface Obj {
          prop: string;
        }

        const number$: Observable<number> = of(5);
        const string$: Observable<string> = of('string');

        const componentStore = new ComponentStore();
        ${code}
      `,
      compilerOptions()
    );

    describe('infers Subscription', () => {
      it('when argument type is specified and a variable with corresponding type is passed', () => {
        const effectTest = `const sub = componentStore.effect((e: Observable<string>) => number$)('string');`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it(
        'when argument type is specified, returns EMPTY and ' +
          'a variable with corresponding type is passed',
        () => {
          const effectTest = `const sub = componentStore.effect((e: Observable<string>) => EMPTY)('string');`;
          expectSnippet(effectTest).toInfer('sub', 'Subscription');
        }
      );

      it('when argument type is specified and an Observable with corresponding type is passed', () => {
        const effectTest = `const sub = componentStore.effect((e: Observable<string>) => EMPTY)(string$);`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when argument type is specified as Observable<unknown> and any type is passed', () => {
        const effectTest = `const sub = componentStore.effect((e: Observable<unknown>) => EMPTY)(5);`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when generic type is specified and a variable with corresponding type is passed', () => {
        const effectTest = `const sub = componentStore.effect<string>((e) => number$)('string');`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when generic type is specified as unknown and a variable with any type is passed', () => {
        const effectTest = `const sub = componentStore.effect<unknown>((e) => number$)('string');`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when generic type is specified as unknown and origin can still be piped', () => {
        const effectTest = `const sub = componentStore.effect<unknown>((e) => e.pipe(concatMap(() => of())))('string');`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when generic type is specified as unknown and origin can still be piped', () => {
        expectSnippet(
          `const sub = componentStore.effect<unknown>((e) => e.pipe(concatMap(() => of())))('string');`
        ).toInfer('sub', 'Subscription');
      });

      it('when argument type is an interface and a variable with corresponding type is passed', () => {
        const effectTest = `const sub = componentStore.effect((e: Observable<Obj>) => number$)({prop: 'string'});`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when argument type is a partial interface and a variable with corresponding type is passed', () => {
        const effectTest = `const sub = componentStore.effect((e: Observable<Partial<Obj>>) => number$)({prop: 'string'});`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });
    });

    describe('for void types', () => {
      it('when generic type is specified as void the argument is optional', () => {
        const effectTest = `const sub = componentStore.effect<void>((e) => EMPTY)();`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when argument type is specified as Observable<void> the argument is optional', () => {
        const effectTest = `const sub = componentStore.effect((e: Observable<void>) => EMPTY)();`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when type is not specified the argument is optional', () => {
        const effectTest = `const sub = componentStore.effect((e) => EMPTY)();`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when type is specified as void the argument can be a void$', () => {
        const effectTest = `const sub = componentStore.effect((e: Observable<void>) => EMPTY)(of<void>());`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when type is specified as void the argument can be a void', () => {
        const effectTest = `const sub = componentStore.effect((e) => EMPTY)({} as unknown as void);`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });

      it('when generic type is specified as void and origin can still be piped', () => {
        const effectTest = `const sub = componentStore.effect<void>((e) => e.pipe(concatMap(() => number$)))();`;
        expectSnippet(effectTest).toInfer('sub', 'Subscription');
      });
    });

    describe('catches improper usage', () => {
      it('when type is specified and argument is not passed', () => {
        expectSnippet(
          `componentStore.effect((e: Observable<string>) => of())();`
        ).toFail(/Expected 1 arguments, but got 0/);
      });

      it('when type is specified and argument of incorrect type is passed', () => {
        expectSnippet(
          `componentStore.effect((e: Observable<string>) => number$)(5);`
        ).toFail(
          /Argument of type 'number' is not assignable to parameter of type 'string \| Observable<string>'./
        );
      });

      it('when type is specified and Observable argument of incorrect type is passed', () => {
        expectSnippet(
          `componentStore.effect((e: Observable<string>) => string$)(number$);`
        ).toFail(
          /Argument of type 'Observable<number>' is not assignable to parameter of type 'string \| Observable<string>'/
        );
      });

      it('when argument type is specified as Observable<unknown> and type is not passed', () => {
        expectSnippet(
          `componentStore.effect((e: Observable<unknown>) => EMPTY)();`
        ).toFail(/Expected 1 arguments, but got 0/);
      });

      it('when generic type is specified and a variable with incorrect type is passed', () => {
        expectSnippet(
          `componentStore.effect<string>((e) => number$)(5);`
        ).toFail(
          /Argument of type 'number' is not assignable to parameter of type 'string \| Observable<string>'/
        );
      });

      it('when generic type is specified as void and a variable with incorrect type is passed', () => {
        expectSnippet(`componentStore.effect<void>((e) => number$)(5);`).toFail(
          /Argument of type 'number' is not assignable to parameter of type 'void \| Observable<void>'/
        );
      });

      it('when generic type is specified as unknown and a variable is not passed', () => {
        expectSnippet(
          `componentStore.effect<unknown>((e) => number$)();`
        ).toFail(/Expected 1 arguments, but got 0/);
      });
    });
  });

  describe('updater', () => {
    const expectSnippet = expecter(
      (code) => `
        import { ComponentStore } from '@ngrx/component-store';
        import { of, EMPTY, Observable } from 'rxjs';
        import { concatMap } from 'rxjs/operators';

        export enum LoadingState {
          INIT = 'INIT',
          LOADING = 'LOADING',
          LOADED = 'LOADED',
          ERROR = 'ERROR',
        }

        interface Obj {
          prop: string;
        }

        const number$: Observable<number> = of(5);
        const string$: Observable<string> = of('string');

        const componentStore = new ComponentStore({ prop: 'init', prop2: 'yeah!'});
        ${code}
      `,
      compilerOptions()
    );

    describe('infers Subscription', () => {
      it('when argument type is specified and a variable with corresponding type is passed', () => {
        const updaterTest = `const sub = componentStore.updater((state, v: string) => ({...state}))('string');`;
        expectSnippet(updaterTest).toInfer('sub', 'Subscription');
      });

      it('when argument type is specified and an Observable with corresponding type is passed', () => {
        const updaterTest = `const sub = componentStore.updater((state, v: string) => ({...state}))(string$);`;
        expectSnippet(updaterTest).toInfer('sub', 'Subscription');
      });

      it('when argument type is an interface and a variable with corresponding type is passed', () => {
        const updaterTest = `const sub = componentStore.updater((state, v: Obj) => ({...state}))({prop: 'obj'});`;
        expectSnippet(updaterTest).toInfer('sub', 'Subscription');
      });

      it('when argument type is an partial interface and a variable with corresponding type is passed', () => {
        const updaterTest = `const sub = componentStore.updater((state, v: Partial<Obj>) => ({...state}))({prop: 'obj'});`;
        expectSnippet(updaterTest).toInfer('sub', 'Subscription');
      });

      it('when argument type is an enum and a variable with corresponding type is passed', () => {
        const updaterTest = `const sub = componentStore.updater((state, v: LoadingState) => ({...state}))(LoadingState.LOADED);`;
        expectSnippet(updaterTest).toInfer('sub', 'Subscription');
      });

      it('when argument type is a union and a variable with corresponding type is passed', () => {
        const updaterTest = `const sub = componentStore.updater((state, v: string|number) => ({...state}))(5);`;
        expectSnippet(updaterTest).toInfer('sub', 'Subscription');
      });

      it('when argument type is an intersection and a variable with corresponding type is passed', () => {
        const updaterTest = `const sub = componentStore.updater((state, v: {p: string} & {p2: number}) => ({...state}))({p: 's', p2: 3});`;
        expectSnippet(updaterTest).toInfer('sub', 'Subscription');
      });

      it('when argument type is unknown and any variable is passed', () => {
        const updaterTest = `const sub = componentStore.updater((state, v: unknown) => ({...state}))({anything: 'works'});`;
        expectSnippet(updaterTest).toInfer('sub', 'Subscription');
      });

      it('when generic type is specified and any variable is passed', () => {
        const updaterTest = `const sub = componentStore.updater<string>((state, v) => ({...state}))('works');`;
        expectSnippet(updaterTest).toInfer('sub', 'Subscription');
      });

      it('when type is not specified and nothing is passed', () => {
        const updaterTest = `const v = componentStore.updater((state) => ({...state}))();`;
        expectSnippet(updaterTest).toInfer('v', 'void');
      });

      it('when type void is specified and nothing is passed', () => {
        const updaterTest = `const v = componentStore.updater<void>((state) => ({...state}))();`;
        expectSnippet(updaterTest).toInfer('v', 'void');
      });
    });

    describe('catches improper usage', () => {
      it('when type is specified and argument is not passed', () => {
        expectSnippet(
          `const sub = componentStore.updater((state, v: string) => ({...state}))();`
        ).toFail(/Expected 1 arguments, but got 0/);
      });

      it('when argument type is unknown and nothing is passed', () => {
        expectSnippet(
          `const sub = componentStore.updater((state, v: unknown) => ({...state}))();`
        ).toFail(/Expected 1 arguments, but got 0/);
      });

      it('when no argument is expected but one is passed', () => {
        expectSnippet(
          `const sub = componentStore.updater((state) => ({...state}))('string');`
        ).toFail(/Expected 0 arguments, but got 1/);
      });

      it('when type is specified and Observable argument of incorrect type is passed', () => {
        expectSnippet(
          `const sub = componentStore.updater((state, v: string) => ({...state}))(number$);`
        ).toFail(
          /Argument of type 'Observable<number>' is not assignable to parameter of type 'string \| Observable<string>'/
        );
      });
    });

    describe('catches excess properties', () => {
      it('when extra property is returned with spread', () => {
        expectSnippet(
          `componentStore.updater((state, v: string) => ({...state, extraProp: 'bad'}))('test');`
        ).toFail(/Remove excess properties/);
      });

      it('when extra property is returned with explicit object', () => {
        expectSnippet(
          `componentStore.updater((state, v: string) => ({ prop: v, prop2: state.prop2, extraProp: 'bad' }))('test');`
        ).toFail(/Remove excess properties/);
      });

      it('when extra property is returned from void updater', () => {
        expectSnippet(
          `componentStore.updater((state) => ({...state, extraProp: true}))();`
        ).toFail(/Remove excess properties/);
      });

      it('when required property is missing', () => {
        expectSnippet(
          `componentStore.updater((state, v: string) => ({ prop: v }))('test');`
        ).toFail(/is missing in type/);
      });

      it('when property has wrong type', () => {
        expectSnippet(
          `componentStore.updater((state, v: string) => ({...state, prop: 123}))('test');`
        ).toFail(/not assignable to type/);
      });

      it('allows spread with override', () => {
        expectSnippet(
          `const sub = componentStore.updater((state, v: string) => ({...state, prop: v}))('test');`
        ).toInfer('sub', 'Subscription');
      });

      it('allows full explicit return matching all state keys', () => {
        expectSnippet(
          `const sub = componentStore.updater((state, v: string) => ({ prop: v, prop2: state.prop2 }))('test');`
        ).toInfer('sub', 'Subscription');
      });

      it('allows void updater with spread return', () => {
        expectSnippet(
          `const v = componentStore.updater((state) => ({...state, prop: 'updated'}))();`
        ).toInfer('v', 'void');
      });

      it('allows direct state return', () => {
        expectSnippet(
          `const v = componentStore.updater((state) => state)();`
        ).toInfer('v', 'void');
      });
    });
  });
});
