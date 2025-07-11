# @ngrx/schematics

Scaffolding library for Angular applications using NgRx libraries.

Schematics provides Angular CLI commands for generating files when building new NgRx feature areas and expanding existing ones. Built on top of [`Schematics`](https://angular.dev/tools/cli/schematics), this tool integrates with the [`Angular CLI`](https://angular.dev/tools/cli).

## Installation

Detailed installation instructions can be found on the [Installation](guide/schematics/install) page.

## Dependencies

After installing `@ngrx/schematics`, install the NgRx dependencies.

```sh
npm install @ngrx/{store,effects,entity,store-devtools} --save
```

```sh
yarn add @ngrx/{store,effects,entity,store-devtools}
```

## Initial State Setup

Generate the initial state management and register it within the `app.module.ts`

```sh
ng generate @ngrx/schematics:store State --root --module app.module.ts
```

<ngrx-docs-alert type="inform">
  The @ngrx/schematics command prefix is only needed when the default collection isn't set.
</ngrx-docs-alert>

## Initial Effects Setup

Generate the root effects and register it within the `app.module.ts`

```sh
ng generate @ngrx/schematics:effect App --root --module app.module.ts
```

## Adding NgRx schematics to schematicCollections

To use `@ngrx/schematics` in your Angular CLI project, add it manually to your `angular.json` or with the following command:

```sh
ng config cli.schematicCollections "[\"@ngrx/schematics\"]"
```

You should end up with the following result in your `angular.json`:

```json
{
  "cli": {
    "schematicCollections": ["@ngrx/schematics"]
  }
}
```

Or, when the Angular schematic is also registered you should end up with following result:

```json
{
  "cli": {
    "schematicCollections": [
      "@schematics/angular",
      "@ngrx/schematics"
    ]
  }
}
```

The [collection schema](https://github.com/ngrx/platform/tree/main/modules/schematics/collection.json) also has aliases to the most common schematics used to generate files.
