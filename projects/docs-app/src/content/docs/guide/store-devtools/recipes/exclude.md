# Excluding Store Devtools In Production

To prevent Store Devtools from being included in your bundle, you can exclude it from the build process.

## Step 1: Create build specific files

Create a folder for your build specific files. In this case, it is `build-specifics`. Now create a file for a common build. Within this file, export an array that defines the `StoreDevtoolsModule`.

```ts
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export const extModules = [
  StoreDevtoolsModule.instrument({
    maxAge: 25,
  }),
];
```

Now create a file for a production build (`ng build --prod=true`) that simply exports an empty array.

```ts
export const extModules = [];
```

## Step 2: Import extModules

Modify `app.module.ts` to include `extModules` in the `imports` array.

```ts
import { extModules } from './build-specifics';

@NgModule({
    imports: [
        StoreModule.forRoot(reducers),
        // Instrumentation must be imported after importing StoreModule
        extModules,
    ],
})
```

## Step 3: Modify angular.json

Add a new entry in the `fileReplacements` section in your `angular.json`. For more information on this topic, look at the build section of the angular documentation. [Configure target-specific file replacements](https://angular.io/guide/build#configure-target-specific-file-replacements)

```ts
"fileReplacements": [
    {
        "replace": "src/app/build-specifics/index.ts",
        "with": "src/app/build-specifics/index.prod.ts"
    }
]
```
