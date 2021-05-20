# Action

---

## Overview

Generates an action file that contains an enum of action types,
an example action class and an exported type union of action classes.

## Command

```sh
ng generate action ActionName [options]
```

##### OR

```sh
ng generate a ActionName [options]
```

### Options

Provide the project name where the action files will be created.

- `--project`
  - Alias: `-p`
  - Type: `string`

Use creator functions for actions

- `--creators`
  - Alias: `-c`
  - Type: `boolean`
  - Default: `true`

Nest the actions file within a folder based on the action `name`.

- `--flat`
  - Type: `boolean`
  - Default: `true`

Group the action file within an `actions` folder.

- `--group`
  - Alias: `-g`
  - Type: `boolean`
  - Default: `false`

Specifies if api success and failure actions should be generated.

- `--api`
  - Alias: `-a`
  - Type: `boolean`
  - Default: `false`  

Generate a spec file alongside the action file.

- `--skip-tests`
  - Type: `boolean`
  - Default: `false`

Specify the prefix for the actions.

- `--prefix`
  - Type: `string`
  - Default: `load`

## Examples

Generate a `User` actions file with an associated spec file.

```sh
ng generate action User
```

Generate a `User` actions file within a nested folder

```sh
ng generate action User --flat false
```

Generate a `User` actions file within a nested `actions` folder

```sh
ng generate action User --group
```
