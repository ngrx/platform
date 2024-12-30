import {
  assertInInjectionContext,
  effect,
  EffectRef,
  inject,
  Injector,
  isSignal,
  Signal,
  untracked,
} from '@angular/core';

type SignalMethod<Input> = (
  input: Input | Signal<Input>,
  config?: { injector?: Injector }
) => EffectRef & { destroy: () => void };

export function signalMethod<Input>(
  processingFn: (value: Input) => void,
  config?: { injector?: Injector }
): SignalMethod<Input> {
  if (!config?.injector) {
    assertInInjectionContext(signalMethod);
  }

  const watchers: Set<EffectRef> = new Set();
  const sourceInjector = config?.injector ?? inject(Injector);

  const signalMethodFn = (
    input: Input | Signal<Input>,
    config?: { injector?: Injector }
  ): EffectRef => {
    if (isSignal(input)) {
      const instanceInjector =
        config?.injector ?? getCallerInjector() ?? sourceInjector;

      const watcher = effect(
        (onCleanup) => {
          const value = input();
          untracked(() => processingFn(value));

          // Register cleanup callback to remove watcher from the Set
          onCleanup(() => {
            watchers.delete(watcher);
          });
        },
        { injector: instanceInjector }
      );

      watchers.add(watcher);
      return watcher;
    } else {
      processingFn(input);
      return { destroy: () => void 0 };
    }
  };

  // Centralized destroy method
  signalMethodFn.destroy = () => {
    watchers.forEach((watcher) => {
      if (watcher.destroy) {
        watcher.destroy();
      }
    });
    watchers.clear(); // Clear the Set after destruction
  };

  return signalMethodFn;
}

function getCallerInjector(): Injector | null {
  try {
    return inject(Injector);
  } catch {
    return null;
  }
}
