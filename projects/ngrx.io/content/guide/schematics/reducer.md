# Reducer

---

## Overview

Generates a reducer file that contains a state interface,
an initial state object for the reducer, and a reducer function.

## Command

```sh
ng generate reducer ReducerName [options]
```

##### OR

```sh
ng generate r ReducerName [options]
```

### Options

Provide the project name where the reducer files will be created.

- `--project`
  - Alias: `-p`
  - Type: `string`

Use creator functions to generate the actions and reducer.

- `--creators`
  - Alias: `-c`
  - Type: `boolean`
  - Default: `true`

Nest the reducer file within a folder based on the reducer `name`.

- `--flat`
  - Type: `boolean`
  - Default: `true`

Group the reducer file within a `reducers` folder.

- `--group`
  - Alias: `-g`
  - Type: `boolean`
  - Default: `false`

Provide the path to a file containing an `Angular Module` and the entity reducer will be added to its `imports` array using `StoreModule.forFeature`.

- `--module`
  - Alias: `-m`
  - Type: `string`

Provide the path to a `reducers` file containing a state interface and an object map of action reducers. The generated reducer interface will be imported and added to the first defined interface within the file. The reducer will be imported and added to the first defined object with an `ActionReducerMap` type.

- `--reducers`
  - Alias: `-r`
  - Type: `string`

Specifies if api success and failure actions should be added to the reducer.

- `--api`
  - Alias: `-a`
  - Type: `boolean`
  - Default: `false`

Generate a spec file alongside the reducer file.

- `--skip-tests`
  - Type: `boolean`
  - Default: `false`

## Examples

Generate a `User` reducer file add it to a defined map of reducers generated from a [feature state](guide/schematics/store#examples).

```sh
ng generate reducer User --reducers reducers/index.ts
```

Generate a `User` reducer file within a nested folder based on the reducer name.

```sh
ng generate reducer User --flat false
```

Generate a `User` reducer and register it within the `Angular Module` in `app.module.ts`.

```sh
ng generate reducer User --module app.module.ts
```

Generate a `User` reducer file within a nested `reducers` folder.

```sh
ng generate reducer User --group
```
