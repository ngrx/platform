# Installation

## Installing with `ng add`

You can install the Data package to your project with the following `ng add` command <a href="https://angular.io/cli/add" target="_blank">(details here)</a>:

```sh
ng add @ngrx/data@latest
```

### Optional `ng add` flags

| flag | description | value type | default value |
| --- | --- | --- | ---
| `--project` | Name of the project defined in your `angular.json` to help locating the module to add the `EntityDataModule` to. | `string` |
| `--module` | Name of file containing the module that you wish to add the import for the `EntityDataModule` to. Can also include the relative path to the file. For example, `src/app/app.module.ts`. | `string` | `app`
| `--effects` | If `false` it will use the `EntityDataModuleWithoutEffects` module instead of the default `EntityDataModule`. | `boolean` | `true`
| `--migrateNgRxData` | If `true` it will replace the `ngrx-data` module with the `@ngrx/data` module. | `boolean` | `false`
| `--entityConfig` | If `false` it will not create and declare the `entity-metadata` file. | `boolean` | `true`

This command will automate the following steps:

1. Update `package.json` > `dependencies` with `@ngrx/data`.
2. Run `npm install` to install those dependencies.
3. Update your `src/app/app.module.ts` > `imports` array with `EntityDataModule` or `EntityDataModuleWithoutEffects` depending on the `effects` flag.

With the `migrateNgRxData` flag the following will also take place:

1. Remove `ngrx-data` from `package.json` > `dependencies`.
2. Rename `ngrx-data` types to the matching `@ngrx/data` types.

## Installing with `npm`

For more information on using `npm` check out the docs <a href="https://docs.npmjs.com/cli/install" target="_blank">here</a>.

```sh
npm install @ngrx/data --save
```

## Installing with `yarn`

For more information on using `yarn` check out the docs <a href="https://yarnpkg.com/getting-started/usage#installing-all-the-dependencies" target="_blank">here</a>.

```sh
yarn add @ngrx/data
```
