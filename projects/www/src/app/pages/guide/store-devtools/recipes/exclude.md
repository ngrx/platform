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
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export const environment = {
  production: false,
  imports: [StoreDevtoolsModule.instrument({ maxAge: 25 })],
};
```

</ngrx-code-example>

When using the standalone API, use the `providers` array instead of `imports`:

<ngrx-code-example header="environments/environment.ts">

```ts
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
  production: false,
  providers: [provideStoreDevtools({ maxAge: 25 })],
};
```

</ngrx-code-example>

Now, let's add an empty `imports` property to the production environment file:

<ngrx-code-example header="environments/environment.prod.ts">

```ts
export const environment = {
  production: true,
  imports: [],
};
```

</ngrx-code-example>

## Step 2: Import Environment File

Modify `app.module.ts` to include `environment.imports` in the `imports` array.

<ngrx-code-example header="app.module.ts">

```ts
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    // Instrumentation must be imported after importing StoreModule
    environment.imports,
  ],
})
```

</ngrx-code-example>

When using the standalone API, modify the `app.config.ts` file, where your application configuration resides, to specify `environment.providers`:

<ngrx-code-example header="app.config.ts">

```ts
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideStore(), environment.providers],
};
```

</ngrx-code-example>
