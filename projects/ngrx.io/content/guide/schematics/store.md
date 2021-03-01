# Store

---

## Overview

Generates the initial setup for state management and registering new feature states. It registers the `@ngrx/store-devtools` integration and generates a state management file containing the state interface, the object map of action reducers and any associated meta-reducers.

## Command

```sh
ng generate store State [options]
```

##### OR

```sh
ng generate st State [options]
```

## Options

Provide the project name where the state files will be created.

- `--project`
  - Alias: `-p`
  - Type: `string`

Provide the path to a file containing an `Angular Module` and the feature state will be added to its `imports` array using `StoreModule.forFeature` or `StoreModule.forRoot`.

- `--module`
  - Alias: `-m`
  - Type: `string`

When used with the `--module` option, it registers the state within the `Angular Module` using `StoreModule.forRoot`. The `--root` option should only be used to setup the global `@ngrx/store` providers.

- `--root`
  - Type: `boolean`
  - Default: `false`

Only provide minimal setup for the root state management. Only registers `StoreModule.forRoot()` in the provided module with an empty object, and default runtime checks.

- `--minimal`
  - Type: `boolean`
  - Default: `false`

Provide the folder where the state files will be created.

- `--state-path`
  - Type: `string`
  - Default: `reducers`

Provide the name of the interface exported for your state. When defining with the `--root` option, the name of the store will be used to define the interface name.

- `--state-interface`
  - Type: `string`
  - Default: `State`

## Examples

Generate the initial state management files and register it within the `app.module.ts`.

```sh
ng generate store State --root --module app.module.ts
```

Generate an `Admin` feature state within the `admin` folder and register it with the `admin.module.ts` in the same folder.

```sh
ng generate module admin --flat false
ng generate store admin/Admin -m admin.module.ts
```

Generate the initial state management files within a `store` folder and register it within the `app.module.ts`.

```sh
ng generate store State --root --state-path store --module app.module.ts
```
