import 'jasmine';

import { inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentStore } from '@ngrx/component-store';
import {
  getMockComponentStore,
  provideMockComponentStores,
} from '@ngrx/component-store/testing';
import { EMPTY, Observable, of, ReplaySubject } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { concatMap, tap } from 'rxjs/operators';

interface ParentState {
  parentValue: string;
}

interface SampleState {
  value: string;
}

@Injectable({ providedIn: 'root' })
class SampleService {
  getValues(_id: string): Observable<string[]> {
    return of([]);
  }
}

@Injectable({ providedIn: 'root' })
class ParentComponentStore extends ComponentStore<ParentState> {
  readonly parentValue$ = this.select((state) => state.parentValue);
  readonly parentUpdater = this.updater((state, parentValue: string) => ({
    ...state,
    parentValue,
  }));
  readonly parentEffect = this.effect((value$: Observable<string>) => {
    return value$.pipe(
      tap((value) => {
        this.parentUpdater(value);
      })
    );
  });
}

class SampleComponentStore extends ComponentStore<SampleState> {
  private readonly sampleService = inject(SampleService);
  private readonly parentStore = inject(ParentComponentStore);

  constructor() {
    super();
    // These cannot be really tested, but they shouldn't break the tests.
    this.updater((state, value: string) => ({ ...state, value }))('some value');
    this.effect<string>((_values$) => EMPTY)('some value');
  }

  readonly parentValue$ = this.parentStore.parentValue$;
  readonly value$ = this.select((state) => state.value);
  readonly pipedValue$ = this.select((state) => state.value).pipe();
  // Testing deprecated methods
  // tslint:disable-next-line:deprecation
  readonly liftedValue$ = this.select((state) => state.value).lift();

  readonly setValue = this.updater((state, value: string) => ({
    ...state,
    value,
  }));

  readonly valueEffect = this.effect((id$: Observable<string>) => {
    return id$.pipe(
      concatMap((id) => this.sampleService.getValues(id)),
      tap((values) => {
        this.setValue(values[0] ?? '');
      })
    );
  });

  readonly parentUpdater = this.parentStore.parentUpdater;
  readonly parentEffect = this.parentStore.parentEffect;

  nonEffectFunction(param: string) {
    this.setValue(param);
    return `my function is not an effect ${param}`;
  }

  getParameterizedSelector(param: string) {
    return this.select((state) => state.value + param);
  }

  nonSelectorFunctionReturningObservable(param: string) {
    return of(param);
  }
}

