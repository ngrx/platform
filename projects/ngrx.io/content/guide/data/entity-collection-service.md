# EntityCollectionService

An **`EntityCollectionService`** is a facade over the NgRx Data **dispatcher** and **selectors$** that manages an entity `T` collection cached in the _NgRx store_.

The **_Dispatcher_** features **command** methods that dispatch [_entity actions_](guide/data/entity-actions) to the _NgRx store_.
These commands either update the entity collection directly or trigger HTTP requests to a server. When the server responds, the NgRx Data library dispatches new actions with the response data and these actions update the entity collection.

The `EntityCommands` interface lists all the commands and what they do.

Your application calls these _command methods_ to update
the _cached entity collection_ in the _NgRx store_.

**_Selectors$_** are properties returning _selector observables_.
Each _observable_ watches for a specific change in the cached entity collection and emits the changed value.

The `EntitySelectors$` interface lists all of the pre-defined _selector observable properties_ and
explains which collection properties they observe.

Your application subscribes to _selector observables_
in order to process and display entities in the collection.

## Examples from the demo app

Here are simplified excerpts from the demo app's `HeroesComponent` showing the component calling _command methods_ and subscribing to _selector observables_.

```typescript
constructor(EntityCollectionServiceFactory: EntityCollectionServiceFactory) {
  this.heroService = EntityCollectionServiceFactory.create<Hero>('Hero');
  this.filteredHeroes$ = this.heroService.filteredEntities$;
  this.loading$ = this.heroService.loading$;
}

getHeroes() { this.heroService.getAll(); }
add(hero: Hero) { this.heroService.add(hero); }
deleteHero(hero: Hero) { this.heroService.delete(hero.id); }
update(hero: Hero) { this.heroService.update(hero); }
```

### Create the _EntityCollectionService_ with a factory

The component injects the NgRx Data `EntityCollectionServiceFactory` and
creates an `EntityCollectionService` for `Hero` entities.

<div class="alert is-helpful">

We'll go inside the factory [later in this guide](#entitycollectionservicefactory).

</div>

### Create the _EntityCollectionService_ as a class

Alternatively, you could have created a single `HeroEntityService` elsewhere, perhaps in the `AppModule`, and injected it into the component's constructor.

There are two basic ways to create the service class.

1.  Derive from `EntityCollectionServiceBase<T>`
1.  Write a `HeroEntityService` with just the API you need.

When `HeroEntityService` derives from `EntityCollectionServiceBase<T>` it must inject the `EntityCollectionServiceFactory` into its constructor.
There are examples of this approach in the demo app.

When defining an `HeroEntityService` with a limited API,
you may also inject `EntityCollectionServiceFactory` as a source of the
functionality that you choose to expose.

Let your preferred style and app needs determine which creation technique you choose.

### Set component _selector$_ properties

A `selector$` property is an _observable_ that emits when a _selected_ state property changes.

<div class="alert is-helpful">

Some folks refer to such properties as **state streams**.

</div>

The example component has two such properties that expose two `EntityCollectionService` _selector observables_: `filteredEntities$` and `loading$`.

The `filteredEntities$` _observable_ produces an array of the currently cached `Hero` entities that satisfy the user's filter criteria.
This _observable_ produces a new array of heroes if the user
changes the filter or if some action changes the heroes in the cached collection.

The `loading$` _observable_ produces `true` while the
[data service](guide/data/entity-dataservice) is waiting for heroes from the server.
It produces `false` when the server responds.
The demo app subscribes to `loading$` so that it can turn a visual loading indicator on and off.

<div class="alert is-helpful">

These component and `EntityCollectionService` selector property names end in `'$'` which is a common convention for a property that returns an `Observable`.
All _selector observable_ properties of an `EntityCollectionService` follow this convention.

</div>

#### The _selector observable_ versus the _selector function_

The _`selector$`_ observable (ending with an `'$'`) differs from the similarly named and
closely-related `selector` function (no `'$'` suffix)

A `selector` is a _function_ that _selects_ a slice of state from the entity collection.
A `selector$` observable emits that slice of state when the state changes.

NgRx Data creates a `selector$` observable by passing the _selector_ function to the NgRx `select` operator and piping it onto the NgRx store, as seen in the following example:

```typescript
loading$ = this.store.select(selectLoading);
```

#### Using _selectors$_

The component _class_ does not subscribe to these `selector$` properties but the component _template_ does.

The template binds to them and forwards their _observables_ to the Angular `AsyncPipe`, which subscribes to them.
Here's an excerpt of the `filteredHeroes$` binding.

```html
<div *ngIf="filteredHeroes$ | async as heroes">
...
</div>
```

### Call _command methods_

Most of the `HeroesComponent` methods delegate to `EntityCollectionService` command methods such as `getAll()` and `add()`.

There are two kinds of commands:

1.  Commands that trigger requests to the server.
1.  Cache-only commands that update the cached entity collection.

The server commands are simple verbs like "add" and "getAll".
They dispatch actions that trigger asynchronous requests to a remote server.

The cache-only command methods are longer verbs like "addManyToCache" and "removeOneFromCache"
and their names all contain the word "cache".
They update the cached collection immediately (synchronously).

<div class="alert is-helpful">

Most applications call the server commands because they want to query and save entity data.

Apps rarely call the cache-only commands because direct updates to the entity collection
are lost when the application shuts down.

</div>

Many `EntityCollectionService` command methods take a value.
The value is _typed_ (often as `Hero`) so you won't make a mistake by passing in the wrong kind of value.

Internally, an entity service method creates an
[_entity action_](guide/data/entity-actions) that corresponds to the method's intent. The action's _payload_ is either the value passed to the method or an appropriate derivative of that value.

_Immutability_ is a core principle of the _redux pattern_.
Several of the command methods take an entity argument such as a `Hero`.
An entity argument **must never be a cached entity object**.
It can be a _copy_ of a cached entity object and it often is.
The demo application always calls these command methods with copies of the entity data.

All _command methods_ return `void`.
A core principle of the _redux pattern_ is that _commands_ never return a value. They just _do things_ that have side-effects.

Rather than expect a result from the command,
you subscribe to a _selector$_ property that reflects
the effects of the command. If the command did something you care about, a _selector$_ property should be able to tell you about it.

## _EntityCollectionServiceFactory_

The `create<T>()` method of the NgRx Data `EntityCollectionServiceFactory` produces a new instance
of the `EntityCollectionServiceBase<T>` class that implements the `EntityCollectionService` interface for the entity type `T`.
