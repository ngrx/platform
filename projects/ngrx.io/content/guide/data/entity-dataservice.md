# Entity DataService

The NgRx Data library expects to persist entity data with calls to a REST-like web api with endpoints for each entity type.

The `EntityDataService` maintains a registry of service classes dedicated to persisting data for a specific entity type.

When the NgRx Data library sees an action for an entity _persistence operation_, it asks the `EntityDataService` for the registered data service that makes HTTP calls for that entity type, and calls the appropriate service method.

A data service is an instance of a class that implements the `EntityCollectionDataService`.
This interface supports a basic set of CRUD operations for an entity.
Each that return `Observables`:

| Method                                                   | Meaning                               | HTTP Method with endpoint        |
| -------------------------------------------------------- | ------------------------------------- | -------------------------------- |
| `add(entity: T): Observable<T>`                          | Add a new entity                      | `POST` /api/hero/                |
| `delete(id: number` &#x7c; `string): Observable<number` &#x7c; `string>` | Delete an entity by primary key value | `DELETE` /api/hero/5             |
| `getAll(): Observable<T[]>`                              | Get all instances of this entity type | `GET` /api/heroes/               |
| `getById(id: number` &#x7c; `string): Observable<T>`     | Get an entity by its primary key      | `GET` /api/hero/5                |
| `getWithQuery(queryParams: QueryParams` &#x7c; `string): Observable<T[]>` | Get entities that satisfy the query   | `GET` /api/heroes/?name=bombasto |
| `update(update: Update<T>): Observable<T>`               | Update an existing entity             | `PUT` /api/hero/5                |

<div class="alert is-helpful">

`QueryParams` is a _parameter-name/value_ map
You can also supply the query string itself.
`HttpClient` safely encodes both into an encoded query string.

`Update<T>` is an object with a strict subset of the entity properties.
It _must_ include the properties that participate in the primary key (e.g., `id`).
The update property values are the _properties-to-update_;
unmentioned properties should retain their current values.

</div>

The default data service methods return the `Observables` returned by the corresponding Angular `HttpClient` methods.

Your API should return an object in the shape of the return type for each data service method. For example: when calling `.add(entity)` your API
should create the entity and then return the full entity matching `T` as that is the value that will be set as the record in the store for that entities primary
key. The one method that differs from the others is `delete`. `delete` requires a response type of the entities primary key, `string | number`, instead of the full object, `T`, that was deleted.

<div class="alert is-helpful">

If you create your own data service alternatives, they should return similar `Observables`.

</div>

## Register data services

The `EntityDataService` registry is empty by default.

You can add custom data services to it by creating instances of those classes and registering them with `EntityDataService` in one of two ways.

1.  register a single data service by entity name with the `registerService()` method.

2.  register several data services at the same time with by calling `registerServices` with an _entity-name/service_ map.

<div class="alert is-helpful">

