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

type SignalMethod<Input> = ((
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
        (onCleanup) => {
          const value = input();
          untracked(() => processingFn(value));
          onCleanup(() => watchers.splice(watchers.indexOf(watcher), 1));
        },
        { injector: instanceInjector }
      );
      watchers.push(watcher);

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
