import { StoreRouterConfig } from '../src/router_store_module';
import { Component, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  ROUTER_CANCEL,
  ROUTER_ERROR,
  ROUTER_NAVIGATION,
  RouterAction,
  routerReducer,
  StoreRouterConnectingModule,
  RouterStateSerializer,
} from '../src/index';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import { of } from 'rxjs/observable/of';

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
    const store = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

    router
      .navigateByUrl('/')
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: '' }, // init event. has nothing to do with the router
          { type: 'router', event: 'NavigationStart', url: '/' },
          { type: 'router', event: 'RoutesRecognized', url: '/' },
          { type: 'store', state: '/' }, // ROUTER_NAVIGATION event in the store
          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/' },
          { type: 'router', event: 'ResolveStart', url: '/' },
          { type: 'router', event: 'ResolveEnd', url: '/' },

          { type: 'router', event: 'NavigationEnd', url: '/' },
        ]);
      })
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'store', state: '/next' },

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

  it('should support preventing navigation', (done: any) => {
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
    const store = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

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

  it('should support rolling back if navigation gets canceled', (done: any) => {
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
    const store = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(r => {
        expect(r).toEqual(false);

        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          {
            type: 'store',
            state: { url: '/next', lastAction: ROUTER_NAVIGATION },
          },

          /* new Router Lifecycle in Angular 4.3 - m */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          // { type: 'router', event: 'ResolveStart', url: '/next' },
          // { type: 'router', event: 'ResolveEnd', url: '/next' },
          {
            type: 'store',
            state: {
              url: '/next',
              lastAction: ROUTER_CANCEL,
              storeState: { url: '/next', lastAction: ROUTER_NAVIGATION },
            },
          },
          { type: 'router', event: 'NavigationCancel', url: '/next' },
        ]);

        done();
      });
  });

  it('should support rolling back if navigation errors', (done: any) => {
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
    const store = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .catch(e => {
        expect(e.message).toEqual('BOOM!');

        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          {
            type: 'store',
            state: { url: '/next', lastAction: ROUTER_NAVIGATION },
          },

          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },

          {
            type: 'store',
            state: {
              url: '/next',
              lastAction: ROUTER_ERROR,
              storeState: { url: '/next', lastAction: ROUTER_NAVIGATION },
            },
          },
          { type: 'router', event: 'NavigationError', url: '/next' },
        ]);

        done();
      });
  });

  it('should call navigateByUrl when resetting state of the routerReducer', (
    done: any
  ) => {
    const reducer = (state: any, action: RouterAction<any>) => {
      const r = routerReducer(state, action);
      return r && r.state
        ? { url: r.state.url, navigationId: r.navigationId }
        : null;
    };

    createTestModule({ reducers: { routerReducer, reducer } });

    const router = TestBed.get(Router);
    const store = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

    const routerReducerStates: any[] = [];
    store.subscribe((state: any) => {
      if (state.routerReducer) {
        routerReducerStates.push(state.routerReducer);
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
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'store', state: { url: '/next', navigationId: 2 } },

          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },

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
            routerState: routerReducerStates[1].state,
            event: { id: routerReducerStates[1].navigationId },
          },
        });
        return waitForNavigation(router);
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: { url: '/next', navigationId: 2 } }, // restored
          { type: 'router', event: 'NavigationStart', url: '/next' },
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

  it('should support cancellation of initial navigation using canLoad guard', (
    done: any
  ) => {
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
    const store = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

    router.navigateByUrl('/load').then((r: boolean) => {
      expect(r).toBe(false);

      expect(log).toEqual([
        { type: 'store', state: null },
        { type: 'router', event: 'NavigationStart', url: '/load' },
        { type: 'store', state: null },
        { type: 'router', event: 'NavigationCancel', url: '/load' },
      ]);
      done();
    });

    it('should support a custom RouterStateSnapshot serializer ', (
      done: any
    ) => {
      const reducer = (state: any, action: RouterAction<any>) => {
        const r = routerReducer(state, action);
        return r && r.state
          ? { url: r.state.url, navigationId: r.navigationId }
          : null;
      };

      class CustomSerializer
        implements RouterStateSerializer<{ url: string; params: any }> {
        serialize(routerState: RouterStateSnapshot) {
          const url = `${routerState.url}-custom`;
          const params = { test: 1 };

          return { url, params };
        }
      }

      const providers = [
        { provide: RouterStateSerializer, useClass: CustomSerializer },
      ];

      createTestModule({ reducers: { routerReducer, reducer }, providers });

      const router = TestBed.get(Router);
      const store = TestBed.get(Store);
      const log = logOfRouterAndStore(router, store);

      router
        .navigateByUrl('/')
        .then(() => {
          log.splice(0);
          return router.navigateByUrl('next');
        })
        .then(() => {
          expect(log).toEqual([
            { type: 'router', event: 'NavigationStart', url: '/next' },
            { type: 'router', event: 'RoutesRecognized', url: '/next' },
            {
              type: 'store',
              state: {
                url: '/next-custom',
                navigationId: 2,
                params: { test: 1 },
              },
            },
            { type: 'router', event: 'NavigationEnd', url: '/next' },
          ]);
          log.splice(0);
          done();
        });
    });
  });

  it('should support event during an async canActivate guard', (done: any) => {
    createTestModule({
      reducers: { routerReducer },
      canActivate: () => {
        store.dispatch({ type: 'USER_EVENT' });
        return store.take(1).mapTo(true);
      },
    });

    const router: Router = TestBed.get(Router);
    const store: Store<any> = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

    router
      .navigateByUrl('/')
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'store', state: undefined }, // after ROUTER_NAVIGATION
          /* new Router Lifecycle in Angular 4.3 */
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'store', state: undefined }, // after USER_EVENT
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },
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
      reducers: { reducer },
      config: { stateKey: 'router-reducer' },
    });

    const router: Router = TestBed.get(Router);
    const store = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

    router
      .navigateByUrl('/')
      .then(() => {
        expect(log).toEqual([
          { type: 'store', state: '' }, // init event. has nothing to do with the router
          { type: 'router', event: 'NavigationStart', url: '/' },
          { type: 'router', event: 'RoutesRecognized', url: '/' },
          { type: 'store', state: '/' }, // ROUTER_NAVIGATION event in the store
          { type: 'router', event: 'GuardsCheckStart', url: '/' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/' },
          { type: 'router', event: 'ResolveStart', url: '/' },
          { type: 'router', event: 'ResolveEnd', url: '/' },
          { type: 'router', event: 'NavigationEnd', url: '/' },
        ]);
      })
      .then(() => {
        log.splice(0);
        return router.navigateByUrl('next');
      })
      .then(() => {
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'store', state: '/next' },
          { type: 'router', event: 'GuardsCheckStart', url: '/next' },
          { type: 'router', event: 'GuardsCheckEnd', url: '/next' },
          { type: 'router', event: 'ResolveStart', url: '/next' },
          { type: 'router', event: 'ResolveEnd', url: '/next' },
          { type: 'router', event: 'NavigationEnd', url: '/next' },
        ]);

        done();
      });
  });
});

