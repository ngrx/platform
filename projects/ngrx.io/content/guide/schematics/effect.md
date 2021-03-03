# Effect

---

## Overview

Generates an effect file for `@ngrx/effects`.

## Command

```sh
ng generate effect EffectName [options]
```

##### OR

```sh
ng generate ef EffectName [options]
```

## Options

Provide the project name where the effect files will be created.

- `--project`
  - Alias: `-p`
  - Type: `string`

Use creator functions for actions and effects.

- `--creators`
  - Alias: `-c`
  - Type: `boolean`
  - Default: `true`

Nest the effects file within a folder based by the effect `name`.

- `--flat`
  - Type: `boolean`
  - Default: `true`

Group the effect file within an `effects` folder.

- `--group`
  - Alias: `-g`
  - Type: `boolean`
  - Default: `false`

Provide the path to a file containing an `Angular Module` and the effect will be added to its `imports` array. If the `--root` option is not included, the effect will be registered using `EffectsModule.forFeature`.

- `--module`
  - Alias: `-m`
  - Type: `string`

When used with the `--module` option, it registers an effect within the `Angular Module` using `EffectsModule.forRoot`.

- `--root`
  - Type: `boolean`
  - Default: `false`

Only provide minimal setup for the root effects setup. Only registers `EffectsModule.forRoot()` in the provided module with an empty array.

- `--minimal`
  - Type: `boolean`
  - Default: `false`

Specifies if effect has api success and failure actions wired up.

- `--api`
  - Alias: `-a`
  - Type: `boolean`
  - Default: `false`

Generate a spec file alongside the effect file.

- `--skip-tests`
  - Type: `boolean`
  - Default: `false`

## Examples

Generate a `UserEffects` file and register it within the root Angular module in the root-level effects.

```sh
ng generate effect User --root -m app.module.ts
```

Generate a `UserEffects` file within a `user` folder and register it with the `user.module.ts` file in the same folder.

```sh
ng generate module User --flat false
ng generate effect user/User -m user.module.ts
```

Generate a `UserEffects` file within a nested `effects` folder

```sh
ng generate effect User --group
```
