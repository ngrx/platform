import {
  NgModule,
  ModuleWithProviders,
  InjectionToken,
  Inject,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationError,
  Router,
  RouterStateSnapshot,
  RoutesRecognized,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import {
  DefaultRouterStateSerializer,
  RouterStateSerializer,
} from './serializer';
/**
 * An action dispatched when the router navigates.
 */
export const ROUTER_NAVIGATION = 'ROUTER_NAVIGATION';

/**
 * Payload of ROUTER_NAVIGATION.
 */
export type RouterNavigationPayload<T> = {
  routerState: T;
  event: RoutesRecognized;
};

/**
 * An action dispatched when the router navigates.
 */
export type RouterNavigationAction<T = RouterStateSnapshot> = {
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
export type RouterCancelPayload<T, V> = {
  routerState: V;
  storeState: T;
  event: NavigationCancel;
};

/**
 * An action dispatched when the router cancel navigation.
 */
export type RouterCancelAction<T, V = RouterStateSnapshot> = {
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
export type RouterErrorPayload<T, V> = {
  routerState: V;
  storeState: T;
  event: NavigationError;
};

/**
 * An action dispatched when the router errors.
 */
export type RouterErrorAction<T, V = RouterStateSnapshot> = {
  type: typeof ROUTER_ERROR;
  payload: RouterErrorPayload<T, V>;
};

/**
 * An union type of router actions.
 */
export type RouterAction<T, V = RouterStateSnapshot> =
  | RouterNavigationAction<V>
  | RouterCancelAction<T, V>
  | RouterErrorAction<T, V>;

export type RouterReducerState<T = RouterStateSnapshot> = {
  state: T;
  navigationId: number;
};

export function routerReducer<T = RouterStateSnapshot>(
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
export const DEFAULT_ROUTER_FEATURENAME = 'routerReducer';

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

/**
 * Connects RouterModule with StoreModule.
 *
 * During the navigation, before any guards or resolvers run, the router will dispatch
 * a ROUTER_NAVIGATION action, which has the following signature:
 *
 * ```
 * export type RouterNavigationPayload = {
 *   routerState: RouterStateSnapshot,
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

  private routerState: RouterStateSnapshot;
  private storeState: any;
  private lastRoutesRecognized: RoutesRecognized;

  private dispatchTriggeredByRouter: boolean = false; // used only in dev mode in combination with routerReducer
  private navigationTriggeredByDispatch: boolean = false; // used only in dev mode in combination with routerReducer
  private stateKey: string;

  constructor(
    private store: Store<any>,
    private router: Router,
    private serializer: RouterStateSerializer<RouterStateSnapshot>,
    @Inject(ROUTER_CONFIG) private config: StoreRouterConfig
  ) {
    this.stateKey = this.config.stateKey as string;

    this.setUpBeforePreactivationHook();
    this.setUpStoreStateListener();
    this.setUpStateRollbackEvents();
  }

  private setUpBeforePreactivationHook(): void {
    (<any>this.router).hooks.beforePreactivation = (
      routerState: RouterStateSnapshot
    ) => {
      this.routerState = this.serializer.serialize(routerState);
      if (this.shouldDispatchRouterNavigation())
        this.dispatchRouterNavigation();
      return of(true);
    };
  }

  private setUpStoreStateListener(): void {
    this.store.subscribe(s => {
      this.storeState = s;
    });
    this.store.pipe(select(this.stateKey)).subscribe(() => {
      this.navigateIfNeeded();
    });
  }

  private shouldDispatchRouterNavigation(): boolean {
    if (!this.storeState[this.stateKey]) return true;
    return !this.navigationTriggeredByDispatch;
  }

  private navigateIfNeeded(): void {
    if (
      !this.storeState[this.stateKey] ||
      !this.storeState[this.stateKey].state
    ) {
      return;
    }
    if (this.dispatchTriggeredByRouter) return;

    if (this.router.url !== this.storeState[this.stateKey].state.url) {
      this.navigationTriggeredByDispatch = true;
      this.router.navigateByUrl(this.storeState[this.stateKey].state.url);
    }
  }

  private setUpStateRollbackEvents(): void {
    this.router.events.subscribe(e => {
      if (e instanceof RoutesRecognized) {
        this.lastRoutesRecognized = e;
      } else if (e instanceof NavigationCancel) {
        this.dispatchRouterCancel(e);
      } else if (e instanceof NavigationError) {
        this.dispatchRouterError(e);
      }
    });
  }

  private dispatchRouterNavigation(): void {
    this.dispatchRouterAction(ROUTER_NAVIGATION, {
      routerState: this.routerState,
      event: new RoutesRecognized(
        this.lastRoutesRecognized.id,
        this.lastRoutesRecognized.url,
        this.lastRoutesRecognized.urlAfterRedirects,
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
    this.dispatchTriggeredByRouter = true;
    try {
      this.store.dispatch({ type, payload });
    } finally {
      this.dispatchTriggeredByRouter = false;
      this.navigationTriggeredByDispatch = false;
    }
  }
}
