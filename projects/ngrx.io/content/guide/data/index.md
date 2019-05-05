# NgRx Data

NgRx Data is an extension that offers a gentle introduction to NgRx by simplifying management of **entity data** while reducing the amount of explicitness.  

Entity data is only one kind of application data.  NgRx Data should not be used for non-entity or highly idiosyncratic data.

<div class="alert is-important">

An **entity** is an object with long-lived data values that you read from and write to a database.  An entity refers to some "thing" in the application domain.  Examples include a _Customer_, _Order_, _LineItem_, _Product_, and _User_.

</div>

## Introduction

Many applications have substantial _domain models_ with 10s or 100s of entity types.

In NgRx, to create, retrieve, update, and delete (CRUD) data for every entity type is an overwhelming task. You're writing _actions_, _action-creators_, _reducers_, _effects_, _dispatchers_, and _selectors_ as well as the HTTP GET, PUT, POST, and DELETE methods _for each entity type_.

In even a small model, this is a ton of repetitive code to create, maintain, and test.

NgRx Data allows consumers to use NgRx while radically reducing the explicitness necessary to manage entities with NgRx.

## Key Concepts

- NgRx Data can be used with NgRx to provide simplified management of entity data.
- NgRx Data automates the creation of actions, reducers, effects, dispatchers, and selectors for each entity type.
- NgRx Data provides default HTTP GET, PUT, POST, and DELETE methods for each entity type.
- NgRx Data should not be used for non-entity or highly idiosyncratic data.  They are better managed with NgRx.

## Defining the entities

A `EntityMetadataMap` is used to tell NgRx Data about your entities.  Add a property to the set for each entity name.

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
