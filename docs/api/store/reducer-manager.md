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
