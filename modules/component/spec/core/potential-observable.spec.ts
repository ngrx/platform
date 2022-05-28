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

  testNonObservableInput({ ngrx: 'component' }, 'object');

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
});
