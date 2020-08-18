---
kind: ClassDeclaration
name: EntityActionFactory
module: data
---

# EntityActionFactory

```ts
class EntityActionFactory {
  create<P = any>(
    nameOrPayload: EntityActionPayload<P> | string,
    entityOp?: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P>;
  createFromAction<P = any>(
    from: EntityAction,
    newProperties: Partial<EntityActionPayload<P>>
  ): EntityAction<P>;
  formatActionType(op: string, tag: string);
}
```
