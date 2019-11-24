# Saving Multiple Entities

Many apps must save several entities at the same time in the same transaction.

Multiple entity saves are a first class feature.
By "first class" we mean that NgRx Data offers a built-in, multiple entity save solution that
is consistent with NgRx Data itself:

* defines a `ChangeSet`, describing `ChangeOperations` to be performed on multiple entities of multiple types.
* has a set of `SAVE_ENTITIES...` cache-level actions.
* has an `EntityCacheDispatcher` to dispatch those actions.
* offers `EntityCacheEffects` that sends `SAVE_ENTITIES` async requests to the server and
  returns results as `SAVE_ENTITIES_SUCCESS` or `SAVE_ENTITIES_ERROR` actions.
* offers a default `EntityCacheDataService` to make those http server requests.
* integrates with change tracking.
* delegates each collection-level change to the (customizable) `entity-collection-reducer-methods`.

<div class="alert is-helpful">

You could implement multiple-entity saves yourself by, prior to version 6.1.
You could define your own protocol and manipulate the `EntityCache` directly by dispatching `SET_ENTITY_CACHE`
after updating a copy of the current cache before and after save.
The collection-level reducers in `entity-collection-reducer-methods` and the NgRx `EntityAdapters` would help.

It wouldn't be easy and there are many steps that can be easily overlooked. But you could do it.

</div>

### Save with _EntityCacheDispatcher.saveEntities()_

This NgRx Data version includes a new `EntityCacheDispatcher` whose
methods make it easier to create and dispatch all of the entity cache actions.

Save a bunch of entity changes with the `saveEntities()` dispatcher method.
Call it with a URL and a `ChangeSet` describing the entity changes that the server API (at the URL endpoint) should save.

The sample application demonstrates a simple `saveEntities` scenario.
A button on the _Villains_ page deletes all of the villains.

In the following example, we want to add a `Hero` and delete two `Villains` in the same transaction.
We assume a server is ready to handle such a request.

First create the changes (each a `ChangeSetItem`) for the `ChangeSet`.

<code-example linenums="false">
import { ChangeSetOperation } from '@ngrx/data';
...
const changes: ChangeSetItem[] = [
  {
    op: ChangeSetOperation.Add,
    entityName: 'Hero',
    entities: [hero]
  },
  {
    op: ChangeSetOperation.Delete,
    entityName: 'Villain',
    entities: [2, 3] // delete by their ids
  }
];
</code-example>

The `changeSetItemFactory` makes it easier to write these changes.

```typescript
import { changeSetItemFactory as cif } from '@ngrx/data';
...
const changes: ChangeSetItem[] = [
  cif.add('Hero', hero),
  cif.delete('Villain', [2, 3])
];
```

Now dispatch a `saveEntities` with a `ChangeSet` for those changes.

```typescript
const changeSet: ChangeSet = { changes, tag: 'Hello World'}

cacheEntityDispatcher.saveEntities(changeSet, saveUrl).subscribe(
  result => log('Saved ChangeSet')
);
```

The `saveEntities(changeSet, saveUrl)` returns an `Observable<ChangeSet>`,
which emits a new `ChangeSet` after the server API (at the `saveUrl` endpoint) returns a successful response.

That emitted `ChangeSet` holds the server's response data for all affected entities.

The app can wait for the `saveEntities()` observable to terminate (either successfully or with an error), before proceeding (e.g., routing to another page).

#### How it works

Internally, the method creates a `SAVE_ENTITIES` action whose payload data includes the `ChangeSet`.
The action also has the URL to which the requested save should be sent and a `correlationId` (see below).

The method dispatches this action to the NgRx store where it is processed by the `EntityCacheReducer`.
If the action is "optimistic", the reducer updates the cache with changes immediately.

Then the `EntityCacheEffects` picks up the `SAVE_ENTITIES` action and sends a "save changes" request to
the server's API endpoint (the URL).

If the request succeeds, the server returns data for all of the changed (and deleted) entities.
The `EntityCacheEffects` packages that data into a `SAVE_ENTITIES_SUCCESS` action and dispatches it to the store.

The `EntityCacheReducer` for the `SAVE_ENTITIES_SUCCESS` action
updates the cache with the (possibly altered) entity data from the server.

Meanwhile, the `Observable<ChangeSet>` from the `saveEntities()` dispatcher method is
watching the stream of actions dispatched to the store.
When a `SAVE_ENTITIES_SUCCESS` (or `SAVE_ENTITIES_ERROR`) action emerges and
it has the same `correlationId` as the original `SAVE_ENTITIES` action,
the observable emits the `ChangeSet` (or error).

The subscriber to that observable now knows that this particular _save entities_ request is "done".

<div class="alert is-helpful">

This complicated dance is standard NgRx. Fortunately, all you have to know is that you can call `saveEntities()` with the `ChangeSet` and URL, then wait for the returned observable to emit.

</div>

#### _ChangeSet_

