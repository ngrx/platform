# Entity Actions

The [`EntityCollectionService`](guide/data/entity-services) dispatches an `EntityAction` to the _NgRx store_ when you call one of its commands to query or update entities in a cached collection.

## _Action_ and _EntityAction_

A vanilla
[_NgRx `Action`_](guide/store/actions) is a message.
The message describes an operation that can change state in the _store_.

The _action_'s `type` identifies the operation.
It's optional `payload` carries the message data necessary to perform the operation.

An `EntityAction` is a super-set of the _NgRx `Action`_.
It has additional properties that guide NgRx Data's handling of the action. Here's the full interface.

<code-example header="EntityAction" linenums="false">
export interface EntityAction&lt;P = any&gt; extends Action {
  readonly type: string;
  readonly entityName: string;
  readonly op: EntityOp;
  readonly payload?: P;
  readonly tag?: string;
  error?: Error;
  skip?: boolean
}
</code-example>

* `type` - action name, typically generated from the `tag` and the `op`
* `entityName` - the name of the entity type
* `op` - the name of an entity operation
* `payload?` - the message data for the action.
* `tag?` - the tag to use within the generated type. If not specified, the `entityName` is the tag.
* `error?` - an unexpected action processing error.
* `skip?` - true if downstream consumers should skip processing the action.

The `type` is the only property required by _NgRx_. It is a string that uniquely identifies the action among the set of all the types of actions that can be dispatched to the store.

NgRx Data doesn't care about the `type`. It pays attention to the `entityName` and `op` properties.

The `entityName` is the name of the entity type.
It identifies the _entity collection_ in the NgRx Data cache to which this action applies.
This name corresponds to [NgRx Data _metadata_](guide/data/entity-metadata) for that collection.
An entity interface or class name, such as `'Hero'`, is a typical `entityName`.

The `op` identifies the operation to perform on the _entity collection_, 
one of the `EntityOp` enumerations that correspond to one of the
almost _sixty_ distinct operations that NgRx Data can perform on a collection.

The `payload` is conceptually the body of the message.
Its type and content should fit the requirements of the operation to be performed.

The optional `tag` appears in the generated `type` text when the `EntityActionFactory` creates this `EntityAction`.

The `entityName` is the default tag that appears between brackets in the formatted `type`,
e.g., `'[Hero] NgRx Data/query-all'`.

