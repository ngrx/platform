import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { fromPotentialObservable } from '../../src/core/potential-observable';

describe('fromPotentialObservable', () => {
  function setup() {
    return {
      testScheduler: new TestScheduler((actual, expected) =>
        expect(actual).toEqual(expected)
      ),
    };
  }

  function testNonObservableInput(input: any, label = input): void {
    it(`should create observable from ${label}`, () => {
      const { testScheduler } = setup();

      testScheduler.run(({ expectObservable }) => {
        const obs$ = fromPotentialObservable(input);
        expectObservable(obs$).toBe('x', { x: input });
      });
    });
  }

  testNonObservableInput(null);

  testNonObservableInput(undefined);

  testNonObservableInput(100, 'number');

  testNonObservableInput('ngrx', 'string');

  testNonObservableInput(true, 'boolean');

  testNonObservableInput({}, 'empty object');

  testNonObservableInput(
    { ngrx: 'component' },
    'object with non-observable values'
  );

  testNonObservableInput(
    { x: of(1), y: 2 },
    'object with at least one non-observable value'
  );

  testNonObservableInput([1, 2, 3], 'array');

  it('should create observable from promise', (done) => {
    const promise = Promise.resolve(100);
    const obs$ = fromPotentialObservable(promise);

    // promises cannot be tested with test scheduler
    obs$.subscribe((value) => {
      expect(value).toBe(100);
      done();
    });
  });

  it('should return passed observable', () => {
    const obs1$ = of('ngrx');
    const obs2$ = fromPotentialObservable(obs1$);
    expect(obs1$).toBe(obs2$);
  });

  it('should combine observables and distinct same values from observable dictionary', () => {
    const { testScheduler } = setup();

    testScheduler.run(({ cold, expectObservable }) => {
      const o1$ = cold('o--p-q', { o: 1, p: 2, q: 2 });
      const o2$ = cold('-xy-z-', { x: 3, y: 3, z: 4 });

      const result$ = fromPotentialObservable({ o1: o1$, o2: o2$ });
      expectObservable(result$).toBe('-k-lm-', {
        k: { o1: 1, o2: 3 },
        l: { o1: 2, o2: 3 },
        m: { o1: 2, o2: 4 },
      });
    });
  });
});
