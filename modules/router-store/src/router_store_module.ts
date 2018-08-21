import {
  Inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationError,
  NavigationEnd,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { select, Store } from '@ngrx/store';

import {
  DefaultRouterStateSerializer,
  RouterStateSerializer,
  SerializedRouterStateSnapshot,
} from './serializer';

/**
 * An action dispatched when the router navigates.
 */
export const ROUTER_NAVIGATION = 'ROUTER_NAVIGATION';

/**
 * Payload of ROUTER_NAVIGATION.
 */
export type RouterNavigationPayload<T extends RouterState> = {
  routerState: T;
  event: RoutesRecognized;
};

/**
 * An action dispatched when the router navigates.
 */
export type RouterNavigationAction<
  T extends RouterState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_NAVIGATION;
  payload: RouterNavigationPayload<T>;
};

/**
 * An action dispatched when the router cancels navigation.
 */
export const ROUTER_CANCEL = 'ROUTER_CANCEL';

/**
 * Payload of ROUTER_CANCEL.
 */
export type RouterCancelPayload<T, V extends RouterState> = {
  routerState: V;
  storeState: T;
  event: NavigationCancel;
};

/**
 * An action dispatched when the router cancel navigation.
 */
export type RouterCancelAction<
  T,
  V extends RouterState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_CANCEL;
  payload: RouterCancelPayload<T, V>;
};

/**
 * An action dispatched when the router errors.
 */
export const ROUTER_ERROR = 'ROUTE_ERROR';

/**
 * Payload of ROUTER_ERROR.
 */
export type RouterErrorPayload<T, V extends RouterState> = {
  routerState: V;
  storeState: T;
  event: NavigationError;
};

/**
 * An action dispatched when the router errors.
 */
export type RouterErrorAction<
  T,
  V extends RouterState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_ERROR;
  payload: RouterErrorPayload<T, V>;
};

/**
 * An union type of router actions.
 */
export type RouterAction<
  T,
  V extends RouterState = SerializedRouterStateSnapshot
> =
  | RouterNavigationAction<V>
  | RouterCancelAction<T, V>
  | RouterErrorAction<T, V>;

/**
 * Simple router state.
 * All custom router states should have at least this property.
 */
export type RouterState = {
  url: string;
};

export type RouterReducerState<
  T extends RouterState = SerializedRouterStateSnapshot
> = {
  state: T;
  navigationId: number;
};

export function routerReducer<
  T extends RouterState = SerializedRouterStateSnapshot
>(
  state: RouterReducerState<T> | undefined,
  action: RouterAction<any, T>
): RouterReducerState<T> {
  switch (action.type) {
    case ROUTER_NAVIGATION:
    case ROUTER_ERROR:
    case ROUTER_CANCEL:
      return {
        state: action.payload.routerState,
        navigationId: action.payload.event.id,
      };
    default:
      return state as RouterReducerState<T>;
  }
}

export interface StoreRouterConfig {
  stateKey?: string;
}

export const _ROUTER_CONFIG = new InjectionToken(
  '@ngrx/router-store Internal Configuration'
);
export const ROUTER_CONFIG = new InjectionToken(
  '@ngrx/router-store Configuration'
);
export const DEFAULT_ROUTER_FEATURENAME = 'router';

export function _createDefaultRouterConfig(
  config: StoreRouterConfig | StoreRouterConfigFunction
): StoreRouterConfig {
  let _config: StoreRouterConfig;

  if (typeof config === 'function') {
    _config = config();
  } else {
    _config = config || {};
  }

  return {
    stateKey: DEFAULT_ROUTER_FEATURENAME,
    ..._config,
  };
}

export type StoreRouterConfigFunction = () => StoreRouterConfig;

enum RouterTrigger {
  NONE,
  ROUTER,
  STORE,
}

/**
 * Connects RouterModule with StoreModule.
 *
 * During the navigation, before any guards or resolvers run, the router will dispatch
 * a ROUTER_NAVIGATION action, which has the following signature:
 *
 * ```
 * export type RouterNavigationPayload = {
 *   routerState: SerializedRouterStateSnapshot,
 *   event: RoutesRecognized
 * }
 * ```
 *
 * Either a reducer or an effect can be invoked in response to this action.
 * If the invoked reducer throws, the navigation will be canceled.
 *
 * If navigation gets canceled because of a guard, a ROUTER_CANCEL action will be
 * dispatched. If navigation results in an error, a ROUTER_ERROR action will be dispatched.
 *
 * Both ROUTER_CANCEL and ROUTER_ERROR contain the store state before the navigation
 * which can be used to restore the consistency of the store.
 *
 * Usage:
 *
 * ```typescript
 * @NgModule({
 *   declarations: [AppCmp, SimpleCmp],
 *   imports: [
 *     BrowserModule,
 *     StoreModule.forRoot(mapOfReducers),
 *     RouterModule.forRoot([
 *       { path: '', component: SimpleCmp },
 *       { path: 'next', component: SimpleCmp }
 *     ]),
 *     StoreRouterConnectingModule
 *   ],
 *   bootstrap: [AppCmp]
 * })
 * export class AppModule {
 * }
 * ```
 */
