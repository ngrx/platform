---
kind: InterfaceDeclaration
name: EntityDispatcher
module: data
---

# EntityDispatcher

## description

Dispatches EntityCollection actions to their reducers and effects.
The substance of the interface is in EntityCommands.

```ts
interface EntityDispatcher<T> {
  readonly entityName: string;
  readonly guard: EntityActionGuard<T>;
  readonly selectId: IdSelector<T>;
  readonly store: Store<EntityCache>;

  // inherited from EntityCommands
}
```
