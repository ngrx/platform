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

  function testNullishInput(input: null | undefined): void {
    it(`should create observable from ${input}`, () => {
      const { testScheduler } = setup();

      testScheduler.run(({ expectObservable }) => {
        const obs$ = fromPotentialObservable(input);
        expectObservable(obs$).toBe('(x|)', { x: input });
      });
    });
  }

  testNullishInput(null);

  testNullishInput(undefined);

  it('should create observable from array', () => {
    const { testScheduler } = setup();
    const array = [1, 2, 3];

    testScheduler.run(({ expectObservable }) => {
      const obs$ = fromPotentialObservable(array);
      expectObservable(obs$).toBe('(xyz|)', { x: 1, y: 2, z: 3 });
    });
  });

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
