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
import { isObservable, noop, Observable, Subject, Unsubscribable } from 'rxjs';

type RxMethod<Input> = ((
  input: Input | Signal<Input> | Observable<Input>,
  config?: { injector?: Injector }
) => Unsubscribable) &
  Unsubscribable;

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
  ) => {
    if (isStatic(input)) {
      source$.next(input);
      return { unsubscribe: noop };
    }

    const instanceInjector =
      config?.injector ?? getCallerInjector() ?? sourceInjector;

    if (isSignal(input)) {
      const watcher = effect(
        () => {
          const value = input();
          untracked(() => source$.next(value));
        },
        { injector: instanceInjector }
      );
      const instanceSub = { unsubscribe: () => watcher.destroy() };
      sourceSub.add(instanceSub);

      return instanceSub;
    }

    const instanceSub = input.subscribe((value) => source$.next(value));
    sourceSub.add(instanceSub);

    if (instanceInjector !== sourceInjector) {
      instanceInjector
        .get(DestroyRef)
        .onDestroy(() => instanceSub.unsubscribe());
    }

    return instanceSub;
  };
  rxMethodFn.unsubscribe = sourceSub.unsubscribe.bind(sourceSub);

  return rxMethodFn;
}

function isStatic<T>(value: T | Signal<T> | Observable<T>): value is T {
  return !isSignal(value) && !isObservable(value);
}

function getCallerInjector(): Injector | null {
  try {
    return inject(Injector);
  } catch {
    return null;
  }
}
