# Excluding Store Devtools In Production

To prevent Store Devtools from being included in your bundle, you can exclude it from the build process.

## Step 1: Put Store Devtools In `environment.ts`

To exclude the DevTools, put `@ngrx/store-devtools` into an `environment.ts` file, which is replaced with `environment.prod.ts`.

<div class="alert is-helpful">
If the environment files don't exist in your project you can use the `ng generate environments` command to create them.
</div>

Given the below example:

<code-example header="environments/environment.ts">
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export const environment = {
    production: false,
    imports: [
        StoreDevtoolsModule.instrument({ maxAge: 25 })
    ],
};
</code-example>

When using the standalone API, use the `providers` array instead of `imports`:

<code-example header="environments/environment.ts">
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
    production: false,
    providers: [
        provideStoreDevtools({ maxAge: 25 })
    ],
};
</code-example>

Now, let's add an empty `imports` property to the production environment file:

<code-example header="environments/environment.prod.ts">
export const environment = {
    production: true,
    imports: [],
};
</code-example>

## Step 2: Import Environment File

Modify `app.module.ts` to include `environment.imports` in the `imports` array.

<code-example header="app.module.ts">
import { environment } from '../environments/environment';

@NgModule({
    imports: [
        StoreModule.forRoot(reducers),
        // Instrumentation must be imported after importing StoreModule
        environment.imports,
    ],
})
</code-example>

When using the standalone API, modify the `app.config.ts` file, where your application configuration resides, to specify `environment.providers`:

<code-example header="app.config.ts">
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
    providers: [
        provideStore(),
        environment.providers,
    ]
};
</code-example>
