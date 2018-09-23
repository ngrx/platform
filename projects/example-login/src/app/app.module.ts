import { AppComponent } from './app.component';
import { AppRoutingModule } from '@app/app.routing';
import { AuthModule } from '@app/auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '@environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { metaReducers, reducers } from '@app/core/store/reducers';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from '@shared/notfound/notfound.component';
import { PortalModule } from './portal/portal.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    HttpModule,
    HttpClientModule,
    PortalModule,
    /**
     * StoreModule.forRoot is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.forRoot(reducers, { metaReducers }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store.
     */
    StoreRouterConnectingModule.forRoot(),

    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    StoreDevtoolsModule.instrument({
      name: 'NgRx Demo',
      logOnly: environment.production,
    }),

    /**
     * EffectsModule.forRoot() is imported once in the root module and
     * sets up the effects class timport { AuthModule } from './auth/auth.module';
o be initialized immediately when import { NotfoundComponent } from '@shared/notfound/notfound.component';
the
     * application starts.
     *
     * See: https://github.com/ngrx/platform/blob/master/docs/effects/api.md#forroot
     */
    EffectsModule.forRoot([]),

    /**
     * `provideDB` sets up @ngrx/db with the provided schema and makes the Database
     * service available.
     */
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
