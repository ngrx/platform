# Extension Points

**Work in progress**

The `NgRx Data` library strives for the "_it just works_" experience.
But customizations are an inevitable necessity.

The `NgRx Data` library invites you to customize its behavior at many points,
most of them listed here.

## Take control of an entity type

One day you decide that a particular entity type needs special treatment.
You want to take over some or all of the management of that type.

You can do that easily without abandoning NgRx Data for the rest of your entity model.

You can take it over completely simply by removing it from the entity metadata.
Create your own collection and add it to the store's state-tree as you would in vanilla NgRx. Create your own actions, reducers, selectors and effects.
As long as your actions don't have an `entityName` or `op` property,
NgRx Data will ignore them.

Or you can keep the entity type in the NgRx Data system and take over the behaviors that matter to you.

* Create supplemental actions for that type. Give them custom `op` names that suit your purpose.

* Register an alternative `EntityCollectionReducer` for that type with the `EntityCollectionReducerFactory`. Your custom reducer can respond to your custom actions and implement the standard operations in its own way.

* Create your own service facade, an alternative to `EntityCollectionService`, that dispatches the actions you care about
  and exposes the selectors that your type needs.

* Add additional properties to the collection state with the `EntityMetadata.additionalCollectionState` property. Manage these properties with custom reducer actions and selectors.

* By-pass the `EntityEffects` completely by never dispatching an action with an `op` that it intercepts.
  Create a custom _NgRx/effect_ that handles your custom persistence actions.

## Provide alternative service implementations

The `NgRx Data` library consists of many services that perform small tasks.

Look at the many providers in `NgRx Data.module.ts`.
Provide your own version of any `NgRx Data` service, as long as it conforms to the service API and implements the expected behavior.

Be sure to test your alternatives.

## Custom _EntityCollectionService_

## Extend the _EntityCollection_

## Custom _EntityActions_

### Rename the generated entity action _type_

The `EntityActionFactory.create()` method relies on the `formatActionType()` method to
produce the `Action.type` string.

The default implementation concatenates the entity type name with the `EntityOp`.
For example, querying all heroes results in the entity type, `[Hero] NgRx Data/query-all`.

If you don't like that approach you can replace the `formatActionType()` method with a generator that produces action type names that are more to your liking.
The NgRx Data library doesn't make decisions based on the `Action.type`.

## Custom _EntityDispatcher_

### Change the default save strategy

The dispatcher's `add()`, `update()`, `delete()` methods dispatch
_optimistic_ or _pessimistic_ save actions based on settings in the `EntityDispatcherOptions`.

These options come from the `EntityDispatcherFactory` that creates the dispatcher.
This factory gets the options from the entity's metadata.
But where the metadata lack options, the factory relies on its `defaultDispatcherOptions`.

You can set these default options directly by injecting the `EntityDispatcherFactory`
and re-setting `defaultDispatcherOptions` _before_ creating dispatchers
(or creating an `EntityCollectionService` which creates a dispatcher).

## Custom _effects_

The NgRx Data library has one NgRx `@Effect`, the `EntityEffects` class.

This class detects entity persistence actions, performs the persistence operation with a
call to an `EntityDataService` and channels the HTTP response through a
`PersistenceResultHandler` which produces a persistence results observable that
goes back to the NgRx store.

The `EntityEffects` class intercepts actions that have an `op` property whose
value is one of the `persistOps`. Other actions are ignored by this effect.

It tries to process any action with such an `op` property by looking for a

### Choose data service for the type

The [_Entity DataService_](guide/data/entity-dataservice) describes the
default service, how to provide a data service for a specific entity type
or replace the default service entirely.

### Replace the generic-type effects

### Handle effect for a specific type

### Replace handling of the results of a data service call

### Replace the EntityEffects entirely

## Custom _Reducers_

The [_Entity Reducer_ guide](guide/data/entity-reducer#customizing) explains how to
customize entity reducers.

## Custom _Selectors_
  
### Introduction
  
`@ngrx/data` has several built-in selectors that are defined in the [EntitySelectors](https://ngrx.io/api/data/EntitySelectors) interface. These can be used outside of a component.  
  
Many apps use `@ngrx/data` in conjunction with @ngrx/store including manually written reducers, actions, and so on. `@ngrx/data` selectors can be used to combine @ngrx/data state with the state of the entire application.  
  
### Using EntitySelectorsFactory
  
[EntitySelectorsFactory](https://ngrx.io/api/data/EntitySelectorsFactory) exposes a `create` method that can be used to create selectors outside the context of a component, such as in a `reducers/index.ts` file.  
  
#### Example
  
```ts
/* src/app/reducers/index.ts */
import * as fromCat from './cat.reducer';
import { Owner } from '~/app/models'

export const ownerSelectors = new EntitySelectorsFactory().create<Owner>('Owner');

export interface State {
  cat: fromCat.State;
}

export const reducers: ActionReducerMap<State> = {
  cat: fromCat.reducer
};

export const selectCatState = (state: State) => state.cat;

export const {
  selectAll: selectAllCats
} = fromCat.adapter.getSelectors(selectCatState);

export const selectedCatsWithOwners = createSelector(
  selectAllCats,
  ownerSelectors.selectEntities,
  (cats, ownerEntities) => cats.map(c => ({
    ...c,
    owner: ownerEntities[c.owner]
  }))
);
```

## Custom data service

### Replace the generic-type data service

### Replace the data service for a specific type

## Custom HTTP resource URLs

### Add plurals

### Replace the Pluralizer

### Replace the HttpUrlGenerator

## Serialization with back-end

The shape of the JSON data going over the wire to-and-from the server often
doesn't match the shape of the entity model(s) in the client application.
You may need _serialization/deserialization_ transformation functions
to map between the client entity data and the formats expected by the web APIs.

There are no facilities for this within `NgRx Data` itself although
that is a [limitation](guide/data/limitations#serialization) we might address in a future version.

One option in the interim is to write such serialization functions and
inject them into the `HttpClient` pipeline with [`HttpClient` interceptors](https://angular.io/guide/http#intercepting-requests-and-responses).
