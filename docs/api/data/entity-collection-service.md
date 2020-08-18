---
kind: InterfaceDeclaration
name: EntityCollectionService
module: data
---

# EntityCollectionService

## description

A facade for managing
a cached collection of T entities in the ngrx store.

```ts
interface EntityCollectionService<T> {
  readonly dispatcher: EntityDispatcher<T>;
  readonly entityName: string;
  readonly selectors: EntitySelectors<T>;
  readonly selectors$: EntitySelectors$<T>;

  // inherited from EntityCommands

  // inherited from EntitySelectors$
  readonly entityName: string;
  readonly collection$: Observable<EntityCollection> | Store<EntityCollection>;
  readonly count$: Observable<number> | Store<number>;
  readonly entities$: Observable<T[]> | Store<T[]>;
  readonly entityActions$: Observable<EntityAction>;
  readonly entityMap$: Observable<Dictionary<T>> | Store<Dictionary<T>>;
  readonly errors$: Observable<EntityAction>;
  readonly filter$: Observable<string> | Store<string>;
  readonly filteredEntities$: Observable<T[]> | Store<T[]>;
  readonly keys$: Observable<string[] | number[]> | Store<string[] | number[]>;
  readonly loaded$: Observable<boolean> | Store<boolean>;
  readonly loading$: Observable<boolean> | Store<boolean>;
  readonly changeState$:
    | Observable<ChangeStateMap<T>>
    | Store<ChangeStateMap<T>>;
}
```
