# @ngrx/store-devtools

Store Devtools provides developer tools and instrumentation for [Store](guide/store).

## Installation 

Detailed installation instructions can be found on the [Installation](guide/store-devtools/install) page.

## Setup

Instrumentation with the Chrome / Firefox Extension

1.  Download the [Redux Devtools Extension](https://github.com/reduxjs/redux-devtools/)

2.  In your `AppModule` add instrumentation to the module imports using `StoreDevtoolsModule.instrument`:

<code-example header="app.module.ts">
import { NgModule, isDevMode } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
  ],
})
export class AppModule {}
</code-example>

> More extension options and explanation, refer to [Redux Devtools Documentation](https://github.com/reduxjs/redux-devtools#documentation)
