# Overview

Use [ESLint](https://eslint.org/) to follow the best practices and to avoid common pitfalls in your application.

The NgRx ESLint Plugin is no different and promotes the key concepts to create a maintainable project. It consists of @ngrx/store, @ngrx/effects, and @ngrx/component-store rules and a handful of preconfigured configurations.

The plugin comes with a number of rules that help address most popular NgRx malpractices. The rules are configurable so that you can choose the ones you want to follow, and which rules should give a linting error or warning.

Some rules also allow automatic fixes with `ng lint --fix`.

## Adding rules

To use the a [rule](#rules), import the NgRx plugin via `plugins` or `extends`.
You can add a rule by adding the rule to the `rules` collection.

```json
{
  "plugins": ["@ngrx"],
  "rules": {
    "@ngrx/good-action-hygiene": "error"
  }
}
```

or

```json
{
  "extends": ["@ngrx/recommended"],
  "rules": {
    "@ngrx/good-action-hygiene": "error"
  }
}
```

Instead of manually configuring the rules, there are also [preconfigured configurations](#configurations). To use a configuration, add it to `extends`:

```json
{
  "extends": ["@ngrx/recommended-requiring-type-checking"],
  "rules": {}
}
```

## Rules

<!-- DO NOT EDIT, this table is automatically generated-->
<!-- RULES-CONFIG:START -->

### component-store

| Name                                                                                                                    | Description                                       | Category   | Fixable | Has suggestions | Configurable | Requires type information |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------- | ------- | --------------- | ------------ | ------------------------- |
| [@ngrx/avoid-combining-component-store-selectors](/guide/eslint-plugin/rules/avoid-combining-component-store-selectors) | Prefer combining selectors at the selector level. | suggestion | No      | No              | No           | No                        |
| [@ngrx/avoid-mapping-component-store-selectors](/guide/eslint-plugin/rules/avoid-mapping-component-store-selectors)     | Avoid mapping logic outside the selector level.   | problem    | No      | No              | No           | No                        |
| [@ngrx/updater-explicit-return-type](/guide/eslint-plugin/rules/updater-explicit-return-type)                           | `Updater` should have an explicit return type.    | problem    | No      | No              | No           | No                        |

### effects

| Name                                                                                                                    | Description                                                                                     | Category   | Fixable | Has suggestions | Configurable | Requires type information |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------- | ------- | --------------- | ------------ | ------------------------- |
| [@ngrx/avoid-cyclic-effects](/guide/eslint-plugin/rules/avoid-cyclic-effects)                                           | Avoid `Effect` that re-emit filtered actions.                                                   | problem    | No      | No              | No           | Yes                       |
| [@ngrx/no-dispatch-in-effects](/guide/eslint-plugin/rules/no-dispatch-in-effects)                                       | `Effect` should not call `store.dispatch`.                                                      | suggestion | No      | Yes             | No           | No                        |
| [@ngrx/no-effects-in-providers](/guide/eslint-plugin/rules/no-effects-in-providers)                                     | `Effect` should not be listed as a provider if it is added to the `EffectsModule`.              | problem    | Yes     | No              | No           | No                        |
| [@ngrx/no-multiple-actions-in-effects](/guide/eslint-plugin/rules/no-multiple-actions-in-effects)                       | `Effect` should not return multiple actions.                                                    | problem    | No      | No              | No           | Yes                       |
| [@ngrx/prefer-action-creator-in-of-type](/guide/eslint-plugin/rules/prefer-action-creator-in-of-type)                   | Using `action creator` in `ofType` is preferred over `string`.                                  | suggestion | No      | No              | No           | No                        |
| [@ngrx/prefer-effect-callback-in-block-statement](/guide/eslint-plugin/rules/prefer-effect-callback-in-block-statement) | A block statement is easier to troubleshoot.                                                    | suggestion | Yes     | No              | No           | No                        |
| [@ngrx/use-effects-lifecycle-interface](/guide/eslint-plugin/rules/use-effects-lifecycle-interface)                     | Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods. | suggestion | Yes     | No              | No           | No                        |

### operators

| Name                                                                                    | Description                                                                                                                      | Category | Fixable | Has suggestions | Configurable | Requires type information |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- | --------------- | ------------ | ------------------------- |
| [@ngrx/prefer-concat-latest-from](/guide/eslint-plugin/rules/prefer-concat-latest-from) | Use `concatLatestFrom` instead of `withLatestFrom` to prevent the selector from firing until the correct `Action` is dispatched. | problem  | Yes     | No              | Yes          | No                        |

### store

| Name                                                                                                                                    | Description                                                                      | Category   | Fixable | Has suggestions | Configurable | Requires type information |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------- | ------- | --------------- | ------------ | ------------------------- |
| [@ngrx/avoid-combining-selectors](/guide/eslint-plugin/rules/avoid-combining-selectors)                                                 | Prefer combining selectors at the selector level.                                | suggestion | No      | No              | No           | No                        |
| [@ngrx/avoid-dispatching-multiple-actions-sequentially](/guide/eslint-plugin/rules/avoid-dispatching-multiple-actions-sequentially)     | It is recommended to only dispatch one `Action` at a time.                       | suggestion | No      | No              | No           | No                        |
| [@ngrx/avoid-duplicate-actions-in-reducer](/guide/eslint-plugin/rules/avoid-duplicate-actions-in-reducer)                               | A `Reducer` should handle an `Action` once.                                      | suggestion | No      | Yes             | No           | No                        |
| [@ngrx/avoid-mapping-selectors](/guide/eslint-plugin/rules/avoid-mapping-selectors)                                                     | Avoid mapping logic outside the selector level.                                  | suggestion | No      | No              | No           | No                        |
| [@ngrx/good-action-hygiene](/guide/eslint-plugin/rules/good-action-hygiene)                                                             | Ensures the use of good action hygiene.                                          | suggestion | No      | No              | No           | No                        |
| [@ngrx/no-multiple-global-stores](/guide/eslint-plugin/rules/no-multiple-global-stores)                                                 | There should only be one global store injected.                                  | suggestion | No      | Yes             | No           | No                        |
| [@ngrx/no-reducer-in-key-names](/guide/eslint-plugin/rules/no-reducer-in-key-names)                                                     | Avoid the word "reducer" in the key names.                                       | suggestion | No      | Yes             | No           | No                        |
| [@ngrx/no-store-subscription](/guide/eslint-plugin/rules/no-store-subscription)                                                         | Using the `async` pipe is preferred over `store` subscription.                   | suggestion | No      | No              | No           | No                        |
| [@ngrx/no-typed-global-store](/guide/eslint-plugin/rules/no-typed-global-store)                                                         | The global store should not be typed.                                            | suggestion | No      | Yes             | No           | No                        |
| [@ngrx/on-function-explicit-return-type](/guide/eslint-plugin/rules/on-function-explicit-return-type)                                   | `On` function should have an explicit return type.                               | suggestion | No      | Yes             | No           | No                        |
| [@ngrx/prefer-action-creator-in-dispatch](/guide/eslint-plugin/rules/prefer-action-creator-in-dispatch)                                 | Using `action creator` in `dispatch` is preferred over `object` or old `Action`. | suggestion | No      | No              | No           | No                        |
| [@ngrx/prefer-action-creator](/guide/eslint-plugin/rules/prefer-action-creator)                                                         | Using `action creator` is preferred over `Action class`.                         | suggestion | No      | No              | No           | No                        |
| [@ngrx/prefer-inline-action-props](/guide/eslint-plugin/rules/prefer-inline-action-props)                                               | Prefer using inline types instead of interfaces, types or classes.               | suggestion | No      | Yes             | No           | No                        |
| [@ngrx/prefer-one-generic-in-create-for-feature-selector](/guide/eslint-plugin/rules/prefer-one-generic-in-create-for-feature-selector) | Prefer using a single generic to define the feature state.                       | suggestion | No      | Yes             | No           | No                        |
| [@ngrx/prefer-selector-in-select](/guide/eslint-plugin/rules/prefer-selector-in-select)                                                 | Using a selector in the `select` is preferred over `string` or `props drilling`. | suggestion | No      | No              | No           | No                        |
| [@ngrx/prefix-selectors-with-select](/guide/eslint-plugin/rules/prefix-selectors-with-select)                                           | The selector should start with "select", for example "selectEntity".             | suggestion | No      | Yes             | No           | No                        |
| [@ngrx/select-style](/guide/eslint-plugin/rules/select-style)                                                                           | Selector can be used either with `select` as a pipeable operator or as a method. | suggestion | Yes     | No              | Yes          | No                        |
| [@ngrx/use-consistent-global-store-name](/guide/eslint-plugin/rules/use-consistent-global-store-name)                                   | Use a consistent name for the global store.                                      | suggestion | No      | Yes             | Yes          | No                        |

<!-- RULES-CONFIG:END -->

## Configurations

<!-- DO NOT EDIT, this table is automatically generated-->
<!-- CONFIGURATIONS-CONFIG:START -->

| Name                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------- |
| [all](https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs/all.json)                                                 |
| [component-store-all](https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs/component-store-all.json)                 |
| [component-store-recommended](https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs/component-store-recommended.json) |
| [effects-all](https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs/effects-all.json)                                 |
| [effects-recommended](https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs/effects-recommended.json)                 |
| [operators-all](https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs/operators-all.json)                             |
| [operators-recommended](https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs/operators-recommended.json)             |
| [recommended](https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs/recommended.json)                                 |
| [store-all](https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs/store-all.json)                                     |
| [store-recommended](https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs/store-recommended.json)                     |

  <!-- CONFIGURATIONS-CONFIG:END -->
