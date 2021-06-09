# Instrumentation options

When you call the instrumentation, you can give an optional configuration object. As stated, each property in the object provided is optional.

## Configuration Object Properties

### `maxAge`

number (>1) | `false` - maximum allowed actions to be stored in the history tree. The oldest actions are removed once maxAge is reached. It's critical for performance. Default is `false` (infinite).

### `logOnly`

boolean - connect to the Devtools Extension in log-only mode. Default is `false` which enables all extension [features](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#features).

### `autoPause`

boolean - Pauses recording actions and state changes when the extension window is not open. Default is `false`.

### `name`

string - the instance name to show on the monitor page. Default value is NgRx Store DevTools.

### `monitor`

function - the monitor function configuration that you want to hook.

### `actionSanitizer`

function - takes `action` object and id number as arguments, and should return an `action` object.

### `stateSanitizer`

function - takes `state` object and index as arguments, and should return a `state` object.

### `serialize`

- options
  - `undefined` - will use regular `JSON.stringify` to send data
  - `false` - will handle also circular references
  - `true` - will handle also date, regex, undefined, primitives, error objects, symbols, maps, sets and functions
  - object - which contains `date`, `regex`, `undefined`, `NaN`, `infinity`, `Error`, `Symbol`, `Map`, `Set` and `function` keys. For each of them, you can indicate if they have to be included by setting them to `true`. For function keys, you can also specify a custom function which handles serialization.

For more detailed information see [Redux DevTools Serialize](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#serialize)

### `actionsSafelist` / `actionsBlocklist`

array of strings as regex - actions types to be hidden / shown in the monitors, [more information here](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#actionsblacklist--actionswhitelist).

### `predicate`

function - called for every action before sending, takes state and action object, and returns `true` in case it allows sending the current data to the monitor, [more information here](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#predicate).

### `features`

configuration object - containing properties for features than can be enabled or disabled in the browser extension Redux DevTools. These options are passed through to the browser extension verbatim. By default, all features are enabled. For more information visit the [Redux DevTools Docs](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#features)

```typescript
features: {
  pause: true, // start/pause recording of dispatched actions
  lock: true, // lock/unlock dispatching actions and side effects    
  persist: true, // persist states on page reloading
  export: true, // export history of actions in a file
  import: 'custom', // import history of actions from a file
  jump: true, // jump back and forth (time travelling)
  skip: true, // skip (cancel) actions
  reorder: true, // drag and drop actions in the history list 
  dispatch: true, // dispatch custom actions or action creators
  test: true // generate tests for the selected actions
},
```

## Example Object as provided in module imports

<code-example header="app.module.ts">
@NgModule({
  ...
  imports: [
    ...
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      features: {
        pause: false,
        lock: true,
        persist: true
      }
    })
  ],
  ...
})
</code-example>
