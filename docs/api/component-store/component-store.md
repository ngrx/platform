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
  select<R>(projector: (s: T) => R, config?: SelectConfig): Observable<R>;
  select<R, S1>(
    s1: Observable<S1>,
    projector: (s1: S1) => R,
    config?: SelectConfig
  ): Observable<R>;
  select<R, S1, S2>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    projector: (s1: S1, s2: S2) => R,
    config?: SelectConfig
  ): Observable<R>;
  select<R, S1, S2, S3>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    s3: Observable<S3>,
    projector: (s1: S1, s2: S2, s3: S3) => R,
    config?: SelectConfig
  ): Observable<R>;
  select<R, S1, S2, S3, S4>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    s3: Observable<S3>,
    s4: Observable<S4>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4) => R,
    config?: SelectConfig
  ): Observable<R>;
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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L37-L275)

## Methods

### ngOnDestroy

```ts
ngOnDestroy();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L60-L63)

### updater

#### description (#updater-description)

Creates an updater.

Throws an error if updater is called with synchronous values (either
imperative value or Observable that is synchronous) before ComponentStore
is initialized. If called with async Observable before initialization then
state will not be updated and subscription would be closed.

```ts
updater<V>(  updaterFn: (state: T, value: V) => T ): unknown extends V ? () => void : (t: V | Observable<V>) => Subscription;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L80-L122)

#### Parameters (#updater-parameters)

| Name      | Type                        | Description                                            |
| --------- | --------------------------- | ------------------------------------------------------ |
| updaterFn | `(state: T, value: V) => T` | A static updater function that takes 2 parameters (the |

#### return (#updater-return)

A function that accepts one argument which is forwarded as the
second argument to `updaterFn`. Every time this function is called
subscribers will be notified of the state change.

### setState

#### description (#setState-description)

Sets the state specific value.

```ts
setState(stateOrUpdaterFn: T | ((state: T) => T)): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L140-L146)

#### Parameters (#setState-parameters)

| Name             | Type                    | Description                                |
| ---------------- | ----------------------- | ------------------------------------------ |
| stateOrUpdaterFn | `T | ((state: T) => T)` | object of the same type as the state or an |

### select

```ts
select<  O extends Array<Observable<unknown> | SelectConfig | ProjectorFn>,  R,  ProjectorFn = (...a: unknown[]) => R >(...args: O): Observable<R>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L200-L230)

#### Parameters (#select-parameters)

| Name | Type | Description |
| ---- | ---- | ----------- |
| args | `O`  |             |

### select

#### description (#select-description)

Creates a selector.

This supports combining up to 4 selectors. More could be added as needed.

```ts
select<R>(projector: (s: T) => R, config?: SelectConfig): Observable<R>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L173-L173)

#### Parameters (#select-parameters)

| Name      | Type           | Description                                                   |
| --------- | -------------- | ------------------------------------------------------------- |
| projector | `(s: T) => R`  | A pure projection function that takes the current state and   |
| config    | `SelectConfig` | SelectConfig that changes the behavior of selector, including |

#### return (#select-return)

An observable of the projector results.

### select

```ts
select<R, S1>(  s1: Observable<S1>,  projector: (s1: S1) => R,  config?: SelectConfig ): Observable<R>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L174-L178)

#### Parameters (#select-parameters)

| Name      | Type             | Description |
| --------- | ---------------- | ----------- |
| s1        | `Observable<S1>` |             |
| projector | `(s1: S1) => R`  |             |
| config    | `SelectConfig`   |             |

### select

```ts
select<R, S1, S2>(  s1: Observable<S1>,  s2: Observable<S2>,  projector: (s1: S1, s2: S2) => R,  config?: SelectConfig ): Observable<R>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L179-L184)

#### Parameters (#select-parameters)

| Name      | Type                    | Description |
| --------- | ----------------------- | ----------- |
| s1        | `Observable<S1>`        |             |
| s2        | `Observable<S2>`        |             |
| projector | `(s1: S1, s2: S2) => R` |             |
| config    | `SelectConfig`          |             |

### select

```ts
select<R, S1, S2, S3>(  s1: Observable<S1>,  s2: Observable<S2>,  s3: Observable<S3>,  projector: (s1: S1, s2: S2, s3: S3) => R,  config?: SelectConfig ): Observable<R>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L185-L191)

#### Parameters (#select-parameters)

| Name      | Type                            | Description |
| --------- | ------------------------------- | ----------- |
| s1        | `Observable<S1>`                |             |
| s2        | `Observable<S2>`                |             |
| s3        | `Observable<S3>`                |             |
| projector | `(s1: S1, s2: S2, s3: S3) => R` |             |
| config    | `SelectConfig`                  |             |

### select

```ts
select<R, S1, S2, S3, S4>(  s1: Observable<S1>,  s2: Observable<S2>,  s3: Observable<S3>,  s4: Observable<S4>,  projector: (s1: S1, s2: S2, s3: S3, s4: S4) => R,  config?: SelectConfig ): Observable<R>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L192-L199)

#### Parameters (#select-parameters)

| Name      | Type                                    | Description |
| --------- | --------------------------------------- | ----------- |
| s1        | `Observable<S1>`                        |             |
| s2        | `Observable<S2>`                        |             |
| s3        | `Observable<S3>`                        |             |
| s4        | `Observable<S4>`                        |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4) => R` |             |
| config    | `SelectConfig`                          |             |

### effect

#### description (#effect-description)

Creates an effect.

This effect is subscribed to for the life of the @Component.

```ts
effect<  ProvidedType = void,  OriginType extends Observable<ProvidedType> | unknown = Observable<   ProvidedType  >,  ObservableType = OriginType extends Observable<infer A> ? A : never,  ReturnType = ProvidedType | ObservableType extends void   ? () => void   : (     observableOrValue: ObservableType | Observable<ObservableType>    ) => Subscription >(generator: (origin$: OriginType) => Observable<unknown>): ReturnType;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component-store/src/component-store.ts#L241-L274)

#### Parameters (#effect-parameters)

| Name      | Type                                           | Description                                          |
| --------- | ---------------------------------------------- | ---------------------------------------------------- |
| generator | `(origin$: OriginType) => Observable<unknown>` | A function that takes an origin Observable input and |

#### return (#effect-return)

A function that, when called, will trigger the origin Observable.

## Parameters

| Name      | Type               | Description |
| --------- | ------------------ | ----------- |
| destroy\$ | `Observable<void>` |             |
| state\$   | `Observable<T>`    |             |
