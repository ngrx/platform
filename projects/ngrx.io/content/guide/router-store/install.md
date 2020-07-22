# Installation

## Installing with `npm`

For more information on using `npm` check out the docs <a href="https://docs.npmjs.com/cli/install" target="_blank">here</a>.

```sh
npm install @ngrx/router-store --save
```

## Installing with `yarn`

For more information on using `yarn` check out the docs <a href="https://yarnpkg.com/getting-started/usage#installing-all-the-dependencies" target="_blank">here</a>.

```sh
yarn add @ngrx/router-store
```

## Installing with `ng add`

If your project is using the Angular CLI 6+ then you can install the Router Store to your project with the following `ng add` command <a href="https://angular.io/cli/add" target="_blank">(details here)</a>:

```sh
ng add @ngrx/router-store@latest
```

### Optional `ng add` flags

* path - path to the module that you wish to add the import for the `StoreRouterConnectingModule` to.
* project - name of the project defined in your `angular.json` to help locating the module to add the `StoreRouterConnectingModule` to.
* module - name of file containing the module that you wish to add the import for the `StoreRouterConnectingModule` to. Can also include the relative path to the file. For example, `src/app/app.module.ts`;

This command will automate the following steps:

1. Update `package.json` > `dependencies` with `@ngrx/router-store`.
2. Run `npm install` to install those dependencies. 
3. By default, will update  `src/app/app.module.ts` > `imports` array with `StoreRouterConnectingModule.forRoot()`. If you provided flags then the command will attempt to locate and update module found by the flags.

