# Installation

## Installing with `ng add`

You can make `@ngrx/schematics` the default collection for your application with the following `ng add` command <a href="https://angular.io/cli/add" target="_blank">(details here)</a>:

```sh
ng add @ngrx/schematics@latest
```

### Optional `ng add` flags

| flag | description | value type | default value |
| --- | --- | --- | ---
| `--defaultCollection` | Use @ngrx/schematics as the default collection. | `boolean` | `true`

This command will automate the following steps:

1. Update `angular.json` > `cli > defaultCollection` with `@ngrx/schematics`.

## Installing with `npm`

For more information on using `npm` check out the docs <a href="https://docs.npmjs.com/cli/install" target="_blank">here</a>.

```sh
npm install @ngrx/schematics --save-dev
```

## Installing with `yarn`

For more information on using `yarn` check out the docs <a href="https://yarnpkg.com/getting-started/usage#installing-all-the-dependencies" target="_blank">here</a>.

```sh
yarn add @ngrx/schematics --dev
```
