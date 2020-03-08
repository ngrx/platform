# Entity Metadata

The NgRx Data library maintains a **_cache_** of entity collection data in the _NgRx store_.

You tell the NgRx Data library about those collections and the entities they contain with **_entity metadata_**.

The entities within a collection belong to the same **_entity type_**.
Each _entity type_ appears as named instance of the NgRx Data [**`EntityMetadata<T>`**](#metadata-properties) interface.

You can specify metadata for several entities at the same time in an **`EntityMetadataMap`**.

Here is an example `EntityMetadataMap` similar to the one in the demo app
that defines metadata for two entities, `Hero` and `Villain`.

<code-example header="app-entity-metadata.ts">
export const appEntityMetadata: EntityMetadataMap = {
  Hero: {
    /* optional settings */
    filterFn: nameFilter,
    sortComparer: sortByName
  },
  Villain: {
    villainSelectId, // necessary if key is not `id`

    /* optional settings */
    entityName: 'Villain', // optional because same as map key
    filterFn: nameAndSayingFilter,
    entityDispatcherOptions: { optimisticAdd: true, optimisticUpdate: true }
  }
};
</code-example>

## Register metadata

You must register the metadata with the NgRx Data `EntityDefinitionService`.

The easiest way to register metadata is to define a single `EntityMetadataMap` for the entire application and specify it in the one place where you initialize the NgRx Data library:

```typescript
    EntityDataModule.forRoot({
      ...
      entityMetadata: appEntityMetadata,
      ...
    })
```

If you define entities in several, different _eagerly-loaded_ Angular modules, you can add the metadata for each module with the multi-provider.

```typescript
{ provide: ENTITY_METADATA_TOKEN, multi: true, useValue: someEntityMetadata }
```

This technique won't work for a _lazy-loaded_ module.
The `ENTITY_METADATA_TOKEN` provider was already set and consumed by the time the _lazy-loaded_ module arrives.

The module should inject the `EntityDefinitionService`
instead and register metadata directly with one of the registration methods.

```typescript
@NgModule({...})
class LazyModule {
  constructor(eds: EntityDefinitionService) {
    eds.registerMetadataMap(this.lazyMetadataMap);
  }
  ...
}
```

## Metadata Properties

The `EntityMetadata<T>` interface describes aspects of an entity type that tell the NgRx Data library how to manage collections of entity data of type `T`.

Type `T` is your application's TypeScript representation of that entity; it can be an interface or a class.

### _entityName_

The `entityName` of the type is the only **required metadata property**.
It's the unique _key_ of the entity type's metadata in cache.

It _must_ be specified for individual `EntityMetadata` instances.
If you omit it in an `EntityMetadataMap`, the map _key_ becomes the `entityName` as in this example.

```typescript
const map = {
  Hero: {} // "Hero" becomes the entityName
};
```

The spelling and case (typically PascalCase) of the `entityName` is important for NgRx Data conventions. It appears in the generated [_entity actions_](guide/data/entity-actions), in error messages, and in the persistence operations.

Importantly, the default [_entity dataservice_](guide/data/entity-dataservice) creates HTTP resource URLs from the lowercase version of this name. For example, if the `entityName` is "Hero", the default data service will POST to a URL such as `'api/hero'`.

<div class="alert is-helpful">

By default it generates the _plural_ of the entity name when preparing a _collection_ resource URL.

It isn't good at pluralization.
It would produce `'api/heros'` for the URL to fetch _all heroes_ because it blindly adds an `'s'` to the end of the lowercase entity name.

Of course the proper plural of "hero" is "hero**es**", not "hero**s**".
You'll see how to correct this problem [below](#plurals).

</div>

### _filterFn_

Many applications allow the user to filter a cached entity collection.

In the accompanying demonstration app, the user can filter _heroes_ by name and can filter _villains_ by name or the villain's _saying_.

We felt this common scenario is worth building into the NgRx Data library. So every entity can have an _optional_ filter function.

Each collection's `filteredEntities` selector applies the filter function to the collection, based on the user's filtering criteria, which are held in the stored entity collection's `filter` property.

If there is no filter function, the `filteredEntities` selector is the same as the `selectAll` selector, which returns all entities in the collection.

A filter function (see `EntityFilterFn`) takes an entity collection and the user's filtering criteria (the filter _pattern_) and returns an array of the selected entities.

Here's an example that filters for entities with a `name` property whose value contains the search string.

```typescript
export function nameFilter(entities: { name: string }[], search: string) {
  return entities.filter(e => -1 < e.name.indexOf(search));
}
```

The NgRx Data library includes a helper function, `PropsFilterFnFactory<T>`, that creates an entity filter function which will treat the user's input
as a case-insensitive, regular expression and apply it to one or more properties of the entity.

The demo uses this helper to create hero and villain filters. Here's how the app creates the `nameAndSayingFilter` function for villains.

```typescript
/**
 * Filter for entities whose name or saying
 * matches the case-insensitive pattern.
 */
export function nameAndSayingFilter(entities: Villain[], pattern: string) {
  return PropsFilterFnFactory<Villain> ['name', 'saying'](entities, pattern);
}
```

### _selectId_

Every _entity type_ must have a _primary key_ whose value is an integer or a string.

The NgRx Data library assumes that the entity has an `id` property whose value is the primary key.

Not every entity will have a primary key property named `id`. For some entities, the primary key could be the combined value of two or more properties.

In these cases, you specify a `selectId` function that, given an entity instance, returns an integer or string primary key value.

In the _EntityCollectionReducer_ [tests](https://github.com/ngrx/platform/blob/master/modules/data/spec/reducers/entity-collection-reducer.spec.ts),
the `Villain` type has a string primary key property named `key`.
The `selectorId` function is this:

```typescript
selectId: (villain: Villain) => villain.key;
```

### _sortComparer_

The NgRx Data library keeps the collection entities in a specific order.

<div class="alert is-helpful">

This is actually a feature of the underlying NgRx Entity library.

</div>

The default order is the order in which the entities arrive from the server.
The entities you add are pushed to the end of the collection.

You may prefer to maintain the collection in some other order.
When you provide a `sortComparer` function, the _NgRx-lib_ keeps the collection in the order prescribed by your comparer.

In the demo app, the villains metadata has no comparer so its entities are in default order.

The hero metadata have a `sortByName` comparer that keeps the collection in alphabetical order by `name`.

```typescript
export function sortByName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}
```

Run the demo app and try changing existing hero names or adding new heroes.

Your app can call the `selectKey` selector to see the collection's `ids` property, which returns an array of the collection's primary key values in sorted order.

### _entityDispatcherOptions_

These options determine the default behavior of the collection's _dispatcher_ which sends actions to the reducers and effects.

A dispatcher save command will add, delete, or update
the collection _before_ sending a corresponding HTTP request (_optimistic_) or _after_ (_pessimistic_).
The caller can specify in the optional `isOptimistic` parameter.
If the caller doesn't specify, the dispatcher chooses based on default options.

The _defaults_ are the safe ones: _optimistic_ for delete and _pessimistic_ for add and update.
You can override those choices here.

### _additionalCollectionState_

Each NgRx Data entity collection in the store has
[predefined properties](guide/data/entity-collection).

You can add your own collection properties by setting the `additionalCollectionState` property to an object with those custom collection properties.

The _EntitySelectors_ [tests](https://github.com/ngrx/platform/blob/master/modules/data/spec/selectors/entity-selectors.spec.ts)
illustrate by adding `foo` and `bar` collection properties to test hero metadata.

```typescript
  additionalCollectionState: {
    foo: 'Foo',
    bar: 3.14
  }
```

The property values become the initial collection values for those properties when NgRx Data first creates the collection in the store.

The NgRx Data library generates selectors for these properties, but has no way to update them. You'll have to create or extend the existing reducers to do that yourself.

If the property you want to add comes from `backend`, you will need some additional work to make sure the property can be saved into the store from `Effects` correctly.

#### Step 1: Implement `PersistenceResultHandler` to save data from backend to action.payload

Create a new class `AdditionalPersistenceResultHandler` that `extends DefaultPersistenceResultHandler` and overwrite the [handleSuccess](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/persistence-result-handler.service.ts) method, the purpose is to parse the data received from `DataService`, retrieve the additional property, and then save this to the `action.payload`. Note that the default reducer for success actions requires that `action.payload.data` is an array of entities or an entity. This would need to be set after retrieving the additional property, not shown in the example below.

```typescript
export class AdditionalPersistenceResultHandler extends DefaultPersistenceResultHandler {
  handleSuccess(originalAction: EntityAction): (data: any) => Action {
    const actionHandler = super.handleSuccess(originalAction);
    // return a factory to get a data handler to
    // parse data from DataService and save to action.payload
    return function(data: any) {
      const action = actionHandler.call(this, data);
      if (action && data && data.foo) {
        // save the data.foo to action.payload.foo
        (action as any).payload.foo = data.foo;
      }
      return action;
    };
  }
}
```

#### Step 2: Overwrite `EntityCollectionReducerMethods` to save the additional property from action.payload to the EntityCollection instance

Following the prior step, we have added the additional property to the `action.payload`. Up next we need to set it to the instance of EntityCollection in the `reducer`. In order to accomplish that, we need to create an `AdditionalEntityCollectionReducerMethods` that `extends EntityCollectionReducerMethods`. In addition, we will need to overwrite the method to match your `action`. For example, if the additional property `foo` is only available in `queryMany action(triggered by EntityCollectionService.getWithQuery)`, we can follow this approach.

```typescript
export class AdditionalEntityCollectionReducerMethods<T> extends EntityCollectionReducerMethods<T> {
  constructor(public entityName: string, public definition: EntityDefinition<T>) {
    super(entityName, definition);
  }
   protected queryManySuccess(
    collection: EntityCollection<T>,
    action: EntityAction<T[]>
  ): EntityCollection<T> {
    const ec = super.queryManySuccess(collection, action);
    if ((action.payload as any).foo) {
      // save the foo property from action.payload to entityCollection instance
      (ec as any).foo = (action.payload as any).foo;
    }
    return ec;
  }
}
```

#### Step 3: Register customized `EntityCollectionReducerMethods` and `AdditionalPersistenceResultHandler`.
Finally we need to register the `AdditionalPersistenceResultHandler` and `AdditionalEntityCollectionReducerMethods` to replace the default implementation.

Register `AdditionalPersistenceResultHandler` in `NgModule`,

```typescript
@NgModule({
  { provide: PersistenceResultHandler, useClass: AdditionalPersistenceResultHandler },
})
```

Register `AdditionalEntityCollectionReducerMethods`, to do that, we need to create an `AdditionalEntityCollectionReducerMethodFactory`, for details, see [Entity Reducer](guide/data/entity-reducer)

```typescript
@Injectable()
export class AdditionalEntityCollectionReducerMethodsFactory {
  constructor(private entityDefinitionService: EntityDefinitionService) {}
   /** Create the  {EntityCollectionReducerMethods} for the named entity type */
  create<T>(entityName: string): EntityCollectionReducerMethodMap<T> {
    const definition = this.entityDefinitionService.getDefinition<T>(entityName);
    const methodsClass = new AdditionalEntityCollectionReducerMethods(entityName, definition);
     return methodsClass.methods;
  }
}
```

Register `AdditionalEntityCollectionReducerMethodsFactory` to `NgModule`,

```typescript
@NgModule({
  {
    provide: EntityCollectionReducerMethodsFactory,
    useClass: AdditionalEntityCollectionReducerMethodsFactory
  },
})
```

Now you can get `foo` from `backend` just like another `EntityCollection` level property.

<a id="plurals"></a>

## Pluralizing the entity name

The NgRx Data [`DefaultDataService`](guide/data/entity-dataservice) relies on the `HttpUrlGenerator` to create conventional HTTP resource names (URLs) for each entity type.

By convention, an HTTP request targeting a single entity item contains the lowercase, singular version of the entity type name. For example, if the entity type `entityName` is "Hero", the default data service will POST to a URL such as `'api/hero'`.

By convention, an HTTP request targeting multiple entities contains the lowercase, _plural_ version of the entity type name. The URL of a GET request that retrieved all heroes should be something like `'api/heroes'`.

The `HttpUrlGenerator` can't pluralize the entity type name on its own. It delegates to an injected _pluralizing class_, called `Pluralizer`.

The `Pluralizer` class has a _pluralize()_ method that takes the singular string and returns the plural string.

The default `Pluralizer` handles many of the common English pluralization rules such as appending an `'s'`.
That's fine for the `Villain` type (which becomes "Villains") and even for `Company` (which becomes "Companies").

It's far from perfect. For example, it incorrectly turns `Hero` into "Heros" instead of "Heroes".

Fortunately, the default `Pluralizer` also injects a map of singular to plural strings (with the `PLURAL_NAMES_TOKEN`).

Its `pluralize()` method looks for the singular entity name in that map and uses the corresponding plural value if found.
Otherwise, it returns the default pluralization of the entity name.

If this scheme works for you, create a map of _singular-to-plural_ entity names for the exceptional cases:

```typescript
export const pluralNames = {
  // Case matters. Match the case of the entity name.
  Hero: 'Heroes'
};
```

Then specify this map while configuring the NgRx Data library.

```typescript
    EntityDataModule.forRoot({
      ...
      pluralNames: pluralNames
    })
```

If you define your _entity model_ in separate Angular modules, you can incrementally add a plural names map with the multi-provider.

```typescript
{ provide: PLURAL_NAMES_TOKEN, multi: true, useValue: morePluralNames }
```

If this scheme isn't working for you, replace the `Pluralizer` class with your own invention.

```typescript
{ provide: Pluralizer, useClass: MyPluralizer }
```
