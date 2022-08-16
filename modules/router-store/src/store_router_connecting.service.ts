import { ErrorHandler, Inject, Injectable, isDevMode } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
  RoutesRecognized,
} from '@angular/router';
import {
  ACTIVE_RUNTIME_CHECKS,
  isNgrxMockEnvironment,
  RuntimeChecks,
  select,
  Store,
} from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import {
  ROUTER_CANCEL,
  ROUTER_ERROR,
  ROUTER_NAVIGATED,
  ROUTER_NAVIGATION,
  ROUTER_REQUEST,
} from './actions';
import {
  NavigationActionTiming,
  ROUTER_CONFIG,
  RouterState,
  StateKeyOrSelector,
  StoreRouterConfig,
} from './router_store_config';
import {
  FullRouterStateSerializer,
  SerializedRouterStateSnapshot,
} from './serializers/full_serializer';
import { RouterReducerState } from './reducer';
import { RouterStateSerializer } from './serializers/base';

enum RouterTrigger {
  NONE = 1,
  ROUTER = 2,
  STORE = 3,
}

interface StoreRouterActionPayload {
  event: RouterEvent;
  routerState?: SerializedRouterStateSnapshot;
  storeState?: any;
}

/**
 * Shared router initialization logic used alongside both the StoreRouterConnectingModule and the provideRouterStore
 * function
 */
@Injectable()
export class StoreRouterConnectingService {
  private lastEvent: Event | null = null;
  private routerState: SerializedRouterStateSnapshot | null = null;
  private storeState: any;
  private trigger = RouterTrigger.NONE;
  private readonly stateKey: StateKeyOrSelector;

  constructor(
    private store: Store<any>,
    private router: Router,
    private serializer: RouterStateSerializer<SerializedRouterStateSnapshot>,
    private errorHandler: ErrorHandler,
    @Inject(ROUTER_CONFIG) private readonly config: StoreRouterConfig,
    @Inject(ACTIVE_RUNTIME_CHECKS)
    private readonly activeRuntimeChecks: RuntimeChecks
  ) {
    this.stateKey = this.config.stateKey as StateKeyOrSelector;

    if (
      !isNgrxMockEnvironment() &&
      isDevMode() &&
      (activeRuntimeChecks?.strictActionSerializability ||
        activeRuntimeChecks?.strictStateSerializability) &&
      this.serializer instanceof FullRouterStateSerializer
    ) {
      console.warn(
        '@ngrx/router-store: The serializability runtime checks cannot be enabled ' +
          'with the FullRouterStateSerializer. The FullRouterStateSerializer ' +
          'has an unserializable router state and actions that are not serializable. ' +
          'To use the serializability runtime checks either use ' +
          'the MinimalRouterStateSerializer or implement a custom router state serializer.'
      );
    }

    this.setUpStoreStateListener();
    this.setUpRouterEventsListener();
  }

  private setUpStoreStateListener(): void {
    this.store
      .pipe(select(this.stateKey as any), withLatestFrom(this.store))
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
    if (this.lastEvent instanceof NavigationStart) {
      return;
    }

    const url = routerStoreState.state.url;
    if (!isSameUrl(this.router.url, url)) {
      this.storeState = storeState;
      this.trigger = RouterTrigger.STORE;
      this.router.navigateByUrl(url).catch((error) => {
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
        this.lastEvent = event;

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
      storeState: this.storeState,
      event,
    });
  }

  private dispatchRouterError(event: NavigationError): void {
    this.dispatchRouterAction(ROUTER_ERROR, {
      storeState: this.storeState,
      event: new NavigationError(event.id, event.url, `${event}`),
    });
  }

  private dispatchRouterNavigated(event: NavigationEnd): void {
    const routerState = this.serializer.serialize(
      this.router.routerState.snapshot
    );
    this.dispatchRouterAction(ROUTER_NAVIGATED, { event, routerState });
  }

  private dispatchRouterAction(
    type: string,
    payload: StoreRouterActionPayload
  ): void {
    this.trigger = RouterTrigger.ROUTER;
    try {
      this.store.dispatch({
        type,
        payload: {
          routerState: this.routerState,
          ...payload,
          event:
            this.config.routerState === RouterState.Full
              ? payload.event
              : {
                  id: payload.event.id,
                  url: payload.event.url,
                  // safe, as it will just be `undefined` for non-NavigationEnd router events
                  urlAfterRedirects: (payload.event as NavigationEnd)
                    .urlAfterRedirects,
                },
        },
      });
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

/**
 * Check if the URLs are matching. Accounts for the possibility of trailing "/" in url.
 */
function isSameUrl(first: string, second: string): boolean {
  return stripTrailingSlash(first) === stripTrailingSlash(second);
}

function stripTrailingSlash(text: string): string {
  if (text?.length > 0 && text[text.length - 1] === '/') {
    return text.substring(0, text.length - 1);
  }
  return text;
}
