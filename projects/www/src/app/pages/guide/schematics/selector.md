# Selector

---

## Overview

Generates a selector file for `@ngrx/store`.

## Command

```sh
ng generate selector selectorName [options]
```

##### OR

```sh
ng generate se selectorName [options]
```

## Options

Provide the project name where the selector files will be created.

- `--project`
  - Alias: `-p`
  - Type: `string`

Nest the effects file within a folder based by the selector `name`.

- `--flat`
  - Type: `boolean`
  - Default: `true`

Group the selector file within an `selectors` folder.

- `--group`
  - Alias: `-g`
  - Type: `boolean`
  - Default: `false`

Generate a spec file alongside the selector file.

- `--skip-tests`
  - Type: `boolean`
  - Default: `false`

## Examples

Generate a selector file.

```sh
ng generate selector User
```

Generate a selector file within a nested `selectors` folder

```sh
ng generate selector User --group
```
