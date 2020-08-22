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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/actions.ts#L11-L27)

## Methods

### lift

```ts
lift<R>(operator: Operator<V, R>): Observable<R>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/actions.ts#L21-L26)

#### Parameters (#lift-parameters)

| Name     | Type             | Description |
| -------- | ---------------- | ----------- |
| operator | `Operator<V, R>` |             |
