import { isDevMode, Provider } from '@angular/core';
import {
  serializationCheckMetaReducer,
  immutabilityCheckMetaReducer,
} from './meta-reducers';
import { RuntimeChecks, MetaReducer } from './models';
import {
  _USER_RUNTIME_CHECKS,
  _ACTIVE_RUNTIME_CHECKS,
  META_REDUCERS,
  USER_RUNTIME_CHECKS,
} from './tokens';

export function createActiveRuntimeChecks(
  runtimeChecks?: Partial<RuntimeChecks>
): RuntimeChecks {
  if (isDevMode()) {
    return {
      strictStateSerializability: false,
      strictActionSerializability: false,
      strictStateImmutability: true,
      strictActionImmutability: true,
      ...runtimeChecks,
    };
  }

  return {
    strictStateSerializability: false,
    strictActionSerializability: false,
    strictStateImmutability: false,
    strictActionImmutability: false,
  };
}

export function createSerializationCheckMetaReducer({
  strictActionSerializability,
  strictStateSerializability,
}: RuntimeChecks): MetaReducer {
  return reducer =>
    strictActionSerializability || strictStateSerializability
      ? serializationCheckMetaReducer(reducer, {
          action: strictActionSerializability,
          state: strictStateSerializability,
        })
      : reducer;
}

export function createImmutabilityCheckMetaReducer({
  strictActionImmutability,
  strictStateImmutability,
}: RuntimeChecks): MetaReducer {
  return reducer =>
    strictActionImmutability || strictStateImmutability
      ? immutabilityCheckMetaReducer(reducer, {
          action: strictActionImmutability,
          state: strictStateImmutability,
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
      provide: _ACTIVE_RUNTIME_CHECKS,
      deps: [USER_RUNTIME_CHECKS],
      useFactory: createActiveRuntimeChecks,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [_ACTIVE_RUNTIME_CHECKS],
      useFactory: createImmutabilityCheckMetaReducer,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [_ACTIVE_RUNTIME_CHECKS],
      useFactory: createSerializationCheckMetaReducer,
    },
  ];
}

export function _runtimeChecksFactory(
  runtimeChecks: RuntimeChecks
): RuntimeChecks {
  return runtimeChecks;
}
