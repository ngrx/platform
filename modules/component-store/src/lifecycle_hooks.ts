import { Provider, InjectionToken, Type, inject } from '@angular/core';
import { take } from 'rxjs';
import { ComponentStore } from './component-store';

/**
 * The interface for the lifecycle hook
 * called after the ComponentStore is instantiated.
 */
export interface OnStoreInit {
  readonly ngrxOnStoreInit: () => void;
}

/**
 * The interface for the lifecycle hook
 * called only once after the ComponentStore
 * state is first initialized.
 */
export interface OnStateInit {
  readonly ngrxOnStateInit: () => void;
}

/**
 * Checks to see if the OnInitStore lifecycle hook
 * is defined on the ComponentStore.
 *
 * @param cs ComponentStore type
 * @returns boolean
 */
function isOnStoreInitDefined(cs: unknown): cs is OnStoreInit {
  return typeof (cs as OnStoreInit).ngrxOnStoreInit === 'function';
}

/**
 * Checks to see if the OnInitState lifecycle hook
 * is defined on the ComponentStore.
 *
 * @param cs ComponentStore type
 * @returns boolean
 */
function isOnStateInitDefined(cs: unknown): cs is OnStateInit {
  return typeof (cs as OnStateInit).ngrxOnStateInit === 'function';
}

/**
 * @description
 *
 * Function that returns the ComponentStore
 * class registered as a provider,
 * and uses a factory provider to instantiate the
 * ComponentStore and run the lifecycle hooks
 * defined on the ComponentStore.
 *
 * @param componentStoreClass The ComponentStore with lifecycle hooks
 * @returns Provider[]
 *
 * @usageNotes
 *
 * ```ts
 * @Injectable()
 * export class MyStore
 *    extends ComponentStore<{ init: boolean }>
 *    implements OnStoreInit, OnStateInit
 *   {
 *
 *   constructor() {
 *     super({ init: true });
 *   }
 *
 *   ngrxOnStoreInit() {
 *     // runs once after store has been instantiated
 *   }
 *
 *   ngrxOnStateInit() {
 *     // runs once after store state has been initialized
 *   }
 * }
 *
 * @Component({
 *   providers: [
 *     provideComponentStore(MyStore)
 *   ]
 * })
 * export class MyComponent {
 *   constructor(private myStore: MyStore) {}
 * }
 * ```
 */
export function provideComponentStore<T extends object>(
  componentStoreClass: Type<ComponentStore<T>>
): Provider[] {
  const CS_WITH_HOOKS = new InjectionToken<ComponentStore<T>>(
    '@ngrx/component-store ComponentStore with Hooks'
  );

  return [
    { provide: CS_WITH_HOOKS, useClass: componentStoreClass },
    {
      provide: componentStoreClass,
      useFactory: () => {
        const componentStore = inject(CS_WITH_HOOKS);

        if (isOnStoreInitDefined(componentStore)) {
          componentStore.ngrxOnStoreInit();
        }

        if (isOnStateInitDefined(componentStore)) {
          componentStore.state$
            .pipe(take(1))
            .subscribe(() => componentStore.ngrxOnStateInit());
        }

        return componentStore;
      },
    },
  ];
}
