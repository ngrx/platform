---
kind: ClassDeclaration
name: EntityCollectionServiceBase
module: data
---

# EntityCollectionServiceBase

## description

Base class for a concrete EntityCollectionService<T>.
Can be instantiated. Cannot be injected. Use EntityCollectionServiceFactory to create.

```ts
class EntityCollectionServiceBase<
  T,
  S$ extends EntitySelectors$<T> = EntitySelectors$<T>
> implements EntityCollectionService<T> {
  readonly dispatcher: EntityDispatcher<T>;
  readonly selectors: EntitySelectors<T>;
  readonly selectors$: S$;
  guard: EntityActionGuard<T>;
  selectId: IdSelector<T>;
  toUpdate: (entity: Partial<T>) => Update<T>;
  collection$: Observable<EntityCollection<T>> | Store<EntityCollection<T>>;
  count$: Observable<number> | Store<number>;
  entities$: Observable<T[]> | Store<T[]>;
  entityActions$: Observable<EntityAction>;
  entityMap$: Observable<Dictionary<T>> | Store<Dictionary<T>>;
  errors$: Observable<EntityAction>;
  filter$: Observable<any> | Store<any>;
  filteredEntities$: Observable<T[]> | Store<T[]>;
  keys$: Observable<string[] | number[]> | Store<string[] | number[]>;
  loaded$: Observable<boolean> | Store<boolean>;
  loading$: Observable<boolean> | Store<boolean>;
  changeState$: Observable<ChangeStateMap<T>> | Store<ChangeStateMap<T>>;

  createEntityAction<P = any>(
    op: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P>;
  createAndDispatch<P = any>(
    op: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P>;
  dispatch(action: Action): Action;
  add(entity: T, options?: EntityActionOptions): Observable<T>;
  cancel(
    correlationId: any,
    reason?: string,
    options?: EntityActionOptions
  ): void;
  delete(
    arg: number | string | T,
    options?: EntityActionOptions
  ): Observable<number | string>;
  getAll(options?: EntityActionOptions): Observable<T[]>;
  getByKey(key: any, options?: EntityActionOptions): Observable<T>;
  getWithQuery(
    queryParams: QueryParams | string,
    options?: EntityActionOptions
  ): Observable<T[]>;
  load(options?: EntityActionOptions): Observable<T[]>;
  update(entity: Partial<T>, options?: EntityActionOptions): Observable<T>;
  upsert(entity: T, options?: EntityActionOptions): Observable<T>;
  addAllToCache(entities: T[], options?: EntityActionOptions): void;
  addOneToCache(entity: T, options?: EntityActionOptions): void;
  addManyToCache(entities: T[], options?: EntityActionOptions): void;
  clearCache(): void;
  removeOneFromCache(
    arg: (number | string) | T,
    options?: EntityActionOptions
  ): void;
  removeManyFromCache(
    args: (number | string)[] | T[],
    options?: EntityActionOptions
  ): void;
  updateOneInCache(entity: Partial<T>, options?: EntityActionOptions): void;
  updateManyInCache(
    entities: Partial<T>[],
    options?: EntityActionOptions
  ): void;
  upsertOneInCache(entity: Partial<T>, options?: EntityActionOptions): void;
  upsertManyInCache(
    entities: Partial<T>[],
    options?: EntityActionOptions
  ): void;
  setFilter(pattern: any): void;
  setLoaded(isLoaded: boolean): void;
  setLoading(isLoading: boolean): void;
}
```

## Parameters

| Name                            | Type                                  | Description |
| ------------------------------- | ------------------------------------- | ----------- |
| EntityCollectionServiceElements | `` | The ingredients for this service |