The `ChangeSet` interface is a simple structure with only one critical property,
`changes`, which holds the entity data to save.

<code-example header="ChangeSet" linenums="false">

export interface ChangeSet&lt;T = any&gt; {
  /** An array of ChangeSetItems to be processed in the array order */
  changes: ChangeSetItem[];

  /**
   * An arbitrary, serializable object that should travel with the ChangeSet.
   * Meaningful to the ChangeSet producer and consumer. Ignored by NgRx Data.
   */
  extras?: T;

  /** An arbitrary string, identifying the ChangeSet and perhaps its purpose */
  tag?: string;
}

</code-example>

At the heart of it is `changes`, an array of `ChangeSetItems` that describes a change operation to be performed with one or more entities of a particular type.

For example,

* a `ChangeSetAdd` could add 3 new `Hero` entities to the server's `Hero` collection.
* a `ChangeSetUpdate` could update 2 existing `Villain` entities.
* a `ChangeSetDelete` could delete a `SideKick` entity by its primary key.
* a `ChangeSetUpsert` could add two new `SuperPower` entities and update a third `SuperPower` entity.

There are four `ChangeSetOperations`

<code-example header="ChangeSetOperation">
export enum ChangeSetOperation {
  Add = 'Add',
  Delete = 'Delete',
  Update = 'Update',
  Upsert = 'Upsert'
}
</code-example>

<div class="alert is-helpful">

`Upsert` is a request to treat the entities in the `ChangeSetItem` as _either_ new entities or updates to _existing_ entities.

</div>

Each kind of `ChangeSetItem` follows a pattern similar to `ChangeSetAdd`.

<code-example header="ChangeSetAdd">
export interface ChangeSetAdd&lt;T = any&gt; {
  op: ChangeSetOperation.Add;
  entityName: string;
  entities: T[];
}
</code-example>

The `ChangeSetItem` flavors all have `op`, `entityName` and `entities` properties.
They differ substantively only in the nature of the `entities` array which corresponds to the change operation:

* Add: entities
* Delete: primary keys of the entities to delete
* Update: NgRx Entity `Update<T>`s
* Upsert: entities

#### Pessimistic / Optimistic save

The `EntityCacheDispatcher.saveEntities` dispatches the `SAVE_ENTITIES` action (with its `ChangeSet`) to the store where it is processed by the `EntityCacheReducer`.

If the action is "pessimistic", the reducer sets the collection `loading` flags but doesn't update the entities in cache.
The reducer for the `SAVE_ENTITIES_SUCCESS` action, whose payload holds the successfully saved entities, will update the cached entities.

If the action is "optimistic", the reducer applies the changes to the cache immediately, before you send them to the server.

You can specify "optimistic" or "pessimistic" in the `options` parameter.
If you don't specify this option, NgRx Data uses the default value in
`EntityDispatcherDefaultOptions.optimisticSaveEntities`.
It is `false` (pessimistic) by default.

#### Specify your own defaults

You can provide alternative defaults.


```typescript
 {
  provide: EntityDispatcherDefaultOptions,
  useValue: myDispatcherDefaultOptions
}
```

#### Server

The server API (the usual recipient of a `ChangeSet`) must be able to process the request.
NgRx Data doesn't know if the API can or cannot process a `ChangeSet` (and that includes whether the server can or cannot handle upserts).

As always, make sure only to send something that the server API can handle.

#### EntityCacheEffects

You can handle the async HTTP _save changes_ request yourself, making your own calls to the server in your own way.

Your solution can use the `EntityCacheDispacher` to dispatch `SAVE_ENTITIES`, `SAVE_ENTITIES_SUCCESS` and `SAVE_ENTITIES_ERROR` actions for updating the cache and managing the `ChangeState` of the entities in the `ChangeSet`.

Perhaps better, you can let the `EntityCacheEffects` handle this for you in a manner similar to the v6 `EntityEffects` for single-entity saves.

The `EntityCacheEffects.saveEntities$` effect listens for `SAVE_ENTITIES` and makes a request to the designated URL via the (new) `EntityCacheDataService`.
It takes the response and dispatches either a `SAVE_ENTITIES_SUCCESS` or `SAVE_ENTITIES_ERROR`, as appropriate.

<div class="alert is-helpful">

If you prefer to handle server interaction yourself,
you can disable the `EntityCacheEffects` by providing a null implementation, in your `NgModule`, e.g.,


```typescript
{ provide: EntityCacheEffects: useValue: {} }
```
</div>

#### EntityCacheDataService

The `EntityCacheDataService` constructs and POSTS the actual request to the given API URL.

We anticipate that most server API implementors will not support the NgRx Entity `Update` structure within the `ChangeSet`.
So the `EntityCacheDataService.saveEntities()` method
extracts the `changes` from the `Updates<T>[]` and sends these to the server; it then reconstructs the `Updates<T>[]` entities in from the server response so that the NgRx Data consumer of the response sees those `Update` structures.

