# Change Log

All notable changes to this project will be documented in this file.
See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

      <a name="4.0.0"></a>
# 4.0.0 (2017-07-18)


### Bug Fixes

* **Devtools:** Removed SHOULD_INSTRUMENT token used to eagerly inject providers (#57) ([b90df34](https://github.com/ngrx/platform/commit/b90df34))
* **omit:** Strengthen the type checking of the omit utility function ([3982038](https://github.com/ngrx/platform/commit/3982038))
* **Store:** Exported initial state tokens (#65) ([4b27b6d](https://github.com/ngrx/platform/commit/4b27b6d))
* **Store:** pass all required arguments to projector (#74) ([9b82b3a](https://github.com/ngrx/platform/commit/9b82b3a))
* **Store:** Remove parameter destructuring for strict mode (#33) (#77) ([c9d6a45](https://github.com/ngrx/platform/commit/c9d6a45))
* **Store:** Removed readonly from type (#72) ([68274c9](https://github.com/ngrx/platform/commit/68274c9))


### Code Refactoring

* **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))


### Features

* **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
* **Effects:** Introduce new Effects testing module (#70) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))
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
