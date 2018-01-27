# Action
--------

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

Nest the actions file within a folder based on the action `name`.

- `--flat`
  - Type: `boolean`
  - Default: `true`

Group the action file within an `actions` folder.

- `--group`
  - Alias: `-g`
  - Type: `boolean`
  - Default: `false`   

Generate a spec file alongside the action file.

- `--spec`
  - Type: `boolean`
  - Default: `false`


#### Examples

Generate a `User` actions file with an associated spec file.

```sh
ng generate action User --spec
```

Generate a `User` actions file within a nested folder

```sh
ng generate action User --flat false
```

Generate a `User` actions file within a nested `actions` folder

```sh
ng generate action User --group
```
