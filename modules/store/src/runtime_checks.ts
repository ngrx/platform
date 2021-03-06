import { isDevMode, Provider } from '@angular/core';
import {
  serializationCheckMetaReducer,
  immutabilityCheckMetaReducer,
  inNgZoneAssertMetaReducer,
} from './meta-reducers';
import { RuntimeChecks, MetaReducer, Action } from './models';
import {
  _USER_RUNTIME_CHECKS,
  ACTIVE_RUNTIME_CHECKS,
  META_REDUCERS,
  USER_RUNTIME_CHECKS,
  _ACTION_TYPE_UNIQUENESS_CHECK,
} from './tokens';
import { REGISTERED_ACTION_TYPES } from './globals';
import { RUNTIME_CHECK_URL } from './meta-reducers/utils';

export function createActiveRuntimeChecks(
  runtimeChecks?: Partial<RuntimeChecks>
): RuntimeChecks {
  if (isDevMode()) {
    return {
      strictStateSerializability: false,
      strictActionSerializability: false,
      strictStateImmutability: true,
      strictActionImmutability: true,
      strictActionWithinNgZone: false,
      strictActionTypeUniqueness: false,
      ...runtimeChecks,
    };
  }

  return {
    strictStateSerializability: false,
    strictActionSerializability: false,
    strictStateImmutability: false,
    strictActionImmutability: false,
    strictActionWithinNgZone: false,
    strictActionTypeUniqueness: false,
  };
}

export function createSerializationCheckMetaReducer({
  strictActionSerializability,
  strictStateSerializability,
}: RuntimeChecks): MetaReducer {
  return (reducer) =>
    strictActionSerializability || strictStateSerializability
      ? serializationCheckMetaReducer(reducer, {
          action: (action) =>
            strictActionSerializability && !ignoreNgrxAction(action),
          state: () => strictStateSerializability,
        })
      : reducer;
}

export function createImmutabilityCheckMetaReducer({
  strictActionImmutability,
  strictStateImmutability,
}: RuntimeChecks): MetaReducer {
  return (reducer) =>
    strictActionImmutability || strictStateImmutability
      ? immutabilityCheckMetaReducer(reducer, {
          action: (action) =>
            strictActionImmutability && !ignoreNgrxAction(action),
          state: () => strictStateImmutability,
        })
      : reducer;
}

function ignoreNgrxAction(action: Action) {
  return action.type.startsWith('@ngrx');
}

export function createInNgZoneCheckMetaReducer({
  strictActionWithinNgZone,
}: RuntimeChecks): MetaReducer {
  return (reducer) =>
    strictActionWithinNgZone
      ? inNgZoneAssertMetaReducer(reducer, {
          action: (action) =>
            strictActionWithinNgZone && !ignoreNgrxAction(action),
        })
      : reducer;
}

export function provideRuntimeChecks(
  runtimeChecks?: Partial<RuntimeChecks>
): Provider[] {
  return [
    {
      provide: _USER_RUNTIME_CHECKS,
      useValue: runtimeChecks,
    },
    {
      provide: USER_RUNTIME_CHECKS,
      useFactory: _runtimeChecksFactory,
      deps: [_USER_RUNTIME_CHECKS],
    },
    {
      provide: ACTIVE_RUNTIME_CHECKS,
      deps: [USER_RUNTIME_CHECKS],
      useFactory: createActiveRuntimeChecks,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [ACTIVE_RUNTIME_CHECKS],
      useFactory: createImmutabilityCheckMetaReducer,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [ACTIVE_RUNTIME_CHECKS],
      useFactory: createSerializationCheckMetaReducer,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [ACTIVE_RUNTIME_CHECKS],
      useFactory: createInNgZoneCheckMetaReducer,
    },
  ];
}

export function checkForActionTypeUniqueness(): Provider[] {
  return [
    {
      provide: _ACTION_TYPE_UNIQUENESS_CHECK,
      multi: true,
      deps: [ACTIVE_RUNTIME_CHECKS],
      useFactory: _actionTypeUniquenessCheck,
    },
  ];
}

export function _runtimeChecksFactory(
  runtimeChecks: RuntimeChecks
): RuntimeChecks {
  return runtimeChecks;
}

export function _actionTypeUniquenessCheck(config: RuntimeChecks): void {
  if (!config.strictActionTypeUniqueness) {
    return;
  }

  const duplicates = Object.entries(REGISTERED_ACTION_TYPES)
    .filter(([, registrations]) => registrations > 1)
    .map(([type]) => type);

  if (duplicates.length) {
    throw new Error(
      `Action types are registered more than once, ${duplicates
        .map((type) => `"${type}"`)
        .join(', ')}. ${RUNTIME_CHECK_URL}#strictactiontypeuniqueness`
    );
  }
}
