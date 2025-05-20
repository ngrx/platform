# Excluding Store Devtools In Production

To prevent Store Devtools from being included in your bundle, you can exclude it from the build process.

## Step 1: Put Store Devtools In `environment.ts`

To exclude the DevTools, put `@ngrx/store-devtools` into an `environment.ts` file, which is replaced with `environment.prod.ts`.

<ngrx-docs-alert type="help">
If the environment files don't exist in your project you can use the `ng generate environments` command to create them.
</ngrx-docs-alert>

Given the below example:

<ngrx-code-example header="environments/environment.ts">

```ts
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
  production: false,
  providers: [provideStoreDevtools({ maxAge: 25 })],
};
```

</ngrx-code-example>

## Step 2: Import Environment File

Modify the `app.config.ts` file, where your application configuration resides, to specify `environment.providers`:

<ngrx-code-example header="app.config.ts">

```ts
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideStore(), environment.providers],
};
```

</ngrx-code-example>
