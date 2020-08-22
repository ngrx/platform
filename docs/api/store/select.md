---
kind: FunctionDeclaration
name: select
module: store
---

# select

```ts
function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L214-L238)

## Parameters

| Name        | Type                                          | Description |
| ----------- | --------------------------------------------- | ----------- |
| pathOrMapFn | `string | ((state: T, props?: Props) => any)` |             |
| propsOrPath | `string | Props`                              |             |
| paths       | `string[]`                                    |             |

## Overloads

```ts
function select<T, Props, K>(
  mapFn: (state: T, props: Props) => K,
  props?: Props
): (source$: Observable<T>) => Observable<K>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L133-L136)

### Parameters

| Name  | Type                            | Description |
| ----- | ------------------------------- | ----------- |
| mapFn | `(state: T, props: Props) => K` |             |
| props | `Props`                         |             |

```ts
function select<T, a extends keyof T>(
  key: a
): (source$: Observable<T>) => Observable<T[a]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L137-L139)

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key  | `a`  |             |

```ts
function select<T, a extends keyof T, b extends keyof T[a]>(
  key1: a,
  key2: b
): (source$: Observable<T>) => Observable<T[a][b]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L140-L143)

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |

```ts
function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b]
>(
  key1: a,
  key2: b,
  key3: c
): (source$: Observable<T>) => Observable<T[a][b][c]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L144-L153)

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |

```ts
function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b],
  d extends keyof T[a][b][c]
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d
): (source$: Observable<T>) => Observable<T[a][b][c][d]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L154-L165)

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |
| key4 | `d`  |             |

```ts
function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b],
  d extends keyof T[a][b][c],
  e extends keyof T[a][b][c][d]
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d,
  key5: e
): (source$: Observable<T>) => Observable<T[a][b][c][d][e]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L166-L179)

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |
| key4 | `d`  |             |
| key5 | `e`  |             |

```ts
function select<
  T,
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
): (source$: Observable<T>) => Observable<T[a][b][c][d][e][f]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L180-L195)

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |
| key4 | `d`  |             |
| key5 | `e`  |             |
| key6 | `f`  |             |

```ts
function select<
  T,
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
): (source$: Observable<T>) => Observable<K>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts#L196-L213)

### Parameters

| Name  | Type       | Description |
| ----- | ---------- | ----------- |
| key1  | `a`        |             |
| key2  | `b`        |             |
| key3  | `c`        |             |
| key4  | `d`        |             |
| key5  | `e`        |             |
| key6  | `f`        |             |
| paths | `string[]` |             |
