---
kind: InterfaceDeclaration
name: EntitySelectors$
module: data
---

# EntitySelectors\$

## description

The selector observable functions for entity collection members.

```ts
interface EntitySelectors$<T> {
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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/selectors/entity-selectors$.ts#L26-L70)
