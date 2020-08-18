---
kind: ClassDeclaration
name: Actions
module: effects
---

# Actions

```ts
class Actions<V = Action> extends Observable<V> {
  lift<R>(operator: Operator<V, R>): Observable<R>;
}
```
