# @ngrx/store-devtools

Devtools for [@ngrx/store](../store/README.md).

### Installation

Install @ngrx/store-devtools from npm:

`npm install @ngrx/store-devtools --save` OR `yarn add @ngrx/store-devtools`

### Nightly builds

`npm install github:ngrx/store-devtools-builds` OR `yarn add github:ngrx/store-devtools-builds`

## Instrumentation

### Instrumentation with the Chrome / Firefox Extension

1.  Download the [Redux Devtools Extension](https://github.com/zalmoxisus/redux-devtools-extension/)

2.  In your `AppModule` add instrumentation to the module imports using `StoreDevtoolsModule.instrument`:

```ts
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment'; // Angular CLI environemnt

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
})
export class AppModule {}
```

***NOTE:*** Once some component injects the `Store` service, Devtools will be enabled.

### Instrumentation options

When you call the instrumentation, you can give an optional configuration object:

#### `maxAge`

number (>1) | false - maximum allowed actions to be stored in the history tree. The oldest actions are removed once maxAge is reached. It's critical for performance. Default is `false` (infinite).

#### `logOnly`

boolean - connect to the Devtools Extension in log-only mode. Default is `false` which enables all extension [features](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#features).

#### `name`

string - the instance name to be showed on the monitor page. Default value is _NgRx Store DevTools_.

#### `monitor`

function - the monitor function configuration that you want to hook.

#### `actionSanitizer`

function - takes `action` object and id number as arguments, and should return `action` object back.

#### `stateSanitizer`

function = takes `state` object and index as arguments, and should return `state` object back.

#### `serialize`

false | configuration object - Handle the way you want to serialize your state, [more information here](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#serialize).
