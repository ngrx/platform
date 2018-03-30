<a name="5.2.0"></a>

# [5.2.0](https://github.com/ngrx/platform/compare/v5.1.0...v5.2.0) (2018-03-07)

### Bug Fixes

* **Schematics:** Correct usage of upsert actions for entity blueprint (#821) ([1ffb5a9](https://github.com/ngrx/platform/commit/1ffb5a9)), closes [#821](https://github.com/ngrx/platform/issues/821)
* **Store:** only default to initialValue when store value is undefined (#886) ([51a1547](https://github.com/ngrx/platform/commit/51a1547)), closes [#886](https://github.com/ngrx/platform/issues/886)
* **StoreDevtools:** Fix bug when exporting/importing state history (#855) ([a5dcdb1](https://github.com/ngrx/platform/commit/a5dcdb1)), closes [#855](https://github.com/ngrx/platform/issues/855)
* **StoreDevtools:** Recompute state history when reducers are updated (#844) ([10debcc](https://github.com/ngrx/platform/commit/10debcc)), closes [#844](https://github.com/ngrx/platform/issues/844)

### Features

* **Entity:** Add 'selectId' and 'sortComparer' to state adapter (#889) ([69a62f2](https://github.com/ngrx/platform/commit/69a62f2)), closes [#889](https://github.com/ngrx/platform/issues/889)
* **Store:** Added feature name to Update Reducers action ([730361e](https://github.com/ngrx/platform/commit/730361e))

<a name="5.1.0"></a>

# [5.1.0](https://github.com/ngrx/platform/compare/v5.0.1...v5.1.0) (2018-02-13)

### Bug Fixes

* **Devtools:** Ensure Store is loaded eagerly (#801) ([ecf1ebf](https://github.com/ngrx/platform/commit/ecf1ebf)), closes [#801](https://github.com/ngrx/platform/issues/801) [#624](https://github.com/ngrx/platform/issues/624) [#741](https://github.com/ngrx/platform/issues/741)
* **Effects:** Make ofType operator strictFunctionTypes safe (#789) ([c8560e4](https://github.com/ngrx/platform/commit/c8560e4)), closes [#789](https://github.com/ngrx/platform/issues/789) [#753](https://github.com/ngrx/platform/issues/753)
* **Entity:** Avoid for..in iteration in sorted state adapter (#805) ([4192645](https://github.com/ngrx/platform/commit/4192645)), closes [#805](https://github.com/ngrx/platform/issues/805)
* **Entity:** Do not add Array.prototype properties to store (#782) ([d537758](https://github.com/ngrx/platform/commit/d537758)), closes [#782](https://github.com/ngrx/platform/issues/782) [#781](https://github.com/ngrx/platform/issues/781)
* **Entity:** Properly iterate over array in upsert (#802) ([779d689](https://github.com/ngrx/platform/commit/779d689)), closes [#802](https://github.com/ngrx/platform/issues/802)
* **Schematics:** Add store import to container blueprint (#763) ([a140fa9](https://github.com/ngrx/platform/commit/a140fa9)), closes [#763](https://github.com/ngrx/platform/issues/763) [#760](https://github.com/ngrx/platform/issues/760)
* **Schematics:** Remove extra braces from constructor for container blueprint (#791) ([945bf40](https://github.com/ngrx/platform/commit/945bf40)), closes [#791](https://github.com/ngrx/platform/issues/791) [#778](https://github.com/ngrx/platform/issues/778)
* **Schematics:** Use correct paths for nested and grouped feature blueprint (#756) ([c219770](https://github.com/ngrx/platform/commit/c219770)), closes [#756](https://github.com/ngrx/platform/issues/756)
* **StoreDevtools:** Add internal support for ActionSanitizer and StateSanitizer (#795) ([a7de2a6](https://github.com/ngrx/platform/commit/a7de2a6)), closes [#795](https://github.com/ngrx/platform/issues/795)
* **StoreDevtools:** Do not send full liftedState for application actions (#790) ([c11504f](https://github.com/ngrx/platform/commit/c11504f)), closes [#790](https://github.com/ngrx/platform/issues/790)

### Features

* **Entity:** Add upsertOne and upsertMany functions to entity adapters (#780) ([f871540](https://github.com/ngrx/platform/commit/f871540)), closes [#780](https://github.com/ngrx/platform/issues/780) [#421](https://github.com/ngrx/platform/issues/421)
* **Schematics:** Add group option to entity blueprint (#792) ([0429276](https://github.com/ngrx/platform/commit/0429276)), closes [#792](https://github.com/ngrx/platform/issues/792) [#779](https://github.com/ngrx/platform/issues/779)
* **Schematics:** Add upsert methods to entity blueprint (#809) ([7acdc79](https://github.com/ngrx/platform/commit/7acdc79)), closes [#809](https://github.com/ngrx/platform/issues/809) [#592](https://github.com/ngrx/platform/issues/592)

<a name="5.0.1"></a>

## [5.0.1](https://github.com/ngrx/platform/compare/v5.0.0...v5.0.1) (2018-01-25)

### Bug Fixes

* **Effects:** Provide instance from actions to ofType lettable operator (#751) ([33d48e7](https://github.com/ngrx/platform/commit/33d48e7)), closes [#751](https://github.com/ngrx/platform/issues/751) [#739](https://github.com/ngrx/platform/issues/739)

<a name="5.0.0"></a>

# [5.0.0](https://github.com/ngrx/platform/compare/v4.1.1...v5.0.0) (2018-01-22)

### Bug Fixes

* **Effects:** Ensure Store modules are loaded eagerly (#658) ([0a3398d](https://github.com/ngrx/platform/commit/0a3398d)), closes [#658](https://github.com/ngrx/platform/issues/658) [#642](https://github.com/ngrx/platform/issues/642)
* **Effects:** Remove toPayload utility function (#738) ([b390ef5](https://github.com/ngrx/platform/commit/b390ef5)), closes [#738](https://github.com/ngrx/platform/issues/738)
* **Entity:** updateOne/updateMany should not change ids state on existing entity (#581) ([b989e4b](https://github.com/ngrx/platform/commit/b989e4b)), closes [#581](https://github.com/ngrx/platform/issues/581) [#571](https://github.com/ngrx/platform/issues/571)
* **RouterStore:** Fix usage of config object if provided (#575) ([4125914](https://github.com/ngrx/platform/commit/4125914)), closes [#575](https://github.com/ngrx/platform/issues/575)
* **RouterStore:** Match RouterAction type parameters (#562) ([980a653](https://github.com/ngrx/platform/commit/980a653)), closes [#562](https://github.com/ngrx/platform/issues/562)
* **Schematics:** Add group folder after feature name folder (#737) ([317fb94](https://github.com/ngrx/platform/commit/317fb94)), closes [#737](https://github.com/ngrx/platform/issues/737)
* **Schematics:** Add handling of flat option to entity blueprint ([fb8d2c6](https://github.com/ngrx/platform/commit/fb8d2c6))
* **Schematics:** Distinguish between root and feature effect arrays when registering (#718) ([95ff6c8](https://github.com/ngrx/platform/commit/95ff6c8)), closes [#718](https://github.com/ngrx/platform/issues/718)
* **Schematics:** Don't add state import if not provided (#697) ([e5c2aed](https://github.com/ngrx/platform/commit/e5c2aed)), closes [#697](https://github.com/ngrx/platform/issues/697)
* **Schematics:** Make variable naming consistent for entity blueprint (#716) ([765b15a](https://github.com/ngrx/platform/commit/765b15a)), closes [#716](https://github.com/ngrx/platform/issues/716)
* **Store:** Compose provided metareducers for a feature reducer (#704) ([1454620](https://github.com/ngrx/platform/commit/1454620)), closes [#704](https://github.com/ngrx/platform/issues/704) [#701](https://github.com/ngrx/platform/issues/701)
* **StoreDevtools:** Only recompute current state when reducers are updated (#570) ([247ae1a](https://github.com/ngrx/platform/commit/247ae1a)), closes [#570](https://github.com/ngrx/platform/issues/570) [#229](https://github.com/ngrx/platform/issues/229) [#487](https://github.com/ngrx/platform/issues/487)
* **typo:** update login error to use correct css font color property ([41723fc](https://github.com/ngrx/platform/commit/41723fc))

### Features

* **Effects:** Add lettable ofType operator ([d5e1814](https://github.com/ngrx/platform/commit/d5e1814))
* **ErrorHandler:** Use the Angular ErrorHandler for reporting errors (#667) ([8f297d1](https://github.com/ngrx/platform/commit/8f297d1)), closes [#667](https://github.com/ngrx/platform/issues/667) [#626](https://github.com/ngrx/platform/issues/626)
* **material:** Upgrade [@angular](https://github.com/angular)/material to v 2.0.0-beta.12 (#482) ([aedf20e](https://github.com/ngrx/platform/commit/aedf20e)), closes [#482](https://github.com/ngrx/platform/issues/482) [#448](https://github.com/ngrx/platform/issues/448)
* **Schematics:** Add alias for container, store and action blueprints (#685) ([dc64ac9](https://github.com/ngrx/platform/commit/dc64ac9)), closes [#685](https://github.com/ngrx/platform/issues/685)
* **Schematics:** Add alias for reducer blueprint (#684) ([ea98fb7](https://github.com/ngrx/platform/commit/ea98fb7)), closes [#684](https://github.com/ngrx/platform/issues/684)
* **Schematics:** Add effect to registered effects array (#717) ([f1082fe](https://github.com/ngrx/platform/commit/f1082fe)), closes [#717](https://github.com/ngrx/platform/issues/717)
* **Schematics:** Add option to group feature blueprints in respective folders (#736) ([b82c35d](https://github.com/ngrx/platform/commit/b82c35d)), closes [#736](https://github.com/ngrx/platform/issues/736)
* **Schematics:** Introduce [@ngrx](https://github.com/ngrx)/schematics (#631) ([1837dba](https://github.com/ngrx/platform/commit/1837dba)), closes [#631](https://github.com/ngrx/platform/issues/631) [#53](https://github.com/ngrx/platform/issues/53)
* **Store:** Add lettable select operator ([77eed24](https://github.com/ngrx/platform/commit/77eed24))
* **Store:** Add support for generating custom createSelector functions (#734) ([cb0d185](https://github.com/ngrx/platform/commit/cb0d185)), closes [#734](https://github.com/ngrx/platform/issues/734) [#478](https://github.com/ngrx/platform/issues/478) [#724](https://github.com/ngrx/platform/issues/724)
* **StoreDevtools:** Add option to configure extension in log-only mode (#712) ([1ecd658](https://github.com/ngrx/platform/commit/1ecd658)), closes [#712](https://github.com/ngrx/platform/issues/712) [#643](https://github.com/ngrx/platform/issues/643) [#374](https://github.com/ngrx/platform/issues/374)
* **StoreDevtools:** Add support for custom instance name (#517) ([00be3d1](https://github.com/ngrx/platform/commit/00be3d1)), closes [#517](https://github.com/ngrx/platform/issues/517) [#463](https://github.com/ngrx/platform/issues/463)
* **StoreDevtools:** Add support for extension sanitizers (#544) ([6ed92b0](https://github.com/ngrx/platform/commit/6ed92b0)), closes [#544](https://github.com/ngrx/platform/issues/544) [#494](https://github.com/ngrx/platform/issues/494)
* **StoreDevtools:** Add support for jumping to a specific action (#703) ([b9f6442](https://github.com/ngrx/platform/commit/b9f6442)), closes [#703](https://github.com/ngrx/platform/issues/703) [#681](https://github.com/ngrx/platform/issues/681)

### BREAKING CHANGES

* **Effects:** The utility function `toPayload`, deprecated in @ngrx/effects v4.0, has been removed.

  Before:

  ```ts
  import { toPayload } from '@ngrx/effects';

  actions$.ofType('SOME_ACTION').map(toPayload);
  ```

  After:

  ```ts
  actions$
    .ofType('SOME_ACTION')
    .map((action: SomeActionWithPayload) => action.payload);
  ```

* **ErrorHandler:** The ErrorReporter has been replaced with ErrorHandler
  from angular/core.

BEFORE:

Errors were reported to the ngrx/effects ErrorReporter. The
ErrorReporter would log to the console by default.

AFTER:

Errors are now reported to the @angular/core ErrorHandler.

* **Store:** Updates minimum version of RxJS dependency.

BEFORE:

Minimum peer dependency of RxJS ^5.0.0

AFTER:

Minimum peer dependency of RxJS ^5.5.0

* **Effects:** Updates minimum version of RxJS dependency.

BEFORE:

Minimum peer dependency of RxJS ^5.0.0

AFTER:

Minimum peer dependency of RxJS ^5.5.0

<a name="4.1.1"></a>

## [4.1.1](https://github.com/ngrx/platform/compare/v4.1.0...v4.1.1) (2017-11-07)

### Bug Fixes

* **Entity:** Fix type error for id selectors (#533) ([88f672c](https://github.com/ngrx/platform/commit/88f672c)), closes [#533](https://github.com/ngrx/platform/issues/533) [#525](https://github.com/ngrx/platform/issues/525)
* Add support for Angular 5 ([30a8c56](https://github.com/ngrx/platform/commit/30a8c56))

### Features

* **Codegen:** Add base code and build for [@ngrx](https://github.com/ngrx)/codegen (#534) ([2a22211](https://github.com/ngrx/platform/commit/2a22211)), closes [#534](https://github.com/ngrx/platform/issues/534)
* **RouterStore:** Add configurable option for router reducer name (#417) ([ab7de5c](https://github.com/ngrx/platform/commit/ab7de5c)), closes [#417](https://github.com/ngrx/platform/issues/417) [#410](https://github.com/ngrx/platform/issues/410)

<a name="4.1.0"></a>

# [4.1.0](https://github.com/ngrx/platform/compare/v4.0.5...v4.1.0) (2017-10-19)

### Bug Fixes

* **Build:** Fix build with space in path (#331) ([257fc9d](https://github.com/ngrx/platform/commit/257fc9d)), closes [#331](https://github.com/ngrx/platform/issues/331)
* **combineSelectors:** Remove default parameter from function signature for Closure ([ae7d5e1](https://github.com/ngrx/platform/commit/ae7d5e1))
* **decorator:** add ExportDecoratedItems jsdoc for g3 (#456) ([2b0e0cf](https://github.com/ngrx/platform/commit/2b0e0cf)), closes [#456](https://github.com/ngrx/platform/issues/456)
* **Effects:** Simplify decorator handling for Closure compatibility ([ad30d40](https://github.com/ngrx/platform/commit/ad30d40))
* **Entity:** Change type for EntityState to interface (#454) ([d5640ec](https://github.com/ngrx/platform/commit/d5640ec)), closes [#454](https://github.com/ngrx/platform/issues/454) [#458](https://github.com/ngrx/platform/issues/458)
* **Example:** Add missing import for catch operator (#409) ([193e8b3](https://github.com/ngrx/platform/commit/193e8b3)), closes [#409](https://github.com/ngrx/platform/issues/409)
* **RouterStore:** Fix cancelled navigation with async guard (fixes #354) (#355) ([920c0ba](https://github.com/ngrx/platform/commit/920c0ba)), closes [#354](https://github.com/ngrx/platform/issues/354) [#355](https://github.com/ngrx/platform/issues/355) [#354](https://github.com/ngrx/platform/issues/354) [#201](https://github.com/ngrx/platform/issues/201)
* **RouterStore:** Stringify error from navigation error event (#357) ([0528d2d](https://github.com/ngrx/platform/commit/0528d2d)), closes [#357](https://github.com/ngrx/platform/issues/357) [#356](https://github.com/ngrx/platform/issues/356)
* **Store:** Fix typing for feature to accept InjectionToken (#375) ([38b2f95](https://github.com/ngrx/platform/commit/38b2f95)), closes [#375](https://github.com/ngrx/platform/issues/375)
* **Store:** Refactor parameter initialization in combineReducers for Closure ([5c60cba](https://github.com/ngrx/platform/commit/5c60cba))
* **Store:** Set initial value for state action pair to object (#480) ([100a8ef](https://github.com/ngrx/platform/commit/100a8ef)), closes [#480](https://github.com/ngrx/platform/issues/480) [#477](https://github.com/ngrx/platform/issues/477)

### Features

* **createSelector:** Expose projector function on selectors to improve testability ([56cb21f](https://github.com/ngrx/platform/commit/56cb21f)), closes [#290](https://github.com/ngrx/platform/issues/290)
* **Effects:** Add getEffectsMetadata() helper for verifying metadata ([628b865](https://github.com/ngrx/platform/commit/628b865)), closes [#491](https://github.com/ngrx/platform/issues/491)
* **Effects:** Add root effects init action (#473) ([838ba17](https://github.com/ngrx/platform/commit/838ba17)), closes [#473](https://github.com/ngrx/platform/issues/473) [#246](https://github.com/ngrx/platform/issues/246)
* **Entity:** Add default selectId function for EntityAdapter (#405) ([2afb792](https://github.com/ngrx/platform/commit/2afb792)), closes [#405](https://github.com/ngrx/platform/issues/405)
* **Entity:** Add support for string or number type for ID (#441) ([46d6f2f](https://github.com/ngrx/platform/commit/46d6f2f)), closes [#441](https://github.com/ngrx/platform/issues/441)
* **Entity:** Enable creating entity selectors without composing a state selector (#490) ([aae4064](https://github.com/ngrx/platform/commit/aae4064)), closes [#490](https://github.com/ngrx/platform/issues/490)
* **Entity:** Rename 'sort' to 'sortComparer' ([274554b](https://github.com/ngrx/platform/commit/274554b)), closes [#370](https://github.com/ngrx/platform/issues/370)
* **Store:** createSelector with an array of selectors (#340) ([2f6a035](https://github.com/ngrx/platform/commit/2f6a035)), closes [#340](https://github.com/ngrx/platform/issues/340) [#192](https://github.com/ngrx/platform/issues/192)

<a name="4.0.5"></a>

## [4.0.5](https://github.com/ngrx/platform/compare/v4.0.4...v4.0.5) (2017-08-18)

### Bug Fixes

* **Effects:** Do not complete effects if one source errors or completes (#297) ([54747cf](https://github.com/ngrx/platform/commit/54747cf)), closes [#297](https://github.com/ngrx/platform/issues/297) [#232](https://github.com/ngrx/platform/issues/232)
* **Entity:** Return a referentially equal state if state did not change ([fbd6a66](https://github.com/ngrx/platform/commit/fbd6a66))
* **Entity:** Simplify target index finder for sorted entities ([335d255](https://github.com/ngrx/platform/commit/335d255))

<a name="4.0.4"></a>

## [4.0.4](https://github.com/ngrx/platform/compare/v4.0.3...v4.0.4) (2017-08-17)

### Bug Fixes

* **Effects:** Use factory provide for console (#288) ([bf7f70c](https://github.com/ngrx/platform/commit/bf7f70c)), closes [#288](https://github.com/ngrx/platform/issues/288) [#276](https://github.com/ngrx/platform/issues/276)
* **RouterStore:** Add generic type to RouterReducerState (#292) ([6da3ec5](https://github.com/ngrx/platform/commit/6da3ec5)), closes [#292](https://github.com/ngrx/platform/issues/292) [#289](https://github.com/ngrx/platform/issues/289)
* **RouterStore:** Only serialize snapshot in preactivation hook (#287) ([bbb7c99](https://github.com/ngrx/platform/commit/bbb7c99)), closes [#287](https://github.com/ngrx/platform/issues/287) [#286](https://github.com/ngrx/platform/issues/286)

<a name="4.0.3"></a>

## [4.0.3](https://github.com/ngrx/platform/compare/v4.0.2...v4.0.3) (2017-08-16)

### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9)), closes [#266](https://github.com/ngrx/platform/issues/266)
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#230](https://github.com/ngrx/platform/issues/230) [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076)), closes [#231](https://github.com/ngrx/platform/issues/231)
* **Store:** Add type signature for metareducer (#270) ([57633d2](https://github.com/ngrx/platform/commit/57633d2)), closes [#270](https://github.com/ngrx/platform/issues/270) [#264](https://github.com/ngrx/platform/issues/264) [#170](https://github.com/ngrx/platform/issues/170)
* **Store:** Set initial state for feature modules (#235) ([4aec80c](https://github.com/ngrx/platform/commit/4aec80c)), closes [#235](https://github.com/ngrx/platform/issues/235) [#206](https://github.com/ngrx/platform/issues/206) [#233](https://github.com/ngrx/platform/issues/233)
* **Store:** Update usage of compose for reducer factory (#252) ([683013c](https://github.com/ngrx/platform/commit/683013c)), closes [#252](https://github.com/ngrx/platform/issues/252) [#247](https://github.com/ngrx/platform/issues/247)
* **Store:** Use existing reducers when providing reducers without an InjectionToken (#254) ([c409252](https://github.com/ngrx/platform/commit/c409252)), closes [#254](https://github.com/ngrx/platform/issues/254) [#250](https://github.com/ngrx/platform/issues/250) [#116](https://github.com/ngrx/platform/issues/116)
* **Store:** Use injector to get reducers provided via InjectionTokens (#259) ([bd968fa](https://github.com/ngrx/platform/commit/bd968fa)), closes [#259](https://github.com/ngrx/platform/issues/259) [#189](https://github.com/ngrx/platform/issues/189)

### Features

* **RouterStore:** Add serializer for router state snapshot (#188) ([0fc1bcc](https://github.com/ngrx/platform/commit/0fc1bcc)), closes [#188](https://github.com/ngrx/platform/issues/188) [#97](https://github.com/ngrx/platform/issues/97) [#104](https://github.com/ngrx/platform/issues/104) [#237](https://github.com/ngrx/platform/issues/237)

<a name="4.0.2"></a>

## [4.0.2](https://github.com/ngrx/platform/compare/v4.0.1...v4.0.2) (2017-08-02)

### Bug Fixes

* **createSelector:** memoize projector function (#228) ([e2f1e57](https://github.com/ngrx/platform/commit/e2f1e57)), closes [#228](https://github.com/ngrx/platform/issues/228) [#226](https://github.com/ngrx/platform/issues/226)
* **docs:** update angular-cli variable ([eeb7d5d](https://github.com/ngrx/platform/commit/eeb7d5d))
* **Docs:** update effects description (#164) ([c77b2d9](https://github.com/ngrx/platform/commit/c77b2d9)), closes [#164](https://github.com/ngrx/platform/issues/164)
* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#121](https://github.com/ngrx/platform/issues/121) [#117](https://github.com/ngrx/platform/issues/117)
* **RouterStore:** Add support for cancellation with CanLoad guard (#223) ([2c006e8](https://github.com/ngrx/platform/commit/2c006e8)), closes [#223](https://github.com/ngrx/platform/issues/223) [#213](https://github.com/ngrx/platform/issues/213)
* **Store:** Remove auto-memoization of selector functions ([90899f7](https://github.com/ngrx/platform/commit/90899f7)), closes [#118](https://github.com/ngrx/platform/issues/118)

### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Platform:** Introduce [@ngrx](https://github.com/ngrx)/entity (#207) ([9bdfd70](https://github.com/ngrx/platform/commit/9bdfd70)), closes [#207](https://github.com/ngrx/platform/issues/207)
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#153](https://github.com/ngrx/platform/issues/153) [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)
* **Store:** Added initial state function support for features. Added more tests (#85) ([5e5d7dd](https://github.com/ngrx/platform/commit/5e5d7dd)), closes [#85](https://github.com/ngrx/platform/issues/85)

<a name="4.0.1"></a>

## [4.0.1](https://github.com/ngrx/platform/compare/v4.0.0...v4.0.1) (2017-07-18)

### Bug Fixes

* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#98](https://github.com/ngrx/platform/issues/98) [#93](https://github.com/ngrx/platform/issues/93)
* **effects:** make correct export path for testing module (#96) ([a5aad22](https://github.com/ngrx/platform/commit/a5aad22)), closes [#96](https://github.com/ngrx/platform/issues/96) [#94](https://github.com/ngrx/platform/issues/94)

<a name="4.0.0"></a>

# [4.0.0](https://github.com/ngrx/platform/compare/68bd9df...v4.0.0) (2017-07-18)

### Bug Fixes

* **build:** Fixed deployment of latest master as commit (#18) ([5d0ecf9](https://github.com/ngrx/platform/commit/5d0ecf9)), closes [#18](https://github.com/ngrx/platform/issues/18)
* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **build:** Limit concurrency for lerna bootstrap ([7e7a7d8](https://github.com/ngrx/platform/commit/7e7a7d8))
* **Devtools:** Removed SHOULD_INSTRUMENT token used to eagerly inject providers (#57) ([b90df34](https://github.com/ngrx/platform/commit/b90df34)), closes [#57](https://github.com/ngrx/platform/issues/57)
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1)), closes [#43](https://github.com/ngrx/platform/issues/43)
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))
* **Example:** Fix Book State interface parent (#90) ([6982952](https://github.com/ngrx/platform/commit/6982952)), closes [#90](https://github.com/ngrx/platform/issues/90)
* **example-app:** Suppress StoreDevtoolsConfig compiler warning ([8804156](https://github.com/ngrx/platform/commit/8804156))
* **omit:** Strengthen the type checking of the omit utility function ([3982038](https://github.com/ngrx/platform/commit/3982038))
* **router-store:** NavigationCancel and NavigationError creates a cycle when used with routerReducer ([a085730](https://github.com/ngrx/platform/commit/a085730)), closes [#68](https://github.com/ngrx/platform/issues/68)
* **Store:** Exported initial state tokens (#65) ([4b27b6d](https://github.com/ngrx/platform/commit/4b27b6d)), closes [#65](https://github.com/ngrx/platform/issues/65)
* **Store:** pass all required arguments to projector (#74) ([9b82b3a](https://github.com/ngrx/platform/commit/9b82b3a)), closes [#74](https://github.com/ngrx/platform/issues/74)
* **Store:** Remove parameter destructuring for strict mode (#33) (#77) ([c9d6a45](https://github.com/ngrx/platform/commit/c9d6a45)), closes [#33](https://github.com/ngrx/platform/issues/33) [#77](https://github.com/ngrx/platform/issues/77)
* **Store:** Removed readonly from type (#72) ([68274c9](https://github.com/ngrx/platform/commit/68274c9)), closes [#72](https://github.com/ngrx/platform/issues/72)
* **StoreDevtools:** Type InjectionToken for AOT compilation ([e21d688](https://github.com/ngrx/platform/commit/e21d688))

### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))

### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571)), closes [#70](https://github.com/ngrx/platform/issues/70)
* **router-store:** Added action types (#47) ([1f67cb3](https://github.com/ngrx/platform/commit/1f67cb3)), closes [#47](https://github.com/ngrx/platform/issues/47) [#44](https://github.com/ngrx/platform/issues/44)
* **store:** Add 'createSelector' and 'createFeatureSelector' utils (#10) ([41758b1](https://github.com/ngrx/platform/commit/41758b1)), closes [#10](https://github.com/ngrx/platform/issues/10)
* **Store:** Allow initial state function for AoT compatibility (#59) ([1a166ec](https://github.com/ngrx/platform/commit/1a166ec)), closes [#59](https://github.com/ngrx/platform/issues/59) [#51](https://github.com/ngrx/platform/issues/51)
* **Store:** Allow parent modules to provide reducers with tokens (#36) ([069b12f](https://github.com/ngrx/platform/commit/069b12f)), closes [#36](https://github.com/ngrx/platform/issues/36) [#34](https://github.com/ngrx/platform/issues/34)
* **Store:** Simplify API for adding meta-reducers (#87) ([d2295c7](https://github.com/ngrx/platform/commit/d2295c7)), closes [#87](https://github.com/ngrx/platform/issues/87)

### BREAKING CHANGES

* **Effects:** Effects API for registering effects has been updated to allow for multiple classes to be provided.

BEFORE:

```ts
@NgModule({
  imports: [EffectsModule.run(SourceA), EffectsModule.run(SourceB)],
})
export class AppModule {}
```

AFTER:

```ts
@NgModule({
  imports: [EffectsModule.forRoot([SourceA, SourceB, SourceC])],
})
export class AppModule {}

@NgModule({
  imports: [
    EffectsModule.forFeature([FeatureSourceA, FeatureSourceB, FeatureSourceC]),
  ],
})
export class SomeFeatureModule {}
```
