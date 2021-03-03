# Container

---

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

## Container Options

Provide the path to your file with an exported state interface

- `--state`
  - Type: `string`

Provide the name of the interface exported for your state interface

- `--state-interface`
  - Type: `string`
  - Default: `State`

Specifies whether to create a unit test or an integration test

- `--test-depth`
  - Type: `string`
  - Values: `unit|integration`
  - Default: `integration`

## Examples

Generate a `UsersPage` container component with your reducers imported and the `Store` typed a custom interface named `MyState`.

```sh
ng generate container UsersPage --state reducers/index.ts --state-interface MyState
```

If you want to generate a container with an scss file, add `@ngrx/schematics:container` to the `schematics` in your `angular.json`.

```json
"schematics": {
  "@ngrx/schematics:container": {
    "style": "scss"
  }
}
```
