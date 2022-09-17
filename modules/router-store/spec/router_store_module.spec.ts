import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import {
  FullRouterStateSerializer,
  MinimalRouterStateSerializer,
  RouterAction,
  routerReducer,
  RouterReducerState,
  RouterState,
  RouterStateSerializer,
} from '@ngrx/router-store';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { filter, withLatestFrom } from 'rxjs/operators';

import { createTestModule } from './utils';
import { StoreRouterConnectingService } from '../src/store_router_connecting.service';

describe('Router Store Module', () => {
  describe('with defining state key', () => {
    const customStateKey = 'router-reducer';
    let storeRouterConnectingService: StoreRouterConnectingService;
    let store: Store<State>;
    let router: Router;

    interface State {
      [customStateKey]: RouterReducerState;
    }

    beforeEach(() => {
      createTestModule({
        reducers: {
          [customStateKey]: routerReducer,
        },
        config: {
          stateKey: customStateKey,
        },
      });

      store = TestBed.inject(Store);
      router = TestBed.inject(Router);
      storeRouterConnectingService = TestBed.inject(
        StoreRouterConnectingService
      );
    });

    it('should have custom state key as own property', () => {
      expect((<any>storeRouterConnectingService).stateKey).toBe(customStateKey);
    });

    it('should call navigateIfNeeded with args selected by custom state key', (done: any) => {
      let logs: any[] = [];
      store
        .pipe(select(customStateKey), withLatestFrom(store))
        .subscribe(([routerStoreState, storeState]) => {
          logs.push([routerStoreState, storeState]);
        });

      spyOn(
        storeRouterConnectingService,
        'navigateIfNeeded' as never
      ).and.callThrough();
      logs = [];

      // this dispatches `@ngrx/router-store/navigation` action
      // and store emits its payload.
      router.navigateByUrl('/').then(() => {
        const actual = (<any>(
          storeRouterConnectingService
        )).navigateIfNeeded.calls.allArgs();

        expect(actual.length).toBe(1);
        expect(actual[0]).toEqual(logs[0]);
        done();
      });
    });
  });

  describe('with defining state selector', () => {
    const customStateKey = 'routerReducer';
    const customStateSelector = (state: State) => state.routerReducer;

    let storeRouterConnectingService: StoreRouterConnectingService;
    let store: Store<State>;
    let router: Router;

    interface State {
      [customStateKey]: RouterReducerState;
    }

    beforeEach(() => {
      createTestModule({
        reducers: {
          [customStateKey]: routerReducer,
        },
        config: {
          stateKey: customStateSelector,
        },
      });

      store = TestBed.inject(Store);
      router = TestBed.inject(Router);
      storeRouterConnectingService = TestBed.inject(
        StoreRouterConnectingService
      );
    });

    it('should have same state selector as own property', () => {
      expect((<any>storeRouterConnectingService).stateKey).toBe(
        customStateSelector
      );
    });

    it('should call navigateIfNeeded with args selected by custom state selector', (done: any) => {
      let logs: any[] = [];
      store
        .pipe(select(customStateSelector), withLatestFrom(store))
        .subscribe(([routerStoreState, storeState]) => {
          logs.push([routerStoreState, storeState]);
        });

      spyOn(
        storeRouterConnectingService,
        'navigateIfNeeded' as never
      ).and.callThrough();
      logs = [];

      // this dispatches `@ngrx/router-store/navigation` action
      // and store emits its payload.
      router.navigateByUrl('/').then(() => {
        const actual = (<any>(
          storeRouterConnectingService
        )).navigateIfNeeded.calls.allArgs();

        expect(actual.length).toBe(1);
        expect(actual[0]).toEqual(logs[0]);
        done();
      });
    });
  });

  describe('routerState', () => {
    function setup(routerState?: RouterState, serializer?: any) {
      createTestModule({
        reducers: {},
        config: {
          routerState,
          serializer,
        },
      });

      return {
        actions: TestBed.inject(ActionsSubject),
        router: TestBed.inject(Router),
        serializer: TestBed.inject(RouterStateSerializer),
      };
    }

    const onlyRouterActions = (a: any): a is RouterAction<any, any> =>
      a.payload && a.payload.event;

    describe('Full', () => {
      it('should dispatch the full event', (done: any) => {
        const { actions, router } = setup(RouterState.Full);
        actions.pipe(filter(onlyRouterActions)).subscribe(({ payload }) => {
          expect(payload.event instanceof RouterEvent).toBe(true);
          done();
        });

        router.navigateByUrl('/');
      });

      it('should use the default router serializer by default', () => {
        const { serializer } = setup();
        expect(serializer).toEqual(new MinimalRouterStateSerializer());
      });

      it('should use the default router serializer if minimal state option is passed in', () => {
        const { serializer } = setup(RouterState.Minimal);
        expect(serializer).toEqual(new MinimalRouterStateSerializer());
      });

      it('should use the full router serializer if full state option is passed in', () => {
        const { serializer } = setup(RouterState.Full);
        expect(serializer).toEqual(new FullRouterStateSerializer());
      });

      it('should use the provided serializer if one is provided', () => {
        const { serializer } = setup(
          RouterState.Full,
          FullRouterStateSerializer
        );
        expect(serializer).toEqual(new FullRouterStateSerializer());
      });
    });

    describe('Minimal', () => {
      it('should dispatch the navigation id with url', (done: any) => {
        const { actions, router } = setup(RouterState.Minimal);
        actions
          .pipe(filter(onlyRouterActions))
          .subscribe(({ payload }: any) => {
            expect(payload.event instanceof RouterEvent).toBe(false);
            expect(payload.event).toEqual({ id: 1, url: '/' });
            done();
          });

        router.navigateByUrl('/');
      });

      it('should dispatch the navigation with urlAfterRedirects', (done: any) => {
        const { actions, router } = setup(RouterState.Minimal);
        actions
          .pipe(
            filter(onlyRouterActions),
            // wait until NavigationEnd router event
            filter(
              ({ payload }) =>
                !!(payload.event as NavigationEnd).urlAfterRedirects
            )
          )
          .subscribe(({ payload }: any) => {
            expect(payload.event instanceof RouterEvent).toBe(false);
            expect(payload.event).toEqual({
              id: 1,
              url: '/redirect',
              urlAfterRedirects: '/next',
            });
            done();
          });

        router.navigateByUrl('/redirect');
      });

      it('should use the minimal router serializer', () => {
        const { serializer } = setup(RouterState.Minimal);
        expect(serializer).toEqual(new FullRouterStateSerializer());
      });

      it('should use the provided serializer if one is provided', () => {
        const { serializer } = setup(
          RouterState.Minimal,
          MinimalRouterStateSerializer
        );
        expect(serializer).toEqual(new MinimalRouterStateSerializer());
      });
    });
  });
});
