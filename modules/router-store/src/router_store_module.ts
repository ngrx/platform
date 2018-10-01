import {
  Inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  ErrorHandler,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationError,
  NavigationEnd,
  Router,
  RoutesRecognized,
  NavigationStart,
} from '@angular/router';
import { select, Selector, Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';

import {
  ROUTER_CANCEL,
  ROUTER_ERROR,
  ROUTER_NAVIGATED,
  ROUTER_NAVIGATION,
  ROUTER_REQUEST,
} from './actions';
import { RouterReducerState } from './reducer';
import {
  DefaultRouterStateSerializer,
  RouterStateSerializer,
  SerializedRouterStateSnapshot,
} from './serializer';

export type StateKeyOrSelector = string | Selector<any, RouterReducerState>;

export interface StoreRouterConfig {
  stateKey?: StateKeyOrSelector;
  serializer?: new (...args: any[]) => RouterStateSerializer;
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
  config: StoreRouterConfig
): StoreRouterConfig {
  return {
    stateKey: DEFAULT_ROUTER_FEATURENAME,
    serializer: DefaultRouterStateSerializer,
    navigationActionTiming: NavigationActionTiming.PreActivation,
    ...config,
  };
}

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
      useValue: {},
    },
    {
      provide: ROUTER_CONFIG,
      useFactory: _createRouterConfig,
      deps: [_ROUTER_CONFIG],
    },
    {
      provide: RouterStateSerializer,
      useClass: DefaultRouterStateSerializer,
    },
  ],
})
export class StoreRouterConnectingModule {
  static forRoot(
    config: StoreRouterConfig = {}
  ): ModuleWithProviders<StoreRouterConnectingModule> {
    return {
      ngModule: StoreRouterConnectingModule,
      providers: [
        { provide: _ROUTER_CONFIG, useValue: config },
        {
          provide: RouterStateSerializer,
          useClass: config.serializer
            ? config.serializer
            : DefaultRouterStateSerializer,
        },
      ],
    };
  }

  private routerState: SerializedRouterStateSnapshot | null;
  private storeState: any;
  private trigger = RouterTrigger.NONE;

  private stateKey: StateKeyOrSelector;

  constructor(
    private store: Store<any>,
    private router: Router,
    private serializer: RouterStateSerializer<SerializedRouterStateSnapshot>,
    private errorHandler: ErrorHandler,
    @Inject(ROUTER_CONFIG) private config: StoreRouterConfig
  ) {
    this.stateKey = this.config.stateKey as StateKeyOrSelector;

    this.setUpStoreStateListener();
    this.setUpRouterEventsListener();
  }

  private setUpStoreStateListener(): void {
    this.store
      .pipe(
        select(this.stateKey),
        withLatestFrom(this.store)
      )
      .subscribe(([routerStoreState, storeState]) => {
        this.navigateIfNeeded(routerStoreState, storeState);
      });
  }

  private navigateIfNeeded(
    routerStoreState: RouterReducerState,
    storeState: any
  ): void {
    if (!routerStoreState || !routerStoreState.state) {
      return;
    }
    if (this.trigger === RouterTrigger.ROUTER) {
      return;
    }

    const url = routerStoreState.state.url;
    if (this.router.url !== url) {
      this.storeState = storeState;
      this.trigger = RouterTrigger.STORE;
      this.router.navigateByUrl(url).catch(error => {
        this.errorHandler.handleError(error);
      });
    }
  }

  private setUpRouterEventsListener(): void {
    const dispatchNavLate =
      this.config.navigationActionTiming ===
      NavigationActionTiming.PostActivation;
    let routesRecognized: RoutesRecognized;

    this.router.events
      .pipe(withLatestFrom(this.store))
      .subscribe(([event, storeState]) => {
        if (event instanceof NavigationStart) {
          this.routerState = this.serializer.serialize(
            this.router.routerState.snapshot
          );
          if (this.trigger !== RouterTrigger.STORE) {
            this.storeState = storeState;
            this.dispatchRouterRequest(event);
          }
        } else if (event instanceof RoutesRecognized) {
          routesRecognized = event;

          if (!dispatchNavLate && this.trigger !== RouterTrigger.STORE) {
            this.dispatchRouterNavigation(event);
          }
        } else if (event instanceof NavigationCancel) {
          this.dispatchRouterCancel(event);
          this.reset();
        } else if (event instanceof NavigationError) {
          this.dispatchRouterError(event);
          this.reset();
        } else if (event instanceof NavigationEnd) {
          if (this.trigger !== RouterTrigger.STORE) {
            if (dispatchNavLate) {
              this.dispatchRouterNavigation(routesRecognized);
            }
            this.dispatchRouterNavigated(event);
          }
          this.reset();
        }
      });
  }

  private dispatchRouterRequest(event: NavigationStart): void {
    this.dispatchRouterAction(ROUTER_REQUEST, { event });
  }

  private dispatchRouterNavigation(
    lastRoutesRecognized: RoutesRecognized
  ): void {
    const nextRouterState = this.serializer.serialize(
      lastRoutesRecognized.state
    );
    this.dispatchRouterAction(ROUTER_NAVIGATION, {
      routerState: nextRouterState,
      event: new RoutesRecognized(
        lastRoutesRecognized.id,
        lastRoutesRecognized.url,
        lastRoutesRecognized.urlAfterRedirects,
        nextRouterState
      ),
    });
  }

  private dispatchRouterCancel(event: NavigationCancel): void {
    this.dispatchRouterAction(ROUTER_CANCEL, {
      routerState: this.routerState!,
      storeState: this.storeState,
      event,
    });
  }

  private dispatchRouterError(event: NavigationError): void {
    this.dispatchRouterAction(ROUTER_ERROR, {
      routerState: this.routerState!,
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

  private reset() {
    this.trigger = RouterTrigger.NONE;
    this.storeState = null;
    this.routerState = null;
  }
}
