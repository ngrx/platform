import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { Selector } from '@ngrx/store';
import { RouterReducerState } from './reducer';
import {
  RouterStateSerializer,
  BaseRouterStoreState,
} from './serializers/base';
import {
  FullRouterStateSerializer,
  SerializedRouterStateSnapshot,
} from './serializers/full_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';
import { StoreRouterConnectingService } from './store_router_connecting.service';
import {
  _createRouterConfig,
  _ROUTER_CONFIG,
  ROUTER_CONFIG,
  RouterState,
  StoreRouterConfig,
} from './router_store_config';
import { _initRouterStore } from './init_router_store';

/**
 * Connects RouterModule with StoreModule.
 *
 * During the navigation, before any guards or resolvers run, the router will dispatch
 * a ROUTER_NAVIGATION action, which has the following signature:
 *
 * ```
 * export type RouterNavigationPayload = {
 *   routerState: SerializedRouterStateSnapshot,
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
 *     StoreModule.forRoot(mapOfReducers),
 *     RouterModule.forRoot([
 *       { path: '', component: SimpleCmp },
 *       { path: 'next', component: SimpleCmp }
 *     ]),
 *     StoreRouterConnectingModule.forRoot()
 *   ],
 *   bootstrap: [AppCmp]
 * })
 * export class AppModule {
 * }
 * ```
 */
@NgModule({})
export class StoreRouterConnectingModule {
  static forRoot<
    T extends BaseRouterStoreState = SerializedRouterStateSnapshot
  >(
    config: StoreRouterConfig<T> = {}
  ): ModuleWithProviders<StoreRouterConnectingModule> {
    return {
      ngModule: StoreRouterConnectingModule,
      providers: [
        { provide: _ROUTER_CONFIG, useValue: config },
        {
          provide: ROUTER_CONFIG,
          useFactory: _createRouterConfig,
          deps: [_ROUTER_CONFIG],
        },
        {
          provide: RouterStateSerializer,
          useClass: config.serializer
            ? config.serializer
            : config.routerState === RouterState.Full
            ? FullRouterStateSerializer
            : MinimalRouterStateSerializer,
        },
        _initRouterStore,
      ],
    };
  }
}
