import {
  assertInInjectionContext,
  DestroyRef,
  effect,
  inject,
  Injector,
  untracked,
} from '@angular/core';
import { isObservable, noop, Observable, Subject } from 'rxjs';

type RxMethodRef = {
  destroy: () => void;
};

export type RxMethod<Input> = ((
  input: Input | (() => Input) | Observable<Input>,
  config?: { injector?: Injector }
) => RxMethodRef) &
  RxMethodRef;

export function rxMethod<Input>(
  generator: (source$: Observable<Input>) => Observable<unknown>,
  config?: { injector?: Injector }
): RxMethod<Input> {
  if (typeof ngDevMode !== 'undefined' && ngDevMode && !config?.injector) {
    assertInInjectionContext(rxMethod);
  }

  const sourceInjector = config?.injector ?? inject(Injector);
  const source$ = new Subject<Input>();
  const sourceSub = generator(source$).subscribe();
  sourceInjector.get(DestroyRef).onDestroy(() => sourceSub.unsubscribe());

  const rxMethodFn = (
    input: Input | (() => Input) | Observable<Input>,
    config?: { injector?: Injector }
  ): RxMethodRef => {
    if (isStatic(input)) {
      source$.next(input);
      return { destroy: noop };
    }

    const callerInjector = getCallerInjector();
    if (
      typeof ngDevMode !== 'undefined' &&
      ngDevMode &&
      config?.injector === undefined &&
      callerInjector === undefined
    ) {
      console.warn(
        '@ngrx/signals/rxjs-interop: The reactive method was called outside',
        'the injection context with a signal or observable. This may lead to',
        'a memory leak. Make sure to call it within the injection context',
        '(e.g. in a constructor or field initializer) or pass an injector',
        'explicitly via the config parameter.\n\nFor more information, see:',
        'https://ngrx.io/guide/signals/rxjs-integration#reactive-methods-and-injector-hierarchies'
      );
    }

    const instanceInjector =
      config?.injector ?? callerInjector ?? sourceInjector;

    if (typeof input === 'function') {
      const watcher = effect(
        () => {
          const value = input();
          untracked(() => source$.next(value));
        },
        { injector: instanceInjector }
      );
      sourceSub.add({ unsubscribe: () => watcher.destroy() });

      return watcher;
    }

    const instanceSub = input.subscribe((value) => source$.next(value));
    sourceSub.add(instanceSub);

    if (instanceInjector !== sourceInjector) {
      instanceInjector
        .get(DestroyRef)
        .onDestroy(() => instanceSub.unsubscribe());
    }

    return { destroy: () => instanceSub.unsubscribe() };
  };
  rxMethodFn.destroy = sourceSub.unsubscribe.bind(sourceSub);

  return rxMethodFn;
}

function isStatic<T>(value: T | (() => T) | Observable<T>): value is T {
  return typeof value !== 'function' && !isObservable(value);
}

function getCallerInjector(): Injector | undefined {
  try {
    return inject(Injector);
  } catch {
    return undefined;
  }
}
