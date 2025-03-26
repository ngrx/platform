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
      const callerInjector = getCallerInjector();
      if (config?.injector === undefined && callerInjector === undefined) {
        console.warn(`
    A function returned by signalMethod was called outside the injection context.
    This may lead to memory leaks. Make sure to call it within an injection context
    (e.g., in a constructor or field initializer), or pass an injector explicitly
    via the config parameter.

    For more information, see https://ngrx.io/api/signals/signalMethod.
  `);
      }

      const instanceInjector =
        config?.injector ?? callerInjector ?? sourceInjector;

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

function getCallerInjector(): Injector | undefined {
  try {
    return inject(Injector);
  } catch {
    return undefined;
  }
}
