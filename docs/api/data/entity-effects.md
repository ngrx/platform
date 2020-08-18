---
kind: ClassDeclaration
name: EntityEffects
module: data
---

# EntityEffects

```ts
class EntityEffects {
  cancel$: Observable<any> = createEffect(
    () =>
      this.actions.pipe(
        ofEntityOp(EntityOp.CANCEL_PERSIST),
        map((action: EntityAction) => action.payload.correlationId),
        filter((id) => id != null)
      ),
    { dispatch: false }
  );
  persist$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofEntityOp(persistOps),
      mergeMap((action) => this.persist(action))
    )
  );

  persist(action: EntityAction): Observable<Action>;
}
```
