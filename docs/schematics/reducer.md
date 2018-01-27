# Reducer
--------

## Overview

Generates a reducer file that contains a state interface,
and initial state object for the reducer, and a reducer function.

## Command

```sh
ng generate reducer ReducerName [options]
```

##### OR

```sh
ng generate r ReducerName [options]
```

### Options

Nest the reducer file within a folder based on the reducer `name`.

- `--flat`
  - Type: `boolean`
  - Default: `true`

Group the reducer file within an `reducers` folder.

- `--group`
  - Alias: `-g`
  - Type: `boolean`
  - Default: `false`     

Provide the path to a file containing an `Angular Module` and the entity reducer will be added to its `imports` array using `StoreModule.forFeature`.

- `--module`
  - Alias: `-m`
  - Type: `string`

Provide the path to a `reducers` file containing a state interface and a object map of action reducers. The generated reducer interface will be imported added to the first defined interface within the file. The reducer will be imported and added to the first defined object with an `ActionReducerMap` type.

- `--reducers`
  - Alias: `-r`
  - Type: `string`

Generate a spec file alongside the reducer file.

- `--spec`
  - Type: `boolean`
  - Default: `true`


#### Examples

Generate a `User` reducer file add it to a defined map of reducers generated from a [feature state](./store.md#examples).

```sh
ng generate reducer User --reducers reducers/index.ts
```

Generate `User` a reducer file within a nested folder based on the reducer name.

```sh
ng generate reducer User --flat false
```

Generate a `User` reducer and register it within the `Angular Module` in `app.module.ts`.

```sh
ng generate reducer User --module app.module.ts
```

Generate a `User` reducer file within a nested `reducers` folder

```sh
ng generate reducer User --group
```