function createTestModule(
  opts: {
    reducers?: any;
    canActivate?: Function;
    canLoad?: Function;
    providers?: Provider[];
    config?: StoreRouterConfig;
  } = {}
) {
  @Component({
    selector: 'test-app',
    template: '<router-outlet></router-outlet>',
  })
  class AppCmp {}

  @Component({
    selector: 'pagea-cmp',
    template: 'pagea-cmp',
  })
  class SimpleCmp {}

  TestBed.configureTestingModule({
    declarations: [AppCmp, SimpleCmp],
    imports: [
      StoreModule.forRoot(opts.reducers),
      RouterTestingModule.withRoutes([
        { path: '', component: SimpleCmp },
        {
          path: 'next',
          component: SimpleCmp,
          canActivate: ['CanActivateNext'],
        },
        {
          path: 'load',
          loadChildren: 'test',
          canLoad: ['CanLoadNext'],
        },
      ]),
      StoreRouterConnectingModule.forRoot(opts.config),
    ],
    providers: [
      {
        provide: 'CanActivateNext',
        useValue: opts.canActivate || (() => true),
      },
      {
        provide: 'CanLoadNext',
        useValue: opts.canLoad || (() => true),
      },
      opts.providers || [],
    ],
  });

  TestBed.createComponent(AppCmp);
}

function waitForNavigation(router: Router): Promise<any> {
  return router.events
    .filter(e => e instanceof NavigationEnd)
    .first()
    .toPromise();
}

function logOfRouterAndStore(router: Router, store: Store<any>): any[] {
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
  store.subscribe(store => log.push({ type: 'store', state: store.reducer }));
  return log;
}