You can create and import a module that registers your custom data services as shown in the _EntityDataService_ [tests](https://github.com/ngrx/platform/blob/master/modules/data/spec/dataservices/entity-data.service.spec.ts)

</div>

If you decide to register an entity data service, be sure to do so _before_ you ask NgRx Data to perform a persistence operation for that entity.

Otherwise, the NgRx Data library will create and register an instance of the default data service `DefaultDataService<T>` for that entity type.

## The _DefaultDataService_

The demo app doesn't register any entity data services. 
It relies entirely on a `DefaultDataService`, created for each entity type, by the injected `DefaultDataServiceFactory`.

A `DefaultDataService<T>` makes REST-like calls to the server's web api with Angular's `HttpClient`.

It composes HTTP URLs from a _root_ path (see ["Configuration"](#configuration) below) and the entity name.

For example,

* if the persistence action is to delete a hero with id=42 _and_
* the root path is `'api'` _and_
* the entity name is `'Hero'`, _then_
* the DELETE request URL will be `'api/hero/42'`.

When the persistence operation concerns multiple entities, the `DefaultDataService` substitutes the plural of the entity type name for the resource name.

The `QUERY_ALL` action to get all heroes would result in an HTTP GET request to the URL `'api/heroes'`.

The `DefaultDataService` doesn't know how to pluralize the entity type name.
It doesn't even know how to create the base resource names.

It relies on an injected `HttpUrlGenerator` service to produce the appropriate endpoints.
And the default implementation of the `HttpUrlGenerator` relies on the
`Pluralizer` service to produce the plural collection resource names.

The [_Entity Metadata_](guide/data/entity-metadata#plurals) guide
explains how to configure the default `Pluralizer` .

<a id="configuration"></a>

### Configure the _DefaultDataService_

The collection-level data services construct their own URLs for HTTP calls. They typically rely on shared configuration information such as the root of every resource URL.

The shared configuration values are almost always specific to the application and may vary according the runtime environment.

The NgRx Data library defines a `DefaultDataServiceConfig` for 
conveying shared configuration to an entity collection data service.

The most important configuration property, `root`, returns the _root_ of every web api URL, the parts that come before the entity resource name. If you are using a remote API, this value can include the protocol, domain, port, and root path, such as `https://my-api-domain.com:8000/api/v1`.

For a `DefaultDataService<T>`, the default value is `'api'`, which results in URLs such as `api/heroes`.

The `timeout` property sets the maximum time (in ms) before the _ng-lib_ persistence operation abandons hope of receiving a server reply and cancels the operation. The default value is `0`, which means that requests do not timeout.

The `delete404OK` flag tells the data service what to do if the server responds to a DELETE request with a `404 - Not Found`.

In general, not finding the resource to delete is harmless and
you can save yourself the headache of ignoring a DELETE 404 error
by setting this flag to `true`, which is the default for the `DefaultDataService<T>`.

When running a demo app locally, the server may respond more quickly than it will in production. You can simulate real-world by setting the `getDelay` and `saveDelay` properties.

#### Provide a custom configuration

First, create a custom configuration object of type `DefaultDataServiceConfig` :

```typescript
const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: 'https://my-api-domain.com:8000/api/v1',
  timeout: 3000, // request timeout
}
```

Provide it in an eagerly-loaded `NgModule` such as the `EntityStoreModule` in the sample application:

```typescript
@NgModule({
  providers: [{ provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }]
})
```

## Custom _EntityDataService_

While the NgRx Data library provides a configuration object to modify certain aspects of the _DefaultDataService_,
you may want to further customize what happens when you save or retrieve data for a particular collection.

For example, you may need to modify fetched entities to convert strings to dates, or to add additional properties to an entity.

You could do this by creating a custom data service and registering that service with the `EntityDataService`.

To illustrate this, the sample app adds a `dateLoaded` property to the `Hero` entity to record when a hero is loaded from the server into the _NgRx-store_ entity cache.

```typescript
export class Hero {
  readonly id: number;
  readonly name: string;
  readonly saying: string;
  readonly dateLoaded: Date;
}
```

To support this feature, we 'll create a `HeroDataService` class that implements the `EntityCollectionDataService<T>` interface.

In the sample app the `HeroDataService` derives from the NgRx Data `DefaultDataService<T>` in order to leverage its base functionality.
It only overrides what it really needs.

<code-example header="store/entity/hero-data-service.ts" linenums="false">
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  EntityCollectionDataService,
  DefaultDataService,
  HttpUrlGenerator,
  Logger,
  QueryParams
} from '@ngrx/data';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hero } from '../../core';

@Injectable()
export class HeroDataService extends DefaultDataService&lt;Hero&gt; {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator, logger: Logger) {
    super('Hero', http, httpUrlGenerator);
    logger.log('Created custom Hero EntityDataService');
  }

  getAll(): Observable&lt;Hero[]&gt; {
    return super.getAll().pipe(map(heroes => heroes.map(hero => this.mapHero(hero))));
  }

  getById(id: string | number): Observable&lt;Hero&gt; {
    return super.getById(id).pipe(map(hero => this.mapHero(hero)));
  }

  getWithQuery(params: string | QueryParams): Observable&lt;Hero[]&gt; {
    return super.getWithQuery(params).pipe(map(heroes => heroes.map(hero => this.mapHero(hero))));
  }

  private mapHero(hero: Hero): Hero {
    return { ...hero, dateLoaded: new Date() };
  }
}
</code-example>

This `HeroDataService` hooks into the _get_ operations to set the `Hero.dateLoaded` on fetched hero entities.
It also tells the logger when it is created (see the console output of the running sample) .

Finally, we must tell NgRx Data about this new data service.

The sample app provides `HeroDataService` and registers it by calling the `registerService()` method on the `EntityDataService` in the app's _entity store module_:

<code-example header="store/entity-store.module.ts" linenums="false">
import { EntityDataService } from '@ngrx/data'; // <-- import the NgRx Data data service registry

import { HeroDataService } from './hero-data-service';

@NgModule({
  imports: [ ... ],
  providers: [ HeroDataService ] // <-- provide the data service
})
export class EntityStoreModule {
  constructor(
    entityDataService: EntityDataService,
    heroDataService: HeroDataService,
  ) {
    entityDataService.registerService('Hero', heroDataService); // <-- register it
  }
}
</code-example>

### A custom _DataService_

You don't have to override members of the `DefaultDataService`.
You could write a completely custom alternative that queries and saves
entities by any mechanism you choose.

You can register it the same way as long as it adheres to the interface. 

```typescript
// Register custom data service
entityDataService.registerService('Hero', peculiarHeroDataService); 
```
