import { Injectable, ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  NavigationEnd,
  Router,
  RouterStateSnapshot,
  NavigationCancel,
  NavigationError,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Store, ScannedActionsSubject } from '@ngrx/store';
import { filter, first, mapTo, take } from 'rxjs/operators';

import {
  NavigationActionTiming,
  ROUTER_CANCEL,
  ROUTER_ERROR,
  ROUTER_NAVIGATED,
  ROUTER_NAVIGATION,
  ROUTER_REQUEST,
  RouterAction,
  routerReducer,
  RouterReducerState,
  RouterStateSerializer,
  StateKeyOrSelector,
} from '../src';
import { createTestModule } from './utils';

describe('integration spec', () => {
  it('should work', (done: any) => {
    const reducer = (state: string = '', action: RouterAction<any>) => {
      if (action.type === ROUTER_NAVIGATION) {
        return action.payload.routerState.url.toString();
      } else {
        return state;
      }
    };

    createTestModule({ reducers: { reducer } });

    const router: Router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore();

    router
      .navigateByUrl('/')
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: '' }, // init event. has nothing to do with the router
          { type: 'store', state: '' }, // ROUTER_REQUEST event in the store
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/' },
          { type: 'store', state: '/' }, // ROUTER_NAVIGATION event in the store
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/' },
          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/' },
          { type: 'router', event: 'ResolveStart', url: '/' },
          { type: 'router', event: 'ResolveEnd', url: '/' },
          { type: 'store', state: '/' }, // ROUTER_NAVIGATED event in the store
          { type: 'action', action: ROUTER_NAVIGATED },
          { type: 'router', event: 'NavigationEnd', url: '/' },
        ]);
      })
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: '/' }, // ROUTER_REQUEST event in the store
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'store', state: '/next' },
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },

          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },
          { type: 'store', state: '/next' }, // ROUTER_NAVIGATED event in the store
          { type: 'action', action: ROUTER_NAVIGATED },
          { type: 'router', event: 'NavigationEnd', url: '/next' },
        ]);

        done();
      });
  });

  it('should have the routerState in the payload', (done: any) => {
    const actionLog: RouterAction<any>[] = [];
    const reducer = (state: string = '', action: RouterAction<any>) => {
      switch (action.type) {
        case ROUTER_CANCEL:
        case ROUTER_ERROR:
        case ROUTER_NAVIGATED:
        case ROUTER_NAVIGATION:
        case ROUTER_REQUEST:
          actionLog.push(action);
          return state;
        default:
          return state;
      }
    };

    createTestModule({
      reducers: { reducer },
      canActivate: (
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ) => state.url !== 'next',
    });

    const router: Router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore();

    const hasRouterState = (action: RouterAction<any>) =>
      !!action.payload.routerState;

    router
      .navigateByUrl('/')
      .then(() => {
        expect(actionLog.filter(hasRouterState).length).toBe(actionLog.length);
      })
      .then(() => {
        actionLog.splice(0);
        return router.navigateByUrl('next');
      })
      .then(() => {
        expect(actionLog.filter(hasRouterState).length).toBe(actionLog.length);
        done();
      });
  });

  xit('should support preventing navigation', (done: any) => {
    const reducer = (state: string = '', action: RouterAction<any>) => {
      if (
        action.type === ROUTER_NAVIGATION &&
        action.payload.routerState.url.toString() === '/next'
      ) {
        throw new Error('You shall not pass!');
      } else {
        return state;
      }
    };

    createTestModule({ reducers: { reducer } });

    const router: Router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore();

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .catch(e => {
        expect(e.message).toEqual('You shall not pass!');
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'router', event: 'NavigationError', url: '/next' },
        ]);

        done();
      });
  });

  it('should support rolling back if navigation gets canceled (navigation initialized through router)', (done: any) => {
    const reducer = (state: string = '', action: RouterAction<any>): any => {
      if (action.type === ROUTER_NAVIGATION) {
        return {
          url: action.payload.routerState.url.toString(),
          lastAction: ROUTER_NAVIGATION,
        };
      } else if (action.type === ROUTER_CANCEL) {
        return {
          url: action.payload.routerState.url.toString(),
          storeState: action.payload.storeState.reducer,
          lastAction: ROUTER_CANCEL,
        };
      } else {
        return state;
      }
    };

    createTestModule({
      reducers: { reducer, routerReducer },
      canActivate: () => false,
    });

    const router: Router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore();

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(r => {
        expect(r).toEqual(false);

        expect(log).toEqual([
          {
            type: 'store',
            state: { url: '/', lastAction: ROUTER_NAVIGATION },
          }, // ROUTER_REQUEST event in the store
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/next' },
          {
            type: 'store',
            state: { url: '/next', lastAction: ROUTER_NAVIGATION },
          },
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },

          /* new Router Lifecycle in Angular 4.3 - m */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          // { type: 'router', event: 'ResolveStart', url: '/next' },
          // { type: 'router', event: 'ResolveEnd', url: '/next' },
          {
            type: 'store',
            state: {
              url: '/',
              lastAction: ROUTER_CANCEL,
              storeState: { url: '/', lastAction: ROUTER_NAVIGATION },
            },
          },
          { type: 'action', action: ROUTER_CANCEL },
          { type: 'router', event: 'NavigationCancel', url: '/next' },
        ]);

        done();
      });
  });

  it('should support rolling back if navigation gets canceled (navigation initialized through store)', (done: any) => {
    const CHANGE_ROUTE = 'CHANGE_ROUTE';
    const reducer = (
      state: RouterReducerState,
      action: any
    ): RouterReducerState => {
      if (action.type === CHANGE_ROUTE) {
        return {
          state: { url: '/next', root: <any>{} },
          navigationId: 123,
        };
      } else {
        const nextState = routerReducer(state, action);
        if (nextState && nextState.state) {
          nextState.state.root = <any>{};
        }
        return nextState;
      }
    };

    createTestModule({
      reducers: { reducer },
      canActivate: () => false,
      config: { stateKey: 'reducer' },
    });

    const router: Router = TestBed.get(Router);
    const store: Store<any> = TestBed.get(Store);
    const log = logOfRouterAndActionsAndStore();

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        store.dispatch({ type: CHANGE_ROUTE });
        return waitForNavigation(router, NavigationCancel);
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          {
            type: 'store',
            state: { state: { url: '/next', root: {} }, navigationId: 123 },
          },
          { type: 'action', action: CHANGE_ROUTE },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          {
            type: 'store',
            state: { state: { url: '/', root: {} }, navigationId: 2 },
          },
          { type: 'action', action: ROUTER_CANCEL },
          { type: 'router', event: 'NavigationCancel', url: '/next' },
        ]);

        done();
      });
  });

  it('should support rolling back if navigation errors (navigation initialized through router)', (done: any) => {
    const reducer = (state: string = '', action: RouterAction<any>): any => {
      if (action.type === ROUTER_NAVIGATION) {
        return {
          url: action.payload.routerState.url.toString(),
          lastAction: ROUTER_NAVIGATION,
        };
      } else if (action.type === ROUTER_ERROR) {
        return {
          url: action.payload.routerState.url.toString(),
          storeState: action.payload.storeState.reducer,
          lastAction: ROUTER_ERROR,
        };
      } else {
        return state;
      }
    };

    createTestModule({
      reducers: { reducer, routerReducer },
      canActivate: () => {
        throw new Error('BOOM!');
      },
    });

    const router: Router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore();

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .catch(e => {
        expect(e.message).toEqual('BOOM!');

        expect(log).toEqual([
          {
            type: 'store',
            state: { url: '/', lastAction: ROUTER_NAVIGATION },
          }, // ROUTER_REQUEST event in the store
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/next' },
          {
            type: 'store',
            state: { url: '/next', lastAction: ROUTER_NAVIGATION },
          },
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },

          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },

          {
            type: 'store',
            state: {
              url: '/',
              lastAction: ROUTER_ERROR,
              storeState: { url: '/', lastAction: ROUTER_NAVIGATION },
            },
          },
          { type: 'action', action: ROUTER_ERROR },
          { type: 'router', event: 'NavigationError', url: '/next' },
        ]);

        done();
      });
  });

  it('should support rolling back if navigation errors and hand error to error handler (navigation initialized through store)', (done: any) => {
    const CHANGE_ROUTE = 'CHANGE_ROUTE';
    const reducer = (
      state: RouterReducerState,
      action: any
    ): RouterReducerState => {
      if (action.type === CHANGE_ROUTE) {
        return {
          state: { url: '/next', root: <any>{} },
          navigationId: 123,
        };
      } else {
        const nextState = routerReducer(state, action);
        if (nextState && nextState.state) {
          nextState.state.root = <any>{};
        }
        return nextState;
      }
    };

    const routerError = new Error('BOOM!');
    class SilentErrorHandler implements ErrorHandler {
      handleError(error: any) {
        expect(error).toBe(routerError);
      }
    }

    createTestModule({
      reducers: { reducer },
      canActivate: () => {
        throw routerError;
      },
      providers: [{ provide: ErrorHandler, useClass: SilentErrorHandler }],
      config: { stateKey: 'reducer' },
    });

    const router: Router = TestBed.get(Router);
    const store: Store<any> = TestBed.get(Store);
    const log = logOfRouterAndActionsAndStore();

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        store.dispatch({ type: CHANGE_ROUTE });
        return waitForNavigation(router, NavigationError);
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          {
            type: 'store',
            state: { state: { url: '/next', root: {} }, navigationId: 123 },
          },
          { type: 'action', action: CHANGE_ROUTE },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          {
            type: 'store',
            state: { state: { url: '/', root: {} }, navigationId: 2 },
          },
          { type: 'action', action: ROUTER_ERROR },
          { type: 'router', event: 'NavigationError', url: '/next' },
        ]);

        done();
      });
  });

  it('should call navigateByUrl when resetting state of the routerReducer', (done: any) => {
    const reducer = (state: any, action: RouterAction<any>) => {
      const r = routerReducer(state, action);
      return r && r.state
        ? { url: r.state.url, navigationId: r.navigationId }
        : null;
    };

    createTestModule({ reducers: { router: routerReducer, reducer } });

    const router = TestBed.get(Router);
    const store = TestBed.get(Store);
    const log = logOfRouterAndActionsAndStore();

    const routerReducerStates: any[] = [];
    store.subscribe((state: any) => {
      if (state.router) {
        routerReducerStates.push(state.router);
      }
    });

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: null }, // ROUTER_REQUEST event in the store
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'store', state: { url: '/next', navigationId: 2 } },
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },

          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },
          { type: 'store', state: null }, // ROUTER_NAVIGATED event in the store
          { type: 'action', action: ROUTER_NAVIGATED },
          { type: 'router', event: 'NavigationEnd', url: '/next' },
        ]);
        log.splice(0);

        store.dispatch({
          type: ROUTER_NAVIGATION,
          payload: {
            routerState: routerReducerStates[0].state,
            event: { id: routerReducerStates[0].navigationId },
          },
        });
        return waitForNavigation(router);
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/' },
          { type: 'store', state: { url: '/', navigationId: 1 } }, // restored
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/' },

          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/' },
          { type: 'router', event: 'ResolveStart', url: '/' },
          { type: 'router', event: 'ResolveEnd', url: '/' },

          { type: 'router', event: 'NavigationEnd', url: '/' },
        ]);
        log.splice(0);
      })
      .then(() => {
        store.dispatch({
          type: ROUTER_NAVIGATION,
          payload: {
            routerState: routerReducerStates[3].state,
            event: { id: routerReducerStates[3].navigationId },
          },
        });
        return waitForNavigation(router);
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'store', state: { url: '/next', navigationId: 2 } }, // restored
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },

          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },

          { type: 'router', event: 'NavigationEnd', url: '/next' },
        ]);
        done();
      });
  });

  it('should support cancellation of initial navigation using canLoad guard', (done: any) => {
    const reducer = (state: any, action: RouterAction<any>) => {
      const r = routerReducer(state, action);
      return r && r.state
        ? { url: r.state.url, navigationId: r.navigationId }
        : null;
    };

    createTestModule({
      reducers: { routerReducer, reducer },
      canLoad: () => false,
    });

    const router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore();

    router.navigateByUrl('/load').then((r: boolean) => {
      expect(r).toBe(false);

      expect(log).toEqual([
        { type: 'store', state: null }, // initial state
        { type: 'store', state: null }, // ROUTER_REQEST event in the store
        { type: 'action', action: ROUTER_REQUEST },
        { type: 'router', event: 'NavigationStart', url: '/load' },
        { type: 'store', state: { url: '', navigationId: 1 } },
        { type: 'action', action: ROUTER_CANCEL },
        { type: 'router', event: 'NavigationCancel', url: '/load' },
      ]);
      done();
    });
  });

  it('should support cancellation of initial navigation when canLoad guard rejects', (done: any) => {
    const reducer = (state: any, action: RouterAction<any>) => {
      const r = routerReducer(state, action);
      return r && r.state
        ? { url: r.state.url, navigationId: r.navigationId }
        : null;
    };

    createTestModule({
      reducers: { routerReducer, reducer },
      canLoad: () => Promise.reject('boom'),
    });

    const router: Router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore();

    router
      .navigateByUrl('/load')
      .then(() => {
        fail(`Shouldn't be called`);
      })
      .catch(err => {
        expect(err).toBe('boom');

        expect(log).toEqual([
          { type: 'store', state: null }, // initial state
          { type: 'store', state: null }, // ROUTER_REQEST event in the store
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/load' },
          { type: 'store', state: { url: '', navigationId: 1 } },
          { type: 'action', action: ROUTER_ERROR },
          { type: 'router', event: 'NavigationError', url: '/load' },
        ]);

        done();
      });
  });

  function shouldSupportCustomSerializer(
    serializerThroughConfig: boolean,
    done: Function
  ) {
    interface SerializedState {
      url: string;
      params: any;
    }

    const reducer = (
      state: any,
      action: RouterAction<any, SerializedState>
    ) => {
      const r = routerReducer<SerializedState>(state, action);
      return r && r.state
        ? {
            url: r.state.url,
            navigationId: r.navigationId,
            params: r.state.params,
          }
        : null;
    };

    @Injectable()
    class CustomSerializer implements RouterStateSerializer<SerializedState> {
      constructor(store: Store<any>) {
        // Requiring store to test Serializer with injected arguments works.
      }
      serialize(routerState: RouterStateSnapshot): SerializedState {
        const url = `${routerState.url}-custom`;
        const params = { test: 1 };

        return { url, params };
      }
    }

    if (serializerThroughConfig) {
      createTestModule({
        reducers: { routerReducer, reducer },
        config: { serializer: CustomSerializer },
      });
    } else {
      const providers = [
        { provide: RouterStateSerializer, useClass: CustomSerializer },
      ];
      createTestModule({ reducers: { routerReducer, reducer }, providers });
    }

    const router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore();

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: null }, // ROUTER_REQUEST event in the store
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/next' },
          {
            type: 'store',
            state: {
              url: '/next-custom',
              navigationId: 2,
              params: { test: 1 },
            },
          },
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },
          { type: 'store', state: null }, // ROUTER_NAVIGATED event in the store
          { type: 'action', action: ROUTER_NAVIGATED },
          { type: 'router', event: 'NavigationEnd', url: '/next' },
        ]);
        log.splice(0);
        done();
      });
  }

  it('should support a custom RouterStateSnapshot serializer via provider', (done: any) => {
    shouldSupportCustomSerializer(false, done);
  });

  it('should support a custom RouterStateSnapshot serializer via config', (done: any) => {
    shouldSupportCustomSerializer(true, done);
  });

  it('should support event during an async canActivate guard', (done: any) => {
    createTestModule({
      reducers: { routerReducer },
      canActivate: () => {
        store.dispatch({ type: 'USER_EVENT' });
        return store.pipe(
          take(1),
          mapTo(true)
        );
      },
    });

    const router: Router = TestBed.get(Router);
    const store: Store<any> = TestBed.get(Store);
    const log = logOfRouterAndActionsAndStore();

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: undefined }, // after ROUTER_REQUEST
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'store', state: undefined }, // after ROUTER_NAVIGATION
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'store', state: undefined }, // after USER_EVENT
          { type: 'action', action: 'USER_EVENT' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },
          { type: 'store', state: undefined }, // after ROUTER_NAVIGATED
          { type: 'action', action: ROUTER_NAVIGATED },
          { type: 'router', event: 'NavigationEnd', url: '/next' },
        ]);

        done();
      });
  });

  it('should work when defining state key', (done: any) => {
    const reducer = (state: string = '', action: RouterAction<any>) => {
      if (action.type === ROUTER_NAVIGATION) {
        return action.payload.routerState.url.toString();
      } else {
        return state;
      }
    };

    createTestModule({
      reducers: { 'router-reducer': reducer },
      config: { stateKey: 'router-reducer' },
    });

    const router: Router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore({ stateKey: 'router-reducer' });

    router
      .navigateByUrl('/')
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: '' }, // init event. has nothing to do with the router
          { type: 'store', state: '' }, // ROUTER_REQUEST event in the store
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/' },
          { type: 'store', state: '/' }, // ROUTER_NAVIGATION event in the store
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/' },
          { type: 'router', event: 'GuardsCheckStart', url: '/' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/' },
          { type: 'router', event: 'ResolveStart', url: '/' },
          { type: 'router', event: 'ResolveEnd', url: '/' },
          { type: 'store', state: '/' }, // ROUTER_NAVIGATED event in the store
          { type: 'action', action: ROUTER_NAVIGATED },
          { type: 'router', event: 'NavigationEnd', url: '/' },
        ]);
      })
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: '/' },
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'store', state: '/next' },
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },
          { type: 'store', state: '/next' },
          { type: 'action', action: ROUTER_NAVIGATED },
          { type: 'router', event: 'NavigationEnd', url: '/next' },
        ]);

        done();
      });
  });

  it('should work when defining state selector', (done: any) => {
    const reducer = (state: string = '', action: RouterAction<any>) => {
      if (action.type === ROUTER_NAVIGATION) {
        return action.payload.routerState.url.toString();
      } else {
        return state;
      }
    };

    createTestModule({
      reducers: { routerReducer: reducer },
      config: { stateKey: (state: any) => state.routerReducer },
    });

    const router: Router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore({
      stateKey: (state: any) => state.routerReducer,
    });

    router
      .navigateByUrl('/')
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: '' }, // init event. has nothing to do with the router
          { type: 'store', state: '' }, // ROUTER_REQUEST event in the store
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/' },
          { type: 'store', state: '/' }, // ROUTER_NAVIGATION event in the store
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/' },
          { type: 'router', event: 'GuardsCheckStart', url: '/' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/' },
          { type: 'router', event: 'ResolveStart', url: '/' },
          { type: 'router', event: 'ResolveEnd', url: '/' },
          { type: 'store', state: '/' }, // ROUTER_NAVIGATED event in the store
          { type: 'action', action: ROUTER_NAVIGATED },
          { type: 'router', event: 'NavigationEnd', url: '/' },
        ]);
      })
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: '/' },
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'store', state: '/next' },
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },
          { type: 'store', state: '/next' },
          { type: 'action', action: ROUTER_NAVIGATED },
          { type: 'router', event: 'NavigationEnd', url: '/next' },
        ]);

        done();
      });
  });

  it('should continue to react to navigation after state initiates router change', (done: Function) => {
    const reducer = (state: any = { state: { url: '/' } }, action: any) => {
      if (action.type === ROUTER_NAVIGATION) {
        return { state: { url: action.payload.routerState.url.toString() } };
      } else {
        return state;
      }
    };

    createTestModule({
      reducers: { reducer },
      config: { stateKey: 'reducer' },
    });

    const router: Router = TestBed.get(Router);
    const store = TestBed.get(Store);
    const log = logOfRouterAndActionsAndStore();

    store.dispatch({
      type: ROUTER_NAVIGATION,
      payload: { routerState: { url: '/next' } },
    });
    waitForNavigation(router)
      .then(() => {
        router.navigate(['/']);
        return waitForNavigation(router);
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: { state: { url: '/' } } },
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'store', state: { state: { url: '/next' } } },
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },
          { type: 'router', event: 'NavigationEnd', url: '/next' },
          { type: 'store', state: { state: { url: '/next' } } },
          { type: 'action', action: ROUTER_REQUEST },
          { type: 'router', event: 'NavigationStart', url: '/' },
          { type: 'store', state: { state: { url: '/' } } },
          { type: 'action', action: ROUTER_NAVIGATION },
          { type: 'router', event: 'RoutesRecognized', url: '/' },
          { type: 'router', event: 'GuardsCheckStart', url: '/' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/' },
          { type: 'router', event: 'ResolveStart', url: '/' },
          { type: 'router', event: 'ResolveEnd', url: '/' },
          { type: 'store', state: { state: { url: '/' } } },
          { type: 'action', action: ROUTER_NAVIGATED },
          { type: 'router', event: 'NavigationEnd', url: '/' },
        ]);
        done();
      });
  });

  it('should dispatch ROUTER_NAVIGATION later when config options set to true', () => {
    const reducer = (state: string = '', action: RouterAction<any>) => {
      if (action.type === ROUTER_NAVIGATION) {
        return action.payload.routerState.url.toString();
      } else {
        return state;
      }
    };

    createTestModule({
      reducers: { reducer },
      config: { navigationActionTiming: NavigationActionTiming.PostActivation },
    });

    const router: Router = TestBed.get(Router);
    const log = logOfRouterAndActionsAndStore();

    router.navigateByUrl('/').then(() => {
      expect(log).toEqual([
        { type: 'store', state: '' }, // init event. has nothing to do with the router
        { type: 'store', state: '' }, // ROUTER_REQUEST event in the store
        { type: 'action', action: ROUTER_REQUEST },
        { type: 'router', event: 'NavigationStart', url: '/' },
        { type: 'router', event: 'RoutesRecognized', url: '/' },
        /* new Router Lifecycle in Angular 4.3 */
        { type: 'router', event: 'GuardsCheckStart', url: '/' },
        { type: 'router', event: 'GuardsCheckEnd', url: '/' },
        { type: 'router', event: 'ResolveStart', url: '/' },
        { type: 'router', event: 'ResolveEnd', url: '/' },
        { type: 'store', state: '/' }, // ROUTER_NAVIGATION event in the store
        { type: 'action', action: ROUTER_NAVIGATION },
        { type: 'store', state: '/' }, // ROUTER_NAVIGATED event in the store
        { type: 'action', action: ROUTER_NAVIGATED },
        { type: 'router', event: 'NavigationEnd', url: '/' },
      ]);
    });
  });
});

