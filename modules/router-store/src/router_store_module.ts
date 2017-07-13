import { NgModule } from '@angular/core';
import {
  NavigationCancel,
  NavigationError,
  Router,
  RouterStateSnapshot,
  RoutesRecognized,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

/**
 * An action dispatched when the router navigates.
 */
export const ROUTER_NAVIGATION = 'ROUTER_NAVIGATION';

/**
 * Payload of ROUTER_NAVIGATION.
 */
export type RouterNavigationPayload = {
  routerState: RouterStateSnapshot;
  event: RoutesRecognized;
};

/**
 * An action dispatched when the router navigates.
 */
export type RouterNavigationAction = {
  type: typeof ROUTER_NAVIGATION;
  payload: RouterNavigationPayload;
};

/**
 * An action dispatched when the router cancels navigation.
 */
export const ROUTER_CANCEL = 'ROUTER_CANCEL';

/**
 * Payload of ROUTER_CANCEL.
 */
export type RouterCancelPayload<T> = {
  routerState: RouterStateSnapshot;
  storeState: T;
  event: NavigationCancel;
};

/**
 * An action dispatched when the router cancel navigation.
 */
export type RouterCancelAction<T> = {
  type: typeof ROUTER_CANCEL;
  payload: RouterCancelPayload<T>;
};

/**
 * An action dispatched when the router errors.
 */
export const ROUTER_ERROR = 'ROUTE_ERROR';

/**
 * Payload of ROUTER_ERROR.
 */
export type RouterErrorPayload<T> = {
  routerState: RouterStateSnapshot;
  storeState: T;
  event: NavigationError;
};

/**
 * An action dispatched when the router errors.
 */
export type RouterErrorAction<T> = {
  type: typeof ROUTER_ERROR;
  payload: RouterErrorPayload<T>;
};

/**
 * An union type of router actions.
 */
export type RouterAction<T> =
  | RouterNavigationAction
  | RouterCancelAction<T>
  | RouterErrorAction<T>;

export type RouterReducerState = {
  state: RouterStateSnapshot;
  navigationId: number;
};

export function routerReducer(
  state: RouterReducerState,
  action: RouterAction<any>
): RouterReducerState {
  switch (action.type) {
    case ROUTER_NAVIGATION:
    case ROUTER_ERROR:
    case ROUTER_CANCEL:
      return {
        state: action.payload.routerState,
        navigationId: action.payload.event.id,
      };
    default:
      return state;
  }
}

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
 *     StoreModule.provideStore(mapOfReducers),
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
@NgModule({})
export class StoreRouterConnectingModule {
  private routerState: RouterStateSnapshot | null = null;
  private storeState: any;
  private lastRoutesRecognized: RoutesRecognized;

  private dispatchTriggeredByRouter: boolean = false; // used only in dev mode in combination with routerReducer
  private navigationTriggeredByDispatch: boolean = false; // used only in dev mode in combination with routerReducer

  constructor(private store: Store<any>, private router: Router) {
    this.setUpBeforePreactivationHook();
    this.setUpStoreStateListener();
    this.setUpStateRollbackEvents();
  }

  private setUpBeforePreactivationHook(): void {
    (<any>this.router).hooks.beforePreactivation = (
      routerState: RouterStateSnapshot
    ) => {
      this.routerState = routerState;
      if (this.shouldDispatch()) this.dispatchEvent();
      return of(true);
    };
  }

  private setUpStoreStateListener(): void {
    this.store.subscribe(s => {
      this.storeState = s;
      this.navigateIfNeeded();
    });
  }

  private dispatchEvent(): void {
    this.dispatchTriggeredByRouter = true;
    try {
      const payload = {
        routerState: this.routerState,
        event: this.lastRoutesRecognized,
      };
      this.store.dispatch({ type: ROUTER_NAVIGATION, payload });
    } finally {
      this.dispatchTriggeredByRouter = false;
      this.navigationTriggeredByDispatch = false;
    }
  }

  private shouldDispatch(): boolean {
    if (!this.storeState['routerReducer']) return true;
    return !this.navigationTriggeredByDispatch;
  }

  private navigateIfNeeded(): void {
    if (!this.storeState['routerReducer']) return;
    if (this.dispatchTriggeredByRouter) return;

    if (this.router.url !== this.storeState['routerReducer'].state.url) {
      this.navigationTriggeredByDispatch = true;
      this.router.navigateByUrl(this.storeState['routerReducer'].state.url);
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

  private dispatchRouterCancel(event: NavigationCancel): void {
    const payload = {
      routerState: this.routerState,
      storeState: this.storeState,
      event,
    };
    this.store.dispatch({ type: ROUTER_CANCEL, payload });
  }

  private dispatchRouterError(event: NavigationError): void {
    const payload = {
      routerState: this.routerState,
      storeState: this.storeState,
      event,
    };
    this.store.dispatch({ type: ROUTER_ERROR, payload });
  }
}
