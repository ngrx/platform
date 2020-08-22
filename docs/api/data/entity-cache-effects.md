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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/effects/entity-cache-effects.ts#L42-L192)

## Methods

### saveEntities

#### description (#saveEntities-description)

Perform the requested SaveEntities actions and return a scalar Observable<Action>
that the effect should dispatch to the store after the server responds.

```ts
saveEntities(action: SaveEntities): Observable<Action>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/effects/entity-cache-effects.ts#L89-L134)

#### Parameters (#saveEntities-parameters)

| Name   | Type           | Description             |
| ------ | -------------- | ----------------------- |
| action | `SaveEntities` | The SaveEntities action |

## Parameters

| Name                 | Type                             | Description |
| -------------------- | -------------------------------- | ----------- |
| saveEntitiesCancel\$ | `Observable<SaveEntitiesCancel>` | /\*\*       |

- Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
  \*/ |
  | saveEntities\$ | `Observable<any>` | |
