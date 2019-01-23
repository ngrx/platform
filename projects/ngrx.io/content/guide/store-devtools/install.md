# Installation

## Installing with `npm`

For more information on using `npm` check out the docs <a href="https://docs.npmjs.com/cli/install" target="_blank">here</a>.

```sh
npm install @ngrx/store-devtools --save
```

## Installing with `yarn`
For more information on using `yarn` check out the docs <a href="https://yarnpkg.com/docs/usage" target="_blank">here</a>.

```sh
yarn add @ngrx/store-devtools
```

## Installing with `ng add`

If your project is using the Angular CLI 6+ then you can install the Store Devtools to your project with the following `ng add` command <a href="https://angular.io/cli/add" target="_blank">(details here)</a>:

```sh
ng add @ngrx/store-devtools
```

This command will automate the following steps:

1. Update `package.json` > `depedencies` with `@ngrx/store-devtools`.
2. Run `npm install` to install those depedencies. 
3. Update your `src/app.module.ts` > `imports` array with `StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })`
