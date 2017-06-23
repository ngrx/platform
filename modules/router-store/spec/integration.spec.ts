import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {NavigationEnd, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {Store, StoreModule} from '@ngrx/store';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATION, routerReducer, StoreRouterConnectingModule, RouterNavigationAction, RouterCancelAction, RouterAction } from '../src/index';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';

describe('integration spec', () => {
  it('should work', (done) => {
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

    router.navigateByUrl('/').then(() => {
      expect(log).toEqual([
        { type: 'store', state: '' }, // init event. has nothing to do with the router
        { type: 'router', event: 'NavigationStart', url: '/' },
        { type: 'router', event: 'RoutesRecognized', url: '/' },
        { type: 'store', state: '/' }, // ROUTER_NAVIGATION event in the store
        { type: 'router', event: 'NavigationEnd', url: '/' }
      ]);
    }).then(() => {
      log.splice(0);
      return router.navigateByUrl('next');

    }).then(() => {
      expect(log).toEqual([
        { type: 'router', event: 'NavigationStart', url: '/next' },
        { type: 'router', event: 'RoutesRecognized', url: '/next' },
        { type: 'store', state: '/next' },
        { type: 'router', event: 'NavigationEnd', url: '/next' }
      ]);

      done();
    });
  });

  it('should support preventing navigation', (done) => {
    const reducer = (state: string = '', action: RouterAction<any>) => {
      if (action.type === ROUTER_NAVIGATION && action.payload.routerState.url.toString() === '/next') {
        throw new Error('You shall not pass!');
      } else {
        return state;
      }
    };

    createTestModule({ reducers: { reducer } });

    const router: Router = TestBed.get(Router);
    const store = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

    router.navigateByUrl('/').then(() => {
      log.splice(0);
      return router.navigateByUrl('next');

    }).catch((e) => {
      expect(e.message).toEqual('You shall not pass!');
      expect(log).toEqual([
        { type: 'router', event: 'NavigationStart', url: '/next' },
        { type: 'router', event: 'RoutesRecognized', url: '/next' },
        { type: 'router', event: 'NavigationError', url: '/next' }
      ]);

      done();
    });
  });

  it('should support rolling back if navigation gets canceled', (done) => {
    const reducer = (state: string = '', action: RouterAction<any>): any => {
      if (action.type === ROUTER_NAVIGATION) {
        return { url: action.payload.routerState.url.toString(), lastAction: ROUTER_NAVIGATION };

      } else if (action.type === ROUTER_CANCEL) {
        return { url: action.payload.routerState.url.toString(), storeState: action.payload.storeState, lastAction: ROUTER_CANCEL };

      } else {
        return state;
      }
    };

    createTestModule({ reducers: { reducer }, canActivate: () => false });

    const router: Router = TestBed.get(Router);
    const store = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

    router.navigateByUrl('/').then(() => {
      log.splice(0);
      return router.navigateByUrl('next');

    }).then((r) => {
      expect(r).toEqual(false);
      expect(log).toEqual([
        { type: 'router', event: 'NavigationStart', url: '/next' },
        { type: 'router', event: 'RoutesRecognized', url: '/next' },
        { type: 'store', state: { url: '/next', lastAction: ROUTER_NAVIGATION } },
        { type: 'store', state: { url: '/next', lastAction: ROUTER_CANCEL, storeState: { reducer: { url: '/next', lastAction: ROUTER_NAVIGATION } } } },
        { type: 'router', event: 'NavigationCancel', url: '/next' }
      ]);

      done();
    });
  });

  it('should support rolling back if navigation errors', (done) => {
    const reducer = (state: string = '', action: RouterAction<any>): any => {
      if (action.type === ROUTER_NAVIGATION) {
        return { url: action.payload.routerState.url.toString(), lastAction: ROUTER_NAVIGATION };

      } else if (action.type === ROUTER_ERROR) {
        return { url: action.payload.routerState.url.toString(), storeState: action.payload.storeState, lastAction: ROUTER_ERROR };

      } else {
        return state;
      }
    };

    createTestModule({ reducers: { reducer }, canActivate: () => { throw new Error('BOOM!'); } });

    const router: Router = TestBed.get(Router);
    const store = TestBed.get(Store);
    const log = logOfRouterAndStore(router, store);

    router.navigateByUrl('/').then(() => {
      log.splice(0);
      return router.navigateByUrl('next');

    }).catch((e) => {
      expect(e.message).toEqual('BOOM!');

      expect(log).toEqual([
        { type: 'router', event: 'NavigationStart', url: '/next' },
        { type: 'router', event: 'RoutesRecognized', url: '/next' },
        { type: 'store', state: { url: '/next', lastAction: ROUTER_NAVIGATION } },
        { type: 'store', state: { url: '/next', lastAction: ROUTER_ERROR, storeState: { reducer: { url: '/next', lastAction: ROUTER_NAVIGATION } } } },
        { type: 'router', event: 'NavigationError', url: '/next' }
      ]);

      done();
    });
  });

  it('should call navigateByUrl when resetting state of the routerReducer', (done) => {
    const reducer = (state: any, action: RouterAction<any>) => {
      const r = routerReducer(state, action);
      return r && r.state ? ({ url: r.state.url, navigationId: r.navigationId }) : null;
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

    router.navigateByUrl('/').then(() => {
      log.splice(0);
      return router.navigateByUrl('next');

    }).then(() => {
      expect(log).toEqual([
        { type: 'router', event: 'NavigationStart', url: '/next' },
        { type: 'router', event: 'RoutesRecognized', url: '/next' },
        { type: 'store', state: { url: '/next', navigationId: 2 } },
        { type: 'router', event: 'NavigationEnd', url: '/next' }
      ]);
      log.splice(0);

      store.dispatch({
        type: ROUTER_NAVIGATION,
        payload: { routerState: routerReducerStates[0].state, event: { id: routerReducerStates[0].navigationId } }
      });
      return waitForNavigation(router);

    }).then(() => {
      expect(log).toEqual([
        { type: 'router', event: 'NavigationStart', url: '/' },
        { type: 'store', state: { url: '/', navigationId: 1 } }, // restored
        { type: 'router', event: 'RoutesRecognized', url: '/' },
        { type: 'router', event: 'NavigationEnd', url: '/' }
      ]);
      log.splice(0);

    }).then(() => {
      store.dispatch({
        type: ROUTER_NAVIGATION,
        payload: { routerState: routerReducerStates[1].state, event: { id: routerReducerStates[1].navigationId } }
      });
      return waitForNavigation(router);

    }).then(() => {
      expect(log).toEqual([
        { type: 'store', state: { url: '/next', navigationId: 2 } }, // restored
        { type: 'router', event: 'NavigationStart', url: '/next' },
        { type: 'router', event: 'RoutesRecognized', url: '/next' },
        { type: 'router', event: 'NavigationEnd', url: '/next' }
      ]);
      done();
    });
  });
});

function createTestModule(opts: { reducers?: any, canActivate?: Function } = {}) {
  @Component({
    selector: 'test-app',
    template: '<router-outlet></router-outlet>'
  })
  class AppCmp {
  }

  @Component({
    selector: 'pagea-cmp',
    template: 'pagea-cmp'
  })
  class SimpleCmp { }

  TestBed.configureTestingModule({
    declarations: [AppCmp, SimpleCmp],
    imports: [
      StoreModule.forRoot(opts.reducers),
      RouterTestingModule.withRoutes([
        { path: '', component: SimpleCmp },
        { path: 'next', component: SimpleCmp, canActivate: ['CanActivateNext'] }
      ]),
      StoreRouterConnectingModule
    ],
    providers: [
      { provide: 'CanActivateNext', useValue: opts.canActivate || (() => true) }
    ],
  });

  TestBed.createComponent(AppCmp);
}

function waitForNavigation(router: Router): Promise<any> {
  return router.events.filter(e => e instanceof NavigationEnd).first().toPromise();
}

function logOfRouterAndStore(router: Router, store: Store<any>): any[] {
  const log: any[] = [];
  router.events.
    subscribe(e => log.push({ type: 'router', event: e.constructor.name, url: (<any>e).url.toString() }));
  store.subscribe(store => log.push({ type: 'store', state: store.reducer }));
  return log;
}
