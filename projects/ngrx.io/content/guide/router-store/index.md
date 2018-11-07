# Router Store

Bindings to connect the Angular Router with [Store](guide/store). During each router navigation cycle, multiple [actions](guide/router-store/actions) are dispatched that allow you to listen for changes in the router's state. You can then select data from the state of the router to provide additional information to your application.

### Installation

```sh
npm install @ngrx/router-store --save
```

```sh
yarn add @ngrx/router-store
```

## Setup

```ts
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
    // Connects RouterModule with StoreModule
    StoreRouterConnectingModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```