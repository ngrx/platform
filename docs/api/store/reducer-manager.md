---
kind: ClassDeclaration
name: ReducerManager
module: store
---

# ReducerManager

```ts
class ReducerManager extends BehaviorSubject<ActionReducer<any, any>>
  implements OnDestroy {
  addFeature(feature: StoreFeature<any, any>);
  addFeatures(features: StoreFeature<any, any>[]);
  removeFeature(feature: StoreFeature<any, any>);
  removeFeatures(features: StoreFeature<any, any>[]);
  addReducer(key: string, reducer: ActionReducer<any, any>);
  addReducers(reducers: { [key: string]: ActionReducer<any, any> });
  removeReducer(featureKey: string);
  removeReducers(featureKeys: string[]);
  ngOnDestroy();
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_manager.ts#L25-L104)

## Methods

### addFeature

```ts
addFeature(feature: StoreFeature<any, any>);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_manager.ts#L38-L40)

#### Parameters (#addFeature-parameters)

| Name    | Type                     | Description |
| ------- | ------------------------ | ----------- |
| feature | `StoreFeature<any, any>` |             |

### addFeatures

```ts
addFeatures(features: StoreFeature<any, any>[]);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_manager.ts#L42-L63)

#### Parameters (#addFeatures-parameters)

| Name     | Type                       | Description |
| -------- | -------------------------- | ----------- |
| features | `StoreFeature<any, any>[]` |             |

### removeFeature

```ts
removeFeature(feature: StoreFeature<any, any>);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_manager.ts#L65-L67)

#### Parameters (#removeFeature-parameters)

| Name    | Type                     | Description |
| ------- | ------------------------ | ----------- |
| feature | `StoreFeature<any, any>` |             |

### removeFeatures

```ts
removeFeatures(features: StoreFeature<any, any>[]);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_manager.ts#L69-L71)

#### Parameters (#removeFeatures-parameters)

| Name     | Type                       | Description |
| -------- | -------------------------- | ----------- |
| features | `StoreFeature<any, any>[]` |             |

### addReducer

```ts
addReducer(key: string, reducer: ActionReducer<any, any>);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_manager.ts#L73-L75)

#### Parameters (#addReducer-parameters)

| Name    | Type                      | Description |
| ------- | ------------------------- | ----------- |
| key     | `string`                  |             |
| reducer | `ActionReducer<any, any>` |             |

### addReducers

```ts
addReducers(reducers: { [key: string]: ActionReducer<any, any> });
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_manager.ts#L77-L80)

#### Parameters (#addReducers-parameters)

| Name     | Type                                          | Description |
| -------- | --------------------------------------------- | ----------- |
| reducers | `{ [key: string]: ActionReducer<any, any>; }` |             |

### removeReducer

```ts
removeReducer(featureKey: string);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_manager.ts#L82-L84)

#### Parameters (#removeReducer-parameters)

| Name       | Type     | Description |
| ---------- | -------- | ----------- |
| featureKey | `string` |             |

### removeReducers

```ts
removeReducers(featureKeys: string[]);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_manager.ts#L86-L91)

#### Parameters (#removeReducers-parameters)

| Name        | Type       | Description |
| ----------- | ---------- | ----------- |
| featureKeys | `string[]` |             |

### ngOnDestroy

```ts
ngOnDestroy();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_manager.ts#L101-L103)
