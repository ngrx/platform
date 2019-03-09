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
      });
    });

    it('should allow the user to override the config', () => {
      expect(
        createActiveRuntimeChecks({ strictStateSerializabilityChecks: false })
      ).toEqual({
        strictStateSerializabilityChecks: false,
      });
    });

    it('should disable runtime checks in production', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);

      expect(createActiveRuntimeChecks()).toEqual({
        strictStateSerializabilityChecks: false,
      });
    });
  });

  describe('stateSerializationCheckMetaReducer:', () => {
    it('should throw when enabled', (done: DoneFn) => {
      const store = setupStore();

      store.subscribe({
        error: err => {
          expect(err).toMatch(/Detected unserializable state/);
          done();
        },
      });

      store.dispatch({ type: ErrorTypes.UnserializableState });
    });

    it('should not throw when disabled', (done: DoneFn) => {
      const store = setupStore({ strictStateSerializabilityChecks: false });

      store.subscribe({
        next: ({ state }) => {
          if (state.invalid) {
            done();
          }
        },
      });

      store.dispatch({ type: ErrorTypes.UnserializableState });
    });
  });
});

function setupStore(runtimeChecks?: RuntimeChecks): Store<any> {
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
}

function reducerWithBugs(state: any = {}, action: Action) {
  switch (action.type) {
    case ErrorTypes.UnserializableState:
      return {
        invalid: new Date(),
      };

    default:
      return state;
  }
}
