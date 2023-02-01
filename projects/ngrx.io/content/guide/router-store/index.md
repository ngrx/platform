# @ngrx/router-store

Bindings to connect the Angular Router with [Store](guide/store). During each router navigation cycle, multiple [actions](guide/router-store/actions) are dispatched that allow you to listen for changes in the router's state. You can then select data from the state of the router to provide additional information to your application.

## Installation 

Detailed installation instructions can be found on the [Installation](guide/router-store/install) page.

## Setup

<code-example header="app.module.ts">
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({
      router: routerReducer,
    }),
    RouterModule.forRoot([
      // routes
    ]),
    // Connects RouterModule with StoreModule, uses MinimalRouterStateSerializer by default
    StoreRouterConnectingModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
</code-example>

### Using the Standalone API

Registering the router bindings can also be done using the standalone APIs if you are bootstrapping an Angular application using standalone features.

<code-example header="main.ts">
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';

import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      // routes
    ]),
    provideStore({
      router: routerReducer,
    }),
    provideRouterStore()
  ],
});
</code-example>
