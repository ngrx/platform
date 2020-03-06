<a name="9.0.0-rc.0"></a>

# [9.0.0-rc.0](https://github.com/ngrx/platform/compare/9.0.0-beta.2...9.0.0-rc.0) (2020-03-02)

### Bug Fixes

- **data:** correct AppEntityServices example in ngrx data doc page ([#2413](https://github.com/ngrx/platform/issues/2413)) ([711ba0e](https://github.com/ngrx/platform/commit/711ba0e)), closes [#2280](https://github.com/ngrx/platform/issues/2280)
- **example:** fix a typo selectShowSidenav ([#2414](https://github.com/ngrx/platform/issues/2414)) ([c9ebb06](https://github.com/ngrx/platform/commit/c9ebb06))

### Features

- **entity:** add 'setOne' method to entity adapter ([#2410](https://github.com/ngrx/platform/issues/2410)) ([4b4bb85](https://github.com/ngrx/platform/commit/4b4bb85)), closes [#2369](https://github.com/ngrx/platform/issues/2369)

<a name="9.0.0-beta.2"></a>

# [9.0.0-beta.2](https://github.com/ngrx/platform/compare/9.0.0-beta.1...9.0.0-beta.2) (2020-02-25)

### Bug Fixes

- **docs:** replace duplicate link ([#2399](https://github.com/ngrx/platform/issues/2399)) ([d4502b4](https://github.com/ngrx/platform/commit/d4502b4))
- **effects:** use source instance for ngrxOnRunEffects to retain context ([#2401](https://github.com/ngrx/platform/issues/2401)) ([79c830c](https://github.com/ngrx/platform/commit/79c830c))

### Features

- **store-devtools:** add INITIAL_OPTIONS to public API ([#2405](https://github.com/ngrx/platform/issues/2405)) ([37f91db](https://github.com/ngrx/platform/commit/37f91db)), closes [#1470](https://github.com/ngrx/platform/issues/1470)

<a name="9.0.0-beta.1"></a>

# [9.0.0-beta.1](https://github.com/ngrx/platform/compare/9.0.0-beta.0...9.0.0-beta.1) (2020-02-18)

### Bug Fixes

- **data:** Angular 9 style ModuleWithProvider ([#2356](https://github.com/ngrx/platform/issues/2356)) ([#2357](https://github.com/ngrx/platform/issues/2357)) ([182f140](https://github.com/ngrx/platform/commit/182f140))
- **data:** change type of filter observable ([#2349](https://github.com/ngrx/platform/issues/2349)) ([94f3ef1](https://github.com/ngrx/platform/commit/94f3ef1)), closes [#2337](https://github.com/ngrx/platform/issues/2337)
- **data:** EntityDataModuleWithoutEffect ModuleWithProviders ([#2366](https://github.com/ngrx/platform/issues/2366)) ([234ce84](https://github.com/ngrx/platform/commit/234ce84))
- **data:** make mergeServerUpserts change state immutably ([#2374](https://github.com/ngrx/platform/issues/2374)) ([#2389](https://github.com/ngrx/platform/issues/2389)) ([b3a49c1](https://github.com/ngrx/platform/commit/b3a49c1))
- **data:** make undoMany remove tracking changes in changeState ([#2346](https://github.com/ngrx/platform/issues/2346)) ([#2352](https://github.com/ngrx/platform/issues/2352)) ([637b2c7](https://github.com/ngrx/platform/commit/637b2c7))
- **data:** use ng_package for bundling instead of pkg_npm ([9a935b1](https://github.com/ngrx/platform/commit/9a935b1))
- **effects:** dispatch OnInitEffects action after registration ([#2386](https://github.com/ngrx/platform/issues/2386)) ([daf1e64](https://github.com/ngrx/platform/commit/daf1e64)), closes [#2373](https://github.com/ngrx/platform/issues/2373)
- **store:** provide the same instance of MockStore ([#2381](https://github.com/ngrx/platform/issues/2381)) ([827f336](https://github.com/ngrx/platform/commit/827f336)), closes [#2362](https://github.com/ngrx/platform/issues/2362)

### Features

- **effects:** limit retries to 10 by default ([#2376](https://github.com/ngrx/platform/issues/2376)) ([88124a7](https://github.com/ngrx/platform/commit/88124a7)), closes [#2303](https://github.com/ngrx/platform/issues/2303)
- **store:** add strictActionWithinNgZone runtime check ([#2364](https://github.com/ngrx/platform/issues/2364)) ([4cae255](https://github.com/ngrx/platform/commit/4cae255)), closes [#2339](https://github.com/ngrx/platform/issues/2339)
- **store:** testing - clean up mock store and remove static property ([#2361](https://github.com/ngrx/platform/issues/2361)) ([ee2c114](https://github.com/ngrx/platform/commit/ee2c114))

<a name="9.0.0-beta.0"></a>

# [9.0.0-beta.0](https://github.com/ngrx/platform/compare/8.6.0...9.0.0-beta.0) (2020-02-06)

### Bug Fixes

- **data:** allow additional selectors in entitySelectors$ ([#2332](https://github.com/ngrx/platform/issues/2332)) ([900bf75](https://github.com/ngrx/platform/commit/900bf75))
- **effects:** dispatch init action once ([#2164](https://github.com/ngrx/platform/issues/2164)) ([a528320](https://github.com/ngrx/platform/commit/a528320)), closes [#2106](https://github.com/ngrx/platform/issues/2106)
- **effects:** fix specs for ng-add tests ([#2314](https://github.com/ngrx/platform/issues/2314)) ([98d6606](https://github.com/ngrx/platform/commit/98d6606))
- **schematics:** migrate spec to skipTest to be in line with Angular CLI ([#2253](https://github.com/ngrx/platform/issues/2253)) ([714ae5f](https://github.com/ngrx/platform/commit/714ae5f)), closes [#2242](https://github.com/ngrx/platform/issues/2242)
- **store:** add not allowed check to action creator config ([#2313](https://github.com/ngrx/platform/issues/2313)) ([f6336d5](https://github.com/ngrx/platform/commit/f6336d5))
- **store:** allow union of types in props ([#2301](https://github.com/ngrx/platform/issues/2301)) ([33241cb](https://github.com/ngrx/platform/commit/33241cb))
- **store:** replace Creator with ActionCreator on createAction ([#2299](https://github.com/ngrx/platform/issues/2299)) ([fe6bfa7](https://github.com/ngrx/platform/commit/fe6bfa7))

### Chores

- update deps to Angular version 9 ([#2234](https://github.com/ngrx/platform/issues/2234)) ([b146af5](https://github.com/ngrx/platform/commit/b146af5))

### Code Refactoring

- **schematics:** Flag minimal is set to true ([#2258](https://github.com/ngrx/platform/issues/2258)) ([7ecaa22](https://github.com/ngrx/platform/commit/7ecaa22)), closes [#2250](https://github.com/ngrx/platform/issues/2250)
- **schematics:** migrate from styleext to style ([#2254](https://github.com/ngrx/platform/issues/2254)) ([2801018](https://github.com/ngrx/platform/commit/2801018)), closes [#2248](https://github.com/ngrx/platform/issues/2248)

### Features

- **component:** initial setup ([#2257](https://github.com/ngrx/platform/issues/2257)) ([b8a769a](https://github.com/ngrx/platform/commit/b8a769a))
- **docs:** add presskit page ([#2296](https://github.com/ngrx/platform/issues/2296)) ([9ac1165](https://github.com/ngrx/platform/commit/9ac1165)), closes [#2293](https://github.com/ngrx/platform/issues/2293)
- **effects:** add migration for breaking change that renames effects error handler config key ([#2335](https://github.com/ngrx/platform/issues/2335)) ([93b4081](https://github.com/ngrx/platform/commit/93b4081))
- **effects:** make resubscription handler overridable ([#2295](https://github.com/ngrx/platform/issues/2295)) ([3a9ad63](https://github.com/ngrx/platform/commit/3a9ad63)), closes [#2294](https://github.com/ngrx/platform/issues/2294)
- **entity:** deprecate addAll and rename it to setAll ([#2348](https://github.com/ngrx/platform/issues/2348)) ([27f5059](https://github.com/ngrx/platform/commit/27f5059)), closes [#2330](https://github.com/ngrx/platform/issues/2330)
- **router:** enabling MinimalRouterStateSerializer by default ([#2326](https://github.com/ngrx/platform/issues/2326)) ([ba37ad8](https://github.com/ngrx/platform/commit/ba37ad8)), closes [#2225](https://github.com/ngrx/platform/issues/2225)
- **router-store:** add migration to add the default serializer ([#2291](https://github.com/ngrx/platform/issues/2291)) ([b742a8c](https://github.com/ngrx/platform/commit/b742a8c))
- **schematics:** update creators to the default ([6149753](https://github.com/ngrx/platform/commit/6149753))
- **store:** add default generic type to Store and MockStore ([#2325](https://github.com/ngrx/platform/issues/2325)) ([09daeb9](https://github.com/ngrx/platform/commit/09daeb9))
- **store:** ignore actions from NgRx libraries in runtime checks ([#2351](https://github.com/ngrx/platform/issues/2351)) ([0dabfc4](https://github.com/ngrx/platform/commit/0dabfc4))
- update to Angular 9-rc.13 ([#2345](https://github.com/ngrx/platform/issues/2345)) ([d7fdf7f](https://github.com/ngrx/platform/commit/d7fdf7f))
- **store:** add clearResult to reset a mock selector ([#2270](https://github.com/ngrx/platform/issues/2270)) ([803295b](https://github.com/ngrx/platform/commit/803295b)), closes [#2244](https://github.com/ngrx/platform/issues/2244)
- **store:** compile time errors when action creators being passed to dispatch without () ([#2306](https://github.com/ngrx/platform/issues/2306)) ([98b74ad](https://github.com/ngrx/platform/commit/98b74ad))
- **store:** enable immutability checks by default ([#2266](https://github.com/ngrx/platform/issues/2266)) ([1758d34](https://github.com/ngrx/platform/commit/1758d34)), closes [#2217](https://github.com/ngrx/platform/issues/2217)
- **store:** testing - expose MockStore provider ([#2331](https://github.com/ngrx/platform/issues/2331)) ([ef5cd5f](https://github.com/ngrx/platform/commit/ef5cd5f)), closes [#2328](https://github.com/ngrx/platform/issues/2328)

### BREAKING CHANGES

- **router:** The MinimalRouterStateSerializer is enabled by default.

BEFORE:

If no router state serializer is provided through the configuration of router store, the DefaultRouterStateSerializer is used.

AFTER:

If no router state serializer is provided through the configuration of router store, the MinimalRouterStateSerializer is used.

- **effects:** `resubscribeOnError` renamed to `useEffectsErrorHandler` in `createEffect` metadata

BEFORE:

```ts
class MyEffects {
  effect$ = createEffect(() => stream$, {
    resubscribeOnError: true, // default
  });
}
```

AFTER:

```ts
class MyEffects {
  effect$ = createEffect(() => stream$, {
    useEffectsErrorHandler: true, // default
  });
}
```

- **effects:** BEFORE:

When the effect class was registered, the init action would be dispatched.
If the effect was provided in multiple lazy loaded modules, the init action would be dispatched for every module.

AFTER:

The init action is only dispatched once
The init action is now dispatched based on the identifier of the effect (via ngrxOnIdentifyEffects)

- **schematics:** To be inline with the Angular CLI, we migrated the `--spec` to `--skipTest`.
  By default skipTest is false, this way you will always be provided with `*.spec.ts files`

BEFORE:

```sh
ng generate action User --spec
```

AFTER:

```sh
ng generate action User
```

- **store:** BEFORE:

Using `mockSelector.setResult(undefined)` resulted in clearing the
return value.

AFTER:

Using `mockSelector.setResult(undefined)` will set the return value of
the selector to `undefined`.
To reset the mock selector, use `mockSelector.clearResult()`.

- **schematics:** To be inline with the Angular CLI, the `styleExt` option has been changed to `style`.

BEFORE:

```
"@schematics/angular:component": {
      "inlineStyle": true,
      "prefix": "aio",
      "styleext": "scss"
    }
...
```

AFTER:

```
"@schematics/angular:component": {
      "inlineStyle": true,
      "prefix": "aio",
      "style": "scss"
    }
....
```

- **store:** Immutability checks are enabled by default.

BEFORE:

Immutability checks are opt-in.

AFTER:

If state or action is mutated then there will be a run time exception thrown.

- **schematics:** With this change by default the minimal setup for `@ngrx/store` will be generated.

BEFORE:

```
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    .....
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

AFTER:

```
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({})
    ....
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

- **schematics:** BEFORE:

The create functions weren't the default to create actions, reducers and effects

AFTER:

The create functions are the default to create actions (createAction, reducers (createReducer) and effects (createEffect)
To fallback to the previous generators, use

`sh ng generate reducer ReducerName --creators=false`

- Libraries will depend on Angular version 9

<a name="8.6.0"></a>

# [8.6.0](https://github.com/ngrx/platform/compare/8.5.2...8.6.0) (2019-12-18)

### Features

- **router-store:** add action creator for root router actions ([#2272](https://github.com/ngrx/platform/issues/2272)) ([f17589f](https://github.com/ngrx/platform/commit/f17589f)), closes [#2206](https://github.com/ngrx/platform/issues/2206)

<a name="8.5.2"></a>

## [8.5.2](https://github.com/ngrx/platform/compare/8.5.1...8.5.2) (2019-11-21)

### Bug Fixes

- **effects:** add EffectsRootModule and EffectsFeatureModule to public API ([#2273](https://github.com/ngrx/platform/issues/2273)) ([abe1f6b](https://github.com/ngrx/platform/commit/abe1f6b))
- **store:** added noop for addFeature in MockReducerManager ([#2265](https://github.com/ngrx/platform/issues/2265)) ([c42e444](https://github.com/ngrx/platform/commit/c42e444)), closes [#2263](https://github.com/ngrx/platform/issues/2263)
- **store-devtools:** escaping the safelist and blocklist strings ([#2259](https://github.com/ngrx/platform/issues/2259)) ([e888977](https://github.com/ngrx/platform/commit/e888977)), closes [#2228](https://github.com/ngrx/platform/issues/2228)

<a name="8.5.1"></a>

## [8.5.1](https://github.com/ngrx/platform/compare/8.5.0...8.5.1) (2019-11-12)

### Bug Fixes

- **effects:** add action creator for root effects init action ([#2219](https://github.com/ngrx/platform/issues/2219)) ([de9a590](https://github.com/ngrx/platform/commit/de9a590)), closes [#2218](https://github.com/ngrx/platform/issues/2218)
- **effects:** export CreateEffectMetadata ([#2245](https://github.com/ngrx/platform/issues/2245)) ([bfe4c81](https://github.com/ngrx/platform/commit/bfe4c81)), closes [#2243](https://github.com/ngrx/platform/issues/2243)

<a name="8.5.0"></a>

# [8.5.0](https://github.com/ngrx/platform/compare/8.4.0...8.5.0) (2019-11-07)

### Bug Fixes

- **effects:** resubscribe every time an error occurs ([#2165](https://github.com/ngrx/platform/issues/2165)) ([0d59783](https://github.com/ngrx/platform/commit/0d59783))
- **store:** disallow arrays in action creators ([#2155](https://github.com/ngrx/platform/issues/2155)) ([1e4c0be](https://github.com/ngrx/platform/commit/1e4c0be))
- **store:** improve createFeatureSelector warning ([#2163](https://github.com/ngrx/platform/issues/2163)) ([e4765d6](https://github.com/ngrx/platform/commit/e4765d6)), closes [#2116](https://github.com/ngrx/platform/issues/2116)
- **store:** improve types for string selectors ([#2174](https://github.com/ngrx/platform/issues/2174)) ([46a8467](https://github.com/ngrx/platform/commit/46a8467))

### Features

- **data:** add entity config in app module declaration for ng-add ([#2133](https://github.com/ngrx/platform/issues/2133)) ([6ca3056](https://github.com/ngrx/platform/commit/6ca3056))
- **effects:** createEffect returns specific type for dispatch false ([#2195](https://github.com/ngrx/platform/issues/2195)) ([f70600f](https://github.com/ngrx/platform/commit/f70600f))
- **effects:** improve types for ofType with action creators ([#2175](https://github.com/ngrx/platform/issues/2175)) ([cf02dd2](https://github.com/ngrx/platform/commit/cf02dd2))
- **schematics:** add message prompts for individual schematics ([#2143](https://github.com/ngrx/platform/issues/2143)) ([fcb01e2](https://github.com/ngrx/platform/commit/fcb01e2))
- **schematics:** add selector schematics ([#2160](https://github.com/ngrx/platform/issues/2160)) ([78817c7](https://github.com/ngrx/platform/commit/78817c7)), closes [#2140](https://github.com/ngrx/platform/issues/2140)
- **store:** add On interface to public api ([#2157](https://github.com/ngrx/platform/issues/2157)) ([1b4ba1a](https://github.com/ngrx/platform/commit/1b4ba1a))

<a name="8.4.0"></a>

# [8.4.0](https://github.com/ngrx/platform/compare/8.3.0...8.4.0) (2019-10-09)

### Bug Fixes

- **schematics:** fixed the schematics/action spec template ([#2092](https://github.com/ngrx/platform/issues/2092)) ([ed3b1f9](https://github.com/ngrx/platform/commit/ed3b1f9)), closes [#2082](https://github.com/ngrx/platform/issues/2082)
- **store:** improve consistency of memoized selector result when projection fails ([#2101](https://github.com/ngrx/platform/issues/2101)) ([c63941c](https://github.com/ngrx/platform/commit/c63941c)), closes [#2100](https://github.com/ngrx/platform/issues/2100)

### Features

- **effects:** throw error when forRoot() is used more than once ([b46748c](https://github.com/ngrx/platform/commit/b46748c))
- **schematics:** add createEffect migration schematic ([#2136](https://github.com/ngrx/platform/issues/2136)) ([9eb1bd5](https://github.com/ngrx/platform/commit/9eb1bd5))
- **store:** add refreshState method to mock store ([#2148](https://github.com/ngrx/platform/issues/2148)) ([30e876f](https://github.com/ngrx/platform/commit/30e876f)), closes [#2121](https://github.com/ngrx/platform/issues/2121)
- **store:** allow multiple on handlers for the same action in createReducer([#2103](https://github.com/ngrx/platform/issues/2103)) ([9a70262](https://github.com/ngrx/platform/commit/9a70262)), closes [#1956](https://github.com/ngrx/platform/issues/1956)
- **store:** cleanup selector after a test ([2964e2b](https://github.com/ngrx/platform/commit/2964e2b))
- **store:** throw error when forRoot() is used more than once ([4304865](https://github.com/ngrx/platform/commit/4304865))

<a name="8.3.0"></a>

# [8.3.0](https://github.com/ngrx/platform/compare/8.2.0...8.3.0) (2019-08-29)

### Bug Fixes

- **data:** use correct guard when handling optimistic update ([#2060](https://github.com/ngrx/platform/issues/2060)) ([34c0420](https://github.com/ngrx/platform/commit/34c0420)), closes [#2059](https://github.com/ngrx/platform/issues/2059)
- **store:** add DefaultProjectorFn to public API ([#2090](https://github.com/ngrx/platform/issues/2090)) ([2d37b48](https://github.com/ngrx/platform/commit/2d37b48))
- **store:** should not run schematics when not using named imports ([#2095](https://github.com/ngrx/platform/issues/2095)) ([7cadbc0](https://github.com/ngrx/platform/commit/7cadbc0)), closes [#2093](https://github.com/ngrx/platform/issues/2093)

### Features

- **store:** add verbose error message for undefined feature state in development mode ([#2078](https://github.com/ngrx/platform/issues/2078)) ([6946e2e](https://github.com/ngrx/platform/commit/6946e2e)), closes [#1897](https://github.com/ngrx/platform/issues/1897)

<a name="8.2.0"></a>

# [8.2.0](https://github.com/ngrx/platform/compare/8.1.0...8.2.0) (2019-07-31)

### Bug Fixes

- **effects:** resubscribe every time an error occurs ([#2023](https://github.com/ngrx/platform/issues/2023)) ([#2026](https://github.com/ngrx/platform/issues/2026)) ([5b48912](https://github.com/ngrx/platform/commit/5b48912))
- **store:** add missing StoreConfig and RootStoreConfig exports ([#2009](https://github.com/ngrx/platform/issues/2009)) ([5e01e50](https://github.com/ngrx/platform/commit/5e01e50)), closes [#2007](https://github.com/ngrx/platform/issues/2007)

### Features

- **docs:** enable search functionality ([#2020](https://github.com/ngrx/platform/issues/2020)) ([3cc4f3d](https://github.com/ngrx/platform/commit/3cc4f3d))
- **router-store:** add selectQueryParam and selectRouteParam ([#2014](https://github.com/ngrx/platform/issues/2014)) ([57fd3d7](https://github.com/ngrx/platform/commit/57fd3d7))
- **schematics:** add option to use MockStore in container tests ([#2029](https://github.com/ngrx/platform/issues/2029)) ([6905d52](https://github.com/ngrx/platform/commit/6905d52)), closes [#2028](https://github.com/ngrx/platform/issues/2028)
- **store:** add USER_RUNTIME_CHECKS public token ([#2006](https://github.com/ngrx/platform/issues/2006)) ([fa8da34](https://github.com/ngrx/platform/commit/fa8da34)), closes [#1973](https://github.com/ngrx/platform/issues/1973)

<a name="8.1.0"></a>

# [8.1.0](https://github.com/ngrx/platform/compare/8.0.1...8.1.0) (2019-07-09)

### Bug Fixes

- **data:** allow ChangeSetItemFactory to update entities with number ids ([#1995](https://github.com/ngrx/platform/issues/1995)) ([f11c7b2](https://github.com/ngrx/platform/commit/f11c7b2)), closes [#1988](https://github.com/ngrx/platform/issues/1988)
- **data:** search for replacements in all files when using ng-add ([#1971](https://github.com/ngrx/platform/issues/1971)) ([30ce2c6](https://github.com/ngrx/platform/commit/30ce2c6))
- **store:** add immutability check for IE compatibility ([#1997](https://github.com/ngrx/platform/issues/1997)) ([11c0864](https://github.com/ngrx/platform/commit/11c0864)), closes [#1991](https://github.com/ngrx/platform/issues/1991)
- **store:** fix typo in runtime checks injection token description ([#1975](https://github.com/ngrx/platform/issues/1975)) ([125d950](https://github.com/ngrx/platform/commit/125d950)), closes [#1972](https://github.com/ngrx/platform/issues/1972)

### Features

- **effects:** add support for minimal setup option for ng-add ([e839568](https://github.com/ngrx/platform/commit/e839568))
- **effects:** export EffectConfig and add docs ([6a4bbcf](https://github.com/ngrx/platform/commit/6a4bbcf))
- **schematics:** add support for minimal setup option for store and effects ([cede393](https://github.com/ngrx/platform/commit/cede393))
- **schematics:** enable immutability checks for root store by default ([#1983](https://github.com/ngrx/platform/issues/1983)) ([2b8178d](https://github.com/ngrx/platform/commit/2b8178d)), closes [#1950](https://github.com/ngrx/platform/issues/1950)
- **store:** add support for minimal setup option for ng-add ([12202a7](https://github.com/ngrx/platform/commit/12202a7))

<a name="8.0.1"></a>

## [8.0.1](https://github.com/ngrx/platform/compare/8.0.0...8.0.1) (2019-06-10)

### Bug Fixes

- **store:** prevent passing of action creator function to store dispatch and effects ([#1914](https://github.com/ngrx/platform/issues/1914)) ([78153cb](https://github.com/ngrx/platform/commit/78153cb)), closes [#1906](https://github.com/ngrx/platform/issues/1906)

<a name="8.0.0"></a>

# [8.0.0](https://github.com/ngrx/platform/compare/8.0.0-rc.1...8.0.0) (2019-06-06)

### Features

- **store:** add protection from type property use ([#1923](https://github.com/ngrx/platform/issues/1923)) ([bb9add7](https://github.com/ngrx/platform/commit/bb9add7)), closes [#1917](https://github.com/ngrx/platform/issues/1917)
- **store:** capture the type of a selector projector function ([#1920](https://github.com/ngrx/platform/issues/1920)) ([4e39cc1](https://github.com/ngrx/platform/commit/4e39cc1)), closes [#1908](https://github.com/ngrx/platform/issues/1908)

### Performance Improvements

- fine tune schematics to only commit changes ([#1925](https://github.com/ngrx/platform/issues/1925)) ([5fcdd3b](https://github.com/ngrx/platform/commit/5fcdd3b))

<a name="8.0.0-rc.1"></a>

# [8.0.0-rc.1](https://github.com/ngrx/platform/compare/8.0.0-rc.0...8.0.0-rc.1) (2019-06-04)

### Bug Fixes

- **router-store:** remove circular dependency in serializers ([#1904](https://github.com/ngrx/platform/issues/1904)) ([0407c5b](https://github.com/ngrx/platform/commit/0407c5b)), closes [#1902](https://github.com/ngrx/platform/issues/1902)

### Features

- **store:** add ngrx-store-freeze migration ([#1901](https://github.com/ngrx/platform/issues/1901)) ([4146650](https://github.com/ngrx/platform/commit/4146650)), closes [#1896](https://github.com/ngrx/platform/issues/1896)

<a name="8.0.0-rc.0"></a>

# [8.0.0-rc.0](https://github.com/ngrx/platform/compare/8.0.0-beta.2...8.0.0-rc.0) (2019-05-30)

### Bug Fixes

- update signature for createSelectorFactory and createSelector to return a MemoizedSelector ([#1883](https://github.com/ngrx/platform/issues/1883)) ([8b31da7](https://github.com/ngrx/platform/commit/8b31da7))
- **store:** adjust mock store to handle selectors with props ([#1878](https://github.com/ngrx/platform/issues/1878)) ([a7ded00](https://github.com/ngrx/platform/commit/a7ded00)), closes [#1864](https://github.com/ngrx/platform/issues/1864) [#1873](https://github.com/ngrx/platform/issues/1873)

### Features

- **effects:** resubscribe to effects on error ([#1881](https://github.com/ngrx/platform/issues/1881)) ([71137e5](https://github.com/ngrx/platform/commit/71137e5))
- **example:** add examples of effects not based on the Actions stream ([#1845](https://github.com/ngrx/platform/issues/1845)) ([3454e70](https://github.com/ngrx/platform/commit/3454e70)), closes [#1830](https://github.com/ngrx/platform/issues/1830)
- **router-store:** add routerState config option ([#1847](https://github.com/ngrx/platform/issues/1847)) ([d874cfc](https://github.com/ngrx/platform/commit/d874cfc)), closes [#1834](https://github.com/ngrx/platform/issues/1834)
- **router-store:** add selectors for router state ([#1874](https://github.com/ngrx/platform/issues/1874)) ([21c67cc](https://github.com/ngrx/platform/commit/21c67cc)), closes [#1854](https://github.com/ngrx/platform/issues/1854)
- **store:** split immutibility checks in state and action checks ([#1894](https://github.com/ngrx/platform/issues/1894)) ([c59c211](https://github.com/ngrx/platform/commit/c59c211))

### Reverts

- **store:** store should fail synchronously ([#1871](https://github.com/ngrx/platform/issues/1871)) ([59a9e6c](https://github.com/ngrx/platform/commit/59a9e6c)), closes [#1865](https://github.com/ngrx/platform/issues/1865)

### BREAKING CHANGES

- **effects:** Prior to introduction of automatic resubscriptions on errors, all effects had effectively {resubscribeOnError: false} behavior. For the rare cases when this is still wanted please add {resubscribeOnError: false} to the effect metadata.

BEFORE:

```ts
login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(LoginPageActions.login),
    mapToAction(
      // Happy path callback
      action =>
        this.authService
          .login(action.credentials)
          .pipe(map(user => AuthApiActions.loginSuccess({ user }))),
      // error callback
      error => AuthApiActions.loginFailure({ error })
    )
  )
);
```

AFTER:

```ts
login$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(LoginPageActions.login),
      mapToAction(
        // Happy path callback
        action =>
          this.authService
            .login(action.credentials)
            .pipe(map(user => AuthApiActions.loginSuccess({ user }))),
        // error callback
        error => AuthApiActions.loginFailure({ error })
      )
      // Errors are handled and it is safe to disable resubscription
    ),
  { resubscribeOnError: false }
);
```

- The return type of the createSelectorFactory and createSelector is now a MemoizedSelector instead of a Selector

<a name="8.0.0-beta.2"></a>

# [8.0.0-beta.2](https://github.com/ngrx/platform/compare/8.0.0-beta.1...8.0.0-beta.2) (2019-05-15)

### Bug Fixes

- **data:** update the package name for replacement to ngrx-data ([#1805](https://github.com/ngrx/platform/issues/1805)) ([00c00e0](https://github.com/ngrx/platform/commit/00c00e0)), closes [#1802](https://github.com/ngrx/platform/issues/1802)
- **example:** resolve circular dependency ([#1833](https://github.com/ngrx/platform/issues/1833)) ([1fbd59c](https://github.com/ngrx/platform/commit/1fbd59c))

### Features

- **effects:** add mapToAction operator ([#1822](https://github.com/ngrx/platform/issues/1822)) ([1ff986f](https://github.com/ngrx/platform/commit/1ff986f)), closes [#1224](https://github.com/ngrx/platform/issues/1224)
- **store:** add option to mock selectors in MockStoreConfig ([#1836](https://github.com/ngrx/platform/issues/1836)) ([070228c](https://github.com/ngrx/platform/commit/070228c)), closes [#1827](https://github.com/ngrx/platform/issues/1827)
- **store:** expand createReducer type signature to support up to ten action creators ([#1803](https://github.com/ngrx/platform/issues/1803)) ([63e4926](https://github.com/ngrx/platform/commit/63e4926))
- **store:** warn when same action is registered ([#1801](https://github.com/ngrx/platform/issues/1801)) ([ecda5f7](https://github.com/ngrx/platform/commit/ecda5f7)), closes [#1758](https://github.com/ngrx/platform/issues/1758)

### Reverts

- warn when same action is registered ([#1801](https://github.com/ngrx/platform/issues/1801)) ([#1841](https://github.com/ngrx/platform/issues/1841)) ([b07ae4e](https://github.com/ngrx/platform/commit/b07ae4e))

<a name="8.0.0-beta.1"></a>

# [8.0.0-beta.1](https://github.com/ngrx/platform/compare/8.0.0-beta.0...8.0.0-beta.1) (2019-04-24)

### Features

- **data:** add schematics and migrations ([#1782](https://github.com/ngrx/platform/issues/1782)) ([c79362d](https://github.com/ngrx/platform/commit/c79362d))
- **schematics:** add support for reducer creators ([#1785](https://github.com/ngrx/platform/issues/1785)) ([8a0a049](https://github.com/ngrx/platform/commit/8a0a049)), closes [#1764](https://github.com/ngrx/platform/issues/1764)
- **store:** change createReducer to avoid generic ([#1796](https://github.com/ngrx/platform/issues/1796)) ([8f2cb7b](https://github.com/ngrx/platform/commit/8f2cb7b))

<a name="8.0.0-beta.0"></a>

# [8.0.0-beta.0](https://github.com/ngrx/platform/compare/7.4.0...8.0.0-beta.0) (2019-04-17)

### Bug Fixes

- **effects:** add the export of EffectMetadata ([#1720](https://github.com/ngrx/platform/issues/1720)) ([214316f](https://github.com/ngrx/platform/commit/214316f))
- **example:** handle possible undefined results from Dictionary ([#1745](https://github.com/ngrx/platform/issues/1745)) ([861b0cb](https://github.com/ngrx/platform/commit/861b0cb)), closes [#1735](https://github.com/ngrx/platform/issues/1735)
- **schematics:** check for empty name when using store schematic for feature states ([#1659](https://github.com/ngrx/platform/issues/1659)) ([#1666](https://github.com/ngrx/platform/issues/1666)) ([3b9b890](https://github.com/ngrx/platform/commit/3b9b890))
- **store:** add the missing bracket in immutability meta-reducer ([#1721](https://github.com/ngrx/platform/issues/1721)) ([56f8a59](https://github.com/ngrx/platform/commit/56f8a59))
- **Store:** selector with only a projector ([#1579](https://github.com/ngrx/platform/issues/1579)) ([da1ec80](https://github.com/ngrx/platform/commit/da1ec80)), closes [#1558](https://github.com/ngrx/platform/issues/1558)
- **StoreDevTools:** rename action list filters ([#1589](https://github.com/ngrx/platform/issues/1589)) ([5581826](https://github.com/ngrx/platform/commit/5581826)), closes [#1557](https://github.com/ngrx/platform/issues/1557)

### Code Refactoring

- **Store:** don't export internal functions and tokens ([#1679](https://github.com/ngrx/platform/issues/1679)) ([0446a15](https://github.com/ngrx/platform/commit/0446a15)), closes [#1657](https://github.com/ngrx/platform/issues/1657)

### Features

- **schematics:** add support for action creators to schematics ([#1765](https://github.com/ngrx/platform/issues/1765)) ([876f80a](https://github.com/ngrx/platform/commit/876f80a)), closes [#1670](https://github.com/ngrx/platform/issues/1670)
- **store:** add createReducer function ([#1746](https://github.com/ngrx/platform/issues/1746)) ([f954e14](https://github.com/ngrx/platform/commit/f954e14)), closes [#1724](https://github.com/ngrx/platform/issues/1724)
- introduce [@ngrx](https://github.com/ngrx)/data library to the platform ([#1733](https://github.com/ngrx/platform/issues/1733)) ([5d569c3](https://github.com/ngrx/platform/commit/5d569c3))
- introduce [@ngrx](https://github.com/ngrx)/data library to the platform ([#1754](https://github.com/ngrx/platform/issues/1754)) ([dbfdbaf](https://github.com/ngrx/platform/commit/dbfdbaf))
- **effects:** add createEffect function ([#1667](https://github.com/ngrx/platform/issues/1667)) ([ced2d3d](https://github.com/ngrx/platform/commit/ced2d3d)), closes [#1368](https://github.com/ngrx/platform/issues/1368)
- **effects:** allow non-dispatching effects to not return an action ([#1689](https://github.com/ngrx/platform/issues/1689)) ([04e07a6](https://github.com/ngrx/platform/commit/04e07a6))
- **effects:** allow ofType to handle ActionCreator ([#1676](https://github.com/ngrx/platform/issues/1676)) ([a41d1d6](https://github.com/ngrx/platform/commit/a41d1d6))
- **entity:** add undefined to Dictionary's index signature ([#1719](https://github.com/ngrx/platform/issues/1719)) ([d472757](https://github.com/ngrx/platform/commit/d472757))
- **example:** update ofType in effects per [#1676](https://github.com/ngrx/platform/issues/1676) ([#1691](https://github.com/ngrx/platform/issues/1691)) ([c9c9a0e](https://github.com/ngrx/platform/commit/c9c9a0e))
- **router-store:** add v8 migration schematic ([#1699](https://github.com/ngrx/platform/issues/1699)) ([0b794ce](https://github.com/ngrx/platform/commit/0b794ce))
- **router-store:** Make usage of forRoot required ([#1662](https://github.com/ngrx/platform/issues/1662)) ([#1672](https://github.com/ngrx/platform/issues/1672)) ([c7e1406](https://github.com/ngrx/platform/commit/c7e1406))
- **schematics:** add support for effect creators to schematics ([#1725](https://github.com/ngrx/platform/issues/1725)) ([8901abd](https://github.com/ngrx/platform/commit/8901abd)), closes [#1682](https://github.com/ngrx/platform/issues/1682)
- **store:** add API to mock selectors ([#1688](https://github.com/ngrx/platform/issues/1688)) ([2a9b067](https://github.com/ngrx/platform/commit/2a9b067)), closes [#1504](https://github.com/ngrx/platform/issues/1504)
- **store:** add immutability and serializability runtime checks ([#1613](https://github.com/ngrx/platform/issues/1613)) ([60633b7](https://github.com/ngrx/platform/commit/60633b7)), closes [#857](https://github.com/ngrx/platform/issues/857)
- **store:** add META_REDUCERS replacement migration ([#1640](https://github.com/ngrx/platform/issues/1640)) ([57bacf5](https://github.com/ngrx/platform/commit/57bacf5))
- **store:** run migration schema for v8 beta ([#1716](https://github.com/ngrx/platform/issues/1716)) ([0abc948](https://github.com/ngrx/platform/commit/0abc948))

### BREAKING CHANGES

- **entity:** Dictionary could be producing undefined but previous typings were not explicit about it.
- **Store:** Internal functions and tokens are removed from the public API
- **router-store:** usage of forRoot is now required for StoreRouterConnectingModule

BEFORE:

```ts
@NgModule({
  imports: [StoreRouterConnectingModule],
})
export class AppModule {}
```

AFTER:

```ts
@NgModule({
  imports: [StoreRouterConnectingModule.forRoot()],
})
export class AppModule {}
```

- **Store:** Selectors with only a projector function aren't valid anymore.
  This change will make the usage more consistent.

BEFORE:

```
const getTodosById = createSelector(
  (state: TodoAppSchema, id: number) => state.todos.find(p => p.id === id)
);
```

AFTER:

```
const getTodosById = createSelector(
  (state: TodoAppSchema) => state.todos,
  (todos: Todo[], id: number) => todos.find(p => p.id === id)
);
```

- **StoreDevTools:** `actionsWhitelist` is renamed to `actionsSafelist`
  `actionsBlacklist` is renamed to `actionsBlocklist`

BEFORE:

```ts
StoreDevtoolsModule.instrument({
  actionsWhitelist: ['...'],
  actionsBlacklist: ['...'],
});
```

AFTER:

```ts
StoreDevtoolsModule.instrument({
  actionsSafelist: ['...'],
  actionsBlocklist: ['...'],
});
```

<a name="7.4.0"></a>

# [7.4.0](https://github.com/ngrx/platform/compare/7.3.0...7.4.0) (2019-03-29)

### Bug Fixes

- **Example:** linter problems ([#1597](https://github.com/ngrx/platform/issues/1597)) ([4cfcc08](https://github.com/ngrx/platform/commit/4cfcc08))

### Features

- **example-app:** add visual testing with Applitools ([#1605](https://github.com/ngrx/platform/issues/1605)) ([8856210](https://github.com/ngrx/platform/commit/8856210))
- **schematics:** use plural for entity schematics reducer key ([#1596](https://github.com/ngrx/platform/issues/1596)) ([1e49530](https://github.com/ngrx/platform/commit/1e49530)), closes [#1412](https://github.com/ngrx/platform/issues/1412)
- **store:** add action creator functions ([#1654](https://github.com/ngrx/platform/issues/1654)) ([e7fe28b](https://github.com/ngrx/platform/commit/e7fe28b)), closes [#1480](https://github.com/ngrx/platform/issues/1480) [#1634](https://github.com/ngrx/platform/issues/1634)

<a name="7.3.0"></a>

# [7.3.0](https://github.com/ngrx/platform/compare/7.2.0...7.3.0) (2019-02-27)

### Bug Fixes

- **schematics:** type actions and avoid endless loop in effect schematic ([#1576](https://github.com/ngrx/platform/issues/1576)) ([5fbcb3c](https://github.com/ngrx/platform/commit/5fbcb3c)), closes [#1573](https://github.com/ngrx/platform/issues/1573)
- **store:** deprecate signature for selector with only a projector ([#1580](https://github.com/ngrx/platform/issues/1580)) ([e86c5f6](https://github.com/ngrx/platform/commit/e86c5f6))

### Features

- **schematics:** Add ng-add support with prompt for making our schematics default ([#1552](https://github.com/ngrx/platform/issues/1552)) ([01ff157](https://github.com/ngrx/platform/commit/01ff157))

<a name="7.2.0"></a>

# [7.2.0](https://github.com/ngrx/platform/compare/7.1.0...7.2.0) (2019-01-29)

### Bug Fixes

- **Entity:** add schematics to bazel build ([88d0ad5](https://github.com/ngrx/platform/commit/88d0ad5))
- **RouterStore:** add schematics to bazel build ([7465af9](https://github.com/ngrx/platform/commit/7465af9))
- **StoreDevTools:** out of bounds when actions are filtered ([#1532](https://github.com/ngrx/platform/issues/1532)) ([d532979](https://github.com/ngrx/platform/commit/d532979)), closes [#1522](https://github.com/ngrx/platform/issues/1522)

### Features

- **schematics:** add api success/failure effects/actions to ng generate feature ([#1530](https://github.com/ngrx/platform/issues/1530)) ([e17a787](https://github.com/ngrx/platform/commit/e17a787))
- **schematics:** bump platformVersion to ^7.0.0 per issue [#1489](https://github.com/ngrx/platform/issues/1489) ([#1527](https://github.com/ngrx/platform/issues/1527)) ([a71aa71](https://github.com/ngrx/platform/commit/a71aa71))

<a name="7.1.0"></a>

# [7.1.0](https://github.com/ngrx/platform/compare/7.0.0...7.1.0) (2019-01-21)

### Bug Fixes

- **store:** call metareducer with the user's config initial state ([#1498](https://github.com/ngrx/platform/issues/1498)) ([2aabe0f](https://github.com/ngrx/platform/commit/2aabe0f)), closes [#1464](https://github.com/ngrx/platform/issues/1464)
- **store:** don't call the projector function if there are no selectors and props ([#1515](https://github.com/ngrx/platform/issues/1515)) ([e0ad3c3](https://github.com/ngrx/platform/commit/e0ad3c3)), closes [#1501](https://github.com/ngrx/platform/issues/1501)

### Features

- **example:** make the example app more user friendly ([#1508](https://github.com/ngrx/platform/issues/1508)) ([ac4fb88](https://github.com/ngrx/platform/commit/ac4fb88))
- **router-store:** add routerState to action payload ([#1511](https://github.com/ngrx/platform/issues/1511)) ([283424f](https://github.com/ngrx/platform/commit/283424f))
- **schematics:** add ng add support for [@ngrx](https://github.com/ngrx)/entity ([#1503](https://github.com/ngrx/platform/issues/1503)) ([da1c955](https://github.com/ngrx/platform/commit/da1c955))
- **schematics:** implement router store ng-add ([#1487](https://github.com/ngrx/platform/issues/1487)) ([9da4aac](https://github.com/ngrx/platform/commit/9da4aac)), closes [#1479](https://github.com/ngrx/platform/issues/1479)
- **store:** support store config factory for feature ([#1445](https://github.com/ngrx/platform/issues/1445)) ([6aa5645](https://github.com/ngrx/platform/commit/6aa5645)), closes [#1414](https://github.com/ngrx/platform/issues/1414)

<a name="7.0.0"></a>

# [7.0.0](https://github.com/ngrx/platform/compare/7.0.0-beta.1...7.0.0) (2018-12-20)

### Features

- **Effects:** add OnInitEffects interface to dispatch an action on initialization ([e921cd9](https://github.com/ngrx/platform/commit/e921cd9))
- **RouterStore:** make the router store key selector generic ([a30a514](https://github.com/ngrx/platform/commit/a30a514)), closes [#1457](https://github.com/ngrx/platform/issues/1457)
- **schematics:** add project flag support to specify apps or libs ([#1477](https://github.com/ngrx/platform/issues/1477)) ([af39fd2](https://github.com/ngrx/platform/commit/af39fd2)), closes [#1455](https://github.com/ngrx/platform/issues/1455)

### Reverts

- **Effects:** dispatch init feature effects action on init [#1305](https://github.com/ngrx/platform/issues/1305) ([e9cc9ae](https://github.com/ngrx/platform/commit/e9cc9ae))

<a name="7.0.0-beta.1"></a>

# [7.0.0-beta.1](https://github.com/ngrx/platform/compare/7.0.0-beta.0...7.0.0-beta.1) (2018-12-04)

### Features

- **effects:** add OnIdentifyEffects interface to register multiple effect instances ([#1448](https://github.com/ngrx/platform/issues/1448)) ([b553ce7](https://github.com/ngrx/platform/commit/b553ce7))
- **store-devtools:** catch and log redux devtools errors ([#1450](https://github.com/ngrx/platform/issues/1450)) ([4ed16cd](https://github.com/ngrx/platform/commit/4ed16cd))

<a name="7.0.0-beta.0"></a>

# [7.0.0-beta.0](https://github.com/ngrx/platform/compare/6.1.0...7.0.0-beta.0) (2018-11-03)

### Bug Fixes

- **docs-infra:** ARIA roles used must conform to valid values ([8a4b2de](https://github.com/ngrx/platform/commit/8a4b2de))
- **docs-infra:** elements must have sufficient color contrast ([c5dfaef](https://github.com/ngrx/platform/commit/c5dfaef))
- **docs-infra:** html element must have a lang attribute ([32256de](https://github.com/ngrx/platform/commit/32256de))
- **docs-infra:** Images must have alternate text ([8241f99](https://github.com/ngrx/platform/commit/8241f99))
- **docs-infra:** notification must have sufficient color contrast ([ac24cc3](https://github.com/ngrx/platform/commit/ac24cc3))
- **example:** close side nav when escape key is pressed ([#1244](https://github.com/ngrx/platform/issues/1244)) ([b3fc5dd](https://github.com/ngrx/platform/commit/b3fc5dd)), closes [#1172](https://github.com/ngrx/platform/issues/1172)
- **router-store:** Added new imports to index.ts, codestyle ([293f960](https://github.com/ngrx/platform/commit/293f960))
- **router-store:** allow compilation with strictFunctionTypes ([#1385](https://github.com/ngrx/platform/issues/1385)) ([0e38673](https://github.com/ngrx/platform/commit/0e38673)), closes [#1344](https://github.com/ngrx/platform/issues/1344)
- **router-store:** Avoiding [@ngrx](https://github.com/ngrx)/effects dependency inside tests ([11d3b9f](https://github.com/ngrx/platform/commit/11d3b9f))
- **router-store:** handle internal navigation error, dispatch cancel/error action with previous state ([#1294](https://github.com/ngrx/platform/issues/1294)) ([5300e7d](https://github.com/ngrx/platform/commit/5300e7d))
- **schematics:** correct spec description in reducer template ([#1269](https://github.com/ngrx/platform/issues/1269)) ([b7ab4f8](https://github.com/ngrx/platform/commit/b7ab4f8))
- **schematics:** fix effects code generated by schematics:feature ([#1357](https://github.com/ngrx/platform/issues/1357)) ([458e2b4](https://github.com/ngrx/platform/commit/458e2b4))
- **store:** add typing to allow props with store.select ([#1387](https://github.com/ngrx/platform/issues/1387)) ([a9e7cbd](https://github.com/ngrx/platform/commit/a9e7cbd))
- **store:** memoize selector arguments ([#1393](https://github.com/ngrx/platform/issues/1393)) ([7cc9702](https://github.com/ngrx/platform/commit/7cc9702)), closes [#1389](https://github.com/ngrx/platform/issues/1389)
- **store:** remove deprecation from Store.select ([#1382](https://github.com/ngrx/platform/issues/1382)) ([626784e](https://github.com/ngrx/platform/commit/626784e))

### Code Refactoring

- **routerstore:** change default state key to router ([#1258](https://github.com/ngrx/platform/issues/1258)) ([e8173d9](https://github.com/ngrx/platform/commit/e8173d9))
- **RouterStore:** normalize actions ([#1302](https://github.com/ngrx/platform/issues/1302)) ([466e2cd](https://github.com/ngrx/platform/commit/466e2cd))

### Features

- update angular dependencies to V7 ([e6048bd](https://github.com/ngrx/platform/commit/e6048bd)), closes [#1340](https://github.com/ngrx/platform/issues/1340)
- **effects:** add smarter type inference for ofType operator. ([#1183](https://github.com/ngrx/platform/issues/1183)) ([8d56a6f](https://github.com/ngrx/platform/commit/8d56a6f))
- **effects:** add support for effects of different instances of same class ([#1249](https://github.com/ngrx/platform/issues/1249)) ([518e561](https://github.com/ngrx/platform/commit/518e561)), closes [#1246](https://github.com/ngrx/platform/issues/1246)
- **effects:** dispatch feature effects action on init ([#1305](https://github.com/ngrx/platform/issues/1305)) ([15a4b58](https://github.com/ngrx/platform/commit/15a4b58)), closes [#683](https://github.com/ngrx/platform/issues/683)
- **entity:** add support for predicate to removeMany ([#900](https://github.com/ngrx/platform/issues/900)) ([d7daa2f](https://github.com/ngrx/platform/commit/d7daa2f))
- **entity:** add support for predicate to updateMany ([#907](https://github.com/ngrx/platform/issues/907)) ([4e4c50f](https://github.com/ngrx/platform/commit/4e4c50f))
- **example:** add logout confirmation ([#1287](https://github.com/ngrx/platform/issues/1287)) ([ba8d300](https://github.com/ngrx/platform/commit/ba8d300)), closes [#1271](https://github.com/ngrx/platform/issues/1271)
- **router-store:** Add custom serializer to config object ([5c814a9](https://github.com/ngrx/platform/commit/5c814a9)), closes [#1262](https://github.com/ngrx/platform/issues/1262)
- **router-store:** Add support for serializers with injected values ([959cfac](https://github.com/ngrx/platform/commit/959cfac))
- **router-store:** config option to dispatch ROUTER_NAVIGATION later ([fe71ffb](https://github.com/ngrx/platform/commit/fe71ffb)), closes [#1263](https://github.com/ngrx/platform/issues/1263)
- **router-store:** New router Actions ROUTER_REQUEST and ROUTER_NAVIGATED ([9f731c3](https://github.com/ngrx/platform/commit/9f731c3)), closes [#1010](https://github.com/ngrx/platform/issues/1010) [#1263](https://github.com/ngrx/platform/issues/1263)
- **router-store:** serialize routeConfig inside the default serializer ([#1384](https://github.com/ngrx/platform/issues/1384)) ([18a16d4](https://github.com/ngrx/platform/commit/18a16d4))
- **router-store:** update stateKey definition to take a string or selector ([4ad9a94](https://github.com/ngrx/platform/commit/4ad9a94)), closes [#1300](https://github.com/ngrx/platform/issues/1300)
- **store:** add testing package ([#1027](https://github.com/ngrx/platform/issues/1027)) ([ab56aac](https://github.com/ngrx/platform/commit/ab56aac)), closes [#915](https://github.com/ngrx/platform/issues/915)
- **store:** dispatch one update action when features are added or removed ([#1240](https://github.com/ngrx/platform/issues/1240)) ([0b90f91](https://github.com/ngrx/platform/commit/0b90f91))
- **Store:** export SelectorWithProps and MemoizedSelectorWithProps ([#1341](https://github.com/ngrx/platform/issues/1341)) ([df8fc60](https://github.com/ngrx/platform/commit/df8fc60))
- **store-devtools:** add support for persist, lock, pause ([#955](https://github.com/ngrx/platform/issues/955)) ([93fcf56](https://github.com/ngrx/platform/commit/93fcf56)), closes [#853](https://github.com/ngrx/platform/issues/853) [#919](https://github.com/ngrx/platform/issues/919)
- **store-devtools:** use different action when recomputing state history ([#1353](https://github.com/ngrx/platform/issues/1353)) ([1448a0e](https://github.com/ngrx/platform/commit/1448a0e)), closes [#1255](https://github.com/ngrx/platform/issues/1255)
- **StoreDevtools:** implement actionsBlacklist/Whitelist & predicate ([#970](https://github.com/ngrx/platform/issues/970)) ([7ee46d2](https://github.com/ngrx/platform/commit/7ee46d2)), closes [#938](https://github.com/ngrx/platform/issues/938)

### BREAKING CHANGES

- **router-store:** The default router serializer now returns a `null` value for
  `routeConfig` when `routeConfig` doesn't exist on the
  `ActivatedRouteSnapshot` instead of an empty object.

BEFORE:

```json
{
  "routeConfig": {}
}
```

AFTER:

```json
{
  "routeConfig": null
}
```

- **effects:** Removes .ofType method on Actions. Instead use the provided 'ofType'
  rxjs operator.

BEFORE:

```
this.actions.ofType('INCREMENT')
```

AFTER:

```
import { ofType } from '@ngrx/store';
...
this.action.pipe(ofType('INCREMENT'))
```

- **RouterStore:** Normalize router store actions to be consistent with the other modules

BEFORE:

- ROUTER_REQUEST
- ROUTER_NAVIGATION
- ROUTER_CANCEL
- ROUTER_ERROR
- ROUTER_NAVIGATED

AFTER

- @ngrx/router-store/request
- @ngrx/router-store/navigation
- @ngrx/router-store/cancel
- @ngrx/router-store/error
- @ngrx/router-store/navigated

* **router-store:** StoreRouterConfigFunction is removed. It is no longer possible to pass a function returning a StoreRouterConfig to StoreRouterConnectingModule.forRoot

If you still need this, pass a provider like this:
{
provide: ROUTER_CONFIG,
useFactory: \_createRouterConfig // you function
}

- **routerstore:** The default state key is changed from routerReducer to router
- **store:** BEFORE:

```ts
{type: '@ngrx/store/update-reducers', feature: 'feature1'}
{type: '@ngrx/store/update-reducers', feature: 'feature2'}
```

AFTER:

```ts
{type: '@ngrx/store/update-reducers', features: ['feature1',
'feature2']}
```

<a name="6.1.0"></a>

# [6.1.0](https://github.com/ngrx/platform/compare/6.0.1...6.1.0) (2018-08-02)

### Bug Fixes

- **effects:** Add deprecation notice for ofType instance operator ([830c8fa](https://github.com/ngrx/platform/commit/830c8fa))
- **Effects:** Added defaults for ng-add schematic ([9d36016](https://github.com/ngrx/platform/commit/9d36016))
- **example:** adjust styles to display spinner correctly ([#1203](https://github.com/ngrx/platform/issues/1203)) ([4a0b580](https://github.com/ngrx/platform/commit/4a0b580))
- **example:** remove custom router state serializer ([#1129](https://github.com/ngrx/platform/issues/1129)) ([389cd78](https://github.com/ngrx/platform/commit/389cd78))
- **schematics:** correct a type of action class generated ([#1140](https://github.com/ngrx/platform/issues/1140)) ([bbb7e8c](https://github.com/ngrx/platform/commit/bbb7e8c))
- **schematics:** exclude environment imports for libraries ([#1213](https://github.com/ngrx/platform/issues/1213)) ([541de02](https://github.com/ngrx/platform/commit/541de02)), closes [#1205](https://github.com/ngrx/platform/issues/1205) [#1197](https://github.com/ngrx/platform/issues/1197)
- **schematics:** Remove peer dependencies on Angular DevKit ([#1222](https://github.com/ngrx/platform/issues/1222)) ([fd3da16](https://github.com/ngrx/platform/commit/fd3da16)), closes [#1206](https://github.com/ngrx/platform/issues/1206)
- **Schematics:** correct resolution of environments path for module ([#1094](https://github.com/ngrx/platform/issues/1094)) ([d24ed10](https://github.com/ngrx/platform/commit/d24ed10)), closes [#1090](https://github.com/ngrx/platform/issues/1090)
- **store:** Add deprecation notice for select instance operator ([232ca7a](https://github.com/ngrx/platform/commit/232ca7a))
- **store:** Compare results in addition to arguments change in memoizer ([#1175](https://github.com/ngrx/platform/issues/1175)) ([99e1313](https://github.com/ngrx/platform/commit/99e1313))
- **Store:** bootstrap store with partial initial state ([#1163](https://github.com/ngrx/platform/issues/1163)) ([11bd465](https://github.com/ngrx/platform/commit/11bd465)), closes [#906](https://github.com/ngrx/platform/issues/906) [#909](https://github.com/ngrx/platform/issues/909)
- **Store:** Fix import bug with ng-add and added defaults ([ff7dc72](https://github.com/ngrx/platform/commit/ff7dc72))

### Features

- **effects:** stringify action when reporting as invalid ([#1219](https://github.com/ngrx/platform/issues/1219)) ([73d32eb](https://github.com/ngrx/platform/commit/73d32eb))
- **entity:** log a warning message when selectId returns undefined in dev mode ([#1169](https://github.com/ngrx/platform/issues/1169)) ([8f05f1f](https://github.com/ngrx/platform/commit/8f05f1f)), closes [#1133](https://github.com/ngrx/platform/issues/1133)
- **Entity:** expose Dictionary as part of the public API ([#1118](https://github.com/ngrx/platform/issues/1118)) ([2a267b6](https://github.com/ngrx/platform/commit/2a267b6)), closes [#865](https://github.com/ngrx/platform/issues/865)
- **schematics:** display provided path when displaying an error ([#1208](https://github.com/ngrx/platform/issues/1208)) ([91cc6ed](https://github.com/ngrx/platform/commit/91cc6ed)), closes [#1200](https://github.com/ngrx/platform/issues/1200)
- **schematics:** use ofType operator function instead of Actions#ofType ([#1154](https://github.com/ngrx/platform/issues/1154)) ([cb58ff1](https://github.com/ngrx/platform/commit/cb58ff1))
- **store:** add an overload to createFeatureSelector to provide better type checking ([#1171](https://github.com/ngrx/platform/issues/1171)) ([03db76f](https://github.com/ngrx/platform/commit/03db76f)), closes [#1136](https://github.com/ngrx/platform/issues/1136)
- **store:** provide props to createSelector projector function ([#1210](https://github.com/ngrx/platform/issues/1210)) ([b1f9b34](https://github.com/ngrx/platform/commit/b1f9b34))
- **Store:** createSelector allow props in selector ([53832a1](https://github.com/ngrx/platform/commit/53832a1))
- **Store:** createSelector with only a props selector ([35a4848](https://github.com/ngrx/platform/commit/35a4848))
- **StoreDevtools:** Add ng-add support ([be28d8d](https://github.com/ngrx/platform/commit/be28d8d))
- **StoreDevtools:** Allow custom serializer options ([#1121](https://github.com/ngrx/platform/issues/1121)) ([55a0488](https://github.com/ngrx/platform/commit/55a0488))

### Performance Improvements

- **Effects:** remove path filters in ng-add ([5318913](https://github.com/ngrx/platform/commit/5318913))
- **Schematics:** remove path filters in effects schematics ([6d3f5a1](https://github.com/ngrx/platform/commit/6d3f5a1))
- **Schematics:** remove path filters in reducer schematics ([055f6ef](https://github.com/ngrx/platform/commit/055f6ef))
- **Schematics:** remove path filters in store schematics ([762cf2e](https://github.com/ngrx/platform/commit/762cf2e))
- **Store:** remove path filters in ng-add ([ec6adb5](https://github.com/ngrx/platform/commit/ec6adb5))
- **StoreDevtools:** remove path filters in ng-add ([3ba463f](https://github.com/ngrx/platform/commit/3ba463f))

<a name="6.0.1"></a>

## [6.0.1](https://github.com/ngrx/platform/compare/6.0.0...6.0.1) (2018-05-23)

<a name="6.0.0"></a>

# [6.0.0](https://github.com/ngrx/platform/compare/v6.0.0-beta.3...6.0.0) (2018-05-23)

### Bug Fixes

- **Schematics:** remove ts extension when importing reducer in container ([#1061](https://github.com/ngrx/platform/issues/1061)) ([d1ed9e5](https://github.com/ngrx/platform/commit/d1ed9e5)), closes [#1056](https://github.com/ngrx/platform/issues/1056)
- **Schematics:** Update parsed path logic to split path and name ([a1e9530](https://github.com/ngrx/platform/commit/a1e9530)), closes [#1064](https://github.com/ngrx/platform/issues/1064)
- **Store:** Resolve environment path when generating a new store ([#1071](https://github.com/ngrx/platform/issues/1071)) ([599cfb6](https://github.com/ngrx/platform/commit/599cfb6))

### Features

- implement ng add for store and effects packages ([db94db7](https://github.com/ngrx/platform/commit/db94db7))

<a name="6.0.0-beta.3"></a>

# [6.0.0-beta.3](https://github.com/ngrx/platform/compare/v6.0.0-beta.2...v6.0.0-beta.3) (2018-05-12)

### Bug Fixes

- **build:** Use default build for schematics ([#1057](https://github.com/ngrx/platform/issues/1057)) ([355b12f](https://github.com/ngrx/platform/commit/355b12f))

<a name="6.0.0-beta.2"></a>

# [6.0.0-beta.2](https://github.com/ngrx/platform/compare/v6.0.0-beta.1...v6.0.0-beta.2) (2018-05-11)

### Bug Fixes

- **build:** Fix UMD global names ([#1005](https://github.com/ngrx/platform/issues/1005)) ([413efd4](https://github.com/ngrx/platform/commit/413efd4)), closes [#1004](https://github.com/ngrx/platform/issues/1004)
- **RouterStore:** Reset dispatch-tracking booleans after navigation end ([#968](https://github.com/ngrx/platform/issues/968)) ([48305aa](https://github.com/ngrx/platform/commit/48305aa))
- **Schematics:** Add check for app/lib to project helper function ([5942885](https://github.com/ngrx/platform/commit/5942885))
- **Schematics:** Add smart default to blueprint schemas ([cdd247e](https://github.com/ngrx/platform/commit/cdd247e))
- **Schematics:** Remove aliases for state and stateInterface options ([f4520a2](https://github.com/ngrx/platform/commit/f4520a2))
- **Schematics:** Update upsert actions for entity blueprint ([#1042](https://github.com/ngrx/platform/issues/1042)) ([0d1d309](https://github.com/ngrx/platform/commit/0d1d309)), closes [#1039](https://github.com/ngrx/platform/issues/1039)
- **Schematics:** Upgrade schematics to new CLI structure ([b99d9ff](https://github.com/ngrx/platform/commit/b99d9ff))
- **Store:** Fix type annotations for select methods ([#953](https://github.com/ngrx/platform/issues/953)) ([4d74bd2](https://github.com/ngrx/platform/commit/4d74bd2))
- **StoreDevtools:** Refresh devtools when extension is started ([#1017](https://github.com/ngrx/platform/issues/1017)) ([c6e33d9](https://github.com/ngrx/platform/commit/c6e33d9)), closes [#508](https://github.com/ngrx/platform/issues/508)
- Update minimum node version to 8.9.0 ([#989](https://github.com/ngrx/platform/issues/989)) ([0baaad8](https://github.com/ngrx/platform/commit/0baaad8))

### Features

- Add ng update support to ngrx packages ([#1053](https://github.com/ngrx/platform/issues/1053)) ([4f91e9e](https://github.com/ngrx/platform/commit/4f91e9e))
- **Schematics:** Rename default action type for action blueprint ([#1047](https://github.com/ngrx/platform/issues/1047)) ([4c4e6a9](https://github.com/ngrx/platform/commit/4c4e6a9)), closes [#1040](https://github.com/ngrx/platform/issues/1040)
- **Store:** Add support ng update ([#1032](https://github.com/ngrx/platform/issues/1032)) ([5b4f067](https://github.com/ngrx/platform/commit/5b4f067))

### BREAKING CHANGES

- **Schematics:** The action blueprint has been updated to be less generic, with associated reducer and effects updated for the feature blueprint

BEFORE:

export enum UserActionTypes {
UserAction = '[User] Action'
}

export class User implements Action {
readonly type = UserActionTypes.UserAction;
}

export type UserActions = User;

AFTER:

export enum UserActionTypes {
LoadUsers = '[User] Load Users'
}

export class LoadUsers implements Action {
readonly type = UserActionTypes.LoadUsers;
}

export type UserActions = LoadUsers;

- **Schematics:** Aliases for `state` and `stateInterface` were removed due to conflicts with component aliases without reasonable alternatives.
- **Schematics:** Minimum dependency for @ngrx/schematics has changed:

@angular-devkit/core: ^0.5.0
@angular-devkit/schematics: ^0.5.0

<a name="6.0.0-beta.1"></a>

# [6.0.0-beta.1](https://github.com/ngrx/platform/compare/v6.0.0-beta.0...v6.0.0-beta.1) (2018-04-02)

### Bug Fixes

- Declare global NgRx packages for UMD bundles ([#952](https://github.com/ngrx/platform/issues/952)) ([ba2139d](https://github.com/ngrx/platform/commit/ba2139d)), closes [#949](https://github.com/ngrx/platform/issues/949)

<a name="6.0.0-beta.0"></a>

# [6.0.0-beta.0](https://github.com/ngrx/platform/compare/v5.2.0...v6.0.0-beta.0) (2018-03-31)

### Bug Fixes

- **Entity:** Change EntityAdapter upsertOne/upsertMany to accept an entity ([a0f45ff](https://github.com/ngrx/platform/commit/a0f45ff))
- **RouterStore:** Allow strict mode with router reducer ([#903](https://github.com/ngrx/platform/issues/903)) ([f17a032](https://github.com/ngrx/platform/commit/f17a032))
- **RouterStore:** change the default serializer to work around cycles in RouterStateSnapshot ([7917a27](https://github.com/ngrx/platform/commit/7917a27))
- **RouterStore:** Replace RouterStateSnapshot with SerializedRouterStateSnapshot ([bd415a1](https://github.com/ngrx/platform/commit/bd415a1))
- **StoreDevtools:** pass timestamp to actions ([df2411f](https://github.com/ngrx/platform/commit/df2411f))
- **StoreDevtools:** report errors to ErrorHandler instead of console ([32df3f0](https://github.com/ngrx/platform/commit/32df3f0))
- Add support for Angular 6 and RxJS 6 ([d1286d2](https://github.com/ngrx/platform/commit/d1286d2))

### Features

- **Schematcis:** Extend from [@schematics](https://github.com/schematics)/angular ([0e17aad](https://github.com/ngrx/platform/commit/0e17aad))
- **Schematics:** Add support for custom store interface name ([#810](https://github.com/ngrx/platform/issues/810)) ([1352d83](https://github.com/ngrx/platform/commit/1352d83))

### BREAKING CHANGES

- **StoreDevtools:** Errors in reducers are no longer hidden from ErrorHandler by
  StoreDevtools

BEFORE:

Errors in reducers are caught by StoreDevtools and logged to the console

AFTER:

Errors in reducers are reported to ErrorHandler

- **Schematcis:** NgRx Schematics now has a minimum version dependency on @angular-devkit/core
  and @angular-devkit/schematics of v0.4.0.
- **RouterStore:** Default router state is serialized to a shape that removes cycles

BEFORE:

Full RouterStateSnapshot is returned

AFTER:

Router state snapshot is returned as a SerializedRouterStateSnapshot with cyclical dependencies removed

- **Entity:** The signature of the upsertOne/upsertMany functions in the EntityAdapter
  has been changed to accept a fully qualified entity instead of an update
  object that implements the Update<T> interface.

  Before:

  ```
  entityAdapter.upsertOne({
    id: 'Entity ID',
    changes: { id: 'Entity ID', name: 'Entity Name' },
  }, state);
  ```

  After:

  ```
  entityAdapter.upsertOne({
    id: 'Entity ID',
    name: 'Entity Name',
  }, state);
  ```

- NgRx now has a minimum version requirement on Angular 6 and RxJS 6.

<a name="5.2.0"></a>

# [5.2.0](https://github.com/ngrx/platform/compare/v5.1.0...v5.2.0) (2018-03-07)

### Bug Fixes

- **Schematics:** Correct usage of upsert actions for entity blueprint ([#821](https://github.com/ngrx/platform/issues/821)) ([1ffb5a9](https://github.com/ngrx/platform/commit/1ffb5a9))
- **Store:** only default to initialValue when store value is undefined ([#886](https://github.com/ngrx/platform/issues/886)) ([51a1547](https://github.com/ngrx/platform/commit/51a1547))
- **StoreDevtools:** Fix bug when exporting/importing state history ([#855](https://github.com/ngrx/platform/issues/855)) ([a5dcdb1](https://github.com/ngrx/platform/commit/a5dcdb1))
- **StoreDevtools:** Recompute state history when reducers are updated ([#844](https://github.com/ngrx/platform/issues/844)) ([10debcc](https://github.com/ngrx/platform/commit/10debcc))

### Features

- **Entity:** Add 'selectId' and 'sortComparer' to state adapter ([#889](https://github.com/ngrx/platform/issues/889)) ([69a62f2](https://github.com/ngrx/platform/commit/69a62f2))
- **Store:** Added feature name to Update Reducers action ([730361e](https://github.com/ngrx/platform/commit/730361e))

<a name="5.1.0"></a>

# [5.1.0](https://github.com/ngrx/platform/compare/v5.0.1...v5.1.0) (2018-02-13)

### Bug Fixes

- **Devtools:** Ensure Store is loaded eagerly ([#801](https://github.com/ngrx/platform/issues/801)) ([ecf1ebf](https://github.com/ngrx/platform/commit/ecf1ebf)), closes [#624](https://github.com/ngrx/platform/issues/624) [#741](https://github.com/ngrx/platform/issues/741)
- **Effects:** Make ofType operator strictFunctionTypes safe ([#789](https://github.com/ngrx/platform/issues/789)) ([c8560e4](https://github.com/ngrx/platform/commit/c8560e4)), closes [#753](https://github.com/ngrx/platform/issues/753)
- **Entity:** Avoid for..in iteration in sorted state adapter ([#805](https://github.com/ngrx/platform/issues/805)) ([4192645](https://github.com/ngrx/platform/commit/4192645))
- **Entity:** Do not add Array.prototype properties to store ([#782](https://github.com/ngrx/platform/issues/782)) ([d537758](https://github.com/ngrx/platform/commit/d537758)), closes [#781](https://github.com/ngrx/platform/issues/781)
- **Entity:** Properly iterate over array in upsert ([#802](https://github.com/ngrx/platform/issues/802)) ([779d689](https://github.com/ngrx/platform/commit/779d689))
- **Schematics:** Add store import to container blueprint ([#763](https://github.com/ngrx/platform/issues/763)) ([a140fa9](https://github.com/ngrx/platform/commit/a140fa9)), closes [#760](https://github.com/ngrx/platform/issues/760)
- **Schematics:** Remove extra braces from constructor for container blueprint ([#791](https://github.com/ngrx/platform/issues/791)) ([945bf40](https://github.com/ngrx/platform/commit/945bf40)), closes [#778](https://github.com/ngrx/platform/issues/778)
- **Schematics:** Use correct paths for nested and grouped feature blueprint ([#756](https://github.com/ngrx/platform/issues/756)) ([c219770](https://github.com/ngrx/platform/commit/c219770))
- **StoreDevtools:** Add internal support for ActionSanitizer and StateSanitizer ([#795](https://github.com/ngrx/platform/issues/795)) ([a7de2a6](https://github.com/ngrx/platform/commit/a7de2a6))
- **StoreDevtools:** Do not send full liftedState for application actions ([#790](https://github.com/ngrx/platform/issues/790)) ([c11504f](https://github.com/ngrx/platform/commit/c11504f))

### Features

- **Entity:** Add upsertOne and upsertMany functions to entity adapters ([#780](https://github.com/ngrx/platform/issues/780)) ([f871540](https://github.com/ngrx/platform/commit/f871540)), closes [#421](https://github.com/ngrx/platform/issues/421)
- **Schematics:** Add group option to entity blueprint ([#792](https://github.com/ngrx/platform/issues/792)) ([0429276](https://github.com/ngrx/platform/commit/0429276)), closes [#779](https://github.com/ngrx/platform/issues/779)
- **Schematics:** Add upsert methods to entity blueprint ([#809](https://github.com/ngrx/platform/issues/809)) ([7acdc79](https://github.com/ngrx/platform/commit/7acdc79)), closes [#592](https://github.com/ngrx/platform/issues/592)

<a name="5.0.1"></a>

## [5.0.1](https://github.com/ngrx/platform/compare/v5.0.0...v5.0.1) (2018-01-25)

### Bug Fixes

- **Effects:** Provide instance from actions to ofType lettable operator ([#751](https://github.com/ngrx/platform/issues/751)) ([33d48e7](https://github.com/ngrx/platform/commit/33d48e7)), closes [#739](https://github.com/ngrx/platform/issues/739)

<a name="5.0.0"></a>

# [5.0.0](https://github.com/ngrx/platform/compare/v4.1.1...v5.0.0) (2018-01-22)

### Bug Fixes

- **Effects:** Ensure Store modules are loaded eagerly ([#658](https://github.com/ngrx/platform/issues/658)) ([0a3398d](https://github.com/ngrx/platform/commit/0a3398d)), closes [#642](https://github.com/ngrx/platform/issues/642)
- **Effects:** Remove toPayload utility function ([#738](https://github.com/ngrx/platform/issues/738)) ([b390ef5](https://github.com/ngrx/platform/commit/b390ef5))
- **Entity:** updateOne/updateMany should not change ids state on existing entity ([#581](https://github.com/ngrx/platform/issues/581)) ([b989e4b](https://github.com/ngrx/platform/commit/b989e4b)), closes [#571](https://github.com/ngrx/platform/issues/571)
- **RouterStore:** Fix usage of config object if provided ([#575](https://github.com/ngrx/platform/issues/575)) ([4125914](https://github.com/ngrx/platform/commit/4125914))
- **RouterStore:** Match RouterAction type parameters ([#562](https://github.com/ngrx/platform/issues/562)) ([980a653](https://github.com/ngrx/platform/commit/980a653))
- **Schematics:** Add group folder after feature name folder ([#737](https://github.com/ngrx/platform/issues/737)) ([317fb94](https://github.com/ngrx/platform/commit/317fb94))
- **Schematics:** Add handling of flat option to entity blueprint ([fb8d2c6](https://github.com/ngrx/platform/commit/fb8d2c6))
- **Schematics:** Distinguish between root and feature effect arrays when registering ([#718](https://github.com/ngrx/platform/issues/718)) ([95ff6c8](https://github.com/ngrx/platform/commit/95ff6c8))
- **Schematics:** Don't add state import if not provided ([#697](https://github.com/ngrx/platform/issues/697)) ([e5c2aed](https://github.com/ngrx/platform/commit/e5c2aed))
- **Schematics:** Make variable naming consistent for entity blueprint ([#716](https://github.com/ngrx/platform/issues/716)) ([765b15a](https://github.com/ngrx/platform/commit/765b15a))
- **Store:** Compose provided metareducers for a feature reducer ([#704](https://github.com/ngrx/platform/issues/704)) ([1454620](https://github.com/ngrx/platform/commit/1454620)), closes [#701](https://github.com/ngrx/platform/issues/701)
- **StoreDevtools:** Only recompute current state when reducers are updated ([#570](https://github.com/ngrx/platform/issues/570)) ([247ae1a](https://github.com/ngrx/platform/commit/247ae1a)), closes [#229](https://github.com/ngrx/platform/issues/229) [#487](https://github.com/ngrx/platform/issues/487)
- **typo:** update login error to use correct css font color property ([41723fc](https://github.com/ngrx/platform/commit/41723fc))

### Features

- **Effects:** Add lettable ofType operator ([d5e1814](https://github.com/ngrx/platform/commit/d5e1814))
- **ErrorHandler:** Use the Angular ErrorHandler for reporting errors ([#667](https://github.com/ngrx/platform/issues/667)) ([8f297d1](https://github.com/ngrx/platform/commit/8f297d1)), closes [#626](https://github.com/ngrx/platform/issues/626)
- **material:** Upgrade [@angular](https://github.com/angular)/material to v 2.0.0-beta.12 ([#482](https://github.com/ngrx/platform/issues/482)) ([aedf20e](https://github.com/ngrx/platform/commit/aedf20e)), closes [#448](https://github.com/ngrx/platform/issues/448)
- **Schematics:** Add alias for container, store and action blueprints ([#685](https://github.com/ngrx/platform/issues/685)) ([dc64ac9](https://github.com/ngrx/platform/commit/dc64ac9))
- **Schematics:** Add alias for reducer blueprint ([#684](https://github.com/ngrx/platform/issues/684)) ([ea98fb7](https://github.com/ngrx/platform/commit/ea98fb7))
- **Schematics:** Add effect to registered effects array ([#717](https://github.com/ngrx/platform/issues/717)) ([f1082fe](https://github.com/ngrx/platform/commit/f1082fe))
- **Schematics:** Add option to group feature blueprints in respective folders ([#736](https://github.com/ngrx/platform/issues/736)) ([b82c35d](https://github.com/ngrx/platform/commit/b82c35d))
- **Schematics:** Introduce [@ngrx](https://github.com/ngrx)/schematics ([#631](https://github.com/ngrx/platform/issues/631)) ([1837dba](https://github.com/ngrx/platform/commit/1837dba)), closes [#53](https://github.com/ngrx/platform/issues/53)
- **Store:** Add lettable select operator ([77eed24](https://github.com/ngrx/platform/commit/77eed24))
- **Store:** Add support for generating custom createSelector functions ([#734](https://github.com/ngrx/platform/issues/734)) ([cb0d185](https://github.com/ngrx/platform/commit/cb0d185)), closes [#478](https://github.com/ngrx/platform/issues/478) [#724](https://github.com/ngrx/platform/issues/724)
- **StoreDevtools:** Add option to configure extension in log-only mode ([#712](https://github.com/ngrx/platform/issues/712)) ([1ecd658](https://github.com/ngrx/platform/commit/1ecd658)), closes [#643](https://github.com/ngrx/platform/issues/643) [#374](https://github.com/ngrx/platform/issues/374)
- **StoreDevtools:** Add support for custom instance name ([#517](https://github.com/ngrx/platform/issues/517)) ([00be3d1](https://github.com/ngrx/platform/commit/00be3d1)), closes [#463](https://github.com/ngrx/platform/issues/463)
- **StoreDevtools:** Add support for extension sanitizers ([#544](https://github.com/ngrx/platform/issues/544)) ([6ed92b0](https://github.com/ngrx/platform/commit/6ed92b0)), closes [#494](https://github.com/ngrx/platform/issues/494)
- **StoreDevtools:** Add support for jumping to a specific action ([#703](https://github.com/ngrx/platform/issues/703)) ([b9f6442](https://github.com/ngrx/platform/commit/b9f6442)), closes [#681](https://github.com/ngrx/platform/issues/681)

### BREAKING CHANGES

- **Effects:** The utility function `toPayload`, deprecated in @ngrx/effects v4.0, has been removed.

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

- **ErrorHandler:** The ErrorReporter has been replaced with ErrorHandler
  from angular/core.

BEFORE:

Errors were reported to the ngrx/effects ErrorReporter. The
ErrorReporter would log to the console by default.

AFTER:

Errors are now reported to the @angular/core ErrorHandler.

- **Store:** Updates minimum version of RxJS dependency.

BEFORE:

Minimum peer dependency of RxJS ^5.0.0

AFTER:

Minimum peer dependency of RxJS ^5.5.0

- **Effects:** Updates minimum version of RxJS dependency.

BEFORE:

Minimum peer dependency of RxJS ^5.0.0

AFTER:

Minimum peer dependency of RxJS ^5.5.0

<a name="4.1.1"></a>

## [4.1.1](https://github.com/ngrx/platform/compare/v4.1.0...v4.1.1) (2017-11-07)

### Bug Fixes

- Add support for Angular 5 ([30a8c56](https://github.com/ngrx/platform/commit/30a8c56))
- **Entity:** Fix type error for id selectors ([#533](https://github.com/ngrx/platform/issues/533)) ([88f672c](https://github.com/ngrx/platform/commit/88f672c)), closes [#525](https://github.com/ngrx/platform/issues/525)

### Features

- **Codegen:** Add base code and build for [@ngrx](https://github.com/ngrx)/codegen ([#534](https://github.com/ngrx/platform/issues/534)) ([2a22211](https://github.com/ngrx/platform/commit/2a22211))
- **RouterStore:** Add configurable option for router reducer name ([#417](https://github.com/ngrx/platform/issues/417)) ([ab7de5c](https://github.com/ngrx/platform/commit/ab7de5c)), closes [#410](https://github.com/ngrx/platform/issues/410)

<a name="4.1.0"></a>

# [4.1.0](https://github.com/ngrx/platform/compare/v4.0.5...v4.1.0) (2017-10-19)

### Bug Fixes

- **Build:** Fix build with space in path ([#331](https://github.com/ngrx/platform/issues/331)) ([257fc9d](https://github.com/ngrx/platform/commit/257fc9d))
- **combineSelectors:** Remove default parameter from function signature for Closure ([ae7d5e1](https://github.com/ngrx/platform/commit/ae7d5e1))
- **decorator:** add ExportDecoratedItems jsdoc for g3 ([#456](https://github.com/ngrx/platform/issues/456)) ([2b0e0cf](https://github.com/ngrx/platform/commit/2b0e0cf))
- **Effects:** Simplify decorator handling for Closure compatibility ([ad30d40](https://github.com/ngrx/platform/commit/ad30d40))
- **Entity:** Change type for EntityState to interface ([#454](https://github.com/ngrx/platform/issues/454)) ([d5640ec](https://github.com/ngrx/platform/commit/d5640ec)), closes [#458](https://github.com/ngrx/platform/issues/458)
- **Example:** Add missing import for catch operator ([#409](https://github.com/ngrx/platform/issues/409)) ([193e8b3](https://github.com/ngrx/platform/commit/193e8b3))
- **RouterStore:** Fix cancelled navigation with async guard (fixes [#354](https://github.com/ngrx/platform/issues/354)) ([#355](https://github.com/ngrx/platform/issues/355)) ([920c0ba](https://github.com/ngrx/platform/commit/920c0ba)), closes [#201](https://github.com/ngrx/platform/issues/201)
- **RouterStore:** Stringify error from navigation error event ([#357](https://github.com/ngrx/platform/issues/357)) ([0528d2d](https://github.com/ngrx/platform/commit/0528d2d)), closes [#356](https://github.com/ngrx/platform/issues/356)
- **Store:** Fix typing for feature to accept InjectionToken ([#375](https://github.com/ngrx/platform/issues/375)) ([38b2f95](https://github.com/ngrx/platform/commit/38b2f95))
- **Store:** Refactor parameter initialization in combineReducers for Closure ([5c60cba](https://github.com/ngrx/platform/commit/5c60cba))
- **Store:** Set initial value for state action pair to object ([#480](https://github.com/ngrx/platform/issues/480)) ([100a8ef](https://github.com/ngrx/platform/commit/100a8ef)), closes [#477](https://github.com/ngrx/platform/issues/477)

### Features

- **createSelector:** Expose projector function on selectors to improve testability ([56cb21f](https://github.com/ngrx/platform/commit/56cb21f)), closes [#290](https://github.com/ngrx/platform/issues/290)
- **Effects:** Add getEffectsMetadata() helper for verifying metadata ([628b865](https://github.com/ngrx/platform/commit/628b865)), closes [#491](https://github.com/ngrx/platform/issues/491)
- **Effects:** Add root effects init action ([#473](https://github.com/ngrx/platform/issues/473)) ([838ba17](https://github.com/ngrx/platform/commit/838ba17)), closes [#246](https://github.com/ngrx/platform/issues/246)
- **Entity:** Add default selectId function for EntityAdapter ([#405](https://github.com/ngrx/platform/issues/405)) ([2afb792](https://github.com/ngrx/platform/commit/2afb792))
- **Entity:** Add support for string or number type for ID ([#441](https://github.com/ngrx/platform/issues/441)) ([46d6f2f](https://github.com/ngrx/platform/commit/46d6f2f))
- **Entity:** Enable creating entity selectors without composing a state selector ([#490](https://github.com/ngrx/platform/issues/490)) ([aae4064](https://github.com/ngrx/platform/commit/aae4064))
- **Entity:** Rename 'sort' to 'sortComparer' ([274554b](https://github.com/ngrx/platform/commit/274554b)), closes [#370](https://github.com/ngrx/platform/issues/370)
- **Store:** createSelector with an array of selectors ([#340](https://github.com/ngrx/platform/issues/340)) ([2f6a035](https://github.com/ngrx/platform/commit/2f6a035)), closes [#192](https://github.com/ngrx/platform/issues/192)

<a name="4.0.5"></a>

## [4.0.5](https://github.com/ngrx/platform/compare/v4.0.4...v4.0.5) (2017-08-18)

### Bug Fixes

- **Effects:** Do not complete effects if one source errors or completes ([#297](https://github.com/ngrx/platform/issues/297)) ([54747cf](https://github.com/ngrx/platform/commit/54747cf)), closes [#232](https://github.com/ngrx/platform/issues/232)
- **Entity:** Return a referentially equal state if state did not change ([fbd6a66](https://github.com/ngrx/platform/commit/fbd6a66))
- **Entity:** Simplify target index finder for sorted entities ([335d255](https://github.com/ngrx/platform/commit/335d255))

<a name="4.0.4"></a>

## [4.0.4](https://github.com/ngrx/platform/compare/v4.0.3...v4.0.4) (2017-08-17)

### Bug Fixes

- **Effects:** Use factory provide for console ([#288](https://github.com/ngrx/platform/issues/288)) ([bf7f70c](https://github.com/ngrx/platform/commit/bf7f70c)), closes [#276](https://github.com/ngrx/platform/issues/276)
- **RouterStore:** Add generic type to RouterReducerState ([#292](https://github.com/ngrx/platform/issues/292)) ([6da3ec5](https://github.com/ngrx/platform/commit/6da3ec5)), closes [#289](https://github.com/ngrx/platform/issues/289)
- **RouterStore:** Only serialize snapshot in preactivation hook ([#287](https://github.com/ngrx/platform/issues/287)) ([bbb7c99](https://github.com/ngrx/platform/commit/bbb7c99)), closes [#286](https://github.com/ngrx/platform/issues/286)

<a name="4.0.3"></a>

## [4.0.3](https://github.com/ngrx/platform/compare/v4.0.2...v4.0.3) (2017-08-16)

### Bug Fixes

- **Effects:** Deprecate toPayload utility function ([#266](https://github.com/ngrx/platform/issues/266)) ([1cbb2c9](https://github.com/ngrx/platform/commit/1cbb2c9))
- **Effects:** Ensure StoreModule is loaded before effects ([#230](https://github.com/ngrx/platform/issues/230)) ([065d33e](https://github.com/ngrx/platform/commit/065d33e)), closes [#184](https://github.com/ngrx/platform/issues/184) [#219](https://github.com/ngrx/platform/issues/219)
- **Effects:** Export EffectsNotification interface ([#231](https://github.com/ngrx/platform/issues/231)) ([2b1a076](https://github.com/ngrx/platform/commit/2b1a076))
- **Store:** Add type signature for metareducer ([#270](https://github.com/ngrx/platform/issues/270)) ([57633d2](https://github.com/ngrx/platform/commit/57633d2)), closes [#264](https://github.com/ngrx/platform/issues/264) [#170](https://github.com/ngrx/platform/issues/170)
- **Store:** Set initial state for feature modules ([#235](https://github.com/ngrx/platform/issues/235)) ([4aec80c](https://github.com/ngrx/platform/commit/4aec80c)), closes [#206](https://github.com/ngrx/platform/issues/206) [#233](https://github.com/ngrx/platform/issues/233)
- **Store:** Update usage of compose for reducer factory ([#252](https://github.com/ngrx/platform/issues/252)) ([683013c](https://github.com/ngrx/platform/commit/683013c)), closes [#247](https://github.com/ngrx/platform/issues/247)
- **Store:** Use existing reducers when providing reducers without an InjectionToken ([#254](https://github.com/ngrx/platform/issues/254)) ([c409252](https://github.com/ngrx/platform/commit/c409252)), closes [#250](https://github.com/ngrx/platform/issues/250) [#116](https://github.com/ngrx/platform/issues/116)
- **Store:** Use injector to get reducers provided via InjectionTokens ([#259](https://github.com/ngrx/platform/issues/259)) ([bd968fa](https://github.com/ngrx/platform/commit/bd968fa)), closes [#189](https://github.com/ngrx/platform/issues/189)

### Features

- **RouterStore:** Add serializer for router state snapshot ([#188](https://github.com/ngrx/platform/issues/188)) ([0fc1bcc](https://github.com/ngrx/platform/commit/0fc1bcc)), closes [#97](https://github.com/ngrx/platform/issues/97) [#104](https://github.com/ngrx/platform/issues/104) [#237](https://github.com/ngrx/platform/issues/237)

<a name="4.0.2"></a>

## [4.0.2](https://github.com/ngrx/platform/compare/v4.0.1...v4.0.2) (2017-08-02)

### Bug Fixes

- **createSelector:** memoize projector function ([#228](https://github.com/ngrx/platform/issues/228)) ([e2f1e57](https://github.com/ngrx/platform/commit/e2f1e57)), closes [#226](https://github.com/ngrx/platform/issues/226)
- **docs:** update angular-cli variable ([eeb7d5d](https://github.com/ngrx/platform/commit/eeb7d5d))
- **Docs:** update effects description ([#164](https://github.com/ngrx/platform/issues/164)) ([c77b2d9](https://github.com/ngrx/platform/commit/c77b2d9))
- **Effects:** Wrap testing source in an Actions observable ([#121](https://github.com/ngrx/platform/issues/121)) ([bfdb83b](https://github.com/ngrx/platform/commit/bfdb83b)), closes [#117](https://github.com/ngrx/platform/issues/117)
- **RouterStore:** Add support for cancellation with CanLoad guard ([#223](https://github.com/ngrx/platform/issues/223)) ([2c006e8](https://github.com/ngrx/platform/commit/2c006e8)), closes [#213](https://github.com/ngrx/platform/issues/213)
- **Store:** Remove auto-memoization of selector functions ([90899f7](https://github.com/ngrx/platform/commit/90899f7)), closes [#118](https://github.com/ngrx/platform/issues/118)

### Features

- **Effects:** Add generic type to the "ofType" operator ([55c13b2](https://github.com/ngrx/platform/commit/55c13b2))
- **Platform:** Introduce [@ngrx](https://github.com/ngrx)/entity ([#207](https://github.com/ngrx/platform/issues/207)) ([9bdfd70](https://github.com/ngrx/platform/commit/9bdfd70))
- **Store:** Add injection token option for feature modules ([#153](https://github.com/ngrx/platform/issues/153)) ([7f77693](https://github.com/ngrx/platform/commit/7f77693)), closes [#116](https://github.com/ngrx/platform/issues/116) [#141](https://github.com/ngrx/platform/issues/141) [#147](https://github.com/ngrx/platform/issues/147)
- **Store:** Added initial state function support for features. Added more tests ([#85](https://github.com/ngrx/platform/issues/85)) ([5e5d7dd](https://github.com/ngrx/platform/commit/5e5d7dd))

<a name="4.0.1"></a>

## [4.0.1](https://github.com/ngrx/platform/compare/v4.0.0...v4.0.1) (2017-07-18)

### Bug Fixes

- **effects:** allow downleveled annotations ([#98](https://github.com/ngrx/platform/issues/98)) ([875b326](https://github.com/ngrx/platform/commit/875b326)), closes [#93](https://github.com/ngrx/platform/issues/93)
- **effects:** make correct export path for testing module ([#96](https://github.com/ngrx/platform/issues/96)) ([a5aad22](https://github.com/ngrx/platform/commit/a5aad22)), closes [#94](https://github.com/ngrx/platform/issues/94)

<a name="4.0.0"></a>

# [4.0.0](https://github.com/ngrx/platform/compare/68bd9df...v4.0.0) (2017-07-18)

### Bug Fixes

- **build:** Fixed deployment of latest master as commit ([#18](https://github.com/ngrx/platform/issues/18)) ([5d0ecf9](https://github.com/ngrx/platform/commit/5d0ecf9))
- **build:** Get tests running for each project ([c4a1054](https://github.com/ngrx/platform/commit/c4a1054))
- **build:** Limit concurrency for lerna bootstrap ([7e7a7d8](https://github.com/ngrx/platform/commit/7e7a7d8))
- **Devtools:** Removed SHOULD_INSTRUMENT token used to eagerly inject providers ([#57](https://github.com/ngrx/platform/issues/57)) ([b90df34](https://github.com/ngrx/platform/commit/b90df34))
- **Effects:** Start child effects after running root effects ([#43](https://github.com/ngrx/platform/issues/43)) ([931adb1](https://github.com/ngrx/platform/commit/931adb1))
- **Effects:** Use Actions generic type for the return of the ofType operator ([d176a11](https://github.com/ngrx/platform/commit/d176a11))
- **Example:** Fix Book State interface parent ([#90](https://github.com/ngrx/platform/issues/90)) ([6982952](https://github.com/ngrx/platform/commit/6982952))
- **example-app:** Suppress StoreDevtoolsConfig compiler warning ([8804156](https://github.com/ngrx/platform/commit/8804156))
- **omit:** Strengthen the type checking of the omit utility function ([3982038](https://github.com/ngrx/platform/commit/3982038))
- **router-store:** NavigationCancel and NavigationError creates a cycle when used with routerReducer ([a085730](https://github.com/ngrx/platform/commit/a085730)), closes [#68](https://github.com/ngrx/platform/issues/68)
- **Store:** Exported initial state tokens ([#65](https://github.com/ngrx/platform/issues/65)) ([4b27b6d](https://github.com/ngrx/platform/commit/4b27b6d))
- **Store:** pass all required arguments to projector ([#74](https://github.com/ngrx/platform/issues/74)) ([9b82b3a](https://github.com/ngrx/platform/commit/9b82b3a))
- **Store:** Remove parameter destructuring for strict mode ([#33](https://github.com/ngrx/platform/issues/33)) ([#77](https://github.com/ngrx/platform/issues/77)) ([c9d6a45](https://github.com/ngrx/platform/commit/c9d6a45))
- **Store:** Removed readonly from type ([#72](https://github.com/ngrx/platform/issues/72)) ([68274c9](https://github.com/ngrx/platform/commit/68274c9))
- **StoreDevtools:** Type InjectionToken for AOT compilation ([e21d688](https://github.com/ngrx/platform/commit/e21d688))

### Code Refactoring

- **Effects:** Simplified AP, added better error reporting and effects stream control ([015107f](https://github.com/ngrx/platform/commit/015107f))

### Features

- **build:** Updated build pipeline for modules ([68bd9df](https://github.com/ngrx/platform/commit/68bd9df))
- **Effects:** Ensure effects are only subscribed to once ([089abdc](https://github.com/ngrx/platform/commit/089abdc))
- **Effects:** Introduce new Effects testing module ([#70](https://github.com/ngrx/platform/issues/70)) ([7dbb571](https://github.com/ngrx/platform/commit/7dbb571))
- **router-store:** Added action types ([#47](https://github.com/ngrx/platform/issues/47)) ([1f67cb3](https://github.com/ngrx/platform/commit/1f67cb3)), closes [#44](https://github.com/ngrx/platform/issues/44)
- **store:** Add 'createSelector' and 'createFeatureSelector' utils ([#10](https://github.com/ngrx/platform/issues/10)) ([41758b1](https://github.com/ngrx/platform/commit/41758b1))
- **Store:** Allow initial state function for AoT compatibility ([#59](https://github.com/ngrx/platform/issues/59)) ([1a166ec](https://github.com/ngrx/platform/commit/1a166ec)), closes [#51](https://github.com/ngrx/platform/issues/51)
- **Store:** Allow parent modules to provide reducers with tokens ([#36](https://github.com/ngrx/platform/issues/36)) ([069b12f](https://github.com/ngrx/platform/commit/069b12f)), closes [#34](https://github.com/ngrx/platform/issues/34)
- **Store:** Simplify API for adding meta-reducers ([#87](https://github.com/ngrx/platform/issues/87)) ([d2295c7](https://github.com/ngrx/platform/commit/d2295c7))

### BREAKING CHANGES

- **Effects:** Effects API for registering effects has been updated to allow for multiple classes to be provided.

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
