import { Component, Provider, ɵConsole as Console } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { StoreRouterConfig, StoreRouterConnectingModule } from '../src';

export function createTestModule(
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
    selector: 'page-cmp',
    template: 'page-cmp',
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
      {
        provide: Console,
        useValue: {
          log: jasmine.createSpy('Console.log'),
          warn: jasmine.createSpy('Console.warn'),
        },
      },
      opts.providers || [],
    ],
  });

  TestBed.createComponent(AppCmp);
}
