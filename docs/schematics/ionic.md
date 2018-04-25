## Ionic integration

In an Ionic project, you normally use the Ionic CLI (`ionic`) instead of the Angular CLI (`ng`).

But you can integrate Angular CLI and `@ngrx/schematics` with these simple steps:

* Install Angular CLI in your `devDependencies`:

```bash
npm install --save-dev @angular/cli@latest
```

* Install `@ngrx/schematics` and its dependencies following the steps in the [documentation](./README.md#installation).

* Create a `.angular-cli.json` file in your root directory, beside your `ionic.config.json` file. Angular CLI (`ng`) will use it to know where to generate new files. The only contents it needs to have are:

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "apps": [
    {
      "root": "src"
    }
  ]
}
```

* Make `@ngrx/schematics` the default collection as described in the [documentation](README.md#default-schematics-collection), e.g.:

```bash
ng set defaults.schematics.collection=@ngrx/schematics
```

That command will modify the file `.angular-cli.json` so that you don't have to type `--collection @ngrx/schematics` with every command.

* Make SCSS the default style format (the default for Ionic):

```bash
ng set defaults.styleExt scss
```

* After that, you can use `ng` with the same instructions as above, e.g.:

```bash
ng generate store State --root --module app.module.ts
```

**Note**: When you generate components (like containers) they are generated with a `styleUrls` pointing to the `.scss` file, but by default Ionic doesn't include styles directly in each component. So, you will probably need to remove that line from the components you create with `ng`. You will remove a line similar to this:

```TypeScript
  styleUrls: ['./login.component.css']
```

---

**Note**: As Ionic currently doesn't support Angular's `environment.ts` files, you will have to remove them from the imports and adjust the changed files manually, but apart from that, you can use the generated files normally. You will probably have to remove from `app.module.ts` the line with:

```TypeScript
import { environment } from '../environments/environment';
```

And change the line with:

```TypeScript
    !environment.production ? StoreDevtoolsModule.instrument() : [],
```

to:

```TypeScript
    StoreDevtoolsModule.instrument(),
```

during development and probably remove that line in production.

And in the file in `reducers/index.ts` remove the line:

```TypeScript
import { environment } from '../../environments/environment';
```

and change the line:

```TypeScript
export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
```

to:

```TypeScript
export const metaReducers: MetaReducer<State>[] = [];
```

during development and probably remove that line in production.
