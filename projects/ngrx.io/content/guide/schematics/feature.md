# Feature

---

## Overview

Generates a feature set containing an `actions`, `effects`, `reducer`, and `selectors` file. You use this to build out a new feature area that provides a new piece of state.

## Command

```sh
ng generate feature FeatureName [options]
```

##### OR

```sh
ng generate f FeatureName [options]
```

## Options

Provide the project name where the feature files will be created.

- `--project`
  - Alias: `-p`
  - Type: `string`

Use creator functions for actions, reducers, and effects.

- `--creators`
  - Alias: `-c`
  - Type: `boolean`
  - Default: `true`

Nest the feature files within a folder based on the feature `name`.

- `--flat`
  - Type: `boolean`
  - Default: `true`

Group the feature files within their respective folders.

- `--group`
  - Alias: `-g`
  - Type: `boolean`
  - Default: `false`

Provide the path to a file containing an `Angular Module` and the feature reducer will be added to its `imports` array using `StoreModule.forFeature`.

- `--module`
  - Alias: `-m`
  - Type: `string`

Provide the path to a `reducers` file containing a state interface and a object map of action reducers. The generated feature interface will be imported added to the first defined interface within the file. The feature reducer will be imported and added to the first defined object with an `ActionReducerMap` type.

- `--reducers`
  - Alias: `-r`
  - Type: `string`

Specifies if api success and failure `actions`, `reducer`, and `effects` should be generated as part of this feature.

- `--api`
  - Alias: `-a`
  - Type: `boolean`
  - Default: `false`

Generate spec files associated with the feature files.

- `--skip-tests`
  - Type: `boolean`
  - Default: `false`

## Examples

Generate a `User` feature set and register it within an `Angular Module`.

```sh
ng generate feature User -m app.module.ts
```

Generate a `User` feature set and add it to a defined set of reducers.

```sh
ng generate feature User --group --reducers reducers/index.ts
```

Generate a `User` feature set within a `user` folder and register it with the `user.module.ts` file in the same `user` folder.

```sh
ng generate module User --flat false
ng generate feature user/User -m user.module.ts --group
```

Generate a `User` feature set with `actions`, `effects`, `reducer`, and `selectors` file nested within their respective folders.

```sh
ng generate feature User --group
```
