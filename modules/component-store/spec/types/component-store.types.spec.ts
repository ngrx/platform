import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('ComponentStore types', () => {
  describe('effect', () => {
    const expectSnippet = expecter(
      (code) => `
        import { ComponentStore } from '@ngrx/component-store';
        import { of, EMPTY, Observable } from 'rxjs';
        import { concatMap } from 'rxjs/operators';

        const number$: Observable<number> = of(5);
        const string$: Observable<string> = of('string');

        const componentStore = new ComponentStore();
        ${code}
      `,
      compilerOptions()
    );

    describe('infers Subscription', () => {
      it('when argument type is specified and a variable with corresponding type is passed', () => {
        expectSnippet(
          `const eff = componentStore.effect((e: Observable<string>) => number$)('string');`
        ).toInfer('eff', 'Subscription');
      });

      it(
        'when argument type is specified, returns EMPTY and ' +
          'a variable with corresponding type is passed',
        () => {
          expectSnippet(
            `const eff = componentStore.effect((e: Observable<string>) => EMPTY)('string');`
          ).toInfer('eff', 'Subscription');
        }
      );

      it('when argument type is specified and an Observable with corresponding type is passed', () => {
        expectSnippet(
          `const eff = componentStore.effect((e: Observable<string>) => EMPTY)(string$);`
        ).toInfer('eff', 'Subscription');
      });

      it('when argument type is specified as Observable<unknown> and any type is passed', () => {
        expectSnippet(
          `const eff = componentStore.effect((e: Observable<unknown>) => EMPTY)(5);`
        ).toInfer('eff', 'Subscription');
      });

      it('when generic type is specified and a variable with corresponding type is passed', () => {
        expectSnippet(
          `const eff = componentStore.effect<string>((e) => number$)('string');`
        ).toInfer('eff', 'Subscription');
      });

      it('when generic type is specified as unknown and a variable with any type is passed', () => {
        expectSnippet(
          `const eff = componentStore.effect<unknown>((e) => number$)('string');`
        ).toInfer('eff', 'Subscription');
      });

      it('when generic type is specified as unknown and origin can still be piped', () => {
        expectSnippet(
          `const eff = componentStore.effect<unknown>((e) => e.pipe(concatMap(() => of())))('string');`
        ).toInfer('eff', 'Subscription');
      });

      it('when generic type is specified as unknown and origin can still be piped', () => {
        expectSnippet(
          `const eff = componentStore.effect<unknown>((e) => e.pipe(concatMap(() => of())))('string');`
        ).toInfer('eff', 'Subscription');
      });
    });

    describe('infers void', () => {
      it('when argument type is specified as Observable<void> and nothing is passed', () => {
        expectSnippet(
          `const eff = componentStore.effect((e: Observable<void>) => string$)();`
        ).toInfer('eff', 'void');
      });

      it('when type is not specified and origin can still be piped', () => {
        expectSnippet(
          //     treated as Observable<void> 👇
          `const eff = componentStore.effect((e) => e.pipe(concatMap(() => of())))();`
        ).toInfer('eff', 'void');
      });

      it('when generic type is specified as void and origin can still be piped', () => {
        expectSnippet(
          `const eff = componentStore.effect<void>((e) => e.pipe(concatMap(() => number$)))();`
        ).toInfer('eff', 'void');
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
          /Argument of type '5' is not assignable to parameter of type 'string \| Observable<string>'./
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
          /Argument of type '5' is not assignable to parameter of type 'string \| Observable<string>'/
        );
      });

      it('when generic type is specified as unknown and a variable is not passed', () => {
        expectSnippet(
          `componentStore.effect<unknown>((e) => number$)();`
        ).toFail(/Expected 1 arguments, but got 0/);
      });

      it('when argument type is specified as Observable<void> and anything is passed', () => {
        expectSnippet(
          `componentStore.effect((e: Observable<void>) => string$)(5);`
        ).toFail(/Expected 0 arguments, but got 1/);
      });

      it('when type is not specified and anything is passed', () => {
        expectSnippet(
          `const eff = componentStore.effect((e) => EMPTY)('string');`
        ).toFail(/Expected 0 arguments, but got 1/);
      });

      it('when generic type is specified and anything is passed', () => {
        expectSnippet(
          `componentStore.effect<void>((e) => EMPTY)(undefined);`
        ).toFail(/Expected 0 arguments, but got 1/);
      });
    });
  });
});
