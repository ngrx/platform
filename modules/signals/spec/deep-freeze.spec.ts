import { TestBed } from '@angular/core/testing';
import {
  getState,
  patchState,
  signalState,
  signalStore,
  withState,
} from '../src';

describe('deepFreeze', () => {
  const SECRET = Symbol('secret');

  const initialState = {
    user: {
      firstName: 'John',
      lastName: 'Smith',
    },
    foo: 'bar',
    numbers: [1, 2, 3],
    ngrx: 'signals',
    nestedSymbol: {
      [SECRET]: 'another secret',
    },
    [SECRET]: {
      code: 'secret',
      value: '123',
    },
  };

  for (const { stateFactory, name } of [
    {
      name: 'signalStore',
      stateFactory: () => {
        const Store = signalStore(
          { protectedState: false },
          withState(initialState)
        );
        return TestBed.configureTestingModule({ providers: [Store] }).inject(
          Store
        );
      },
    },
    { name: 'signalState', stateFactory: () => signalState(initialState) },
  ]) {
    describe(name, () => {
      it(`throws on a mutable change`, () => {
        const state = stateFactory();
        expect(() =>
          patchState(state, (state) => {
            state.ngrx = 'mutable change';
            return state;
          })
        ).toThrowError("Cannot assign to read only property 'ngrx' of object");
      });

      it('throws on a nested mutable change', () => {
        const state = stateFactory();
        expect(() =>
          patchState(state, (state) => {
            state.user.firstName = 'mutable change';
            return state;
          })
        ).toThrowError(
          "Cannot assign to read only property 'firstName' of object"
        );
      });

      describe('mutable changes outside of patchState', () => {
        it('throws on reassigned a property of the exposed state', () => {
          const state = stateFactory();
          expect(() => {
            state.user().firstName = 'mutable change 1';
          }).toThrowError(
            "Cannot assign to read only property 'firstName' of object"
          );
        });

        it('throws when exposed state via getState is mutated', () => {
          const state = stateFactory();
          const s = getState(state);

          expect(() => (s.ngrx = 'mutable change 2')).toThrowError(
            "Cannot assign to read only property 'ngrx' of object"
          );
        });

        it('throws when mutable change happens', () => {
          const state = stateFactory();
          const s = { user: { firstName: 'M', lastName: 'S' } };
          patchState(state, s);

          expect(() => {
            s.user.firstName = 'mutable change 3';
          }).toThrowError(
            "Cannot assign to read only property 'firstName' of object"
          );
        });

        it('throws when mutable change of root symbol property happens', () => {
          const state = stateFactory();
          const s = getState(state);

          expect(() => {
            s[SECRET].code = 'mutable change';
          }).toThrowError(
            "Cannot assign to read only property 'code' of object"
          );
        });

        it('throws when mutable change of nested symbol property happens', () => {
          const state = stateFactory();
          const s = getState(state);

          expect(() => {
            s.nestedSymbol[SECRET] = 'mutable change';
          }).toThrowError(
            "Cannot assign to read only property 'Symbol(secret)' of object"
          );
        });
      });
    });
  }

  describe('special tests', () => {
    for (const { name, mutationFn } of [
      {
        name: 'location',
        mutationFn: (state: { location: { city: string } }) =>
          (state.location.city = 'Paris'),
      },
      {
        name: 'user',
        mutationFn: (state: { user: { firstName: string } }) =>
          (state.user.firstName = 'Jane'),
      },
    ]) {
      it(`throws on concatenated state (${name})`, () => {
        const UserStore = signalStore(
          { providedIn: 'root' },
          withState(initialState),
          withState({ location: { city: 'London' } })
        );
        const store = TestBed.inject(UserStore);
        const state = getState(store);

        expect(() => mutationFn(state)).toThrowError();
      });
    }
  });
});
