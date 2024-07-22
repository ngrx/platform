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
  input: Input | Signal<Input> | Observable<Input>
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
  const destroyRef = injector.get(DestroyRef);
  const source$ = new Subject<Input>();

  const sourceSub = generator(source$).subscribe();
  destroyRef.onDestroy(() => sourceSub.unsubscribe());

  const rxMethodFn = (input: Input | Signal<Input> | Observable<Input>) => {
    if (isSignal(input)) {
      const watcher = effect(
        () => {
          const value = input();
          untracked(() => source$.next(value));
        },
        { injector }
      );
      const instanceSub = { unsubscribe: () => watcher.destroy() };
      sourceSub.add(instanceSub);

      return instanceSub;
    }

    if (isObservable(input)) {
      const instanceSub = input.subscribe((value) => source$.next(value));
      sourceSub.add(instanceSub);

      return instanceSub;
    }

    source$.next(input);
    return { unsubscribe: noop };
  };
  rxMethodFn.unsubscribe = sourceSub.unsubscribe.bind(sourceSub);

  return rxMethodFn;
}
