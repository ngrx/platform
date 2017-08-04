# @ngrx/store-devtools

Devtools for [@ngrx/store](../store/README.md).

### Installation
Install @ngrx/store-devtools from npm:

`npm install @ngrx/store-devtools --save` OR `yarn add @ngrx/store-devtools`


### Nightly builds

`npm install github:ngrx/store-devtools-builds` OR `yarn add github:ngrx/store-devtools-builds`

### Warning
store-devtools currently causes severe performance problems when
used with router-store. We are working to
[fix this](https://github.com/ngrx/platform/issues/97), but for now, avoid
using them together.


## Instrumentation
### Instrumentation with the Chrome / Firefox Extension

1. Download the [Redux Devtools Extension](http://zalmoxisus.github.io/redux-devtools-extension/)

2. In your `AppModule` add instrumentation to the module imports using `StoreDevtoolsModule.instrument`:

```ts
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    // Note that you must instrument after importing StoreModule
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    })
  ]
})
export class AppModule { }
```