The `error` property indicates that something went wrong while processing the action. [See more below](#action-error).

The `skip` property tells downstream action receivers that they should skip the usual action processing.
This flag is usually missing and is implicitly false.
[See more below](#action-skip).

## _EntityAction_ consumers

The NgRx Data library ignores the `Action.type`.
All NgRx Data library behaviors are determined by the `entityName` and `op` properties alone.

The NgRx Data `EntityReducer` redirects an action to an `EntityCollectionReducer` based on the `entityName`
and that reducer processes the action based on the `op`.

`EntityEffects` intercepts an action if its `op` is among the small set of persistence `EntityAction.op` names.
The effect picks the right _data service_ for that action's `entityName`, then tells the service to make the appropriate HTTP request and handle the response.

## Creating an _EntityAction_

You can create an `EntityAction` by hand if you wish.
The NgRx Data library considers _any action_ with an `entityName` and `op` properties to be an `EntityAction`.

The `EntityActionFactory.create()` method helps you create a consistently well-formed `EntityAction` instance
whose `type` is a string composed from the `tag` (the `entityName` by default) and the `op`.

For example, the default generated `Action.type` for the operation that queries the server for all heroes is `'[Hero] NgRx Data/query-all'`.

<div class="alert is-helpful">

The `EntityActionFactory.create()` method calls the factory's `formatActionType()` method
to produce the `Action.type` string.

Because NgRx Data ignores the `type`, you can replace `formatActionType()` with your own method if you prefer a different format
or provide and inject your own `EntityActionFactory`.
</div>

Note that **_each entity type has its own \_unique_ `Action` for each operation\_**, as if you had created them individually by hand.

## Tagging the EntityAction

A well-formed action `type` can tell the reader what changed and
who changed it.

The NgRx Data library doesn't look at the type of an `EntityAction`,
only its `entityName` and `entityOp`.
So you can get the same behavior from several different actions,
each with its own informative `type`, as long as they share the same
`entityName` and `entityOp`.

The optional `tag` parameter of the `EntityActionFactory.create()` method makes
it easy to produce meaningful _EntityActions_.

You don't have to specify a tag. The `entityName` is the default tag that appears between brackets in the formatted `type`,
e.g., `'[Hero] NgRx Data/query-all'`.

Here's an example that uses the injectable `EntityActionFactory` to construct the default "query all heroes" action.

```typescript
const action = entityActionFactory<Hero>(
  'Hero', EntityOp.QUERY_ALL, null, 'Load Heroes On Start'
);

store.dispatch(action);
```

Thanks to the NgRx Data _Effects_, this produces _two_ actions in the log, the first to initiate the request and the second with the successful response:

```typescript
[Hero] NgRx Data/query-all
[Hero] NgRx Data/query-all-success
```

This default `entityName` tag identifies the action's target entity collection.
But you can't understand the _context_ of the action from these log entries. You don't know who dispatched the action or why.
The action `type` is too generic.

You can create a more informative action by providing a tag that
better describes what is happening and also make it easier to find
where that action is dispatched by your code.

For example,

```typescript
const action = entityActionFactory<Hero>(
  'Hero', EntityOp.QUERY_ALL, null, 'Load Heroes On Start'
);

store.dispatch(action);
```

The action log now looks like this:

```typescript
[Load Heroes On Start] NgRx Data/query-all
[Load Heroes On Start] NgRx Data/query-all-success
```

### Handcrafted _EntityAction_

You don't have to create entity actions with the `EntityActionFactory`.
Any action object with an `entityName` and `op` property is
an entity action, as explained [below](#where-are-the-entityactions).

The following example creates the initiating "query all heroes" action by hand.

```typescript
const action = {
  type: 'some/arbitrary/action/type',
  entityName: 'Hero',
  op: EntityOp.QUERY_ALL
};

store.dispatch(action);
```

It triggers the HTTP request via _NgRx Data effects_, as in the previous examples.

Just be aware that _NgRx Data effects_ uses the `EntityActionFactory` to create the second, success Action.
Without the `tag` property, it produces a generic success action.

The log of the two action types will look like this:

```sh
some/arbitrary/action/type
[Hero] NgRx Data/query-all-success
```

## Where are the _EntityActions_?

In an NgRx Data app, the NgRx Data library creates and dispatches _EntityActions_ for you.

_EntityActions_ are largely invisible when you call the [`EntityCollectionService`](guide/data/entity-services) API.
You can see them in action with the
[NgRx store dev-tools](guide/store-devtools).

## Why this matters

In an ordinary _NgRx_ application, you hand-code every `Action` for every _state_ in the store
as well as the [reducers](guide/store/reducers)
that process those _actions_.

It takes many _actions_, a complex _reducer_, and the help of an NgRx [Effect](guide/effects) to manage queries and saves for a _single_ entity type.

The NgRx [Entity](guide/entity) library makes the job considerably easier.

<div class="alert is-helpful">

The NgRx Data library internally delegates much of the heavy lifting to NgRx _Entity_.

</div>

But you must still write a lot of code for each entity type.
You're expected to create _eight actions_ per entity type and
write a _reducer_ that responds to these eight actions by calling eight methods of an NgRx [_EntityAdapter_](guide/entity/adapter#adapter-collection-methods).

These artifacts only address the _cached_ entity collection.

You may write as many as _eighteen additional actions_ to support a typical complement of asynchronous CRUD (Create, Retrieve, Update, Delete) operations. You'll have to dispatch them to the store where you'll process them with more _reducer_ methods and _effects_ that you must also hand code.

With vanilla _NgRx_, you'll go through this exercise for _every entity type_.
That's a lot of code to write, test, and maintain.

With the help of NgRx Data, you don't write any of it.
NgRx Data creates the _actions_ and the _dispatchers_, _reducers_, and _effects_ that respond to those actions.

<a id="action-error"></a>

## _EntityAction.error_

The presence of an `EntityAction.error` property indicates that something bad happened while processing the action.

An `EntityAction` should be immutable. The `EntityAction.error` property is the _only_ exception and is strictly an internal property of the NgRx Data system.
You should rarely (if ever) set it yourself.

The primary use case for `error` is to catch reducer exceptions.
_NgRx_ stops subscribing to reducers if one of them throws an exception.
Catching reducer exceptions allows the application to continue operating.

NgRx Data traps an error thrown by an `EntityCollectionReducer` and sets the `EntityAction.error` property to the caught error object.

The `error` property is important when the errant action is a _persistence action_ (such as `SAVE_ADD_ONE`).
The `EntityEffects` will see that such an action has an error and will return the corresponding failure action (`SAVE_ADD_ONE_ERROR`) immediately, without attempting an HTTP request.

<div class="alert is-important">

This is the only way we've found to prevent a bad action from getting through the effect and triggering an HTTP request.

</div>

<a id="action-skip"></a>

## _EntityAction.skip_

The `skip` property tells downstream action receivers that they should skip the usual action processing.
This flag is usually missing and is implicitly false.

The NgRx Data sets `skip=true` when you try to delete a new entity that has not been saved.
When the `EntityEffects.persist$` method sees this flag set true on the `EntityAction` envelope,
it skips the HTTP request and dispatches an appropriate `_SUCCESS` action with the
original request payload.

This feature allows NgRx Data to avoid making a DELETE request when you try to delete an entity
that has been added to the collection but not saved.
Such a request would have failed on the server because there is no such entity to delete.

See the [`EntityChangeTracker`](guide/data/entity-change-tracker) page for more about change tracking.

<a id="entity-cache-actions"></a>

## EntityCache-level actions

A few actions target the entity cache as a whole.

`SET_ENTITY_CACHE` replaces the entire cache with the object in the action payload,
effectively re-initializing the entity cache to a known state.

`MERGE_ENTITY_CACHE` replaces specific entity collections in the current entity cache
with those collections present in the action payload.
It leaves the other current collections alone.

Learn about them in the "[EntityReducer](guide/data/entity-reducer#entity-cache-actions)" document.
