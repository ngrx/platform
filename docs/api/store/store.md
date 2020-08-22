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
  select<K>(mapFn: (state: T) => K): Observable<K>;
  select<K, Props = any>(
    mapFn: (state: T, props: Props) => K,
    props: Props
  ): Observable<K>;
  select<a extends keyof T>(key: a): Observable<T[a]>;
  select<a extends keyof T, b extends keyof T[a]>(
    key1: a,
    key2: b
  ): Observable<T[a][b]>;
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(
    key1: a,
    key2: b,
    key3: c
  ): Observable<T[a][b][c]>;
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c]
  >(key1: a, key2: b, key3: c, key4: d): Observable<T[a][b][c][d]>;
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
    e extends keyof T[a][b][c][d]
  >(key1: a, key2: b, key3: c, key4: d, key5: e): Observable<T[a][b][c][d][e]>;
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
    e extends keyof T[a][b][c][d],
    f extends keyof T[a][b][c][d][e]
  >(
    key1: a,
    key2: b,
    key3: c,
    key4: d,
    key5: e,
    key6: f
  ): Observable<T[a][b][c][d][e][f]>;
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
    e extends keyof T[a][b][c][d],
    f extends keyof T[a][b][c][d][e],
    K = any
  >(
    key1: a,
    key2: b,
    key3: c,
    key4: d,
    key5: e,
    key6: f,
    ...paths: string[]
  ): Observable<K>;
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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L10-L129)

## Methods

### select

```ts
select<Props = any, K = any>(  pathOrMapFn: ((state: T, props?: Props) => K) | string,  ...paths: string[] ): Observable<any>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L83-L88)

#### Parameters (#select-parameters)

| Name        | Type                                        | Description |
| ----------- | ------------------------------------------- | ----------- |
| pathOrMapFn | `string | ((state: T, props?: Props) => K)` |             |
| paths       | `string[]`                                  |             |

### select

```ts
select<K>(mapFn: (state: T) => K): Observable<K>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L23-L23)

#### Parameters (#select-parameters)

| Name  | Type              | Description |
| ----- | ----------------- | ----------- |
| mapFn | `(state: T) => K` |             |

### select

```ts
select<K, Props = any>(  mapFn: (state: T, props: Props) => K,  props: Props ): Observable<K>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L24-L27)

#### Parameters (#select-parameters)

| Name  | Type                            | Description |
| ----- | ------------------------------- | ----------- |
| mapFn | `(state: T, props: Props) => K` |             |
| props | `Props`                         |             |

### select

```ts
select<a extends keyof T>(key: a): Observable<T[a]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L28-L28)

#### Parameters (#select-parameters)

| Name | Type | Description |
| ---- | ---- | ----------- |
| key  | `a`  |             |

### select

```ts
select<a extends keyof T, b extends keyof T[a]>(  key1: a,  key2: b ): Observable<T[a][b]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L29-L32)

#### Parameters (#select-parameters)

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |

### select

```ts
select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(  key1: a,  key2: b,  key3: c ): Observable<T[a][b][c]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L33-L37)

#### Parameters (#select-parameters)

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |

### select

```ts
select<  a extends keyof T,  b extends keyof T[a],  c extends keyof T[a][b],  d extends keyof T[a][b][c] >(key1: a, key2: b, key3: c, key4: d): Observable<T[a][b][c][d]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L38-L43)

#### Parameters (#select-parameters)

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |
| key4 | `d`  |             |

### select

```ts
select<  a extends keyof T,  b extends keyof T[a],  c extends keyof T[a][b],  d extends keyof T[a][b][c],  e extends keyof T[a][b][c][d] >(key1: a, key2: b, key3: c, key4: d, key5: e): Observable<T[a][b][c][d][e]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L44-L50)

#### Parameters (#select-parameters)

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |
| key4 | `d`  |             |
| key5 | `e`  |             |

### select

```ts
select<  a extends keyof T,  b extends keyof T[a],  c extends keyof T[a][b],  d extends keyof T[a][b][c],  e extends keyof T[a][b][c][d],  f extends keyof T[a][b][c][d][e] >(  key1: a,  key2: b,  key3: c,  key4: d,  key5: e,  key6: f ): Observable<T[a][b][c][d][e][f]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L51-L65)

#### Parameters (#select-parameters)

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |
| key4 | `d`  |             |
| key5 | `e`  |             |
| key6 | `f`  |             |

### select

```ts
select<  a extends keyof T,  b extends keyof T[a],  c extends keyof T[a][b],  d extends keyof T[a][b][c],  e extends keyof T[a][b][c][d],  f extends keyof T[a][b][c][d][e],  K = any >(  key1: a,  key2: b,  key3: c,  key4: d,  key5: e,  key6: f,  ...paths: string[] ): Observable<K>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L66-L82)

#### Parameters (#select-parameters)

| Name  | Type       | Description |
| ----- | ---------- | ----------- |
| key1  | `a`        |             |
| key2  | `b`        |             |
| key3  | `c`        |             |
| key4  | `d`        |             |
| key5  | `e`        |             |
| key6  | `f`        |             |
| paths | `string[]` |             |

### lift

```ts
lift<R>(operator: Operator<T, R>): Store<R>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L90-L95)

#### Parameters (#lift-parameters)

| Name     | Type             | Description |
| -------- | ---------------- | ----------- |
| operator | `Operator<T, R>` |             |

### dispatch

```ts
dispatch<V extends Action = Action>(  action: V &   FunctionIsNotAllowed<    V,    'Functions are not allowed to be dispatched. Did you forget to call the action creator function?'   > );
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L97-L105)

#### Parameters (#dispatch-parameters)

| Name   | Type                                                                                                                             | Description |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| action | `V & FunctionIsNotAllowed<V, "Functions are not allowed to be dispatched. Did you forget to call the action creator function?">` |             |

### next

```ts
next(action: Action);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L107-L109)

#### Parameters (#next-parameters)

| Name   | Type     | Description |
| ------ | -------- | ----------- |
| action | `Action` |             |

### error

```ts
error(err: any);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L111-L113)

#### Parameters (#error-parameters)

| Name | Type  | Description |
| ---- | ----- | ----------- |
| err  | `any` |             |

### complete

```ts
complete();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L115-L117)

### addReducer

```ts
addReducer<State, Actions extends Action = Action>(  key: string,  reducer: ActionReducer<State, Actions> );
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L119-L124)

#### Parameters (#addReducer-parameters)

| Name    | Type                            | Description |
| ------- | ------------------------------- | ----------- |
| key     | `string`                        |             |
| reducer | `ActionReducer<State, Actions>` |             |

### removeReducer

```ts
removeReducer<Key extends Extract<keyof T, string>>(key: Key);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L126-L128)

#### Parameters (#removeReducer-parameters)

| Name | Type  | Description |
| ---- | ----- | ----------- |
| key  | `Key` |             |
