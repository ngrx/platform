import { Component, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { Router, RouterModule, NavigationEnd } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import { ROUTER_NAVIGATION, ROUTER_CANCEL, ROUTER_ERROR, StoreRouterConnectingModule, routerReducer } from "../src/index";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';

describe('integration spec', () => {
  beforeEach(() => {
    document.body.appendChild(document.createElement("test-app"));
  });

  it('should work', (done) => {
    const reducer = (state: string = "", action: any) => {
      if (action.type === ROUTER_NAVIGATION) {
        return action.payload.routerState.url.toString();
      } else {
        return state;
      }
    };

    const ngModule = createNgModule({ reducers: { reducer } });

    platformBrowserDynamic().bootstrapModule(ngModule).then(ref => {
      const router: Router = ref.injector.get(Router);
      const store = ref.injector.get(Store);
      const log = logOfRouterAndStore(router, store);

      router.navigateByUrl("/").then(() => {
        expect(log).toEqual([
          { type: 'store', state: "" }, //init event. has nothing to do with the router
          { type: 'router', event: 'NavigationStart', url: '/' },
          { type: 'router', event: 'RoutesRecognized', url: '/' },
          { type: 'store', state: "/" }, // ROUTER_NAVIGATION event in the store
          { type: 'router', event: 'NavigationEnd', url: '/' }
        ]);

      }).then(() => {
        log.splice(0);
        return router.navigateByUrl("next");

      }).then(() => {
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'store', state: "/next" },
          { type: 'router', event: 'NavigationEnd', url: '/next' }
        ]);

        done();
      });
    });
  });

  it("should support preventing navigation", (done) => {
    const reducer = (state: string = "", action: any) => {
      if (action.type === ROUTER_NAVIGATION && action.payload.routerState.url.toString() === "/next") {
        throw new Error("You shall not pass!");
      } else {
        return state;
      }
    };
    const ngModule = createNgModule({ reducers: { reducer } });

    platformBrowserDynamic().bootstrapModule(ngModule).then(ref => {
      const router: Router = ref.injector.get(Router);
      const store = ref.injector.get(Store);
      const log = logOfRouterAndStore(router, store);

      router.navigateByUrl("/").then(() => {
        log.splice(0);
        return router.navigateByUrl("next");

      }).catch((e) => {
        expect(e.message).toEqual("You shall not pass!");
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'router', event: 'NavigationError', url: '/next' }
        ]);

        done();
      });
    });
  });

  it("should support rolling back if navigation gets canceled", (done) => {
    const reducer = (state: string = "", action: any): any => {
      console.log(action)
      if (action.type === ROUTER_NAVIGATION) {
        return { url: action.payload.routerState.url.toString(), lastAction: ROUTER_NAVIGATION };

      } else if (action.type === ROUTER_CANCEL) {
        return { url: action.payload.routerState.url.toString(), storeState: action.payload.storeState, lastAction: ROUTER_CANCEL };

      } else {
        return state;
      }
    };

    const ngModule = createNgModule({ reducers: { reducer }, canActivate: () => false });

    platformBrowserDynamic().bootstrapModule(ngModule).then(ref => {
      const router: Router = ref.injector.get(Router);
      const store = ref.injector.get(Store);
      const log = logOfRouterAndStore(router, store);

      router.navigateByUrl("/").then(() => {
        log.splice(0);
        return router.navigateByUrl("next");

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
  });

  it("should support rolling back if navigation errors", (done) => {
    const reducer = (state: string = "", action: any): any => {
      if (action.type === ROUTER_NAVIGATION) {
        return { url: action.payload.routerState.url.toString(), lastAction: ROUTER_NAVIGATION };

      } else if (action.type === ROUTER_ERROR) {
        return { url: action.payload.routerState.url.toString(), storeState: action.payload.storeState, lastAction: ROUTER_ERROR };

      } else {
        return state;
      }
    };

    const ngModule = createNgModule({ reducers: { reducer }, canActivate: () => { throw new Error("BOOM!"); } });

    platformBrowserDynamic().bootstrapModule(ngModule).then(ref => {
      const router: Router = ref.injector.get(Router);
      const store = ref.injector.get(Store);
      const log = logOfRouterAndStore(router, store);

      router.navigateByUrl("/").then(() => {
        log.splice(0);
        return router.navigateByUrl("next");

      }).catch((e) => {
        expect(e.message).toEqual("BOOM!");

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
  });

  it("should call navigateByUrl when resetting state of the routerReducer", (done) => {
    const reducer = (state: any, action: any) => {
      const r = routerReducer(state, action);
      return r && r.state ? ({ url: r.state.url, navigationId: r.navigationId }) : null;
    };

    const ngModule = createNgModule({ reducers: { routerReducer, reducer } });

    platformBrowserDynamic().bootstrapModule(ngModule).then(ref => {
      const router = ref.injector.get(Router);
      const store = ref.injector.get(Store);
      const log = logOfRouterAndStore(router, store);

      const routerReducerStates = [];
      store.subscribe(state => {
        if (state.routerReducer) {
          routerReducerStates.push(state.routerReducer);
        }
      });

      router.navigateByUrl("/").then(() => {
        log.splice(0);
        return router.navigateByUrl("next");

      }).then(() => {
        expect(log).toEqual([
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'store', state: { url: "/next", navigationId: 2 } },
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
          { type: 'store', state: { url: "/", navigationId: 1 } }, //restored
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
          { type: 'store', state: { url: "/next", navigationId: 2 } }, //restored
          { type: 'router', event: 'NavigationStart', url: '/next' },
          { type: 'router', event: 'RoutesRecognized', url: '/next' },
          { type: 'router', event: 'NavigationEnd', url: '/next' }
        ]);
        done();
      });
    });
  });
});

function waitForNavigation(router: Router): Promise<any> {
  return router.events.filter(e => e instanceof NavigationEnd).first().toPromise();
}

function createNgModule(opts: { reducers?: any, canActivate?: Function } = {}) {
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

  @NgModule({
    declarations: [AppCmp, SimpleCmp],
    imports: [
      BrowserModule,
      StoreModule.provideStore(opts.reducers),
      RouterModule.forRoot([
        { path: '', component: SimpleCmp },
        { path: 'next', component: SimpleCmp, canActivate: ["CanActivateNext"] }
      ], { useHash: true, initialNavigation: false }),
      StoreRouterConnectingModule
    ],
    providers: [
      { provide: "CanActivateNext", useValue: opts.canActivate || (() => true) }
    ],
    bootstrap: [AppCmp]
  })
  class TestAppModule {
  }

  return TestAppModule;
}

function logOfRouterAndStore(router: Router, store: Store<any>): any[] {
  const log = [];
  router.events.
    subscribe(e => log.push({ type: 'router', event: e.constructor.name, url: (<any>e).url.toString() }));
  store.subscribe(store => log.push({ type: 'store', state: store.reducer }));
  return log;
}