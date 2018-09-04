import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  routerReducer,
  RouterReducerState,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { select, Store, StoreModule } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'test-app',
  template: '<router-outlet></router-outlet>',
})
class AppCmp {}

@Component({
  selector: 'page-cmp',
  template: 'page-cmp',
})
class SimpleCmp {}

describe('Router Store Module', () => {
  describe('with defining state-key', () => {
    const customStateKey = 'router-reducer';
    let storeRouterConnectingModule: StoreRouterConnectingModule;
    let store: Store<State>;
    let router: Router;

    interface State {
      [customStateKey]: RouterReducerState;
    }

    beforeEach(() => {
      const reducers: any = {
        [customStateKey]: routerReducer,
      };

      TestBed.configureTestingModule({
        declarations: [AppCmp, SimpleCmp],
        imports: [
          StoreModule.forRoot(reducers),
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
          StoreRouterConnectingModule.forRoot({
            stateKey: customStateKey,
          }),
        ],
      });

      store = TestBed.get(Store);
      router = TestBed.get(Router);
      storeRouterConnectingModule = TestBed.get(StoreRouterConnectingModule);
    });

    it('should have custom state key as own property', () => {
      expect((<any>storeRouterConnectingModule).stateKey).toBe(customStateKey);
    });

    it('should call navigateIfNeeded with args selected by custom state key', (done: any) => {
      let logs: any[] = [];
      store
        .pipe(
          select(customStateKey),
          withLatestFrom(store)
        )
        .subscribe(([routerStoreState, storeState]) => {
          logs.push([routerStoreState, storeState]);
        });

      spyOn(storeRouterConnectingModule, 'navigateIfNeeded').and.callThrough();
      logs = [];

      // this dispatches `@ngrx/router-store/navigation` action
      // and store emits its payload.
      router.navigateByUrl('/').then(() => {
        const actual = (<any>(
          storeRouterConnectingModule
        )).navigateIfNeeded.calls.allArgs();

        expect(actual.length).toBe(1);
        expect(actual[0]).toEqual(logs[0]);
        done();
      });
    });
  });
});
