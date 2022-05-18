import { Provider, InjectionToken, Type, inject } from '@angular/core';
import { take } from 'rxjs';
import { ComponentStore } from './component-store';

export interface OnStoreInit {
  readonly ngrxOnStoreInit: () => void;
}

export interface OnStateInit {
  readonly ngrxOnStateInit: () => void;
}

function isOnStoreInitDefined(cs: unknown): cs is OnStoreInit {
  return typeof (cs as OnStoreInit).ngrxOnStoreInit === 'function';
}

function isOnStateInitDefined(cs: unknown): cs is OnStateInit {
  return typeof (cs as OnStateInit).ngrxOnStateInit === 'function';
}

export function provideComponentStore(
  componentStoreClass: Type<ComponentStore<any>>
): Provider[] {
  const CS_WITH_HOOKS = new InjectionToken<ComponentStore<any>>(
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
