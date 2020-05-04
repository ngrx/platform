# @ngrx/schematics

Scaffolding library for Angular applications using NgRx libraries.

Schematics provides Angular CLI commands for generating files when building new NgRx feature areas and expanding existing ones. Built on top of [`Schematics`](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2), this tool integrates with the [`Angular CLI`](https://cli.angular.io/).

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

<div class="alert is-important">
  The @ngrx/schematics command prefix is only needed when the default collection isn't set.
</div>

## Initial Effects Setup

Generate the root effects and register it within the `app.module.ts`

```sh
ng generate @ngrx/schematics:effect App --root --module app.module.ts
```

## Default Schematics Collection

To use `@ngrx/schematics` as the default collection in your Angular CLI project,
add it to your `angular.json`:

```sh
ng config cli.defaultCollection @ngrx/schematics
```

The [collection schema](https://github.com/ngrx/platform/tree/master/modules/schematics/collection.json) also has aliases to the most common schematics used to generate files.
