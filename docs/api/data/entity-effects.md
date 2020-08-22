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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/effects/entity-effects.ts#L30-L199)

## Methods

### persist

#### description (#persist-description)

Perform the requested persistence operation and return a scalar Observable<Action>
that the effect should dispatch to the store after the server responds.

```ts
persist(action: EntityAction): Observable<Action>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/effects/entity-effects.ts#L77-L108)

#### Parameters (#persist-parameters)

| Name   | Type                | Description                          |
| ------ | ------------------- | ------------------------------------ |
| action | `EntityAction<any>` | A persistence operation EntityAction |

## Parameters

| Name     | Type              | Description |
| -------- | ----------------- | ----------- |
| cancel\$ | `Observable<any>` | /\*\*       |

- Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
  \*/ |
  | persist\$ | `Observable<any>` | |
