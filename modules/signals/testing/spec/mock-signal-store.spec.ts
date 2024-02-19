import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
  getState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Injectable, computed, inject } from '@angular/core';
import { pipe, switchMap, tap, Observable, of, Subject } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  MockSignalStore,
  UnwrapProvider,
  asMockSignalStore,
  asSinonSpy,
  provideMockSignalStore,
} from '../src/mock-signal-store';
import { getRxMethodFake } from '../src/fake-rx-method';
import { fake, replace } from 'sinon';

@Injectable()
class SampleService {
  getTripleValue(n: number): Observable<number> {
    return of(n * 3);
  }
}

const initialState = {
  value: 1,
  object: {
    objectValue: 2,
    nestedObject: {
      nestedObjectValue: 3,
    },
  },
};

const SampleSignalStore = signalStore(
  withState(initialState),
  withComputed(({ value }) => ({
    doubleNumericValue: computed(() => value() * 2),
    tripleNumericValue: computed(() => value() * 3),
  })),
  withMethods((store) => ({
    setValue(value: number): void {
      patchState(store, () => ({
        value,
      }));
    },
    setNestedObjectValue(nestedObjectValue: number): void {
      patchState(store, () => ({
        object: {
          ...store.object(),
          nestedObject: {
            ...store.object.nestedObject(),
            nestedObjectValue,
          },
        },
      }));
    },
  })),
  withMethods((store, service = inject(SampleService)) => ({
    rxMethod: rxMethod<number>(
      pipe(
        tap(() => store.setValue(10)),
        switchMap((n) => service.getTripleValue(n)),
        tapResponse(
          (response) => {
            store.setNestedObjectValue(response);
          },
          (errorResponse: HttpErrorResponse) => {
            store.setNestedObjectValue(0);
          }
        )
      )
    ),
  }))
);

describe('mockSignalStore', () => {
  describe('with default parameters', () => {
    let store: UnwrapProvider<typeof SampleSignalStore>;
    let mockStore: MockSignalStore<typeof store>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SampleService,
          provideMockSignalStore(SampleSignalStore, {
            initialComputedValues: {
              doubleNumericValue: 20,
              tripleNumericValue: 30,
            },
          }),
        ],
      });
      store = TestBed.inject(SampleSignalStore);
      mockStore = asMockSignalStore(store);
    });

    it('should set the original initial values', () => {
      expect(store.value()).toBe(initialState.value);
      expect(store.object()).toEqual(initialState.object);
    });

    it("should set the computed signal's initial value", () => {
      expect(store.doubleNumericValue()).toBe(20);
    });

    it('should mock the computed signal with a writable signal', () => {
      expect(store.doubleNumericValue()).toBe(20);
      mockStore.doubleNumericValue.set(33);
      expect(store.doubleNumericValue()).toBe(33);
    });

    it('should mock the updater with a Sinon fake', () => {
      expect(mockStore.setValue.callCount).toBe(0);
      store.setValue(11);
      expect(mockStore.setValue.callCount).toBe(1);
      expect(mockStore.setValue.lastCall.args).toEqual([11]);
    });

    it('should mock the rxMethod with a FakeRxMethod (imperative)', () => {
      expect(getRxMethodFake(store.rxMethod).callCount).toBe(0);
      store.rxMethod(22);
      expect(getRxMethodFake(store.rxMethod).callCount).toBe(1);
      expect(getRxMethodFake(store.rxMethod).lastCall.args).toEqual([22]);
    });

    it('should mock the rxMethod with a FakeRxMethod (declarative)', () => {
      const o = new Subject<number>();
      store.rxMethod(o);
      expect(getRxMethodFake(store.rxMethod).callCount).toBe(0);
      o.next(22);
      expect(getRxMethodFake(store.rxMethod).callCount).toBe(1);
      expect(getRxMethodFake(store.rxMethod).lastCall.args).toEqual([22]);
    });

    it('can alter the DeepSignal with patchState', () => {
      patchState(store, {
        value: 20,
      });
      expect(store.value()).toBe(20);
      expect(store.object()).toEqual(initialState.object);

      patchState(store, {
        object: {
          ...initialState.object,
          nestedObject: {
            ...initialState.object.nestedObject,
            nestedObjectValue: 40,
          },
        },
      });
      expect(store.object()).toEqual({
        ...initialState.object,
        nestedObject: {
          ...initialState.object.nestedObject,
          nestedObjectValue: 40,
        },
      });
    });
  });
  describe('parameters', () => {
    it('should throw an expection, if an inital value is missing for a computed Signal', () => {
      expect(() => {
        TestBed.configureTestingModule({
          providers: [
            SampleService,
            provideMockSignalStore(SampleSignalStore, {
              initialComputedValues: {
                doubleNumericValue: 20,
              },
            }),
          ],
        });
        const store = TestBed.inject(SampleSignalStore);
        const mockStore = asMockSignalStore(store);
      }).toThrow(Error('tripleNumericValue should have an initial value'));
    });

    it('should throw an expection, if an inital value is missing for a computed Signal (2)', () => {
      expect(() => {
        TestBed.configureTestingModule({
          providers: [SampleService, provideMockSignalStore(SampleSignalStore)],
        });
        const store = TestBed.inject(SampleSignalStore);
        const mockStore = asMockSignalStore(store);
      }).toThrowError();
    });

    it('can keep the original computed signals', () => {
      TestBed.configureTestingModule({
        providers: [
          SampleService,
          provideMockSignalStore(SampleSignalStore, {
            mockComputedSignals: false,
          }),
        ],
      });
      const store = TestBed.inject(SampleSignalStore);
      const mockStore = asMockSignalStore(store);

      expect(store.doubleNumericValue()).toBe(2);
      expect(store.tripleNumericValue()).toBe(3);
    });

    it('can update the initial value of the store by the initialStatePatch parameter', () => {
      TestBed.configureTestingModule({
        providers: [
          SampleService,
          provideMockSignalStore(SampleSignalStore, {
            initialComputedValues: {
              doubleNumericValue: 20,
              tripleNumericValue: 30,
            },
            initialStatePatch: {
              value: 22,
            },
          }),
        ],
      });
      const store = TestBed.inject(SampleSignalStore);

      expect(store.value()).toBe(22);
    });

    it('can update the initial value of the store by the initialStatePatch parameter (nested objects)', () => {
      TestBed.configureTestingModule({
        providers: [
          SampleService,
          provideMockSignalStore(SampleSignalStore, {
            initialComputedValues: {
              doubleNumericValue: 20,
              tripleNumericValue: 30,
            },
            initialStatePatch: {
              object: {
                ...initialState.object,
                nestedObject: {
                  ...initialState.object.nestedObject,
                  nestedObjectValue: 40,
                },
              },
            },
          }),
        ],
      });
      const store = TestBed.inject(SampleSignalStore);

      expect(getState(store)).toEqual({
        ...initialState,
        object: {
          ...initialState.object,
          nestedObject: {
            ...initialState.object.nestedObject,
            nestedObjectValue: 40,
          },
        },
      });
    });
  });
  describe('asSinonSpy', () => {
    it('should return the input wihtout change', () => {
      TestBed.runInInjectionContext(() => {
        const o = { fnc: () => 1 };
        replace(o, 'fnc', fake());
        expect(asSinonSpy(o.fnc)).toEqual(o.fnc);
      });
    });
  });
});
