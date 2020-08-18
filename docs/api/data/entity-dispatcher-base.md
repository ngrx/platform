---
kind: ClassDeclaration
name: EntityDispatcherBase
module: data
---

# EntityDispatcherBase

## description

Dispatches EntityCollection actions to their reducers and effects (default implementation).
All save commands rely on an Ngrx Effect such as `EntityEffects.persist$`.

```ts
class EntityDispatcherBase<T> implements EntityDispatcher<T> {
  guard: EntityActionGuard<T>;
  toUpdate: (entity: Partial<T>) => Update<T>;

  createEntityAction<P = any>(
    entityOp: EntityOp,
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
  clearCache(options?: EntityActionOptions): void;
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
