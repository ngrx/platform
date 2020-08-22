---
kind: ClassDeclaration
name: EntityCollectionReducerMethods
module: data
---

# EntityCollectionReducerMethods

## description

Base implementation of reducer methods for an entity collection.

```ts
class EntityCollectionReducerMethods<T> {
  selectId: IdSelector<T>;
  entityChangeTracker: EntityChangeTracker<T>;
  readonly methods: EntityCollectionReducerMethodMap<T> = {
    [EntityOp.CANCEL_PERSIST]: this.cancelPersist.bind(this),

    [EntityOp.QUERY_ALL]: this.queryAll.bind(this),
    [EntityOp.QUERY_ALL_ERROR]: this.queryAllError.bind(this),
    [EntityOp.QUERY_ALL_SUCCESS]: this.queryAllSuccess.bind(this),

    [EntityOp.QUERY_BY_KEY]: this.queryByKey.bind(this),
    [EntityOp.QUERY_BY_KEY_ERROR]: this.queryByKeyError.bind(this),
    [EntityOp.QUERY_BY_KEY_SUCCESS]: this.queryByKeySuccess.bind(this),

    [EntityOp.QUERY_LOAD]: this.queryLoad.bind(this),
    [EntityOp.QUERY_LOAD_ERROR]: this.queryLoadError.bind(this),
    [EntityOp.QUERY_LOAD_SUCCESS]: this.queryLoadSuccess.bind(this),

    [EntityOp.QUERY_MANY]: this.queryMany.bind(this),
    [EntityOp.QUERY_MANY_ERROR]: this.queryManyError.bind(this),
    [EntityOp.QUERY_MANY_SUCCESS]: this.queryManySuccess.bind(this),

    [EntityOp.SAVE_ADD_MANY]: this.saveAddMany.bind(this),
    [EntityOp.SAVE_ADD_MANY_ERROR]: this.saveAddManyError.bind(this),
    [EntityOp.SAVE_ADD_MANY_SUCCESS]: this.saveAddManySuccess.bind(this),

    [EntityOp.SAVE_ADD_ONE]: this.saveAddOne.bind(this),
    [EntityOp.SAVE_ADD_ONE_ERROR]: this.saveAddOneError.bind(this),
    [EntityOp.SAVE_ADD_ONE_SUCCESS]: this.saveAddOneSuccess.bind(this),

    [EntityOp.SAVE_DELETE_MANY]: this.saveDeleteMany.bind(this),
    [EntityOp.SAVE_DELETE_MANY_ERROR]: this.saveDeleteManyError.bind(this),
    [EntityOp.SAVE_DELETE_MANY_SUCCESS]: this.saveDeleteManySuccess.bind(this),

    [EntityOp.SAVE_DELETE_ONE]: this.saveDeleteOne.bind(this),
    [EntityOp.SAVE_DELETE_ONE_ERROR]: this.saveDeleteOneError.bind(this),
    [EntityOp.SAVE_DELETE_ONE_SUCCESS]: this.saveDeleteOneSuccess.bind(this),

    [EntityOp.SAVE_UPDATE_MANY]: this.saveUpdateMany.bind(this),
    [EntityOp.SAVE_UPDATE_MANY_ERROR]: this.saveUpdateManyError.bind(this),
    [EntityOp.SAVE_UPDATE_MANY_SUCCESS]: this.saveUpdateManySuccess.bind(this),

    [EntityOp.SAVE_UPDATE_ONE]: this.saveUpdateOne.bind(this),
    [EntityOp.SAVE_UPDATE_ONE_ERROR]: this.saveUpdateOneError.bind(this),
    [EntityOp.SAVE_UPDATE_ONE_SUCCESS]: this.saveUpdateOneSuccess.bind(this),

    [EntityOp.SAVE_UPSERT_MANY]: this.saveUpsertMany.bind(this),
    [EntityOp.SAVE_UPSERT_MANY_ERROR]: this.saveUpsertManyError.bind(this),
    [EntityOp.SAVE_UPSERT_MANY_SUCCESS]: this.saveUpsertManySuccess.bind(this),

    [EntityOp.SAVE_UPSERT_ONE]: this.saveUpsertOne.bind(this),
    [EntityOp.SAVE_UPSERT_ONE_ERROR]: this.saveUpsertOneError.bind(this),
    [EntityOp.SAVE_UPSERT_ONE_SUCCESS]: this.saveUpsertOneSuccess.bind(this),

    [EntityOp.ADD_ALL]: this.addAll.bind(this),
    [EntityOp.ADD_MANY]: this.addMany.bind(this),
    [EntityOp.ADD_ONE]: this.addOne.bind(this),

    [EntityOp.REMOVE_ALL]: this.removeAll.bind(this),
    [EntityOp.REMOVE_MANY]: this.removeMany.bind(this),
    [EntityOp.REMOVE_ONE]: this.removeOne.bind(this),

    [EntityOp.UPDATE_MANY]: this.updateMany.bind(this),
    [EntityOp.UPDATE_ONE]: this.updateOne.bind(this),

    [EntityOp.UPSERT_MANY]: this.upsertMany.bind(this),
    [EntityOp.UPSERT_ONE]: this.upsertOne.bind(this),

    [EntityOp.COMMIT_ALL]: this.commitAll.bind(this),
    [EntityOp.COMMIT_MANY]: this.commitMany.bind(this),
    [EntityOp.COMMIT_ONE]: this.commitOne.bind(this),
    [EntityOp.UNDO_ALL]: this.undoAll.bind(this),
    [EntityOp.UNDO_MANY]: this.undoMany.bind(this),
    [EntityOp.UNDO_ONE]: this.undoOne.bind(this),

    [EntityOp.SET_CHANGE_STATE]: this.setChangeState.bind(this),
    [EntityOp.SET_COLLECTION]: this.setCollection.bind(this),
    [EntityOp.SET_FILTER]: this.setFilter.bind(this),
    [EntityOp.SET_LOADED]: this.setLoaded.bind(this),
    [EntityOp.SET_LOADING]: this.setLoading.bind(this),
  };
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/reducers/entity-collection-reducer-methods.ts#L34-L1221)

## Parameters

| Name                | Type                     | Description                                           |
| ------------------- | ------------------------ | ----------------------------------------------------- |
| selectId            | `any`                    | /\*_ Extract the primary key (id); default to `id` _/ |
| entityChangeTracker | `EntityChangeTracker<T>` | /\*\*                                                 |

- Track changes to entities since the last query or save
- Can revert some or all of those changes
  \*/ |
  | methods | `EntityCollectionReducerMethodMap<T>` | /\*\*
- Dictionary of the {EntityCollectionReducerMethods} for this entity type,
- keyed by the {EntityOp}
  \*/ |
