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
  NavigationStart,
} from '@angular/router';
import { select, Store } from '@ngrx/store';

import {
  DefaultRouterStateSerializer,
  RouterStateSerializer,
  SerializedRouterStateSnapshot,
  SimpleRouterState,
} from './serializer';

/**
 * An action dispatched when a router navigation request is fired.
 */
export const ROUTER_REQUEST = 'ROUTER_REQUEST';

/**
 * Payload of ROUTER_REQUEST
 */
export type RouterRequestPayload = {
  event: NavigationStart;
};

/**
 * An action dispatched when a router navigation request is fired.
 */
export type RouterRequestAction = {
  type: typeof ROUTER_REQUEST;
  payload: RouterRequestPayload;
};

/**
 * An action dispatched when the router navigates.
 */
export const ROUTER_NAVIGATION = 'ROUTER_NAVIGATION';

/**
 * Payload of ROUTER_NAVIGATION.
 */
export type RouterNavigationPayload<T extends SimpleRouterState> = {
  routerState: T;
  event: RoutesRecognized;
};

/**
 * An action dispatched when the router navigates.
 */
export type RouterNavigationAction<
  T extends SimpleRouterState = SerializedRouterStateSnapshot
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
export type RouterCancelPayload<T, V extends SimpleRouterState> = {
  routerState: V;
  storeState: T;
  event: NavigationCancel;
};

/**
 * An action dispatched when the router cancel navigation.
 */
export type RouterCancelAction<
  T,
  V extends SimpleRouterState = SerializedRouterStateSnapshot
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
export type RouterErrorPayload<T, V extends SimpleRouterState> = {
  routerState: V;
  storeState: T;
  event: NavigationError;
};

/**
 * An action dispatched when the router errors.
 */
export type RouterErrorAction<
  T,
  V extends SimpleRouterState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_ERROR;
  payload: RouterErrorPayload<T, V>;
};

/**
 * An action dispatched after navigation has ended and new route is active.
 */
export const ROUTER_NAVIGATED = 'ROUTER_NAVIGATED';

/**
 * Payload of ROUTER_NAVIGATED.
 */
export type RouterNavigatedPayload = {
  event: NavigationEnd;
};

/**
 * An action dispatched after navigation has ended and new route is active.
 */
export type RouterNavigatedAction = {
  type: typeof ROUTER_NAVIGATED;
  payload: RouterNavigatedPayload;
};

/**
 * An union type of router actions.
 */
export type RouterAction<
  T,
  V extends SimpleRouterState = SerializedRouterStateSnapshot
> =
  | RouterRequestAction
  | RouterNavigationAction<V>
  | RouterCancelAction<T, V>
  | RouterErrorAction<T, V>
  | RouterNavigatedAction;

export type RouterReducerState<
  T extends SimpleRouterState = SerializedRouterStateSnapshot
> = {
  state: T;
  navigationId: number;
};

export function routerReducer<
  T extends SimpleRouterState = SerializedRouterStateSnapshot
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
  serializer?: new () => RouterStateSerializer;
  /**
   * By default, ROUTER_NAVIGATION is dispatched before guards and resolvers run.
   * Therefore, the action could run too soon, for example
   * there may be a navigation cancel due to a guard saying the navigation is not allowed.
   * To run ROUTER_NAVIGATION after guards and resolvers,
   * set this property to NavigationActionTiming.PostActivation.
   */
  navigationActionTiming?: NavigationActionTiming;
}

export enum NavigationActionTiming {
  PreActivation = 1,
  PostActivation = 2,
}

export const _ROUTER_CONFIG = new InjectionToken(
  '@ngrx/router-store Internal Configuration'
);
export const ROUTER_CONFIG = new InjectionToken(
  '@ngrx/router-store Configuration'
);
export const DEFAULT_ROUTER_FEATURENAME = 'router';

export function _createRouterConfig(
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
    serializer: DefaultRouterStateSerializer,
    navigationActionTiming: NavigationActionTiming.PreActivation,
    ..._config,
  };
}

export function _createSerializer(
  config: StoreRouterConfig
): RouterStateSerializer {
  // This function gets handed a complete config-object from _createRouterConfig,
  // so we know the serializer property exists
  return new config.serializer!();
}

export type StoreRouterConfigFunction = () => StoreRouterConfig;

enum RouterTrigger {
  NONE = 1,
  ROUTER = 2,
  STORE = 3,
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
    {
      provide: _ROUTER_CONFIG,
      useValue: {
        stateKey: DEFAULT_ROUTER_FEATURENAME,
        serializer: DefaultRouterStateSerializer,
      },
    },
    {
      provide: ROUTER_CONFIG,
      useFactory: _createRouterConfig,
      deps: [_ROUTER_CONFIG],
    },
    {
      provide: RouterStateSerializer,
      deps: [ROUTER_CONFIG],
      useFactory: _createSerializer,
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
      providers: [{ provide: _ROUTER_CONFIG, useValue: config }],
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
    const dispatchNavLate =
      this.config.navigationActionTiming ===
      NavigationActionTiming.PostActivation;
    let routesRecognized: RoutesRecognized;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.trigger !== RouterTrigger.STORE) {
          this.dispatchRouterRequest(event);
        }
      } else if (event instanceof RoutesRecognized) {
        routesRecognized = event;
        this.routerState = this.serializer.serialize(event.state);

        if (!dispatchNavLate && this.trigger !== RouterTrigger.STORE) {
          this.dispatchRouterNavigation(event);
        }
      } else if (event instanceof NavigationCancel) {
        this.dispatchRouterCancel(event);
      } else if (event instanceof NavigationError) {
        this.dispatchRouterError(event);
      } else if (event instanceof NavigationEnd) {
        if (this.trigger !== RouterTrigger.STORE) {
          if (dispatchNavLate) {
            this.dispatchRouterNavigation(routesRecognized);
          }
          this.dispatchRouterNavigated(event);
        }
        this.trigger = RouterTrigger.NONE;
      }
    });
  }

  private dispatchRouterRequest(event: NavigationStart): void {
    this.dispatchRouterAction(ROUTER_REQUEST, { event });
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

  private dispatchRouterNavigated(event: NavigationEnd): void {
    this.dispatchRouterAction(ROUTER_NAVIGATED, { event });
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