function waitForNavigation(router: Router, event: any = NavigationEnd) {
  return router.events
    .pipe(
      filter(e => e instanceof event),
      first()
    )
    .toPromise();
}

/**
 * Logs the events of router, store and actions$.
 * Note: Because of the synchronous nature of many of those events, it may sometimes
 * appear that the order is "mixed" up even if its correct.
 * Example: router event is fired -> store is updated -> store log appears before router log
 * Also, actions$ always fires the next action AFTER the store is updated
 */
function logOfRouterAndActionsAndStore(
  options: { stateKey: StateKeyOrSelector } = {
    stateKey: 'reducer',
  }
): any[] {
  const router: Router = TestBed.get(Router);
  const store: Store<any> = TestBed.get(Store);
  // Not using effects' Actions to avoid @ngrx/effects dependency
  const actions$: ScannedActionsSubject = TestBed.get(ScannedActionsSubject);
  const log: any[] = [];
  router.events.subscribe(e => {
    if (e.hasOwnProperty('url')) {
      log.push({
        type: 'router',
        event: e.constructor.name,
        url: (<any>e).url.toString(),
      });
    }
  });
  actions$.subscribe(action =>
    log.push({ type: 'action', action: action.type })
  );
  store.subscribe(store => {
    if (typeof options.stateKey === 'function') {
      log.push({ type: 'store', state: options.stateKey(store) });
    } else {
      log.push({ type: 'store', state: store[options.stateKey] });
    }
  });
  return log;
}
