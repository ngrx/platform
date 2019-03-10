import { isDevMode, Provider } from '@angular/core';
import {
  stateSerializationCheckMetaReducer,
  actionSerializationCheckMetaReducer,
  immutabilityCheckMetaReducer,
} from './meta-reducers';
import { RuntimeChecks, MetaReducer } from './models';
import {
  _USER_RUNTIME_CHECKS,
  _ACTIVE_RUNTIME_CHECKS,
  META_REDUCERS,
} from './tokens';

export function createActiveRuntimeChecks(
  runtimeChecks?: Partial<RuntimeChecks>
): RuntimeChecks {
  if (isDevMode()) {
    return {
      strictStateSerializabilityChecks: true,
      strictActionSerializabilityChecks: true,
      strictImmutabilityChecks: true,
      ...runtimeChecks,
    };
  }

  return {
    strictStateSerializabilityChecks: false,
    strictActionSerializabilityChecks: false,
    strictImmutabilityChecks: false,
  };
}

export function createStateSerializationCheckMetaReducer({
  strictStateSerializabilityChecks,
}: RuntimeChecks): MetaReducer {
  return reducer =>
    strictStateSerializabilityChecks
      ? stateSerializationCheckMetaReducer(reducer)
      : reducer;
}

export function createActionSerializationCheckMetaReducer({
  strictActionSerializabilityChecks,
}: RuntimeChecks): MetaReducer {
  return reducer =>
    strictActionSerializabilityChecks
      ? actionSerializationCheckMetaReducer(reducer)
      : reducer;
}

export function createImmutabilityCheckMetaReducer({
  strictImmutabilityChecks,
}: RuntimeChecks): MetaReducer {
  return reducer =>
    strictImmutabilityChecks ? immutabilityCheckMetaReducer(reducer) : reducer;
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
      provide: _ACTIVE_RUNTIME_CHECKS,
      deps: [_USER_RUNTIME_CHECKS],
      useFactory: createActiveRuntimeChecks,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [_ACTIVE_RUNTIME_CHECKS],
      useFactory: createStateSerializationCheckMetaReducer,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [_ACTIVE_RUNTIME_CHECKS],
      useFactory: createActionSerializationCheckMetaReducer,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [_ACTIVE_RUNTIME_CHECKS],
      useFactory: createImmutabilityCheckMetaReducer,
    },
  ];
}
