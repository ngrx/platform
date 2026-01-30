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

/**
 * @description
 *
 * Creates a reactive method for managing side effects by utilizing RxJS APIs.
 * The method accepts an observable, a signal, a computation function, or
 * a static value.
 *
 * @usageNotes
 *
 * ```ts
 * import { Component, inject, signal } from '@angular/core';
 * import { switchMap } from 'rxjs';
 * import { rxMethod } from '@ngrx/signals/rxjs-interop';
 * import { tapResponse } from '@ngrx/operators';
 *
 * \@Component(...)
 * export class TodoList {
 *   readonly #todosService = inject(TodosService);
 *   readonly userId = signal(1);
 *   readonly todos = signal<Todo[]>([]);
 *
 *   readonly loadTodos = rxMethod<number>(
 *     switchMap((id) =>
 *       this.#todosService.getByUserId(id).pipe(
 *         tapResponse({
 *           next: (todos) => this.todos.set(todos),
 *           error: console.error,
 *         })
 *       )
 *     )
 *   );
 *
 *   constructor() {
 *     // 👇 Load todos on `userId` changes.
 *     this.loadTodos(this.userId);
 *   }
 * }
 * ```
 */
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
    const instanceInjector =
      config?.injector ?? callerInjector ?? sourceInjector;

    if (
      typeof ngDevMode !== 'undefined' &&
      ngDevMode &&
      config?.injector === undefined &&
      callerInjector === undefined &&
      isRootInjector(sourceInjector)
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

/**
 * Checks whether the given injector is a root or platform injector.
 *
 * Uses the `scopes` property from Angular's `R3Injector` (the concrete
 * `EnvironmentInjector` implementation) via duck typing. This is an
 * internal Angular API that may change in future versions.
 */
function isRootInjector(injector: Injector): boolean {
  const scopes: Set<string> | undefined = (injector as any)['scopes'];
  return scopes?.has('root') === true || scopes?.has('platform') === true;
}
