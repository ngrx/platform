# @ngrx/store-devtools

Devtools for [@ngrx/store](../store/README.md).

## Installation
```bash
npm install @ngrx/store-devtools --save-dev
```


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
