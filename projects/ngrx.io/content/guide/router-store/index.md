# @ngrx/router-store

Bindings to connect the Angular Router with [Store](guide/store). During each router navigation cycle, multiple [actions](guide/router-store/actions) are dispatched that allow you to listen for changes in the router's state. You can then select data from the state of the router to provide additional information to your application.

## Installation 

Detailed installation instructions can be found on the [Installation](guide/router-store/install) page.

## Setup

<code-example header="app.config.ts">
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      // routes
    ]),
    provideStore({
      router: routerReducer,
    }),
    provideRouterStore()
  ],
};
</code-example>

<div class="alert is-helpful">

An example of the `@ngrx/router-store` setup in module-based applications is available at the [following link](https://v17.ngrx.io/guide/router-store#setup).

</div>
