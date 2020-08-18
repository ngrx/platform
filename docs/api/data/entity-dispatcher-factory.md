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
