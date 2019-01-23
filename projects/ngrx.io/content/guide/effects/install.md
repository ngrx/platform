# Installation

## Installing with `npm`

For more information on using `npm` check out the docs <a href="https://docs.npmjs.com/cli/install" target="_blank">here</a>.

```sh
npm install @ngrx/effects --save
```

## Installing with `yarn`

For more information on using `yarn` check out the docs <a href="https://yarnpkg.com/docs/usage" target="_blank">here</a>.

```sh
yarn add @ngrx/effects
```

## Installing with `ng add`

If your project is using the Angular CLI 6+ then you can install the Effects to your project with the following `ng add` command <a href="https://angular.io/cli/add" target="_blank">(details here)</a>:

```sh
ng add @ngrx/effects
```

This command will automate the following steps:

1. Update `package.json` > `depedencies` with `@ngrx/effects`.
2. Run `npm install` to install those depedencies. 
3. Create a `src/app/app.effects.ts` file with an empty `AppEffects` class that has the `actions$: Actions` observable injected into it.
4. Create a `src/app/app.effects.spec.ts` spec file with a basic unit test.
5. Update your `src/app/app.module.ts` > `imports` array with `EffectsModule.forRoot([AppEffects])`

