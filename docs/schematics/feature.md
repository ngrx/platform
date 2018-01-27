# Feature
--------

## Overview

Generates a feature set containing an `actions`, `effects` and `reducer` file. You use this to build out a new feature area that provides a new piece of state.

## Command

```sh
ng generate feature FeatureName [options]
```

##### OR

```sh
ng generate f FeatureName [options]
```

### Options

Nest the effects file within a folder based on the feature `name`.

- `--flat`
  - Type: `boolean`
  - Default: `true`

Group the `actions`, `effects` and `reducers` files within their respective folders.

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

Generate spec files associated with the feature files.

- `--spec`
  - Type: `boolean`
  - Default: `true`


#### Examples

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

Generate a `User` feature set with `actions`, `effects` and `reducers` file nested within their respective folders.

```sh
ng generate feature User --group
```
