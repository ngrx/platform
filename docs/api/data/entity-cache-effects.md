---
kind: ClassDeclaration
name: EntityCacheEffects
module: data
---

# EntityCacheEffects

```ts
class EntityCacheEffects {
  saveEntitiesCancel$: Observable<SaveEntitiesCancel> = createEffect(
    () =>
      this.actions.pipe(
        ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL),
        filter((a: SaveEntitiesCancel) => a.payload.correlationId != null)
      ),
    { dispatch: false }
  );
  saveEntities$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(EntityCacheAction.SAVE_ENTITIES),
      mergeMap((action: SaveEntities) => this.saveEntities(action))
    )
  );

  saveEntities(action: SaveEntities): Observable<Action>;
}
```
