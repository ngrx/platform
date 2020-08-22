---
kind: ClassDeclaration
name: EntityDispatcherFactory
module: data
---

# EntityDispatcherFactory

```ts
class EntityDispatcherFactory implements OnDestroy {
  reducedActions$: Observable<Action>;

  create<T>(
    /** Name of the entity type */
    entityName: string,
    /**
     * Function that returns the primary key for an entity `T`.
     * Usually acquired from `EntityDefinition` metadata.
     */
    selectId: IdSelector<T> = defaultSelectId,
    /** Defaults for options that influence dispatcher behavior such as whether
     * `add()` is optimistic or pessimistic;
     */
    defaultOptions: Partial<EntityDispatcherDefaultOptions> = {}
  ): EntityDispatcher<T>;
  ngOnDestroy();
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-dispatcher-factory.ts#L20-L82)

## Methods

### create

#### description (#create-description)

Create an `EntityDispatcher` for an entity type `T` and store.

```ts
create<T>(  /** Name of the entity type */  entityName: string,  /**   * Function that returns the primary key for an entity `T`.   * Usually acquired from `EntityDefinition` metadata.   */  selectId: IdSelector<T> = defaultSelectId,  /** Defaults for options that influence dispatcher behavior such as whether   * `add()` is optimistic or pessimistic;   */  defaultOptions: Partial<EntityDispatcherDefaultOptions> = {} ): EntityDispatcher<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-dispatcher-factory.ts#L49-L77)

#### Parameters (#create-parameters)

| Name           | Type                                      | Description |
| -------------- | ----------------------------------------- | ----------- |
| entityName     | `string`                                  |             |
| selectId       | `any`                                     |             |
| defaultOptions | `Partial<EntityDispatcherDefaultOptions>` |             |

### ngOnDestroy

```ts
ngOnDestroy();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dispatchers/entity-dispatcher-factory.ts#L79-L81)

## Parameters

| Name             | Type              | Description |
| ---------------- | ----------------- | ----------- |
| reducedActions\$ | `Observable<any>` | /\*\*       |

- Actions scanned by the store after it processed them with reducers.
- A replay observable of the most recent action reduced by the store.
  \*/ |
