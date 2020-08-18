---
kind: ClassDeclaration
name: ComponentStore
module: component-store
---

# ComponentStore

```ts
class ComponentStore<T extends object> implements OnDestroy {
  readonly destroy$ = this.destroySubject$.asObservable();
  readonly state$: Observable<T> = this.select((s) => s);

  ngOnDestroy();
  updater<V>(
    updaterFn: (state: T, value: V) => T
  ): unknown extends V ? () => void : (t: V | Observable<V>) => Subscription;
  setState(stateOrUpdaterFn: T | ((state: T) => T)): void;
  select<
    O extends Array<Observable<unknown> | SelectConfig | ProjectorFn>,
    R,
    ProjectorFn = (...a: unknown[]) => R
  >(...args: O): Observable<R>;
  effect<
    ProvidedType = void,
    OriginType extends Observable<ProvidedType> | unknown = Observable<
      ProvidedType
    >,
    ObservableType = OriginType extends Observable<infer A> ? A : never,
    ReturnType = ProvidedType | ObservableType extends void
      ? () => void
      : (
          observableOrValue: ObservableType | Observable<ObservableType>
        ) => Subscription
  >(generator: (origin$: OriginType) => Observable<unknown>): ReturnType;
}
```
