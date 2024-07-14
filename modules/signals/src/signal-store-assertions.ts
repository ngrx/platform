import { InnerSignalStore } from './signal-store-models';

declare const ngDevMode: unknown;

export function assertUniqueStoreMembers(
  store: InnerSignalStore,
  newMemberKeys: string[]
): void {
  if (!ngDevMode) {
    return;
  }

  const storeMembers = {
    ...store.stateSignals,
    ...store.computedSignals,
    ...store.methods,
  };
  const overriddenKeys = Object.keys(storeMembers).filter((memberKey) =>
    newMemberKeys.includes(memberKey)
  );

  if (overriddenKeys.length > 0) {
    console.warn(
      '@ngrx/signals: SignalStore members cannot be overridden.',
      'Trying to override:',
      overriddenKeys.join(', ')
    );
  }
}
