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

## Parameters

| Name        | Type                                          | Description |
| ----------- | --------------------------------------------- | ----------- |
| pathOrMapFn | `string | ((state: T, props?: Props) => any)` |             |
| propsOrPath | `string | Props`                              |             |
| paths       | `string[]`                                    |             |

## Overloads

```ts
function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
);
```

### Parameters

| Name  | Type                            | Description |
| ----- | ------------------------------- | ----------- |
| mapFn | `(state: T, props: Props) => K` |             |
| props | `Props`                         |             |

```ts
function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
);
```

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key  | `a`  |             |

```ts
function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
);
```

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |

```ts
function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
);
```

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |

```ts
function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
);
```

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |
| key4 | `d`  |             |

```ts
function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
);
```

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key1 | `a`  |             |
| key2 | `b`  |             |
| key3 | `c`  |             |
| key4 | `d`  |             |
| key5 | `e`  |             |

```ts
function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
);
```

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
function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
);
```

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
