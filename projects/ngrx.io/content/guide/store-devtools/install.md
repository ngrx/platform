# Installation

## Installing with `npm`

For more information on using `npm` check out the docs <a href="https://docs.npmjs.com/cli/install" target="_blank">here</a>.

```sh
npm install @ngrx/store-devtools --save
```

## Installing with `yarn`
For more information on using `yarn` check out the docs <a href="https://yarnpkg.com/getting-started/usage#installing-all-the-dependencies" target="_blank">here</a>.

```sh
yarn add @ngrx/store-devtools
```

## Installing with `ng add`

If your project is using the Angular CLI 6+ then you can install the Store Devtools to your project with the following `ng add` command <a href="https://angular.io/cli/add" target="_blank">(details here)</a>:

```sh
ng add @ngrx/store-devtools@latest
```

### Optional `ng add` flags

* path - path to the module that you wish to add the import for the `StoreDevtoolsModule` to.
* project - name of the project defined in your `angular.json` to help locating the module to add the `StoreDevtoolsModule` to.
* module - name of file containing the module that you wish to add the import for the `StoreDevtoolsModule` to. Can also include the relative path to the file. For example, `src/app/app.module.ts`;
* maxAge - number (>1) | 0 - maximum allowed actions to be stored in the history tree. The oldest actions are removed once maxAge is reached. It's critical for performance. 0 is infinite. Default is 25 for performance reasons.

This command will automate the following steps:

1. Update `package.json` > `dependencies` with `@ngrx/store-devtools`.
2. Run `npm install` to install those dependencies. 
3. Update your `src/app.module.ts` > `imports` array with `StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })`. The maxAge property will be set to the flag `maxAge` if provided. 
