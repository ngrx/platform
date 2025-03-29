import {
  assertInInjectionContext,
  DestroyRef,
  effect,
  EffectRef,
  inject,
  Injector,
  isSignal,
  Signal,
  untracked,
} from '@angular/core';

export type SignalMethod<Input> = ((
  input: Input | Signal<Input>,
  config?: { injector?: Injector }
) => EffectRef) &
  EffectRef;

export function signalMethod<Input>(
  processingFn: (value: Input) => void,
  config?: { injector?: Injector }
): SignalMethod<Input> {
  if (!config?.injector) {
    assertInInjectionContext(signalMethod);
  }

  const watchers: EffectRef[] = [];
  const sourceInjector = config?.injector ?? inject(Injector);

  const signalMethodFn = (
    input: Input | Signal<Input>,
    config?: { injector?: Injector }
  ): EffectRef => {
    if (isSignal(input)) {
      const instanceInjector =
        config?.injector ?? getCallerInjector() ?? sourceInjector;

      const watcher = effect(
        () => {
          const value = input();
          untracked(() => processingFn(value));
        },
        { injector: instanceInjector }
      );
      watchers.push(watcher);

      instanceInjector.get(DestroyRef).onDestroy(() => {
        const ix = watchers.indexOf(watcher);
        if (ix !== -1) {
          watchers.splice(ix, 1);
        }
      });

      return watcher;
    } else {
      processingFn(input);
      return { destroy: () => void true };
    }
  };

  signalMethodFn.destroy = () =>
    watchers.forEach((watcher) => watcher.destroy());

  return signalMethodFn;
}

function getCallerInjector(): Injector | null {
  try {
    return inject(Injector);
  } catch {
    return null;
  }
}
