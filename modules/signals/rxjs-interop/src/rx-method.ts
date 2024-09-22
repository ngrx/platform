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
  injector?: Injector
) => Unsubscribable) &
  Unsubscribable;

export function rxMethod<Input>(
  generator: (source$: Observable<Input>) => Observable<unknown>,
  config?: { injector?: Injector }
): RxMethod<Input> {
  if (!config?.injector) {
    assertInInjectionContext(rxMethod);
  }

  const injector = config?.injector ?? inject(Injector);
  const source$ = new Subject<Input>();
  const sourceSub = generator(source$).subscribe();

  const rxMethodFn = (
    input: Input | Signal<Input> | Observable<Input>,
    customInjector?: Injector
  ) => {
    if (isSignal(input)) {
      const callerInjector = getCallerInjectorIfAvailable();
      const instanceInjector = customInjector ?? callerInjector ?? injector;

      const watcher = effect(
        () => {
          const value = input();
          untracked(() => source$.next(value));
        },
        { injector: instanceInjector }
      );

      instanceInjector.get(DestroyRef).onDestroy(() => {
        sourceSub.unsubscribe();
      });

      const instanceSub = {
        unsubscribe: () => watcher.destroy(),
      };
      sourceSub.add(instanceSub);

      return instanceSub;
    }

    if (isObservable(input)) {
      const instanceSub = input.subscribe((value) => source$.next(value));
      sourceSub.add(instanceSub);

      const destroyRef = injector.get(DestroyRef);
      destroyRef.onDestroy(() => sourceSub.unsubscribe());

      return instanceSub;
    }

    source$.next(input);
    return { unsubscribe: noop };
  };
  rxMethodFn.unsubscribe = sourceSub.unsubscribe.bind(sourceSub);

  return rxMethodFn;
}

function getCallerInjectorIfAvailable(): Injector | null {
  try {
    return inject(Injector);
  } catch (e) {
    return null;
  }
}