As always, you can provide an alternative implementation:

```typescript
{ provide: EntityCacheDataService: useClass: MyCacheDataService }
```

#### Updating the store with server response data

If the save was pessimistic, the EntityCache is unchanged until the server responds.
You need the results from the server to update the cache.

<div class="alert is-helpful">

The changes are already in cache with an optimistic save.
But the server might have made additional changes to the data,
in which case you'd want to (re)apply the server response data to cache.

</div>

The server API is supposed to return all changed entity data in the
form of a `ChangeSet`.

Often the server processes the saved entities without changing them.
There's no real need for the server to return the data.
The original request `ChangeSet` has all the information necessary to update the cache.
Responding with a `"204-No Content"` instead would save time, bandwidth, and processing.

The server can respond `"204-No Content"` and send back nothing.
The `EntityCacheEffects` recognizes this condition and
returns a success action _derived_ from the original request `ChangeSet`.

If the save was pessimistic, it returns a `SaveEntitiesSuccess` action with the original `ChangeSet` in the payload.

If the save was optimistic, the changes are already in the cache and there's no point in updating the cache.
Instead, the effect returns a merge observable that clears the loading flags
for each entity type in the original `CacheSet`.

#### New _EntityOPs_ for multiple entity save

When the server responds with a `ChangeSet`, or the effect re-uses the original request `ChangeSet`, the effect returns a `SAVE_ENTITIES_SUCCESS` action with the `ChangeSet` in the payload.

This `ChangeSet` has the same structure as the one in the `SAVE_ENTITIES` action, which was the source of the HTTP request.

The `EntityCacheReducer` converts the `ChangeSet.changes` into
a sequence of `EntityActions` to the entity collection reducers.

The `store` never sees these reducer calls (and you won't see them in the redux tools).
They are applied synchronously, in succession to an instance of the `EntityCache` object.

After all `ChangeSet.changes` have been reduced, the `EntityCacheReducer` returns the updated `EntityCache` and the NgRx `Store` gets the new, fully-updated cache in one shot.

That should mean that the cache is in a stable state, with all relationships updated, before any code outside the store hears of the changes.

At that point, all affected entity `selectors$` will emit.

#### New _EntityOPs_ for multiple entity save

As always, the entity collection reducers know what to do based on the `EntityAction.entityOp`.

Before v6.1, the _save_ `EntityOps` only worked for single entities.
This version adds multi-entity save actions to `EntityOp`:
`SAVE_ADD_MANY...`,`SAVE_DELETE_MANY...`, `SAVE_UPDATE_MANY...`,`SAVE_UPSERT_MANY...`.

<div class="alert is-helpful">

These ops do not have corresponding `EntityCommands` because a multi-entity save is dispatched (via `SAVE_ENTITIES..` actions) to the `EntityCache` reducer,
not to a collection reducer (at least not in this version).

</div>

#### Transactions

It is up to the server to process the `ChangeSet` as a transaction.
That's easy if the server-side store is a relational database.

If your store doesn't support transactions, you'll have to decide if the multiple-entity save facility is right for you.

On the NgRx Data client, it is "transactional" in the sense that a successful result returned by the server will be applied to the cache all at once.
If the server returns an error result, the cache is not touched.

**_Important_**: if you saved "optimisitically", NgRx Data updates the cache _before_ sending the request to the server.

NgRx Data _does not roll back_ the `EntityCache` automatically when an _optimistic save_ fails.

Fortunately, the NgRx Data collection reducers updated the `ChangeState` of the affected entities _before merging_ the changes into the cache (see the NgRx Data `ChangeTracker`).

You have good options if the save fails.

* You _could_ rollback using the `ChangeTracker`.
* You could try again.
* You could fail the app.

Let your failure analysis and application business rules guide your decision.

#### Cancellation

You can try to cancel a save by dispatching the `SAVE_ENTITIES_CANCEL` action with the
**correlation id** of the _save action_ that you want to cancel.

An optional `EntityNames` array argument tells the `EntityCache` reducer to turn off the `loading` flags
for the collections named in that array (these flags would have been turned on by `SAVE_ENTITIES`).
You can also supply a cancellation "reason" and the usual action tag.

The `EntityCacheEffects.saveEntitiesCancel$` watches for this action and is piped into
the `EntityCacheEffects.saveEntities$`, where it can try to cancel the save operation
or at least prevent the server response from updating the cache.

<div class="alert is-helpful">

It's not obvious that this is ever a great idea.
You cannot tell the server to cancel this way and cannot know if the server did or did not save.
Nor can you count on processing the cancel request before the client receives the server response
and applies the changes on the server or to the cache.

If you cancel before the server results arrive, the `EntityCacheEffect` will not try to update
the cache with late arriving server results.
The effect will issue a `SAVE_ENTITIES_CANCELED` action instead.
The `EntityCache` reducer ignores this action but you can listen for it among the store actions
and thus know that the cancellation took effect on the client.

</div>
