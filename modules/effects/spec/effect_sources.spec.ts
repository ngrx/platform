import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import {
  concat,
  NEVER,
  Observable,
  of,
  throwError,
  timer,
  Subject,
} from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Effect,
  EffectSources,
  OnIdentifyEffects,
  OnInitEffects,
  createEffect,
  EFFECTS_ERROR_HANDLER,
  EffectsErrorHandler,
  Actions,
} from '../';
import { defaultEffectsErrorHandler } from '../src/effects_error_handler';
import { EffectsRunner } from '../src/effects_runner';
import { Store } from '@ngrx/store';
import { ofType } from '../src';

describe('EffectSources', () => {
  let mockErrorReporter: ErrorHandler;
  let effectSources: EffectSources;
  let effectsErrorHandler: EffectsErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: EFFECTS_ERROR_HANDLER,
          useValue: defaultEffectsErrorHandler,
        },
        EffectSources,
        EffectsRunner,
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'),
          },
        },
      ],
    });

    const effectsRunner = TestBed.inject(EffectsRunner);
    effectsRunner.start();

    mockErrorReporter = TestBed.inject(ErrorHandler);
    effectSources = TestBed.inject(EffectSources);
    effectsErrorHandler = TestBed.inject(EFFECTS_ERROR_HANDLER);

    spyOn(mockErrorReporter, 'handleError');
  });

  it('should have an "addEffects" method to push new source instances', () => {
    const effectSource = {};
    spyOn(effectSources, 'next');

    effectSources.addEffects(effectSource);

    expect(effectSources.next).toHaveBeenCalledWith(effectSource);
  });

  describe('toActions() Operator', () => {
    function toActions(source: any): Observable<any> {
      source['errorHandler'] = mockErrorReporter;
      source['effectsErrorHandler'] = effectsErrorHandler;
      return (effectSources as any)['toActions'].call(source);
    }

    describe('with @Effect()', () => {
      const a = { type: 'From Source A' };
      const b = { type: 'From Source B' };
      const c = { type: 'From Source C that completes' };
      const d = { not: 'a valid action' };
      const e = undefined;
      const f = null;
      const i = { type: 'From Source Identifier' };
      const i2 = { type: 'From Source Identifier 2' };

      const circularRef = {} as any;
      circularRef.circularRef = circularRef;
      const g = { circularRef };

      const error = new Error('An Error');

      class SourceA {
        @Effect() a$ = alwaysOf(a);
      }

      class SourceB {
        @Effect() b$ = alwaysOf(b);
      }

      class SourceC {
        @Effect() c$ = of(c);
      }

      class SourceD {
        @Effect() d$ = alwaysOf(d);
      }

      class SourceE {
        @Effect() e$ = alwaysOf(e);
      }

      class SourceF {
        @Effect() f$ = alwaysOf(f);
      }

      class SourceG {
        @Effect() g$ = alwaysOf(g);
      }

      class SourceError {
        @Effect() e$ = throwError(() => error);
      }

      class SourceH {
        @Effect() empty = of('value');
        @Effect()
        never = timer(50, getTestScheduler() as any).pipe(map(() => 'update'));
      }

      class SourceWithIdentifier implements OnIdentifyEffects {
        effectIdentifier: string;
        @Effect() i$ = alwaysOf(i);

        ngrxOnIdentifyEffects() {
          return this.effectIdentifier;
        }

        constructor(identifier: string) {
          this.effectIdentifier = identifier;
        }
      }

      class SourceWithIdentifier2 implements OnIdentifyEffects {
        effectIdentifier: string;
        @Effect() i2$ = alwaysOf(i2);

        ngrxOnIdentifyEffects() {
          return this.effectIdentifier;
        }

        constructor(identifier: string) {
          this.effectIdentifier = identifier;
        }
      }

      it('should resolve effects from instances', () => {
        const sources$ = cold('--a--', { a: new SourceA() });
        const expected = cold('--a--', { a });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should ignore duplicate sources', () => {
        const sources$ = cold('--a--a--a--', {
          a: new SourceA(),
        });
        const expected = cold('--a--------', { a });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should resolve effects with different identifiers', () => {
        const sources$ = cold('--a--b--c--', {
          a: new SourceWithIdentifier('a'),
          b: new SourceWithIdentifier('b'),
          c: new SourceWithIdentifier('c'),
        });
        const expected = cold('--i--i--i--', { i });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should ignore effects with the same identifier', () => {
        const sources$ = cold('--a--b--c--', {
          a: new SourceWithIdentifier('a'),
          b: new SourceWithIdentifier('a'),
          c: new SourceWithIdentifier('a'),
        });
        const expected = cold('--i--------', { i });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should resolve effects with same identifiers but different classes', () => {
        const sources$ = cold('--a--b--c--d--', {
          a: new SourceWithIdentifier('a'),
          b: new SourceWithIdentifier2('a'),
          c: new SourceWithIdentifier('b'),
          d: new SourceWithIdentifier2('b'),
        });
        const expected = cold('--a--b--a--b--', { a: i, b: i2 });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should report an error if an effect dispatches an invalid action', () => {
        const sources$ = of(new SourceD());

        toActions(sources$).subscribe();

        expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
          new Error(
            'Effect "SourceD.d$" dispatched an invalid action: {"not":"a valid action"}'
          )
        );
      });

      it('should report an error if an effect dispatches an `undefined`', () => {
        const sources$ = of(new SourceE());

        toActions(sources$).subscribe();

        expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
          new Error(
            'Effect "SourceE.e$" dispatched an invalid action: undefined'
          )
        );
      });

      it('should report an error if an effect dispatches a `null`', () => {
        const sources$ = of(new SourceF());

        toActions(sources$).subscribe();

        expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
          new Error('Effect "SourceF.f$" dispatched an invalid action: null')
        );
      });

      it('should report an error if an effect throws one', () => {
        const sources$ = of(new SourceError());

        toActions(sources$).subscribe();

        expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
          new Error('An Error')
        );
      });

      it('should resubscribe on error by default', () => {
        class Eff {
          @Effect()
          b$ = hot('a--e--b--e--c--e--d').pipe(
            map((v) => {
              if (v == 'e') throw new Error('An Error');
              return v;
            })
          );
        }

        const sources$ = of(new Eff());

        //                       👇 'e' is ignored.
        const expected = cold('a-----b-----c-----d');
        expect(toActions(sources$)).toBeObservable(expected);
      });

      it('should not resubscribe on error when useEffectsErrorHandler is false', () => {
        class Eff {
          @Effect({ useEffectsErrorHandler: false })
          b$ = hot('a--b--c--d').pipe(
            map((v) => {
              if (v == 'b') throw new Error('An Error');
              return v;
            })
          );
        }

        const sources$ = of(new Eff());

        //                       👇 completes.
        const expected = cold('a--|');

        expect(toActions(sources$)).toBeObservable(expected);
      });

      it(`should not break when the action in the error message can't be stringified`, () => {
        const sources$ = of(new SourceG());

        toActions(sources$).subscribe();

        expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
          new Error(
            'Effect "SourceG.g$" dispatched an invalid action: [object Object]'
          )
        );
      });

      it('should not complete the group if just one effect completes', () => {
        const sources$ = cold('g', {
          g: new SourceH(),
        });
        const expected = cold('a----b-----', { a: 'value', b: 'update' });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });
    });

    describe('with createEffect()', () => {
      const a = { type: 'From Source A' };
      const b = { type: 'From Source B' };
      const c = { type: 'From Source C that completes' };
      const d = { not: 'a valid action' };
      const e = undefined;
      const f = null;
      const i = { type: 'From Source Identifier' };
      const i2 = { type: 'From Source Identifier 2' };
      const initAction = { type: '[SourceWithInitAction] Init' };

      const circularRef = {} as any;
      circularRef.circularRef = circularRef;
      const g = { circularRef };

      const error = new Error('An Error');

      class SourceA {
        a$ = createEffect(() => alwaysOf(a));
      }

      class SourceB {
        b$ = createEffect(() => alwaysOf(b));
      }

      class SourceC {
        c$ = createEffect(() => of(c));
      }

      class SourceD {
        // typed as `any` because otherwise there would be compile errors
        // createEffect is typed that it always has to return an action
        d$ = createEffect(() => alwaysOf(d) as any);
      }

      class SourceE {
        // typed as `any` because otherwise there would be compile errors
        // createEffect is typed that it always has to return an action
        e$ = createEffect(() => alwaysOf(e) as any);
      }

      class SourceF {
        // typed as `any` because otherwise there would be compile errors
        // createEffect is typed that it always has to return an action
        f$ = createEffect(() => alwaysOf(f) as any);
      }

      class SourceG {
        // typed as `any` because otherwise there would be compile errors
        // createEffect is typed that it always has to return an action
        g$ = createEffect(() => alwaysOf(g) as any);
      }

      class SourceError {
        e$ = createEffect(() => throwError(() => error) as any);
      }

      class SourceH {
        // typed as `any` because otherwise there would be compile errors
        // createEffect is typed that it always has to return an action
        empty = createEffect(() => of('value') as any);
        never = createEffect(
          () =>
            // typed as `any` because otherwise there would be compile errors
            // createEffect is typed that it always has to return an action
            timer(50, getTestScheduler() as any).pipe(
              map(() => 'update')
            ) as any
        );
      }

      class SourceWithIdentifier implements OnIdentifyEffects {
        effectIdentifier: string;
        i$ = createEffect(() => alwaysOf(i));

        ngrxOnIdentifyEffects() {
          return this.effectIdentifier;
        }

        constructor(identifier: string) {
          this.effectIdentifier = identifier;
        }
      }

      class SourceWithIdentifier2 implements OnIdentifyEffects {
        effectIdentifier: string;
        i2$ = createEffect(() => alwaysOf(i2));

        ngrxOnIdentifyEffects() {
          return this.effectIdentifier;
        }

        constructor(identifier: string) {
          this.effectIdentifier = identifier;
        }
      }
      class SourceWithInitAction implements OnInitEffects, OnIdentifyEffects {
        effectIdentifier: string;

        effectOne = createEffect(() => {
          return this.actions$.pipe(
            ofType('Action 1'),
            map(() => ({ type: 'Action 1 Response' }))
          );
        });

        effectTwo = createEffect(() => {
          return this.actions$.pipe(
            ofType('Action 2'),
            map(() => ({ type: 'Action 2 Response' }))
          );
        });

        ngrxOnInitEffects() {
          return initAction;
        }

        ngrxOnIdentifyEffects() {
          return this.effectIdentifier;
        }

        constructor(private actions$: Actions, identifier: string = '') {
          this.effectIdentifier = identifier;
        }
      }

      it('should resolve effects from instances', () => {
        const sources$ = cold('--a--', { a: new SourceA() });
        const expected = cold('--a--', { a });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should ignore duplicate sources', () => {
        const sources$ = cold('--a--a--a--', {
          a: new SourceA(),
        });
        const expected = cold('--a--------', { a });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should resolve effects with different identifiers', () => {
        const sources$ = cold('--a--b--c--', {
          a: new SourceWithIdentifier('a'),
          b: new SourceWithIdentifier('b'),
          c: new SourceWithIdentifier('c'),
        });
        const expected = cold('--i--i--i--', { i });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should ignore effects with the same identifier', () => {
        const sources$ = cold('--a--b--c--', {
          a: new SourceWithIdentifier('a'),
          b: new SourceWithIdentifier('a'),
          c: new SourceWithIdentifier('a'),
        });
        const expected = cold('--i--------', { i });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should resolve effects with same identifiers but different classes', () => {
        const sources$ = cold('--a--b--c--d--', {
          a: new SourceWithIdentifier('a'),
          b: new SourceWithIdentifier2('a'),
          c: new SourceWithIdentifier('b'),
          d: new SourceWithIdentifier2('b'),
        });
        const expected = cold('--a--b--a--b--', {
          a: i,
          b: i2,
        });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should start with an  action after being registered with OnInitEffects', () => {
        const sources$ = cold('--a--', {
          a: new SourceWithInitAction(new Subject()),
        });
        const expected = cold('--a--', { a: initAction });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should not start twice for the same instance', () => {
        const sources$ = cold('--a--a--', {
          a: new SourceWithInitAction(new Subject()),
        });
        const expected = cold('--a--', { a: initAction });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should start twice for the same instance with a different key', () => {
        const sources$ = cold('--a--b--', {
          a: new SourceWithInitAction(new Subject(), 'a'),
          b: new SourceWithInitAction(new Subject(), 'b'),
        });
        const expected = cold('--a--a--', { a: initAction });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });

      it('should report an error if an effect dispatches an invalid action', () => {
        const sources$ = of(new SourceD());

        toActions(sources$).subscribe();

        expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
          new Error(
            'Effect "SourceD.d$" dispatched an invalid action: {"not":"a valid action"}'
          )
        );
      });

      it('should report an error if an effect dispatches an `undefined`', () => {
        const sources$ = of(new SourceE());

        toActions(sources$).subscribe();

        expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
          new Error(
            'Effect "SourceE.e$" dispatched an invalid action: undefined'
          )
        );
      });

      it('should report an error if an effect dispatches a `null`', () => {
        const sources$ = of(new SourceF());

        toActions(sources$).subscribe();

        expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
          new Error('Effect "SourceF.f$" dispatched an invalid action: null')
        );
      });

      it('should report an error if an effect throws one', () => {
        const sources$ = of(new SourceError());

        toActions(sources$).subscribe();

        expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
          new Error('An Error')
        );
      });

      it('should resubscribe on error by default', () => {
        const sources$ = of(
          new (class {
            b$ = createEffect(() =>
              hot('a--e--b--e--c--e--d').pipe(
                map((v) => {
                  if (v == 'e') throw new Error('An Error');
                  return v;
                })
              )
            );
          })()
        );

        //                       👇 'e' is ignored.
        const expected = cold('a-----b-----c-----d');

        expect(toActions(sources$)).toBeObservable(expected);
      });

      it('should resubscribe on error by default when dispatch is false', () => {
        const sources$ = of(
          new (class {
            b$ = createEffect(
              () =>
                hot('a--b--c--d').pipe(
                  map((v) => {
                    if (v == 'b') throw new Error('An Error');
                    return v;
                  })
                ),
              { dispatch: false }
            );
          })()
        );
        //                    👇 doesn't complete and doesn't dispatch
        const expected = cold('----------');

        expect(toActions(sources$)).toBeObservable(expected);
      });

      it('should not resubscribe on error when useEffectsErrorHandler is false', () => {
        const sources$ = of(
          new (class {
            b$ = createEffect(
              () =>
                hot('a--b--c--d').pipe(
                  map((v) => {
                    if (v == 'b') throw new Error('An Error');
                    return v;
                  })
                ),
              { dispatch: false, useEffectsErrorHandler: false }
            );
          })()
        );
        //                       👇 errors with dispatch false
        const expected = cold('---#', undefined, new Error('An Error'));

        expect(toActions(sources$)).toBeObservable(expected);
      });

      it(`should not break when the action in the error message can't be stringified`, () => {
        const sources$ = of(new SourceG());

        toActions(sources$).subscribe();

        expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
          new Error(
            'Effect "SourceG.g$" dispatched an invalid action: [object Object]'
          )
        );
      });

      it('should not complete the group if just one effect completes', () => {
        const sources$ = cold('g', {
          g: new SourceH(),
        });
        const expected = cold('a----b-----', { a: 'value', b: 'update' });

        const output = toActions(sources$);

        expect(output).toBeObservable(expected);
      });
    });
  });

  function alwaysOf<T>(value: T) {
    return concat(of(value), NEVER);
  }
});
