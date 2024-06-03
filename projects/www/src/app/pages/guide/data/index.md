<ngrx-docs-alert type="error">

The `@ngrx/data` package is in <a href="https://github.com/ngrx/platform/issues/4011" target="_blank">maintenance mode</a>.
Changes to this package are limited to critical bug fixes.

</ngrx-docs-alert>

# @ngrx/data

NgRx Data is an extension that offers a gentle introduction to NgRx by simplifying management of **entity data** while reducing the amount of explicitness.

## Introduction

Many applications have substantial _domain models_ with 10s or 100s of entity types.

Such applications typically create, retrieve, update, and delete entity data that are "persisted" in a database of some sort, hosted on a remote server.

Developers who build these apps with the NgRx [Store](guide/store), [Effects](guide/effects), and [Entity](guide/entity) libraries alone tend to write a large number of _actions_, _action-creators_, _reducers_, _effects_, _dispatchers_, and _selectors_ as well as the HTTP GET, PUT, POST, and DELETE methods _for each entity type_.
There will be a lot of repetitive code to create, maintain, and test.
The more entities in your model, the bigger the challenge.

With NgRx Data you can develop large entity models quickly with very little code
and without knowing much NgRx at all.
Yet all of NgRx remains accessible to you, when and if you want it.

NgRx Data is an abstraction over the Store, Effects, and Entity that radically reduces
the amount of code you'll write.
As with any abstraction, while you gain simplicity,
you lose the explicitness of direct interaction with the supporting NgRx libraries.

## Key Concepts

#### NgRx Data

- automates the creation of actions, reducers, effects, dispatchers, and selectors for each entity type.
- provides default HTTP GET, PUT, POST, and DELETE methods for each entity type.
- holds entity data as collections within a cache which is a slice of NgRx store state.
- supports optimistic and pessimistic save strategies
- enables transactional save of multiple entities of multiple types in the same request.
- makes reasonable default implementation choices
- offers numerous extension points for changing or augmenting those default behaviors.

NgRx Data targets management of _persisted entity data_, like _Customers_ and _Orders_, that many apps query and save to remote storage. That's its sweet spot.

It is ill-suited to _non-entity_ data.
Value types, enumerations, session data and highly idiosyncratic data are better managed with standard NgRx.
Real-world apps will benefit from a combination of NgRx techniques, all sharing a common store.

#### Entity

An **entity** is an object with long-lived data values that you read from and write to a database. An entity refers to some "thing" in the application domain. Examples include a _Customer_, _Order_, _LineItem_, _Product_, _Person_ and _User_.

An **entity** is a specific kind of data, an object defined by its _thread of continuity and identity_.

We experience its "continuity" by storing and retrieving ("persisting") entity objects in a permanent store on a server, a store such as a database. Whether we retrieve the "Sally" entity today or tomorrow or next week, we "mean" that we're getting the same conceptual "Sally" no matter how her data attributes have changed.

In NgRx Data we maintain the entity object's identity by means of its **primary key**. Every entity in NgRx Data must have a _primary key_. The primary key is usually a single attribute of the object. For example, that "Sally" entity object might be an instance of the "Customer" entity type, an instance whose permanent, unchanging primary key is the `id` property with a value of `42`.

The primary key doesn't have to be a single attribute. It can consist of multiple attributes of the object if you need that feature. What matters is that the primary key _uniquely_ identifies that object within a permanent collection of entities of the same type. There can be exactly one `Customer` entity with `id: 42` and that entity is "Sally".

### Entity Collection

The notion of an _Entity Collection_ is also fundamental to NgRx Data. All entities belong to a collection of the same entity type. A `Customer` entity belongs to a `Customers` collection.

Even if you have only one instance of an entity type, it must be held within an entity collection: perhaps a collection with a single element.

## Defining the entities

A `EntityMetadataMap` tells NgRx Data about your entities. Add a property to the set for each entity name.

<ngrx-code-example header="entity-metadata.ts">

```ts
import { EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  Hero: {},
  Villain: {},
};

// because the plural of "hero" is not "heros"
const pluralNames = { Hero: 'Heroes' };

export const entityConfig = {
  entityMetadata,
  pluralNames,
};
```

</ngrx-code-example>

Export the entity configuration to be used when registering it in your `AppModule`.

## Registering the entity store

Once the entity configuration is created, you need to put it into the root store for NgRx. This is done by importing the `entityConfig` and then passing it to the `EntityDataModule.forRoot()` function.

<ngrx-code-example header="app.module.ts">

```ts
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  DefaultDataServiceConfig,
  EntityDataModule,
} from '@ngrx/data';
import { entityConfig } from './entity-metadata';

@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot(entityConfig),
  ],
})
export class AppModule {}
```

</ngrx-code-example>

### Using the Standalone API

Registering the root entity data can also be done using the standalone APIs if you are bootstrapping an Angular application using standalone features.

<ngrx-code-example header="main.ts">

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideEntityData, withEffects } from '@ngrx/data';

import { AppComponent } from './app.component';
import { entityConfig } from './entity-metadata';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideStore(),
    provideEffects(),
    provideEntityData(entityConfig, withEffects()),
  ],
});
```

</ngrx-code-example>

## Creating entity data services

NgRx Data handles creating, retrieving, updating, and deleting data on your server by extending `EntityCollectionServiceBase` in your service class.

<ngrx-code-example header="hero.service.ts">

```ts
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Hero } from '../core';

@Injectable({ providedIn: 'root' })
export class HeroService extends EntityCollectionServiceBase<Hero> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Hero', serviceElementsFactory);
  }
}
```

</ngrx-code-example>

## Using NgRx Data in components

To access the entity data, components should inject entity data services.

<ngrx-code-example header="heroes.component.ts">

```ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from '../../core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {
  loading$: Observable<boolean>;
  heroes$: Observable<Hero[]>;

  constructor(private heroService: HeroService) {
    this.heroes$ = heroService.entities$;
    this.loading$ = heroService.loading$;
  }

  ngOnInit() {
    this.getHeroes();
  }

  add(hero: Hero) {
    this.heroService.add(hero);
  }

  delete(hero: Hero) {
    this.heroService.delete(hero.id);
  }

  getHeroes() {
    this.heroService.getAll();
  }

  update(hero: Hero) {
    this.heroService.update(hero);
  }
}
```

</ngrx-code-example>

In this example, you need to listen for the stream of heroes. The `heroes$` property references the `heroService.entities$` Observable. When state is changed as a result of a successful HTTP request (initiated by `getAll()`, for example), the `heroes$` property will emit the latest Hero array.

By default, the service includes the `loading$` Observable to indicate whether an HTTP request is in progress. This helps applications manage loading states.
