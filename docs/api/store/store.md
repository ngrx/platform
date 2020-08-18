---
kind: ClassDeclaration
name: Store
module: store
---

# Store

```ts
class Store<T = object> extends Observable<T> implements Observer<Action> {
  select<Props = any, K = any>(
    pathOrMapFn: ((state: T, props?: Props) => K) | string,
    ...paths: string[]
  ): Observable<any>;
  lift<R>(operator: Operator<T, R>): Store<R>;
  dispatch<V extends Action = Action>(
    action: V &
      FunctionIsNotAllowed<
        V,
        'Functions are not allowed to be dispatched. Did you forget to call the action creator function?'
      >
  );
  next(action: Action);
  error(err: any);
  complete();
  addReducer<State, Actions extends Action = Action>(
    key: string,
    reducer: ActionReducer<State, Actions>
  );
  removeReducer<Key extends Extract<keyof T, string>>(key: Key);
}
```
