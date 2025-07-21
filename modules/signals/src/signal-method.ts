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

declare const ngDevMode: unknown;

/**
 * A signal method function type that can process input values and manage effects.
 *
 * @public
 */
export type SignalMethod<Input> = ((
  input: Input | Signal<Input>,
  config?: { injector?: Injector }
) => EffectRef) &
  EffectRef;

/**
 * Creates a signal method that can process input values reactively.
 *
 * @param processingFn - The function to process input values.
 * @param config - Optional configuration with injector.
 * @returns A signal method function.
 *
 * @public
 */
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
      if (
        typeof ngDevMode !== 'undefined' &&
        ngDevMode &&
        config?.injector === undefined &&
        callerInjector === undefined
      ) {
        console.warn(
          '@ngrx/signals: The function returned by signalMethod was called',
          'outside the injection context with a signal. This may lead to',
          'a memory leak. Make sure to call it within the injection context',
          '(e.g. in a constructor or field initializer) or pass an injector',
          'explicitly via the config parameter.\n\nFor more information, see:',
          'https://ngrx.io/guide/signals/signal-method#automatic-cleanup'
        );
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
