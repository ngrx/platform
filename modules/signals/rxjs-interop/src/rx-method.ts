import {
  assertInInjectionContext,
  DestroyRef,
  inject,
  Injector,
  isSignal,
  Signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { isObservable, Observable, of, Subject, Unsubscribable } from 'rxjs';

type RxMethodInput<Input> = Input | Observable<Input> | Signal<Input>;

type RxMethod<Input> = ((input: RxMethodInput<Input>) => Unsubscribable) &
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

  const rxMethodFn = (input: RxMethodInput<Input>) => {
    let input$: Observable<Input>;

    if (isSignal(input)) {
      input$ = toObservable(input, { injector });
    } else if (isObservable(input)) {
      input$ = input;
    } else {
      input$ = of(input);
    }

    const instanceSub = input$.subscribe((value) => source$.next(value));
    sourceSub.add(instanceSub);

    return instanceSub;
  };
  rxMethodFn.unsubscribe = sourceSub.unsubscribe.bind(sourceSub);

  return rxMethodFn;
}
