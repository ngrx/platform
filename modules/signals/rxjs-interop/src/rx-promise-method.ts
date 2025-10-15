import {
  assertInInjectionContext,
  DestroyRef,
  effect,
  inject,
  Injector,
  isSignal,
  Signal,
  untracked,
} from '@angular/core';

declare const ngDevMode: unknown;

type PromiseResult<T> =
  | { status: 'success'; value: T }
  | { status: 'error'; error: unknown };

export type RxPromiseMethod<Input, Output> = {
  (
    input: Input | Signal<Input>,
    config?: { injector?: Injector },
  ): Promise<PromiseResult<Output>>;
  destroy: () => void;
};

type RxPromiseMethodConfig<Output> = {
  injector?: Injector;
  onSuccess?: (value: Output) => void;
  onError?: (error: unknown) => void;
  onFinally?: () => void;
};

export function rxPromiseMethod<Input, Output = void>(
  handler: (input: Input) => Promise<Output>,
  config?: RxPromiseMethodConfig<Output>,
): RxPromiseMethod<Input, Output> {
  if (typeof ngDevMode !== 'undefined' && ngDevMode && !config?.injector) {
    assertInInjectionContext(rxPromiseMethod);
  }

  const sourceInjector = config?.injector ?? inject(Injector);
  const cleanupFunctions = new Set<() => void>();
  let isDestroyed = false;

  sourceInjector.get(DestroyRef).onDestroy(() => {
    isDestroyed = true;
    cleanupFunctions.forEach((fn) => fn());
    cleanupFunctions.clear();
  });

  const rxPromiseMethodFn = async (
    input: Input | Signal<Input>,
    callConfig?: { injector?: Injector },
  ): Promise<PromiseResult<Output>> => {
    if (isDestroyed) {
      return {
        status: 'error',
        error: new Error('PromiseMethod has been destroyed'),
      };
    }

    if (isStatic(input)) {
      try {
        const value = await handler(input);
        config?.onSuccess?.(value);
        return { status: 'success', value };
      } catch (error) {
        config?.onError?.(error);
        return { status: 'error', error };
      } finally {
        config?.onFinally?.();
      }
    }

    const callerInjector = getCallerInjector();
    if (
      typeof ngDevMode !== 'undefined' &&
      ngDevMode &&
      callConfig?.injector === undefined &&
      callerInjector === undefined
    ) {
      console.warn(
        'The promise method was called outside the injection context with a signal.',
        'This may lead to a memory leak. Make sure to call it within the injection',
        'context (e.g. in a constructor or field initializer) or pass an injector',
        'explicitly via the config parameter.',
      );
    }

    const instanceInjector =
      callConfig?.injector ?? callerInjector ?? sourceInjector;

    if (isSignal(input)) {
      return new Promise<PromiseResult<Output>>((resolve) => {
        let isActive = true;
        let hasResolved = false;

        const cleanup = () => {
          isActive = false;
        };

        const watcher = effect(
          () => {
            const value = input();
            untracked(async () => {
              if (isActive && !isDestroyed && !hasResolved) {
                try {
                  const result = await handler(value);
                  hasResolved = true;
                  config?.onSuccess?.(result);
                  resolve({ status: 'success', value: result });
                } catch (error) {
                  hasResolved = true;
                  config?.onError?.(error);
                  resolve({ status: 'error', error });
                } finally {
                  config?.onFinally?.();
                }
              }
            });
          },
          { injector: instanceInjector },
        );

        const destroy = () => {
          cleanup();
          watcher.destroy();
          cleanupFunctions.delete(destroy);
        };

        cleanupFunctions.add(destroy);

        if (instanceInjector !== sourceInjector) {
          instanceInjector.get(DestroyRef).onDestroy(destroy);
        }
      });
    }

    return {
      status: 'error',
      error: new Error('Input must be a static value or a Signal'),
    };
  };

  rxPromiseMethodFn.destroy = () => {
    isDestroyed = true;
    cleanupFunctions.forEach((fn) => fn());
    cleanupFunctions.clear();
  };

  return rxPromiseMethodFn as RxPromiseMethod<Input, Output>;
}

function isStatic<T>(value: T | Signal<T>): value is T {
  return !isSignal(value);
}

function getCallerInjector(): Injector | undefined {
  try {
    return inject(Injector);
  } catch {
    return undefined;
  }
}
