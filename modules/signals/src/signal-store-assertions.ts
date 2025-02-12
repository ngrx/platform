import { InnerSignalStore } from './signal-store-models';

declare const ngDevMode: unknown;

export function assertUniqueStoreMembers(
  store: InnerSignalStore,
  newMemberKeys: Array<string | symbol>
): void {
  if (typeof ngDevMode === 'undefined' || !ngDevMode) {
    return;
  }

  const storeMembers = {
    ...store.stateSignals,
    ...store.props,
    ...store.methods,
  };
  const overriddenKeys = Reflect.ownKeys(storeMembers).filter((memberKey) =>
    newMemberKeys.includes(memberKey)
  );

  if (overriddenKeys.length > 0) {
    console.warn(
      '@ngrx/signals: SignalStore members cannot be overridden.',
      'Trying to override:',
      overriddenKeys.map((key) => String(key)).join(', ')
    );
  }
}
