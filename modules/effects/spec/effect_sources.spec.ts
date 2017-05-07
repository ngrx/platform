import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/catch';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { never } from 'rxjs/observable/never';
import { empty } from 'rxjs/observable/empty';
import { TestBed } from '@angular/core/testing';
import { ErrorReporter } from '../src/error_reporter';
import { CONSOLE } from '../src/tokens';
import { Effect, EffectSources } from '../';

describe('EffectSources', () => {
  let mockErrorReporter: ErrorReporter;
  let effectSources: EffectSources;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EffectSources,
        ErrorReporter,
        {
          provide: CONSOLE,
          useValue: console,
        },
      ],
    });

    mockErrorReporter = TestBed.get(ErrorReporter);
    effectSources = TestBed.get(EffectSources);

    spyOn(mockErrorReporter, 'report');
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
      @Effect() e$ = _throw(error);
    }

    it('should resolve effects from instances', () => {
      const sources$ = cold('--a--', { a: new SourceA() });
      const expected = cold('--a--', { a });

      const output = toActions(sources$);

      expect(output).toBeObservable(expected);
    });

    it('should ignore duplicate sources', () => {
      const sources$ = cold('--a--b--c--', {
        a: new SourceA(),
        b: new SourceA(),
        c: new SourceA(),
      });
      const expected = cold('--a--------', { a });

      const output = toActions(sources$);

      expect(output).toBeObservable(expected);
    });

    it('should report an error if an effect dispatches an invalid action', () => {
      const sources$ = of(new SourceD());

      toActions(sources$).subscribe();

      expect(mockErrorReporter.report).toHaveBeenCalled();
    });

    function toActions(source: any): Observable<any> {
      source['errorReporter'] = mockErrorReporter;
      return effectSources.toActions.call(source);
    }
  });

  function alwaysOf<T>(value: T) {
    return of(value).concat(never<T>());
  }
});
