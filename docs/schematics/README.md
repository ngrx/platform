# @ngrx/schematics

Scaffolding library for Angular applications using NgRx libraries.

@ngrx/schematics provides blueprints for generating files when building out feature areas using NgRx. Built on top of `Schematics`, it integrates with the `Angular CLI` to make setting up and expanding NgRx in Angular applications easier.

### Installation
Install @ngrx/schematics from npm:

`npm install @ngrx/schematics --save-dev`

##### OR

`yarn add @ngrx/schematics --dev`

### Nightly builds

`npm install github:ngrx/schematics-builds --save-dev`

##### OR

`yarn add github:ngrx/entity-builds --dev`

## Dependencies

After installing `@ngrx/schematics`, install the NgRx dependencies.

`npm install @ngrx/{store,effects,entity,store-devtools} --save`

##### OR

`yarn add @ngrx/{store,effects,entity,store-devtools}`


## Default Schematics Collection

To use `@ngrx/schematics` as the default collection in your Angular CLI project,
add the following to the `defaults` section in your `.angular-cli.json`.

```json
    "schematics": {
      "collection": "@ngrx/schematics"
    }
```

The [collection schema](../../modules/schematics/collection.json) also has aliases to the most common blueprints used to generate files.

## Inital State Setup

Generate the initial state management and register it within the `app.module.ts`

```sh
ng generate store State --root --module app.module.ts --collection @ngrx/schematics
```

## Inital Effects Setup

Generate the root effects and register it within the `app.module.ts`

```sh
ng generate effect App --root --module app.module.ts --collection @ngrx/schematics
```

## Blueprints

- [Action](action.md)
- [Container](container.md)
- [Effect](effect.md)
- [Entity](entity.md)
- [Feature](feature.md)
- [Reducer](reducer.md)
- [Store](store.md)
