---
kind: FunctionDeclaration
name: createEffect
module: effects
---

# createEffect

## description

Creates an effect from an `Observable` and an `EffectConfig`.

```ts
function createEffect<
  C extends EffectConfig,
  DT extends DispatchType<C>,
  OT extends ObservableType<DT, OT>,
  R extends EffectResult<OT>
>(
  source: () => R & ConditionallyDisallowActionCreator<DT, R>,
  config?: Partial<C>
): R & CreateEffectMetadata;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/effect_creator.ts#L54-L72)

## Parameters

| Name   | Type                                                  | Description                                                                                                             |
| ------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| source | `() => R & ConditionallyDisallowActionCreator<DT, R>` | A function which returns an `Observable`.                                                                               |
| config | `Partial<C>`                                          | A `Partial<EffectConfig>` to configure the effect. By default, `dispatch` is true and `useEffectsErrorHandler` is true. |

## returns

If `EffectConfig`#`dispatch` is true, returns `Observable<Action>`. Else, returns `Observable<unknown>`.

## usageNotes

** Mapping to a different action **

```ts
effectName$ = createEffect(() =>
  this.actions$.pipe(
    ofType(FeatureActions.actionOne),
    map(() => FeatureActions.actionTwo())
  )
);
```

** Non-dispatching effects **

```ts
effectName$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(FeatureActions.actionOne),
      tap(() => console.log('Action One Dispatched'))
    ),
  { dispatch: false }
  // FeatureActions.actionOne is not dispatched
);
```
