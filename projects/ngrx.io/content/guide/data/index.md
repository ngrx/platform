# NgRx Data

NgRx Data is an extension that offers a gentle introduction to NgRx by simplifying management of **entity data** while reducing the amount of explicitness.  

<div class="alert is-important">

An **entity** is an object with long-lived data values that you read from and write to a database.  An entity refers to some "thing" in the application domain.  Examples include a _Customer_, _Order_, _LineItem_, _Product_, and _User_.

</div>

## Introduction

Many applications have substantial _domain models_ with 10s or 100s of entity types.

Such applications typically create, retrieve, update, and delete entity data that are "persisted" in a database of some sort, hosted on a remote server.

Developers who build these app with the NgRx [Store](guide/store), [Effects](guide/effects), and [Entity](guide/entity) libraries alone tend to write a large number of _actions_, _action-creators_, _reducers_, _effects_, _dispatchers_, and _selectors_ as well as the HTTP GET, PUT, POST, and DELETE methods _for each entity type_.
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

NgRx Data 
- automates the creation of actions, reducers, effects, dispatchers, and selectors for each entity type.
- provides default HTTP GET, PUT, POST, and DELETE methods for each entity type.
- holds entity data as collections within a cache which is a slice of NgRx store state.
- supports optimistic and pessimistic save strategies
- enables transactional save of multiple entities of multiple types in the same request.
- makes reasonable default implementation choices
- offers numerous extension points for changing or augmenting those default behaviors.

NgRx Data targets management of *persisted entity data*, like _Customers_ and _Orders_, that many apps query and save to remote storage. That's its sweet spot.

It is ill-suited to non-entity data.
Session data and highly idiosyncratic data are better managed with standard NgRx.
Real world apps will benefit from a combination of techniques, all sharing a common store.

## Defining the entities

A `EntityMetadataMap` tells NgRx Data about your entities.  Add a property to the set for each entity name.

<code-example header="entity-metadata.ts">
import { EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  Hero: {},
  Villain: {}
};

// because the plural of "hero" is not "heros"
const pluralNames = { Hero: 'Heroes' };

export const entityConfig = {
  entityMetadata,
  pluralNames
};
</code-example>

Export the entity configuration to be used when registering it in your `AppModule`.

## Registering the entity store

Once the entity configuration is created, you need to put it into the root store for NgRx.  This is done by importing the `entityConfig` and then passing it to the `EntityDataModule.forRoot()` function.

<code-example header="app.module.ts">
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DefaultDataServiceConfig, EntityDataModule } from '@ngrx/data';
import { entityConfig } from './entity-metadata';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot(entityConfig)
  ]
})
export class AppModule {}
</code-example>

## Creating entity data services

NgRx Data handles creating, retrieving, updating, and deleting data on your server by extending `EntityCollectionServiceBase` in your service class.

<code-example header="hero.service.ts">
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory
} from '@ngrx/data';
import { Hero } from '../core';

@Injectable({ providedIn: 'root' })
export class HeroService extends EntityCollectionServiceBase&lt;Hero&gt; {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Hero', serviceElementsFactory);
  }
}
</code-example>

## Using NgRx Data in components

To access the entity data, components should inject entity data services.

<code-example header="heroes.component.ts">
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from '../../core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  loading$: Observable&lt;boolean&gt;;
  heroes$: Observable&lt;Hero[]&gt;;

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
</code-example>

In this example, you need to listen for the stream of heroes. The `heroes$` property references the `heroeService.entities$` Observable.  When state is changed as a result of a successful HTTP request (initiated by `getAll()`, for example), the heroes$ property will emit the latest Hero array.

By default, the service includes the `loading$` Observable to indicate whether an HTTP request is in progress.  This helps applications manage loading states.
