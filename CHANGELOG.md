<a name="4.0.0"></a>
# [4.0.0](https://github.com/ngrx/platform/compare/v4.0.1...v4.0.0) (2017-07-22)


### Bug Fixes

* **docs:** update angular-cli variable ([eeb7d5d](https://github.com/ngrx/platform/commit/eeb7d5d))
* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)
* **Store:** Remove auto-memoization of selector functions ([90899f7](https://github.com/ngrx/platform/commit/90899f7)), closes [#118](https://github.com/ngrx/platform/issues/118)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Store:** Added initial state function support for features. Added more tests (#85) ([5e5d7dd](https://github.com/ngrx/platform/commit/5e5d7dd))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/ngrx/platform/compare/v4.0.0...v4.0.1) (2017-07-18)


### Bug Fixes

* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
* **effects:** make correct export path for testing module (#96) ([a5aad22](https://github.com/ngrx/platform/commit/a5aad22)), closes [#94](https://github.com/ngrx/platform/issues/94)



<a name="4.0.0"></a>
# [4.0.0](https://github.com/ngrx/platform/compare/68bd9df...v4.0.0) (2017-07-18)


### Bug Fixes

* **build:** Fixed deployment of latest master as commit (#18) ([5d0ecf9](https://github.com/ngrx/platform/commit/5d0ecf9)), closes [#18](https://github.com/ngrx/platform/issues/18)
* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **build:** Limit concurrency for lerna bootstrap ([7e7a7d8](https://github.com/ngrx/platform/commit/7e7a7d8))
* **Devtools:** Removed SHOULD_INSTRUMENT token used to eagerly inject providers (#57) ([b90df34](https://github.com/ngrx/platform/commit/b90df34))
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))
* **Example:** Fix Book State interface parent (#90) ([6982952](https://github.com/ngrx/platform/commit/6982952)), closes [#90](https://github.com/ngrx/platform/issues/90)
* **example-app:** Suppress StoreDevtoolsConfig compiler warning ([8804156](https://github.com/ngrx/platform/commit/8804156))
* **omit:** Strengthen the type checking of the omit utility function ([3982038](https://github.com/ngrx/platform/commit/3982038))
* **router-store:** NavigationCancel and NavigationError creates a cycle when used with routerReducer ([a085730](https://github.com/ngrx/platform/commit/a085730)), closes [#68](https://github.com/ngrx/platform/issues/68)
* **Store:** Exported initial state tokens (#65) ([4b27b6d](https://github.com/ngrx/platform/commit/4b27b6d))
* **Store:** pass all required arguments to projector (#74) ([9b82b3a](https://github.com/ngrx/platform/commit/9b82b3a))
* **Store:** Remove parameter destructuring for strict mode (#33) (#77) ([c9d6a45](https://github.com/ngrx/platform/commit/c9d6a45))
* **Store:** Removed readonly from type (#72) ([68274c9](https://github.com/ngrx/platform/commit/68274c9))
* **StoreDevtools:** Type InjectionToken for AOT compilation ([e21d688](https://github.com/ngrx/platform/commit/e21d688))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))
* **router-store:** Added action types (#47) ([1f67cb3](https://github.com/ngrx/platform/commit/1f67cb3)), closes [#44](https://github.com/ngrx/platform/issues/44)
* **store:** Add 'createSelector' and 'createFeatureSelector' utils (#10) ([41758b1](https://github.com/ngrx/platform/commit/41758b1))
* **Store:** Allow initial state function for AoT compatibility (#59) ([1a166ec](https://github.com/ngrx/platform/commit/1a166ec)), closes [#51](https://github.com/ngrx/platform/issues/51)
* **Store:** Allow parent modules to provide reducers with tokens (#36) ([069b12f](https://github.com/ngrx/platform/commit/069b12f)), closes [#34](https://github.com/ngrx/platform/issues/34)
* **Store:** Simplify API for adding meta-reducers (#87) ([d2295c7](https://github.com/ngrx/platform/commit/d2295c7))


### BREAKING CHANGES

* **Effects:** Effects API for registering effects has been updated to allow for multiple classes to be provided.

BEFORE:
```ts
@NgModule({
  imports: [
    EffectsModule.run(SourceA),
    EffectsModule.run(SourceB)
  ]
})
export class AppModule { }
```

AFTER:
```ts
@NgModule({
  imports: [
    EffectsModule.forRoot([
      SourceA,
      SourceB,
      SourceC,
    ])
  ]
})
export class AppModule { }

@NgModule({
  imports: [
    EffectsModule.forFeature([
      FeatureSourceA,
      FeatureSourceB,
      FeatureSourceC,
    ])
  ]
})
export class SomeFeatureModule { }
```



