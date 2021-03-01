# Entity

---

## Overview

Generates a set of entity files for managing a collection using `@ngrx/entity` including a set of predefined `actions`, a collection `model` and a `reducer` with state selectors.

## Command

```sh
ng generate entity EntityName [options]
```

##### OR

```sh
ng generate en EntityName [options]
```

## Options

Provide the project name where the entity files will be created.

- `--project`
  - Alias: `-p`
  - Type: `string`

Use creator functions for actions, reducers, and effects.

- `--creators`
  - Alias: `-c`
  - Type: `boolean`
  - Default: `true`

Nest the effects file within a folder based on the entity `name`.

- `--flat`
  - Type: `boolean`
  - Default: `true`

Provide the path to a file containing an `Angular Module` and the entity reducer will be added to its `imports` array using `StoreModule.forFeature`.

- `--module`
  - Alias: `-m`
  - Type: `string`

Provide the path to a `reducers` file containing a state interface and a object map of action reducers. The generated entity interface will be imported and added to the first defined interface within the file. The entity reducer will be imported and added to the first defined object with an `ActionReducerMap` type.

- `--reducers`
  - Alias: `-r`
  - Type: `string`

Generate spec files associated with the entity files.

- `--skip-tests`
  - Type: `boolean`
  - Default: `false`

## Examples

Generate a set of `User` entity files and add it to a defined map of reducers generated from a [feature state](guide/schematics/store#examples).

```sh
ng generate entity User --reducers reducers/index.ts
```

Generate a set of `User` entity files within a nested folder.

```sh
ng generate entity User --flat false
```

Generate a set of `User` entity files and register it within the `Angular Module` in `app.module.ts` as a feature state.

```sh
ng generate entity User -m app.module.ts
```
