# Change Log

All notable changes to this project will be documented in this file.
See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
