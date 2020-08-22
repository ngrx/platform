---
kind: InterfaceDeclaration
name: EntityAction
module: data
---

# EntityAction

```ts
interface EntityAction<P = any> {
  readonly type: string;
  readonly payload: EntityActionPayload<P>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action.ts#L7-L10)
