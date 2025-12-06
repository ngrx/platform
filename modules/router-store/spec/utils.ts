import { Component, Provider, Type, ɵConsole as Console } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { StoreRouterConfig, StoreRouterConnectingModule } from '../src';
import { RouterOutlet } from '@angular/router';
import { vi } from 'vitest';

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
    imports: [RouterOutlet],
  })
  class AppComponent {}

  @Component({
    selector: 'page-cmp',
    template: 'page-cmp',
  })
  class SimpleComponent {}

  TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot(opts.reducers),
      RouterTestingModule.withRoutes([
        { path: '', component: SimpleComponent },
        {
          path: 'next',
          component: SimpleComponent,
          canActivate: ['CanActivateNext'],
        },
        {
          path: 'load',
          loadChildren: () => Promise.resolve({} as Type<any>),
          canLoad: ['CanLoadNext'],
        },
        {
          path: 'redirect',
          pathMatch: 'full',
          redirectTo: 'next',
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
          log: vi.fn(),
          warn: vi.fn(),
        },
      },
      opts.providers || [],
    ],
  });

  TestBed.createComponent(AppComponent);
}
