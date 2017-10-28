<a name="4.0.0"></a>
# [4.0.0](https://github.com/roopkt/platform/compare/v4.1.0...v4.0.0) (2017-10-28)


### Features

* **RouterStore:** Add configurable option for router reducer name (#417) ([ab7de5c](https://github.com/roopkt/platform/commit/ab7de5c)), closes [#410](https://github.com/roopkt/platform/issues/410)



<a name="4.1.0"></a>
# [4.1.0](https://github.com/roopkt/platform/compare/v4.0.5...v4.1.0) (2017-10-19)


### Bug Fixes

* **Build:** Fix build with space in path (#331) ([257fc9d](https://github.com/roopkt/platform/commit/257fc9d)), closes [#331](https://github.com/roopkt/platform/issues/331)
* **combineSelectors:** Remove default parameter from function signature for Closure ([ae7d5e1](https://github.com/roopkt/platform/commit/ae7d5e1))
* **decorator:** add ExportDecoratedItems jsdoc for g3 (#456) ([2b0e0cf](https://github.com/roopkt/platform/commit/2b0e0cf))
* **Effects:** Simplify decorator handling for Closure compatibility ([ad30d40](https://github.com/roopkt/platform/commit/ad30d40))
* **Entity:** Change type for EntityState to interface (#454) ([d5640ec](https://github.com/roopkt/platform/commit/d5640ec)), closes [#458](https://github.com/roopkt/platform/issues/458)
* **Example:** Add missing import for catch operator (#409) ([193e8b3](https://github.com/roopkt/platform/commit/193e8b3))
* **RouterStore:** Fix cancelled navigation with async guard (fixes #354) (#355) ([920c0ba](https://github.com/roopkt/platform/commit/920c0ba)), closes [#354](https://github.com/roopkt/platform/issues/354) [#355](https://github.com/roopkt/platform/issues/355) [#354](https://github.com/roopkt/platform/issues/354) [#201](https://github.com/roopkt/platform/issues/201)
* **RouterStore:** Stringify error from navigation error event (#357) ([0528d2d](https://github.com/roopkt/platform/commit/0528d2d)), closes [#356](https://github.com/roopkt/platform/issues/356)
* **Store:** Fix typing for feature to accept InjectionToken (#375) ([38b2f95](https://github.com/roopkt/platform/commit/38b2f95)), closes [#375](https://github.com/roopkt/platform/issues/375)
* **Store:** Refactor parameter initialization in combineReducers for Closure ([5c60cba](https://github.com/roopkt/platform/commit/5c60cba))
* **Store:** Set initial value for state action pair to object (#480) ([100a8ef](https://github.com/roopkt/platform/commit/100a8ef)), closes [#477](https://github.com/roopkt/platform/issues/477)


### Features

* **createSelector:** Expose projector function on selectors to improve testability ([56cb21f](https://github.com/roopkt/platform/commit/56cb21f)), closes [#290](https://github.com/roopkt/platform/issues/290)
* **Effects:** Add getEffectsMetadata() helper for verifying metadata ([628b865](https://github.com/roopkt/platform/commit/628b865)), closes [#491](https://github.com/roopkt/platform/issues/491)
* **Effects:** Add root effects init action (#473) ([838ba17](https://github.com/roopkt/platform/commit/838ba17)), closes [#246](https://github.com/roopkt/platform/issues/246)
* **Entity:** Add default selectId function for EntityAdapter (#405) ([2afb792](https://github.com/roopkt/platform/commit/2afb792))
* **Entity:** Add support for string or number type for ID (#441) ([46d6f2f](https://github.com/roopkt/platform/commit/46d6f2f))
* **Entity:** Enable creating entity selectors without composing a state selector (#490) ([aae4064](https://github.com/roopkt/platform/commit/aae4064))
* **Entity:** Rename 'sort' to 'sortComparer' ([274554b](https://github.com/roopkt/platform/commit/274554b)), closes [#370](https://github.com/roopkt/platform/issues/370)
* **Store:** createSelector with an array of selectors (#340) ([2f6a035](https://github.com/roopkt/platform/commit/2f6a035)), closes [#192](https://github.com/roopkt/platform/issues/192)



<a name="4.0.5"></a>
## [4.0.5](https://github.com/roopkt/platform/compare/v4.0.4...v4.0.5) (2017-08-18)


### Bug Fixes

* **Effects:** Do not complete effects if one source errors or completes (#297) ([54747cf](https://github.com/roopkt/platform/commit/54747cf)), closes [#232](https://github.com/roopkt/platform/issues/232)
* **Entity:** Return a referentially equal state if state did not change ([fbd6a66](https://github.com/roopkt/platform/commit/fbd6a66))
* **Entity:** Simplify target index finder for sorted entities ([335d255](https://github.com/roopkt/platform/commit/335d255))



<a name="4.0.4"></a>
## [4.0.4](https://github.com/roopkt/platform/compare/v4.0.3...v4.0.4) (2017-08-17)


### Bug Fixes

* **Effects:** Use factory provide for console (#288) ([bf7f70c](https://github.com/roopkt/platform/commit/bf7f70c)), closes [#276](https://github.com/roopkt/platform/issues/276)
* **RouterStore:** Add generic type to RouterReducerState (#292) ([6da3ec5](https://github.com/roopkt/platform/commit/6da3ec5)), closes [#289](https://github.com/roopkt/platform/issues/289)
* **RouterStore:** Only serialize snapshot in preactivation hook (#287) ([bbb7c99](https://github.com/roopkt/platform/commit/bbb7c99)), closes [#286](https://github.com/roopkt/platform/issues/286)



<a name="4.0.3"></a>
## [4.0.3](https://github.com/roopkt/platform/compare/v4.0.2...v4.0.3) (2017-08-16)


### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/roopkt/platform/commit/1cbb2c9))
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/roopkt/platform/commit/065d33e)), closes [#184](https://github.com/roopkt/platform/issues/184) [#219](https://github.com/roopkt/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/roopkt/platform/commit/2b1a076))
* **Store:** Add type signature for metareducer (#270) ([57633d2](https://github.com/roopkt/platform/commit/57633d2)), closes [#264](https://github.com/roopkt/platform/issues/264) [#170](https://github.com/roopkt/platform/issues/170)
* **Store:** Set initial state for feature modules (#235) ([4aec80c](https://github.com/roopkt/platform/commit/4aec80c)), closes [#206](https://github.com/roopkt/platform/issues/206) [#233](https://github.com/roopkt/platform/issues/233)
* **Store:** Update usage of compose for reducer factory (#252) ([683013c](https://github.com/roopkt/platform/commit/683013c)), closes [#247](https://github.com/roopkt/platform/issues/247)
* **Store:** Use existing reducers when providing reducers without an InjectionToken (#254) ([c409252](https://github.com/roopkt/platform/commit/c409252)), closes [#250](https://github.com/roopkt/platform/issues/250) [#116](https://github.com/roopkt/platform/issues/116)
* **Store:** Use injector to get reducers provided via InjectionTokens (#259) ([bd968fa](https://github.com/roopkt/platform/commit/bd968fa))


### Features

* **RouterStore:** Add serializer for router state snapshot (#188) ([0fc1bcc](https://github.com/roopkt/platform/commit/0fc1bcc)), closes [#97](https://github.com/roopkt/platform/issues/97) [#104](https://github.com/roopkt/platform/issues/104) [#237](https://github.com/roopkt/platform/issues/237)



<a name="4.0.2"></a>
## [4.0.2](https://github.com/roopkt/platform/compare/v4.0.1...v4.0.2) (2017-08-02)


### Bug Fixes

* **createSelector:** memoize projector function (#228) ([e2f1e57](https://github.com/roopkt/platform/commit/e2f1e57)), closes [#226](https://github.com/roopkt/platform/issues/226)
* **docs:** update angular-cli variable ([eeb7d5d](https://github.com/roopkt/platform/commit/eeb7d5d))
* **Docs:** update effects description (#164) ([c77b2d9](https://github.com/roopkt/platform/commit/c77b2d9))
* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/roopkt/platform/commit/bfdb83b)), closes [#117](https://github.com/roopkt/platform/issues/117)
* **RouterStore:** Add support for cancellation with CanLoad guard (#223) ([2c006e8](https://github.com/roopkt/platform/commit/2c006e8)), closes [#213](https://github.com/roopkt/platform/issues/213)
* **Store:** Remove auto-memoization of selector functions ([90899f7](https://github.com/roopkt/platform/commit/90899f7)), closes [#118](https://github.com/roopkt/platform/issues/118)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/roopkt/platform/commit/55c13b2))
* **Platform:** Introduce [@ngrx](https://github.com/ngrx)/entity (#207) ([9bdfd70](https://github.com/roopkt/platform/commit/9bdfd70))
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/roopkt/platform/commit/7f77693)), closes [#116](https://github.com/roopkt/platform/issues/116) [#141](https://github.com/roopkt/platform/issues/141) [#147](https://github.com/roopkt/platform/issues/147)
* **Store:** Added initial state function support for features. Added more tests (#85) ([5e5d7dd](https://github.com/roopkt/platform/commit/5e5d7dd))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/roopkt/platform/compare/v4.0.0...v4.0.1) (2017-07-18)


### Bug Fixes

* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/roopkt/platform/commit/875b326)), closes [#93](https://github.com/roopkt/platform/issues/93)
* **effects:** make correct export path for testing module (#96) ([a5aad22](https://github.com/roopkt/platform/commit/a5aad22)), closes [#94](https://github.com/roopkt/platform/issues/94)



<a name="4.0.0"></a>
# [4.0.0](https://github.com/roopkt/platform/compare/68bd9df...v4.0.0) (2017-07-18)


### Bug Fixes

* **build:** Fixed deployment of latest master as commit (#18) ([5d0ecf9](https://github.com/roopkt/platform/commit/5d0ecf9)), closes [#18](https://github.com/roopkt/platform/issues/18)
* **build:** Get tests running for each project ([c4a1054](https://github.com/roopkt/platform/commit/c4a1054))
* **build:** Limit concurrency for lerna bootstrap ([7e7a7d8](https://github.com/roopkt/platform/commit/7e7a7d8))
* **Devtools:** Removed SHOULD_INSTRUMENT token used to eagerly inject providers (#57) ([b90df34](https://github.com/roopkt/platform/commit/b90df34))
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/roopkt/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/roopkt/platform/commit/d176a11))
* **Example:** Fix Book State interface parent (#90) ([6982952](https://github.com/roopkt/platform/commit/6982952)), closes [#90](https://github.com/roopkt/platform/issues/90)
* **example-app:** Suppress StoreDevtoolsConfig compiler warning ([8804156](https://github.com/roopkt/platform/commit/8804156))
* **omit:** Strengthen the type checking of the omit utility function ([3982038](https://github.com/roopkt/platform/commit/3982038))
* **router-store:** NavigationCancel and NavigationError creates a cycle when used with routerReducer ([a085730](https://github.com/roopkt/platform/commit/a085730)), closes [#68](https://github.com/roopkt/platform/issues/68)
* **Store:** Exported initial state tokens (#65) ([4b27b6d](https://github.com/roopkt/platform/commit/4b27b6d))
* **Store:** pass all required arguments to projector (#74) ([9b82b3a](https://github.com/roopkt/platform/commit/9b82b3a))
* **Store:** Remove parameter destructuring for strict mode (#33) (#77) ([c9d6a45](https://github.com/roopkt/platform/commit/c9d6a45))
* **Store:** Removed readonly from type (#72) ([68274c9](https://github.com/roopkt/platform/commit/68274c9))
* **StoreDevtools:** Type InjectionToken for AOT compilation ([e21d688](https://github.com/roopkt/platform/commit/e21d688))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/roopkt/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/roopkt/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/roopkt/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/roopkt/platform/commit/7dbb571))
* **router-store:** Added action types (#47) ([1f67cb3](https://github.com/roopkt/platform/commit/1f67cb3)), closes [#44](https://github.com/roopkt/platform/issues/44)
* **store:** Add 'createSelector' and 'createFeatureSelector' utils (#10) ([41758b1](https://github.com/roopkt/platform/commit/41758b1))
* **Store:** Allow initial state function for AoT compatibility (#59) ([1a166ec](https://github.com/roopkt/platform/commit/1a166ec)), closes [#51](https://github.com/roopkt/platform/issues/51)
* **Store:** Allow parent modules to provide reducers with tokens (#36) ([069b12f](https://github.com/roopkt/platform/commit/069b12f)), closes [#34](https://github.com/roopkt/platform/issues/34)
* **Store:** Simplify API for adding meta-reducers (#87) ([d2295c7](https://github.com/roopkt/platform/commit/d2295c7))


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



