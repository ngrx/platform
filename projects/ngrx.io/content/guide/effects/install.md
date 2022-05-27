# Installation

## Installing with `ng add`

You can install the Effects to your project with the following `ng add` command <a href="https://angular.io/cli/add" target="_blank">(details here)</a>:

```sh
ng add @ngrx/effects@latest
```

### Optional `ng add` flags

| flag | description | value type | default value
| --- | --- | --- | ---
| `--path` | Path to the module that you wish to add the import for the `EffectsModule` to. | `string`
| `--flat` | Indicate if a directory is to be created to hold your effects file. | `boolean` | `true`
| `--skipTests` | When true, does not create test files. | `boolean` | `false`
| `--project` | Name of the project defined in your `angular.json` to help locating the module to add the `EffectsModule` to. | `string`
| `--module` | Name of file containing the module that you wish to add the import for the `EffectsModule` to. Can also include the relative path to the file. For example, `src/app/app.module.ts` | `string` | `app`
| `--minimal` | When true, only provide minimal setup for the root effects setup. Only registers `EffectsModule.forRoot()` in the provided `module` with an empty array. | `boolean` | `true`
| `--group` | Group effects file within `effects` folder. | `boolean` | `false`

This command will automate the following steps:

1. Update `package.json` > `dependencies` with `@ngrx/effects`.
2. Run `npm install` to install those dependencies. 
3. Update your `src/app/app.module.ts` > `imports` array with `EffectsModule.forRoot([AppEffects])`. If you provided flags then the command will attempt to locate and update module found by the flags.

## Installing with `npm`

For more information on using `npm` check out the docs <a href="https://docs.npmjs.com/cli/install" target="_blank">here</a>.

```sh
npm install @ngrx/effects --save
```

## Installing with `yarn`

For more information on using `yarn` check out the docs <a href="https://yarnpkg.com/getting-started/usage#installing-all-the-dependencies" target="_blank">here</a>.

```sh
yarn add @ngrx/effects
```
