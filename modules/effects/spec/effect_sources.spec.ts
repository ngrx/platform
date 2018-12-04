import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { concat, NEVER, Observable, of, throwError, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { Effect, EffectSources, OnIdentifyEffects } from '../';

describe('EffectSources', () => {
  let mockErrorReporter: ErrorHandler;
  let effectSources: EffectSources;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EffectSources],
    });

    mockErrorReporter = TestBed.get(ErrorHandler);
    effectSources = TestBed.get(EffectSources);

    spyOn(mockErrorReporter, 'handleError');
  });

  it('should have an "addEffects" method to push new source instances', () => {
    const effectSource = {};
    spyOn(effectSources, 'next');

    effectSources.addEffects(effectSource);

    expect(effectSources.next).toHaveBeenCalledWith(effectSource);
  });

  describe('toActions() Operator', () => {
    const a = { type: 'From Source A' };
    const b = { type: 'From Source B' };
    const c = { type: 'From Source C that completes' };
    const d = { not: 'a valid action' };
    const e = undefined;
    const f = null;
    const i = { type: 'From Source Identifier' };
    const i2 = { type: 'From Source Identifier 2' };

    let circularRef = {} as any;
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
      @Effect() e$ = throwError(error);
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
        new Error('Effect "SourceE.e$" dispatched an invalid action: undefined')
      );
    });

    it('should report an error if an effect dispatches a `null`', () => {
      const sources$ = of(new SourceF());

      toActions(sources$).subscribe();

      expect(mockErrorReporter.handleError).toHaveBeenCalledWith(
        new Error('Effect "SourceF.f$" dispatched an invalid action: null')
      );
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

    function toActions(source: any): Observable<any> {
      source['errorHandler'] = mockErrorReporter;
      return (effectSources as any)['toActions'].call(source);
    }
  });

  function alwaysOf<T>(value: T) {
    return concat(of(value), NEVER);
  }
});