@NgModule({
  providers: [
    { provide: RouterStateSerializer, useClass: DefaultRouterStateSerializer },
    {
      provide: _ROUTER_CONFIG,
      useValue: { stateKey: DEFAULT_ROUTER_FEATURENAME },
    },
    {
      provide: ROUTER_CONFIG,
      useFactory: _createDefaultRouterConfig,
      deps: [_ROUTER_CONFIG],
    },
  ],
})
export class StoreRouterConnectingModule {
  static forRoot(
    config?: StoreRouterConfig | StoreRouterConfigFunction
  ): ModuleWithProviders;
  static forRoot(
    config: StoreRouterConfig | StoreRouterConfigFunction = {}
  ): ModuleWithProviders {
    return {
      ngModule: StoreRouterConnectingModule,
      providers: [
        { provide: _ROUTER_CONFIG, useValue: config },
        {
          provide: ROUTER_CONFIG,
          useFactory: _createDefaultRouterConfig,
          deps: [_ROUTER_CONFIG],
        },
      ],
    };
  }

  private routerState: SerializedRouterStateSnapshot;
  private storeState: any;
  private trigger = RouterTrigger.NONE;

  private stateKey: string;

  constructor(
    private store: Store<any>,
    private router: Router,
    private serializer: RouterStateSerializer<SerializedRouterStateSnapshot>,
    @Inject(ROUTER_CONFIG) private config: StoreRouterConfig
  ) {
    this.stateKey = this.config.stateKey as string;

    this.setUpStoreStateListener();
    this.setUpRouterEventsListener();
  }

  private setUpStoreStateListener(): void {
    this.store.subscribe(state => {
      this.storeState = state;
    });
    this.store.pipe(select(this.stateKey)).subscribe(() => {
      this.navigateIfNeeded();
    });
  }

  private navigateIfNeeded(): void {
    if (
      !this.storeState[this.stateKey] ||
      !this.storeState[this.stateKey].state
    ) {
      return;
    }
    if (this.trigger === RouterTrigger.ROUTER) {
      return;
    }

    const url = this.storeState[this.stateKey].state.url;
    if (this.router.url !== url) {
      this.trigger = RouterTrigger.STORE;
      this.router.navigateByUrl(url);
    }
  }

  private setUpRouterEventsListener(): void {
    this.router.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {
        this.routerState = this.serializer.serialize(event.state);

        if (this.trigger !== RouterTrigger.STORE) {
          this.dispatchRouterNavigation(event);
        }
      } else if (event instanceof NavigationCancel) {
        this.dispatchRouterCancel(event);
      } else if (event instanceof NavigationError) {
        this.dispatchRouterError(event);
      } else if (event instanceof NavigationEnd) {
        this.trigger = RouterTrigger.NONE;
      }
    });
  }

  private dispatchRouterNavigation(
    lastRoutesRecognized: RoutesRecognized
  ): void {
    this.dispatchRouterAction(ROUTER_NAVIGATION, {
      routerState: this.routerState,
      event: new RoutesRecognized(
        lastRoutesRecognized.id,
        lastRoutesRecognized.url,
        lastRoutesRecognized.urlAfterRedirects,
        this.routerState
      ),
    });
  }

  private dispatchRouterCancel(event: NavigationCancel): void {
    this.dispatchRouterAction(ROUTER_CANCEL, {
      routerState: this.routerState,
      storeState: this.storeState,
      event,
    });
  }

  private dispatchRouterError(event: NavigationError): void {
    this.dispatchRouterAction(ROUTER_ERROR, {
      routerState: this.routerState,
      storeState: this.storeState,
      event: new NavigationError(event.id, event.url, `${event}`),
    });
  }

  private dispatchRouterAction(type: string, payload: any): void {
    this.trigger = RouterTrigger.ROUTER;
    try {
      this.store.dispatch({ type, payload });
    } finally {
      this.trigger = RouterTrigger.NONE;
    }
  }
}
