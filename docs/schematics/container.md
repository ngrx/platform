# Container
--------

## Overview

Generates a component with `Store` injected into its constructor. You can optionally provide the path to your reducers and your state interface.

## Command

```sh
ng generate container ComponentName [options]
```

##### OR

```sh
ng generate co ComponentName [options]
```

### General Options

`Angular CLI` [component options](https://github.com/angular/angular-cli/wiki/generate-component#options).

### Container Options

Provide the path to your file with an exported state interface

- `--reducers`
  - Type: `string`

Provide the name of the interface exported for your state interface

- `--stateInterface`
  - Type: `string`
  - Default: `State`  

#### Examples

Generate a `UsersPage` container component with your reducers imported and the `Store` typed a custom interface named `MyState`.

```sh
ng generate container UsersPage --reducers reducers/index.ts --stateInterface MyState
```
