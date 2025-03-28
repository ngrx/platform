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
import { isObservable, noop, Observable, Subject } from 'rxjs';

type RxMethodRef = {
  destroy: () => void;
};

type RxMethod<Input> = ((
  input: Input | Signal<Input> | Observable<Input>,
  config?: { injector?: Injector }
) => RxMethodRef) &
  RxMethodRef;

export function rxMethod<Input>(
  generator: (source$: Observable<Input>) => Observable<unknown>,
  config?: { injector?: Injector }
): RxMethod<Input> {
  if (!config?.injector) {
    assertInInjectionContext(rxMethod);
  }

  const sourceInjector = config?.injector ?? inject(Injector);
  const source$ = new Subject<Input>();
  const sourceSub = generator(source$).subscribe();
  sourceInjector.get(DestroyRef).onDestroy(() => sourceSub.unsubscribe());

  const rxMethodFn = (
    input: Input | Signal<Input> | Observable<Input>,
    config?: { injector?: Injector }
  ): RxMethodRef => {
    if (isStatic(input)) {
      source$.next(input);
      return { destroy: noop };
    }

    const callerInjector = getCallerInjector();
    if (config?.injector === undefined && callerInjector === undefined) {
      console.warn(`
   @ngrx/signals/rxjs-interop: A function returned by rxMethod was called outside the injection context.
  This may lead to memory leaks. Make sure to call it within an injection context
  (e.g., in a constructor or field initializer), or pass an injector explicitly
  via the config parameter.

  For more information, see https://ngrx.io/api/signals/rxjs-interop/rxmethod.
`);
    }

    const instanceInjector =
      config?.injector ?? callerInjector ?? sourceInjector;

    if (isSignal(input)) {
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

function isStatic<T>(value: T | Signal<T> | Observable<T>): value is T {
  return !isSignal(value) && !isObservable(value);
}

function getCallerInjector(): Injector | undefined {
  try {
    return inject(Injector);
  } catch {
    return undefined;
  }
}