describe('provideMockComponentStores', () => {
  const VALUE = '☝️☝️👇👇👈👉👈👉🅱️🅰️🆗';

  it(
    'can provide initial values to selectors',
    marbles((m) => {
      TestBed.configureTestingModule({
        providers: [
          provideMockComponentStores([
            [SampleComponentStore, { initialValues: { value$: VALUE } }],
          ]),
        ],
      });
      const mockStore = getMockComponentStore(SampleComponentStore);

      m.expect(mockStore.value$).toBeObservable(m.hot('s', { s: VALUE }));
    })
  );

  describe('destroy$', () => {
    it(
      'is a valid ReplaySubject',
      marbles((m) => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);

        expect(mockStore.destroy$).toBeInstanceOf(ReplaySubject);
        m.expect(mockStore.destroy$).toBeObservable(m.hot('-'));
      })
    );
  });

  describe('selectors', () => {
    it(
      'initially has no value to emit',
      marbles((m) => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);

        // Empty observable; no values emitted
        m.expect(mockStore.value$).toBeObservable(m.hot('-'));
      })
    );

    it(
      'emits a value that is passed to it',
      marbles((m) => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);

        mockStore.value$.next(VALUE);

        m.expect(mockStore.value$).toBeObservable(m.hot('s', { s: VALUE }));
      })
    );

    it(
      'mocks an explicitly specified selector',
      marbles((m) => {
        TestBed.configureTestingModule({
          providers: [
            provideMockComponentStores([
              [SampleComponentStore, { selectors: ['parentValue$'] }],
            ]),
          ],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);

        m.expect(mockStore.parentValue$).toBeObservable(m.hot('-'));
        m.flush();

        mockStore.parentValue$.next(VALUE);

        m.expect(mockStore.parentValue$).toBeObservable(
          m.hot('s', { s: VALUE })
        );
      })
    );

    it(
      'mocks selectors that have been piped',
      marbles((m) => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);

        m.expect(mockStore.pipedValue$).toBeObservable(m.hot('-'));
        m.flush();

        mockStore.pipedValue$.next(VALUE);

        m.expect(mockStore.pipedValue$).toBeObservable(
          m.hot('s', { s: VALUE })
        );
      })
    );

    it(
      'mocks selectors that have been lifted',
      marbles((m) => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);

        m.expect(mockStore.liftedValue$).toBeObservable(m.hot('-'));
        m.flush();

        mockStore.liftedValue$.next(VALUE);

        m.expect(mockStore.liftedValue$).toBeObservable(
          m.hot('s', { s: VALUE })
        );
      })
    );
  });

  describe('updaters', () => {
    it(
      'is a spy',
      marbles(() => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);
        mockStore.setValue(VALUE);

        expect(mockStore.setValue).toHaveBeenCalledWith(VALUE);
      })
    );

    it(
      'is initially not called',
      marbles(() => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);

        expect(mockStore.setValue).not.toHaveBeenCalled();
      })
    );

    it(
      'can be provided through hints',
      marbles(() => {
        TestBed.configureTestingModule({
          providers: [
            provideMockComponentStores([
              [SampleComponentStore, { updaters: ['parentUpdater'] }],
            ]),
          ],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);
        mockStore.parentUpdater(VALUE);

        expect(mockStore.parentUpdater).toHaveBeenCalledWith(VALUE);
      })
    );
  });

  describe('effects', () => {
    it(
      'is a spy',
      marbles(() => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);
        mockStore.valueEffect(VALUE);

        expect(mockStore.valueEffect).toHaveBeenCalledWith(VALUE);
      })
    );

    it(
      'is initially not called',
      marbles(() => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);

        expect(mockStore.valueEffect).not.toHaveBeenCalled();
      })
    );

    it(
      'can be provided through hints',
      marbles(() => {
        TestBed.configureTestingModule({
          providers: [
            provideMockComponentStores([
              [SampleComponentStore, { effects: ['parentEffect'] }],
            ]),
          ],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);
        mockStore.parentEffect(VALUE);

        expect(mockStore.parentEffect).toHaveBeenCalledWith(VALUE);
      })
    );
  });

  describe('prototype methods', () => {
    it(
      'is a spy',
      marbles(() => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);
        mockStore.nonEffectFunction(VALUE);

        expect(mockStore.nonEffectFunction).toHaveBeenCalledWith(VALUE);
      })
    );

    it(
      'returns the same spy if accessed multiple times',
      marbles(() => {
        TestBed.configureTestingModule({
          providers: [provideMockComponentStores([SampleComponentStore])],
        });
        const mockStore = getMockComponentStore(SampleComponentStore);
        const spy1 = mockStore.nonEffectFunction;
        const spy2 = mockStore.nonEffectFunction;

        expect(spy1).toBe(spy2);
      })
    );

    describe('provides an appropriate default return value', () => {
      it(
        'for functions returning strings',
        marbles(() => {
          TestBed.configureTestingModule({
            providers: [provideMockComponentStores([SampleComponentStore])],
          });
          const mockStore = getMockComponentStore(SampleComponentStore);
          const returnValue = mockStore.nonEffectFunction(VALUE);

          expect(returnValue).toEqual(jasmine.any(String));
        })
      );

      describe('for functions returning selectors', () => {
        it(
          'returns a ReplaySubject',
          marbles((m) => {
            TestBed.configureTestingModule({
              providers: [provideMockComponentStores([SampleComponentStore])],
            });
            const mockStore = getMockComponentStore(SampleComponentStore);
            const returnValue = mockStore.getParameterizedSelector(VALUE);

            expect(returnValue).toBeInstanceOf(ReplaySubject);
            // no values
            m.expect(returnValue).toBeObservable(m.hot('-'));
            expect(mockStore.getParameterizedSelector(VALUE));
          })
        );

        it(
          'returns the same subject if called multiple times',
          marbles(() => {
            TestBed.configureTestingModule({
              providers: [provideMockComponentStores([SampleComponentStore])],
            });
            const mockStore = getMockComponentStore(SampleComponentStore);
            const returnValue = mockStore.getParameterizedSelector(VALUE);
            const returnValue2 = mockStore.getParameterizedSelector(
              VALUE + 'a'
            );

            expect(returnValue).toBe(returnValue2);
          })
        );
      });

      describe('for functions returning Observables', () => {
        it(
          'returns a ReplaySubject',
          marbles((m) => {
            TestBed.configureTestingModule({
              providers: [provideMockComponentStores([SampleComponentStore])],
            });
            const mockStore = getMockComponentStore(SampleComponentStore);
            const returnValue =
              mockStore.nonSelectorFunctionReturningObservable(VALUE);

            expect(returnValue).toBeInstanceOf(ReplaySubject);
            // no values
            m.expect(returnValue).toBeObservable(m.hot('-'));
            expect(mockStore.getParameterizedSelector(VALUE));
          })
        );

        it(
          'returns the same subject if called multiple times',
          marbles(() => {
            TestBed.configureTestingModule({
              providers: [provideMockComponentStores([SampleComponentStore])],
            });
            const mockStore = getMockComponentStore(SampleComponentStore);
            const returnValue =
              mockStore.nonSelectorFunctionReturningObservable(VALUE);
            const returnValue2 =
              mockStore.nonSelectorFunctionReturningObservable(VALUE + 'a');

            expect(returnValue).toBe(returnValue2);
          })
        );
      });
    });
  });

  describe('mocking multiple stores', () => {
    it(
      'can provide hints and initial values to multiple stores',
      marbles((m) => {
        const PARENT_VALUE = 'a different initial value';
        TestBed.configureTestingModule({
          providers: [
            provideMockComponentStores([
              [
                SampleComponentStore,
                {
                  selectors: ['parentValue$'],
                  updaters: ['parentUpdater'],
                  effects: ['parentEffect'],
                  initialValues: { parentValue$: VALUE },
                },
              ],
              [
                ParentComponentStore,
                { initialValues: { parentValue$: PARENT_VALUE } },
              ],
            ]),
          ],
        });
        const mockSampleStore = getMockComponentStore(SampleComponentStore);
        const mockParentStore = getMockComponentStore(ParentComponentStore);

        m.expect(mockSampleStore.parentValue$).toBeObservable(
          m.hot('s', { s: VALUE })
        );
        m.expect(mockParentStore.parentValue$).toBeObservable(
          m.hot('s', { s: PARENT_VALUE })
        );

        // Would fail with "Expected a spy, but got [object Function]" if the
        // parent updater and effect weren't mocked correctly using the hints.
        expect(mockSampleStore.parentUpdater).not.toHaveBeenCalled();
        expect(mockSampleStore.parentEffect).not.toHaveBeenCalled();
      })
    );
  });
});
