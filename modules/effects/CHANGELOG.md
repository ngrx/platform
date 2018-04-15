# Change Log

All notable changes to this project will be documented in this file.
See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

       <a name="5.2.0"></a>
# 5.2.0 (2018-03-07)



<a name="5.1.0"></a>
# 5.1.0 (2018-02-13)


### Bug Fixes

* **Effects:** Make ofType operator strictFunctionTypes safe (#789) ([c8560e4](https://github.com/ngrx/platform/commit/c8560e4)), closes [#753](https://github.com/ngrx/platform/issues/753)



<a name="5.0.1"></a>
## 5.0.1 (2018-01-25)


### Bug Fixes

* **Effects:** Provide instance from actions to ofType lettable operator (#751) ([33d48e7](https://github.com/ngrx/platform/commit/33d48e7)), closes [#739](https://github.com/ngrx/platform/issues/739)



<a name="5.0.0"></a>
# 5.0.0 (2018-01-22)


### Bug Fixes

* **Effects:** Ensure Store modules are loaded eagerly (#658) ([0a3398d](https://github.com/ngrx/platform/commit/0a3398d)), closes [#642](https://github.com/ngrx/platform/issues/642)
* **Effects:** Remove toPayload utility function (#738) ([b390ef5](https://github.com/ngrx/platform/commit/b390ef5))


### Features

* **Effects:** Add lettable ofType operator ([d5e1814](https://github.com/ngrx/platform/commit/d5e1814))
* **ErrorHandler:** Use the Angular ErrorHandler for reporting errors (#667) ([8f297d1](https://github.com/ngrx/platform/commit/8f297d1)), closes [#626](https://github.com/ngrx/platform/issues/626)
* **Schematics:** Introduce [@ngrx](https://github.com/ngrx)/schematics (#631) ([1837dba](https://github.com/ngrx/platform/commit/1837dba)), closes [#53](https://github.com/ngrx/platform/issues/53)


### BREAKING CHANGES

* **Effects:** The utility function `toPayload`, deprecated in @ngrx/effects v4.0, has been removed.

  Before:
   
   ```ts
   import { toPayload } from '@ngrx/effects';
   
   actions$.ofType('SOME_ACTION').map(toPayload);
   ```

   After:

   ```ts
   actions$.ofType('SOME_ACTION').map((action: SomeActionWithPayload) => action.payload)
   ```
* **ErrorHandler:** The ErrorReporter has been replaced with ErrorHandler
from angular/core.

BEFORE:

Errors were reported to the ngrx/effects ErrorReporter. The
ErrorReporter would log to the console by default.

AFTER:

Errors are now reported to the @angular/core ErrorHandler.
* **Effects:** Updates minimum version of RxJS dependency.

BEFORE:

Minimum peer dependency of RxJS ^5.0.0

AFTER:

Minimum peer dependency of RxJS ^5.5.0



<a name="4.1.1"></a>
## 4.1.1 (2017-11-07)


### Bug Fixes

* Add support for Angular 5 ([30a8c56](https://github.com/ngrx/platform/commit/30a8c56))



<a name="4.1.0"></a>
# 4.1.0 (2017-10-19)


### Bug Fixes

* **decorator:** add ExportDecoratedItems jsdoc for g3 (#456) ([2b0e0cf](https://github.com/ngrx/platform/commit/2b0e0cf))
* **Effects:** Simplify decorator handling for Closure compatibility ([ad30d40](https://github.com/ngrx/platform/commit/ad30d40))


### Features

* **Effects:** Add getEffectsMetadata() helper for verifying metadata ([628b865](https://github.com/ngrx/platform/commit/628b865)), closes [#491](https://github.com/ngrx/platform/issues/491)
* **Effects:** Add root effects init action (#473) ([838ba17](https://github.com/ngrx/platform/commit/838ba17)), closes [#246](https://github.com/ngrx/platform/issues/246)



<a name="4.0.5"></a>
## 4.0.5 (2017-08-18)


### Bug Fixes

* **Effects:** Do not complete effects if one source errors or completes (#297) ([54747cf](https://github.com/ngrx/platform/commit/54747cf)), closes [#232](https://github.com/ngrx/platform/issues/232)



<a name="4.0.4"></a>
## 4.0.4 (2017-08-17)


### Bug Fixes

* **Effects:** Use factory provide for console (#288) ([bf7f70c](https://github.com/ngrx/platform/commit/bf7f70c)), closes [#276](https://github.com/ngrx/platform/issues/276)



<a name="4.0.3"></a>
## 4.0.3 (2017-08-16)


### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9))
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076))



<a name="4.0.2"></a>
## 4.0.2 (2017-08-02)


### Bug Fixes

* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)



<a name="4.0.1"></a>
## 4.0.1 (2017-07-18)


### Bug Fixes

* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))


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




       <a name="5.1.0"></a>
# 5.1.0 (2018-02-13)


### Bug Fixes

* **Effects:** Make ofType operator strictFunctionTypes safe (#789) ([c8560e4](https://github.com/ngrx/platform/commit/c8560e4)), closes [#753](https://github.com/ngrx/platform/issues/753)



<a name="5.0.1"></a>
## 5.0.1 (2018-01-25)


### Bug Fixes

* **Effects:** Provide instance from actions to ofType lettable operator (#751) ([33d48e7](https://github.com/ngrx/platform/commit/33d48e7)), closes [#739](https://github.com/ngrx/platform/issues/739)



<a name="5.0.0"></a>
# 5.0.0 (2018-01-22)


### Bug Fixes

* **Effects:** Ensure Store modules are loaded eagerly (#658) ([0a3398d](https://github.com/ngrx/platform/commit/0a3398d)), closes [#642](https://github.com/ngrx/platform/issues/642)
* **Effects:** Remove toPayload utility function (#738) ([b390ef5](https://github.com/ngrx/platform/commit/b390ef5))


### Features

* **Effects:** Add lettable ofType operator ([d5e1814](https://github.com/ngrx/platform/commit/d5e1814))
* **ErrorHandler:** Use the Angular ErrorHandler for reporting errors (#667) ([8f297d1](https://github.com/ngrx/platform/commit/8f297d1)), closes [#626](https://github.com/ngrx/platform/issues/626)
* **Schematics:** Introduce [@ngrx](https://github.com/ngrx)/schematics (#631) ([1837dba](https://github.com/ngrx/platform/commit/1837dba)), closes [#53](https://github.com/ngrx/platform/issues/53)


### BREAKING CHANGES

* **Effects:** The utility function `toPayload`, deprecated in @ngrx/effects v4.0, has been removed.

 Before:
  
  ```ts
  import { toPayload } from '@ngrx/effects';
  
  actions$.ofType('SOME_ACTION').map(toPayload);
  ```

  After:

  ```ts
  actions$.ofType('SOME_ACTION').map((action: SomeActionWithPayload) => action.payload)
  ```
* **ErrorHandler:** The ErrorReporter has been replaced with ErrorHandler
from angular/core.

BEFORE:

Errors were reported to the ngrx/effects ErrorReporter. The
ErrorReporter would log to the console by default.

AFTER:

Errors are now reported to the @angular/core ErrorHandler.
* **Effects:** Updates minimum version of RxJS dependency.

BEFORE:

Minimum peer dependency of RxJS ^5.0.0

AFTER:

Minimum peer dependency of RxJS ^5.5.0



<a name="4.1.1"></a>
## 4.1.1 (2017-11-07)


### Bug Fixes

* Add support for Angular 5 ([30a8c56](https://github.com/ngrx/platform/commit/30a8c56))



<a name="4.1.0"></a>
# 4.1.0 (2017-10-19)


### Bug Fixes

* **decorator:** add ExportDecoratedItems jsdoc for g3 (#456) ([2b0e0cf](https://github.com/ngrx/platform/commit/2b0e0cf))
* **Effects:** Simplify decorator handling for Closure compatibility ([ad30d40](https://github.com/ngrx/platform/commit/ad30d40))


### Features

* **Effects:** Add getEffectsMetadata() helper for verifying metadata ([628b865](https://github.com/ngrx/platform/commit/628b865)), closes [#491](https://github.com/ngrx/platform/issues/491)
* **Effects:** Add root effects init action (#473) ([838ba17](https://github.com/ngrx/platform/commit/838ba17)), closes [#246](https://github.com/ngrx/platform/issues/246)



<a name="4.0.5"></a>
## 4.0.5 (2017-08-18)


### Bug Fixes

* **Effects:** Do not complete effects if one source errors or completes (#297) ([54747cf](https://github.com/ngrx/platform/commit/54747cf)), closes [#232](https://github.com/ngrx/platform/issues/232)



<a name="4.0.4"></a>
## 4.0.4 (2017-08-17)


### Bug Fixes

* **Effects:** Use factory provide for console (#288) ([bf7f70c](https://github.com/ngrx/platform/commit/bf7f70c)), closes [#276](https://github.com/ngrx/platform/issues/276)



<a name="4.0.3"></a>
## 4.0.3 (2017-08-16)


### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9))
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076))



<a name="4.0.2"></a>
## 4.0.2 (2017-08-02)


### Bug Fixes

* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)



<a name="4.0.1"></a>
## 4.0.1 (2017-07-18)


### Bug Fixes

* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))


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




      <a name="5.0.1"></a>
## 5.0.1 (2018-01-25)


### Bug Fixes

* **Effects:** Provide instance from actions to ofType lettable operator (#751) ([33d48e7](https://github.com/ngrx/platform/commit/33d48e7)), closes [#739](https://github.com/ngrx/platform/issues/739)



<a name="5.0.0"></a>
# 5.0.0 (2018-01-22)


### Bug Fixes

* **Effects:** Ensure Store modules are loaded eagerly (#658) ([0a3398d](https://github.com/ngrx/platform/commit/0a3398d)), closes [#642](https://github.com/ngrx/platform/issues/642)
* **Effects:** Remove toPayload utility function (#738) ([b390ef5](https://github.com/ngrx/platform/commit/b390ef5))


### Features

* **Effects:** Add lettable ofType operator ([d5e1814](https://github.com/ngrx/platform/commit/d5e1814))
* **ErrorHandler:** Use the Angular ErrorHandler for reporting errors (#667) ([8f297d1](https://github.com/ngrx/platform/commit/8f297d1)), closes [#626](https://github.com/ngrx/platform/issues/626)
* **Schematics:** Introduce [@ngrx](https://github.com/ngrx)/schematics (#631) ([1837dba](https://github.com/ngrx/platform/commit/1837dba)), closes [#53](https://github.com/ngrx/platform/issues/53)


### BREAKING CHANGES

* **Effects:** The utility function `toPayload`, deprecated in @ngrx/effects v4.0, has been removed.

Before:
 
 ```ts
 import { toPayload } from '@ngrx/effects';
 
 actions$.ofType('SOME_ACTION').map(toPayload);
 ```

 After:

 ```ts
 actions$.ofType('SOME_ACTION').map((action: SomeActionWithPayload) => action.payload)
 ```
* **ErrorHandler:** The ErrorReporter has been replaced with ErrorHandler
from angular/core.

BEFORE:

Errors were reported to the ngrx/effects ErrorReporter. The
ErrorReporter would log to the console by default.

AFTER:

Errors are now reported to the @angular/core ErrorHandler.
* **Effects:** Updates minimum version of RxJS dependency.

BEFORE:

Minimum peer dependency of RxJS ^5.0.0

AFTER:

Minimum peer dependency of RxJS ^5.5.0



<a name="4.1.1"></a>
## 4.1.1 (2017-11-07)


### Bug Fixes

* Add support for Angular 5 ([30a8c56](https://github.com/ngrx/platform/commit/30a8c56))



<a name="4.1.0"></a>
# 4.1.0 (2017-10-19)


### Bug Fixes

* **decorator:** add ExportDecoratedItems jsdoc for g3 (#456) ([2b0e0cf](https://github.com/ngrx/platform/commit/2b0e0cf))
* **Effects:** Simplify decorator handling for Closure compatibility ([ad30d40](https://github.com/ngrx/platform/commit/ad30d40))


### Features

* **Effects:** Add getEffectsMetadata() helper for verifying metadata ([628b865](https://github.com/ngrx/platform/commit/628b865)), closes [#491](https://github.com/ngrx/platform/issues/491)
* **Effects:** Add root effects init action (#473) ([838ba17](https://github.com/ngrx/platform/commit/838ba17)), closes [#246](https://github.com/ngrx/platform/issues/246)



<a name="4.0.5"></a>
## 4.0.5 (2017-08-18)


### Bug Fixes

* **Effects:** Do not complete effects if one source errors or completes (#297) ([54747cf](https://github.com/ngrx/platform/commit/54747cf)), closes [#232](https://github.com/ngrx/platform/issues/232)



<a name="4.0.4"></a>
## 4.0.4 (2017-08-17)


### Bug Fixes

* **Effects:** Use factory provide for console (#288) ([bf7f70c](https://github.com/ngrx/platform/commit/bf7f70c)), closes [#276](https://github.com/ngrx/platform/issues/276)



<a name="4.0.3"></a>
## 4.0.3 (2017-08-16)


### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9))
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076))



<a name="4.0.2"></a>
## 4.0.2 (2017-08-02)


### Bug Fixes

* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)



<a name="4.0.1"></a>
## 4.0.1 (2017-07-18)


### Bug Fixes

* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))


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




     <a name="5.0.0"></a>
# 5.0.0 (2018-01-22)


### Bug Fixes

* **Effects:** Ensure Store modules are loaded eagerly (#658) ([0a3398d](https://github.com/ngrx/platform/commit/0a3398d)), closes [#642](https://github.com/ngrx/platform/issues/642)
* **Effects:** Remove toPayload utility function (#738) ([b390ef5](https://github.com/ngrx/platform/commit/b390ef5))


### Features

* **Effects:** Add lettable ofType operator ([d5e1814](https://github.com/ngrx/platform/commit/d5e1814))
* **ErrorHandler:** Use the Angular ErrorHandler for reporting errors (#667) ([8f297d1](https://github.com/ngrx/platform/commit/8f297d1)), closes [#626](https://github.com/ngrx/platform/issues/626)
* **Schematics:** Introduce [@ngrx](https://github.com/ngrx)/schematics (#631) ([1837dba](https://github.com/ngrx/platform/commit/1837dba)), closes [#53](https://github.com/ngrx/platform/issues/53)


### BREAKING CHANGES

* **Effects:** The utility function `toPayload`, deprecated in @ngrx/effects v4.0, has been removed.

Before:

```ts
import { toPayload } from '@ngrx/effects';

actions$.ofType('SOME_ACTION').map(toPayload);
```

After:

```ts
actions$.ofType('SOME_ACTION').map((action: SomeActionWithPayload) => action.payload)
```
* **ErrorHandler:** The ErrorReporter has been replaced with ErrorHandler
from angular/core.

BEFORE:

Errors were reported to the ngrx/effects ErrorReporter. The
ErrorReporter would log to the console by default.

AFTER:

Errors are now reported to the @angular/core ErrorHandler.
* **Effects:** Updates minimum version of RxJS dependency.

BEFORE:

Minimum peer dependency of RxJS ^5.0.0

AFTER:

Minimum peer dependency of RxJS ^5.5.0



<a name="4.1.1"></a>
## 4.1.1 (2017-11-07)


### Bug Fixes

* Add support for Angular 5 ([30a8c56](https://github.com/ngrx/platform/commit/30a8c56))



<a name="4.1.0"></a>
# 4.1.0 (2017-10-19)


### Bug Fixes

* **decorator:** add ExportDecoratedItems jsdoc for g3 (#456) ([2b0e0cf](https://github.com/ngrx/platform/commit/2b0e0cf))
* **Effects:** Simplify decorator handling for Closure compatibility ([ad30d40](https://github.com/ngrx/platform/commit/ad30d40))


### Features

* **Effects:** Add getEffectsMetadata() helper for verifying metadata ([628b865](https://github.com/ngrx/platform/commit/628b865)), closes [#491](https://github.com/ngrx/platform/issues/491)
* **Effects:** Add root effects init action (#473) ([838ba17](https://github.com/ngrx/platform/commit/838ba17)), closes [#246](https://github.com/ngrx/platform/issues/246)



<a name="4.0.5"></a>
## 4.0.5 (2017-08-18)


### Bug Fixes

* **Effects:** Do not complete effects if one source errors or completes (#297) ([54747cf](https://github.com/ngrx/platform/commit/54747cf)), closes [#232](https://github.com/ngrx/platform/issues/232)



<a name="4.0.4"></a>
## 4.0.4 (2017-08-17)


### Bug Fixes

* **Effects:** Use factory provide for console (#288) ([bf7f70c](https://github.com/ngrx/platform/commit/bf7f70c)), closes [#276](https://github.com/ngrx/platform/issues/276)



<a name="4.0.3"></a>
## 4.0.3 (2017-08-16)


### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9))
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076))



<a name="4.0.2"></a>
## 4.0.2 (2017-08-02)


### Bug Fixes

* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)



<a name="4.0.1"></a>
## 4.0.1 (2017-07-18)


### Bug Fixes

* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))


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




   <a name="4.1.1"></a>
## 4.1.1 (2017-11-07)


### Bug Fixes

* Add support for Angular 5 ([30a8c56](https://github.com/ngrx/platform/commit/30a8c56))



<a name="4.1.0"></a>
# 4.1.0 (2017-10-19)


### Bug Fixes

* **decorator:** add ExportDecoratedItems jsdoc for g3 (#456) ([2b0e0cf](https://github.com/ngrx/platform/commit/2b0e0cf))
* **Effects:** Simplify decorator handling for Closure compatibility ([ad30d40](https://github.com/ngrx/platform/commit/ad30d40))


### Features

* **Effects:** Add getEffectsMetadata() helper for verifying metadata ([628b865](https://github.com/ngrx/platform/commit/628b865)), closes [#491](https://github.com/ngrx/platform/issues/491)
* **Effects:** Add root effects init action (#473) ([838ba17](https://github.com/ngrx/platform/commit/838ba17)), closes [#246](https://github.com/ngrx/platform/issues/246)



<a name="4.0.5"></a>
## 4.0.5 (2017-08-18)


### Bug Fixes

* **Effects:** Do not complete effects if one source errors or completes (#297) ([54747cf](https://github.com/ngrx/platform/commit/54747cf)), closes [#232](https://github.com/ngrx/platform/issues/232)



<a name="4.0.4"></a>
## 4.0.4 (2017-08-17)


### Bug Fixes

* **Effects:** Use factory provide for console (#288) ([bf7f70c](https://github.com/ngrx/platform/commit/bf7f70c)), closes [#276](https://github.com/ngrx/platform/issues/276)



<a name="4.0.3"></a>
## 4.0.3 (2017-08-16)


### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9))
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076))



<a name="4.0.2"></a>
## 4.0.2 (2017-08-02)


### Bug Fixes

* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)



<a name="4.0.1"></a>
## 4.0.1 (2017-07-18)


### Bug Fixes

* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))


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




 <a name="4.1.0"></a>
# 4.1.0 (2017-10-19)


### Bug Fixes

* **decorator:** add ExportDecoratedItems jsdoc for g3 (#456) ([2b0e0cf](https://github.com/ngrx/platform/commit/2b0e0cf))
* **Effects:** Simplify decorator handling for Closure compatibility ([ad30d40](https://github.com/ngrx/platform/commit/ad30d40))


### Features

* **Effects:** Add getEffectsMetadata() helper for verifying metadata ([628b865](https://github.com/ngrx/platform/commit/628b865)), closes [#491](https://github.com/ngrx/platform/issues/491)
* **Effects:** Add root effects init action (#473) ([838ba17](https://github.com/ngrx/platform/commit/838ba17)), closes [#246](https://github.com/ngrx/platform/issues/246)



<a name="4.0.5"></a>
## 4.0.5 (2017-08-18)


### Bug Fixes

* **Effects:** Do not complete effects if one source errors or completes (#297) ([54747cf](https://github.com/ngrx/platform/commit/54747cf)), closes [#232](https://github.com/ngrx/platform/issues/232)



<a name="4.0.4"></a>
## 4.0.4 (2017-08-17)


### Bug Fixes

* **Effects:** Use factory provide for console (#288) ([bf7f70c](https://github.com/ngrx/platform/commit/bf7f70c)), closes [#276](https://github.com/ngrx/platform/issues/276)



<a name="4.0.3"></a>
## 4.0.3 (2017-08-16)


### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9))
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076))



<a name="4.0.2"></a>
## 4.0.2 (2017-08-02)


### Bug Fixes

* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)



<a name="4.0.1"></a>
## 4.0.1 (2017-07-18)


### Bug Fixes

* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))


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




<a name="4.0.5"></a>
## 4.0.5 (2017-08-18)


### Bug Fixes

* **Effects:** Do not complete effects if one source errors or completes (#297) ([54747cf](https://github.com/ngrx/platform/commit/54747cf)), closes [#232](https://github.com/ngrx/platform/issues/232)



<a name="4.0.4"></a>
## 4.0.4 (2017-08-17)


### Bug Fixes

* **Effects:** Use factory provide for console (#288) ([bf7f70c](https://github.com/ngrx/platform/commit/bf7f70c)), closes [#276](https://github.com/ngrx/platform/issues/276)



<a name="4.0.3"></a>
## 4.0.3 (2017-08-16)


### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9))
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076))



<a name="4.0.2"></a>
## 4.0.2 (2017-08-02)


### Bug Fixes

* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)



<a name="4.0.1"></a>
## 4.0.1 (2017-07-18)


### Bug Fixes

* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))


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




<a name="4.0.4"></a>
## 4.0.4 (2017-08-17)


### Bug Fixes

* **Effects:** Use factory provide for console (#288) ([bf7f70c](https://github.com/ngrx/platform/commit/bf7f70c)), closes [#276](https://github.com/ngrx/platform/issues/276)



<a name="4.0.3"></a>
## 4.0.3 (2017-08-16)


### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9))
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076))



<a name="4.0.2"></a>
## 4.0.2 (2017-08-02)


### Bug Fixes

* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)



<a name="4.0.1"></a>
## 4.0.1 (2017-07-18)


### Bug Fixes

* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))


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




<a name="4.0.3"></a>
## 4.0.3 (2017-08-16)


### Bug Fixes

* **Effects:** Deprecate toPayload utility function (#266) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9))
* **Effects:** Ensure StoreModule is loaded before effects (#230) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
* **Effects:** Export EffectsNotification interface (#231) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076))



<a name="4.0.2"></a>
## 4.0.2 (2017-08-02)


### Bug Fixes

* **Effects:** Wrap testing source in an Actions observable (#121) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)


### Features

* **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
* **Store:** Add injection token option for feature modules (#153) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)



<a name="4.0.1"></a>
## 4.0.1 (2017-07-18)


### Bug Fixes

* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **effects:** allow downleveled annotations (#98) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))


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




<a name="4.0.0"></a>
# 4.0.0 (2017-07-18)


### Bug Fixes

* **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
* **Effects:** Start child effects after running root effects (#43) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
* **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))


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
