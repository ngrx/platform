# Data

---

## Overview

Generates the data entity model and service.

## Command

```sh
ng generate data EntityName [options]
```

##### OR

```sh
ng generate dt EntityName [options]
```

### Options

Provide the project name where the entity files will be created.

- `--project`
  - Alias: `-p`
  - Type: `string`

Nest the data entity files within a folder based on the `data`.

- `--flat`
  - Type: `boolean`
  - Default: `true`

Group the data entity files within an `data` folder.

- `--group`
  - Alias: `-g`
  - Type: `boolean`
  - Default: `false`

Generate a spec file alongside the data entity files.

- `--skip-tests`
  - Type: `boolean`
  - Default: `false`

#### Examples

Generate a `User` data entity files with an associated spec file.

```sh
ng generate data User
```

Generate a `User` data entity files within a nested folder

```sh
ng generate data User --flat false
```

Generate a `User` data entity file within a nested `data` folder

```sh
ng generate data User --group
```
