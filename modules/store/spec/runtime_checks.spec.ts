import * as ngCore from '@angular/core';
import {
  createActiveRuntimeChecks,
  RuntimeChecks,
  Store,
  StoreModule,
  Action,
} from '..';
import { TestBed } from '@angular/core/testing';

describe('Runtime checks:', () => {
  describe('createActiveRuntimeChecks:', () => {
    it('should enable all checks by default', () => {
      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializabilityChecks: true,
        strictActionSerializabilityChecks: true,
      });
    });

    it('should allow the user to override the config', () => {
      expect(
        createActiveRuntimeChecks({ strictStateSerializabilityChecks: false })
      ).toEqual({
        strictStateSerializabilityChecks: false,
        strictActionSerializabilityChecks: true,
      });
    });

    it('should disable runtime checks in production', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);

      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializabilityChecks: false,
        strictActionSerializabilityChecks: false,
      });
    });
  });

  describe('stateSerializationCheckMetaReducer:', () => {
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
          if (state.invalidState) {
            done();
          }
        },
      });

      store.dispatch(invalidAction());
    });
  });

  describe('actionSerializationCheckMetaReducer:', () => {
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
          if (state.invalidAction) {
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
}

function reducerWithBugs(state: any = {}, action: Action) {
  switch (action.type) {
    case ErrorTypes.UnserializableState:
      return {
        invalidState: true,
        invalid: new Date(),
      };

    case ErrorTypes.UnserializableAction: {
      return {
        invalidAction: true,
      };
    }

    default:
      return state;
  }
}
