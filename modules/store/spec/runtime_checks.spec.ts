import * as ngCore from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  createActiveRuntimeChecks,
  RuntimeChecks,
  Store,
  StoreModule,
} from '..';

describe('Runtime checks:', () => {
  describe('createActiveRuntimeChecks:', () => {
    it('should enable all checks by default', () => {
      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializabilityChecks: true,
        strictActionSerializabilityChecks: true,
        strictImmutabilityChecks: true,
      });
    });

    it('should allow the user to override the config', () => {
      expect(
        createActiveRuntimeChecks({
          strictStateSerializabilityChecks: false,
          strictActionSerializabilityChecks: false,
          strictImmutabilityChecks: false,
        })
      ).toEqual({
        strictStateSerializabilityChecks: false,
        strictActionSerializabilityChecks: false,
        strictImmutabilityChecks: false,
      });
    });

    it('should disable runtime checks in production', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);

      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializabilityChecks: false,
        strictActionSerializabilityChecks: false,
        strictImmutabilityChecks: false,
      });
    });
  });

  describe('State Serialization:', () => {
    const invalidAction = () => ({ type: ErrorTypes.UnserializableState });

    it('should throw when enabled', (done: DoneFn) => {
      const store = setupStore();

      store.subscribe({
        error: err => {
          expect(err).toMatch(/Detected unserializable state/);
          done();
        },
      });

      store.dispatch(invalidAction());
    });

    it('should not throw when disabled', (done: DoneFn) => {
      const store = setupStore({ strictStateSerializabilityChecks: false });

      store.subscribe({
        next: ({ state }) => {
          if (state.invalidSerializationState) {
            done();
          }
        },
      });

      store.dispatch(invalidAction());
    });
  });

  describe('Action Serialization:', () => {
    const invalidAction = () => ({
      type: ErrorTypes.UnserializableAction,
      invalid: new Date(),
    });

    it('should throw when enabled', (done: DoneFn) => {
      const store = setupStore();

      store.subscribe({
        error: err => {
          expect(err).toMatch(/Detected unserializable action/);
          done();
        },
      });
      store.dispatch(invalidAction());
    });

    it('should not throw when disabled', (done: DoneFn) => {
      const store = setupStore({ strictActionSerializabilityChecks: false });

      store.subscribe({
        next: ({ state }) => {
          if (state.invalidSerializationAction) {
            done();
          }
        },
      });

      store.dispatch(invalidAction());
    });
  });

  describe('State Mutations', () => {
    const invalidAction = () => ({
      type: ErrorTypes.MutateState,
    });

    it('should throw when enabled', (done: DoneFn) => {
      const store = setupStore();

      store.subscribe({
        error: _ => {
          done();
        },
      });

      store.dispatch(invalidAction());
    });

    it('should not throw when disabled', (done: DoneFn) => {
      const store = setupStore({ strictImmutabilityChecks: false });

      store.subscribe({
        next: ({ state }) => {
          if (state.invalidMutationState) {
            done();
          }
        },
      });

      store.dispatch(invalidAction());
    });
  });

  describe('Action Mutations', () => {
    const invalidAction = () => ({
      type: ErrorTypes.MutateAction,
      foo: 'foo',
    });

    it('should throw when enabled', (done: DoneFn) => {
      const store = setupStore();

      store.subscribe({
        error: _ => {
          done();
        },
      });

      store.dispatch(invalidAction());
    });

    it('should not throw when disabled', (done: DoneFn) => {
      const store = setupStore({ strictImmutabilityChecks: false });

      store.subscribe({
        next: ({ state }) => {
          if (state.invalidMutationAction) {
            done();
          }
        },
      });

      store.dispatch(invalidAction());
    });
  });
});

function setupStore(runtimeChecks?: Partial<RuntimeChecks>): Store<any> {
  TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot(
        {
          state: reducerWithBugs,
        },
        { runtimeChecks }
      ),
    ],
  });

  return TestBed.get(Store);
}

enum ErrorTypes {
  UnserializableState = 'Action type producing unserializable state',
  UnserializableAction = 'Action type producing unserializable action',
  MutateAction = 'Action type producing action mutation',
  MutateState = 'Action type producing state mutation',
}

function reducerWithBugs(state: any = {}, action: any) {
  switch (action.type) {
    case ErrorTypes.UnserializableState:
      return {
        invalidSerializationState: true,
        invalid: new Date(),
      };

    case ErrorTypes.UnserializableAction: {
      return {
        invalidSerializationAction: true,
      };
    }

    case ErrorTypes.MutateAction: {
      action.foo = 'foo';
      return {
        invalidMutationAction: true,
      };
    }

    case ErrorTypes.MutateState: {
      state.invalidMutationState = true;
      return state;
    }

    default:
      return state;
  }
}
