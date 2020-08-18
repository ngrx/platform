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
