<a name="3.2.4"></a>
## [3.2.4](https://github.com/ngrx/devtools/compare/v3.2.3...v3.2.4) (2017-03-24)


### Bug Fixes

* **StoreDevtools:** Eagerly inject initial state and reducers ([c2abe11](https://github.com/ngrx/devtools/commit/c2abe11))



<a name="3.2.3"></a>
## [3.2.3](https://github.com/ngrx/devtools/compare/v3.2.2...v3.2.3) (2017-01-19)


### Bug Fixes

* **devtools:** Fixed AOT bug when providing devtools config options ([#52](https://github.com/ngrx/devtools/issues/52)) ([d21ab15](https://github.com/ngrx/devtools/commit/d21ab15))



<a name="3.2.2"></a>
## [3.2.2](https://github.com/ngrx/devtools/compare/v3.2.1...v3.2.2) (2016-11-04)


### Bug Fixes

* **bundles:** Correctly alias ReplaySubject ([1a65e6d](https://github.com/ngrx/devtools/commit/1a65e6d))
* **extension:** Fix unsubscribing from the extension ([#37](https://github.com/ngrx/devtools/issues/37)) ([f5d068d](https://github.com/ngrx/devtools/commit/f5d068d)), closes [#33](https://github.com/ngrx/devtools/issues/33)



<a name="3.2.1"></a>
## [3.2.1](https://github.com/ngrx/devtools/compare/v3.2.0...v3.2.1) (2016-10-26)


### Bug Fixes

* **StoreDevtools:** Prevent reducer undefined error ([bb1e25d](https://github.com/ngrx/devtools/commit/bb1e25d))



<a name="3.2.0"></a>
# [3.2.0](https://github.com/ngrx/devtools/compare/v3.0.1...v3.2.0) (2016-10-26)


### Bug Fixes

* **Extension:** Get Chrome extension working correctly ([d1abedd](https://github.com/ngrx/devtools/commit/d1abedd))
* **State:** Stop using a refcounted observable to contain state ([d4a6382](https://github.com/ngrx/devtools/commit/d4a6382)), closes [#25](https://github.com/ngrx/devtools/issues/25)


### Features

* **Devtools:** Enable instrumenting store conditionally if extension is present ([a1b6dfc](https://github.com/ngrx/devtools/commit/a1b6dfc))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/ngrx/devtools/compare/v3.0.0...v3.0.1) (2016-09-01)


### Bug Fixes

* **deps:** Upgrade to latest Angular 2 and rxjs ([50869c5](https://github.com/ngrx/devtools/commit/50869c5))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/ngrx/devtools/compare/v2.0.0-beta.1...v3.0.0) (2016-08-26)


### Bug Fixes

* **extension:** Allow universal rendering ([#23](https://github.com/ngrx/devtools/issues/23)) ([dcd640c](https://github.com/ngrx/devtools/commit/dcd640c))


### Chores

* Upgrade to Angular 2 RC.5 ([#26](https://github.com/ngrx/devtools/issues/26)) ([28f53d1](https://github.com/ngrx/devtools/commit/28f53d1))


### BREAKING CHANGES

* With the introduction of NgModules, the process for instrumenting your store has changed

BEFORE:

```ts
import { instrumentStore } from '@ngrx/store-devtools';

bootstrap(App, [
  instrumentStore(config)
]);
```

AFTER:

```ts
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    StoreDevtoolsModule.instrumentStore(config)
  ]
})
export class AppModule { }
```



<a name="2.0.0-beta.1"></a>
# [2.0.0-beta.1](https://github.com/ngrx/devtools/compare/v1.4.0...v2.0.0-beta.1) (2016-07-01)



<a name="1.4.0"></a>
# [1.4.0](https://github.com/ngrx/devtools/compare/v1.3.3...v1.4.0) (2016-05-03)



<a name="1.3.3"></a>
## [1.3.3](https://github.com/ngrx/devtools/compare/v1.3.2...v1.3.3) (2016-03-17)



<a name="1.3.2"></a>
## [1.3.2](https://github.com/ngrx/devtools/compare/v1.3.1...v1.3.2) (2016-03-17)


### Bug Fixes

* **DevtoolsConfig:** Use the PositionsType from the dock monitor to constrain the available positions ([f1a1563](https://github.com/ngrx/devtools/commit/f1a1563))
* **LogMonitor:** do not suppress init action ([78f46c0](https://github.com/ngrx/devtools/commit/78f46c0))


### Features

* **devtools:** Added config function to set default position, visibility and size ([73cfefc](https://github.com/ngrx/devtools/commit/73cfefc))
* **monitors:** Added customizable dock monitor commands via inputs ([5610e27](https://github.com/ngrx/devtools/commit/5610e27))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/ngrx/devtools/compare/v1.3.0...v1.3.1) (2016-03-12)


### Bug Fixes

* **Commander:** Fixed event handling in the Commander component ([ba355fb](https://github.com/ngrx/devtools/commit/ba355fb))
* **LogMonitorButton:** Fixed metadata generation bug with event handler ([b5f69a7](https://github.com/ngrx/devtools/commit/b5f69a7))
* **StoreDevtoolsTest:** Changed all calls to use devtool methods instead of raw action creators ([f99657d](https://github.com/ngrx/devtools/commit/f99657d))


### Features

* **Devtools:** Added unified Devtools component that wraps the DockMonitor and LogMonitor ([58497f5](https://github.com/ngrx/devtools/commit/58497f5))
* **DockMonitor:** Added dock monitor to wrap devtools. ([d10fb7a](https://github.com/ngrx/devtools/commit/d10fb7a))
* **instrumentStore:** Added shortcut to combineReducers if an object is passed in. Default to dock reducer ([344c7b5](https://github.com/ngrx/devtools/commit/344c7b5))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/ngrx/devtools/compare/0f2c4ff...v1.3.0) (2016-03-09)


### Bug Fixes

* **Devtools:** Filtered out all undefined states ([0f2c4ff](https://github.com/ngrx/devtools/commit/0f2c4ff))
* **linter:** Corrected linting errors with store instrumentation ([1d99bbc](https://github.com/ngrx/devtools/commit/1d99bbc))
* **package.json:** Restore name to [@ngrx](https://github.com/ngrx)/devtools ([859491c](https://github.com/ngrx/devtools/commit/859491c))
* **StoreDevtools:** Fixed specs to correctly use liftedState instead of state ([769a046](https://github.com/ngrx/devtools/commit/769a046))
* **tsconfig:** Corrected paths for log monitor ([4d1e5d6](https://github.com/ngrx/devtools/commit/4d1e5d6))
* **tsconfig:** Include the correct scripts for the store devtools ([0419aba](https://github.com/ngrx/devtools/commit/0419aba))


### Features

* **LogMonitor:** Added initial implementation of a LogMonitor component ([ac6f24d](https://github.com/ngrx/devtools/commit/ac6f24d))
* **StoreDevtools:** Solidifed devtools API to be a complete service ([5f293f2](https://github.com/ngrx/devtools/commit/5f293f2))



